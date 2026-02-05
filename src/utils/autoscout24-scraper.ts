/**
 * AutoScout24 scraper utility
 * Fetches listing URLs and details from a dealer's AutoScout24 page
 */

const BASE_URL = 'https://www.autoscout24.be';
const STOP_CHARS = ' \t\n"\'>)';

export interface ScrapedListing {
  url: string;
  title: string | null;
  description: string | null;
  brand: string | null;
  model: string | null;
  bodyType: string | null;
  fuelType: string | null;
  transmission: string | null;
  mileageKm: number | null;
  firstRegistration: string | null;
  price: number | null;
  currency: string | null;
  images: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawLdJson: any;
  error?: string;
}

/**
 * Extract listing URLs from HTML source
 */
function extractListingUrls(source: string): string[] {
  const urls = new Set<string>();

  // Full URLs
  const startFull = `${BASE_URL}/nl/aanbod/`;
  let i = 0;
  while (true) {
    i = source.indexOf(startFull, i);
    if (i === -1) break;
    let end = i + startFull.length;
    while (end < source.length && !STOP_CHARS.includes(source[end])) {
      end++;
    }
    const url = source.slice(i, end).split('?', 1)[0];
    urls.add(url);
    i = end;
  }

  // Relative URLs
  const startRel = '/nl/aanbod/';
  i = 0;
  while (true) {
    i = source.indexOf(startRel, i);
    if (i === -1) break;
    let end = i + startRel.length;
    while (end < source.length && !STOP_CHARS.includes(source[end])) {
      end++;
    }
    const path = source.slice(i, end).split('?', 1)[0];
    urls.add(BASE_URL + path);
    i = end;
  }

  return Array.from(urls);
}

/**
 * Normalize dealer URL by removing page parameter
 */
function normalizeDealerUrl(url: string): string {
  const u = new URL(url);
  u.searchParams.delete('page');
  return u.toString();
}

/**
 * Fetch all listing URLs from a dealer page with pagination support
 */
export async function fetchAllListingUrls(
  dealerUrl: string,
  maxPages: number = 50
): Promise<string[]> {
  const baseUrl = normalizeDealerUrl(dealerUrl);
  const seen = new Set<string>();

  let page = 1;
  while (page <= maxPages) {
    const pageUrl = new URL(baseUrl);
    pageUrl.searchParams.set('page', String(page));

    const res = await fetch(pageUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      break;
    }

    const html = await res.text();
    const pageUrls = extractListingUrls(html);

    if (pageUrls.length === 0) {
      break;
    }

    const newUrls = pageUrls.filter((u) => !seen.has(u));
    if (newUrls.length === 0) {
      break;
    }
    newUrls.forEach((u) => seen.add(u));

    page += 1;
  }

  return Array.from(seen).sort();
}

/**
 * Find application/ld+json block in HTML
 */
function findListingLdJson(html: string): string | null {
  const marker = 'type="application/ld+json"';
  let idx = 0;
  while (true) {
    idx = html.indexOf(marker, idx);
    if (idx === -1) break;
    const start = html.indexOf('>', idx);
    if (start === -1) break;
    const end = html.indexOf('</script>', start);
    if (end === -1) break;
    const jsonText = html.slice(start + 1, end).trim();
    if (
      jsonText.includes('"Product"') ||
      jsonText.includes('"vehicleConfiguration"') ||
      jsonText.includes('"offers"')
    ) {
      return jsonText;
    }
    idx = end + 9;
  }
  return null;
}

/**
 * Parse listing data from application/ld+json
 */
function parseListingFromLdJson(
  ldText: string,
  url: string
): ScrapedListing {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let raw: any;
  try {
    raw = JSON.parse(ldText);
  } catch {
    return {
      url,
      error: 'Failed to parse ld+json',
      title: null,
      description: null,
      brand: null,
      model: null,
      bodyType: null,
      fuelType: null,
      transmission: null,
      mileageKm: null,
      firstRegistration: null,
      price: null,
      currency: null,
      images: [],
      rawLdJson: null,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let product: any = null;

  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (!entry) continue;
      const t = entry['@type'];
      if (
        t === 'Product' ||
        (Array.isArray(t) && t.includes('Product'))
      ) {
        product = entry;
        break;
      }
    }
    if (!product && raw.length > 0) {
      product = raw[0];
    }
  } else {
    product = raw;
  }

  const item = product.itemOffered || product;
  const offers = Array.isArray(product.offers)
    ? product.offers[0] || {}
    : product.offers || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function brandName(brand: any): string | null {
    if (!brand) return null;
    if (typeof brand === 'string') return brand;
    if (typeof brand.name === 'string') return brand.name;
    return null;
  }

  let images: string[] = [];
  if (item.image) images = item.image;
  else if (product.image) images = product.image;
  if (!Array.isArray(images)) images = [images];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images = images.filter((src: any) => typeof src === 'string');

  return {
    url,
    title: product.name || item.name || null,
    description: item.description || product.description || null,
    brand: brandName(item.brand || product.brand),
    model: item.model || null,
    bodyType: item.bodyType || item.vehicleConfiguration || null,
    fuelType: item.fuelType || null,
    transmission: item.vehicleTransmission || null,
    mileageKm:
      item.mileageFromOdometer &&
      item.mileageFromOdometer.value != null
        ? Number(item.mileageFromOdometer.value)
        : null,
    firstRegistration:
      item.productionDate || item.dateVehicleFirstRegistered || null,
    price: offers && offers.price != null ? Number(offers.price) : null,
    currency: (offers && offers.priceCurrency) || null,
    images,
    rawLdJson: product,
  };
}

/**
 * Fetch detailed listing information from a single listing URL
 */
export async function fetchListingDetails(
  url: string
): Promise<ScrapedListing> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!res.ok) {
    return {
      url,
      error: `HTTP ${res.status}`,
      title: null,
      description: null,
      brand: null,
      model: null,
      bodyType: null,
      fuelType: null,
      transmission: null,
      mileageKm: null,
      firstRegistration: null,
      price: null,
      currency: null,
      images: [],
      rawLdJson: null,
    };
  }

  const html = await res.text();
  const ldText = findListingLdJson(html);
  if (!ldText) {
    return {
      url,
      error: 'No application/ld+json block found',
      title: null,
      description: null,
      brand: null,
      model: null,
      bodyType: null,
      fuelType: null,
      transmission: null,
      mileageKm: null,
      firstRegistration: null,
      price: null,
      currency: null,
      images: [],
      rawLdJson: null,
    };
  }

  return parseListingFromLdJson(ldText, url);
}

/**
 * Fetch all listings from a dealer page
 */
export async function fetchAllListings(
  dealerUrl: string,
  maxPages: number = 50
): Promise<ScrapedListing[]> {
  const urls = await fetchAllListingUrls(dealerUrl, maxPages);
  const listings: ScrapedListing[] = [];

  // Fetch details for all listings (with some concurrency control)
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((url) => fetchListingDetails(url))
    );
    listings.push(...results);
  }

  return listings;
}
