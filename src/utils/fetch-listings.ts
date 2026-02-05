import {
  DEALER_URL,
  extractListingUrls,
  normalizeDealerUrl,
} from './listings';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRelevantFields(ldJson: any, url: string) {
  let product = null;

  if (Array.isArray(ldJson)) {
    for (const entry of ldJson) {
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
    if (!product && ldJson.length > 0) {
      product = ldJson[0];
    }
  } else {
    product = ldJson;
  }

  if (!product) {
    return null;
  }

  // The structure is: product.offers.itemOffered contains the Car details
  const offers = Array.isArray(product.offers)
    ? product.offers[0] || {}
    : product.offers || {};
  
  const item = offers.itemOffered || product.itemOffered || product;

  // Extract brand
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getBrand(brand: any): string | null {
    if (!brand) return null;
    if (typeof brand === 'string') return brand;
    if (typeof brand.name === 'string') return brand.name;
    return null;
  }

  // Extract images
  let images: string[] = [];
  if (item.image) images = item.image;
  else if (product.image) images = product.image;
  if (!Array.isArray(images)) images = [images];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images = images.filter((src: any) => typeof src === 'string');

  // Extract mileage
  let mileageKm: number | null = null;
  if (item.mileageFromOdometer) {
    const mileage = item.mileageFromOdometer;
    if (typeof mileage === 'object' && mileage.value != null) {
      mileageKm = Number(mileage.value);
    } else if (typeof mileage === 'number') {
      mileageKm = mileage;
    }
  }

  // Extract price
  let price: number | null = null;
  if (offers && offers.price != null) {
    price = Number(offers.price);
  }

  // Extract first registration date
  let firstRegistration: string | null = null;
  if (item.productionDate) {
    firstRegistration = item.productionDate;
  } else if (item.dateVehicleFirstRegistered) {
    firstRegistration = item.dateVehicleFirstRegistered;
  }

  // Format date to MM/YYYY
  let yearFormatted: string | null = null;
  if (firstRegistration) {
    if (firstRegistration.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month] = firstRegistration.split('-');
      yearFormatted = `${month}/${year}`;
    } else {
      yearFormatted = firstRegistration;
    }
  }

  // Extract power from vehicleEngine array
  let power: string | null = null;
  if (item.vehicleEngine && Array.isArray(item.vehicleEngine) && item.vehicleEngine.length > 0) {
    const engine = item.vehicleEngine[0];
    if (engine.enginePower && Array.isArray(engine.enginePower)) {
      // Look for BHP (PK) and KWT (kW) values
      let pkValue: number | null = null;
      let kwValue: number | null = null;
      
      for (const powerSpec of engine.enginePower) {
        if (powerSpec.unitCode === 'BHP' && powerSpec.value != null) {
          pkValue = Number(powerSpec.value);
        } else if (powerSpec.unitCode === 'KWT' && powerSpec.value != null) {
          kwValue = Number(powerSpec.value);
        }
      }
      
      if (pkValue && kwValue) {
        power = `${pkValue} PK (${kwValue} kW)`;
      } else if (pkValue) {
        power = `${pkValue} PK`;
      } else if (kwValue) {
        const pk = Math.round(kwValue * 1.36);
        power = `${pk} PK (${kwValue} kW)`;
      }
    }
  }

  // Extract fuel type
  let fuelType: string | null = null;
  if (item.vehicleEngine && Array.isArray(item.vehicleEngine) && item.vehicleEngine.length > 0) {
    fuelType = item.vehicleEngine[0].fuelType || null;
  }
  if (!fuelType) {
    fuelType = item.fuelType || null;
  }
  // Normalize fuel type
  if (fuelType) {
    fuelType = fuelType.replace(/Super 95/i, 'Benzine').replace(/Diesel/i, 'Diesel').replace(/Electric/i, 'Elektrisch');
  }

  // Extract transmission
  let transmission: string | null = null;
  if (item.vehicleTransmission) {
    transmission = item.vehicleTransmission.replace(/manual/i, 'Manueel').replace(/automatic/i, 'Automaat');
  }

  // Extract model - prioritize from itemOffered, then from URL
  let model = item.model || null;
  if (!model && url) {
    const urlMatch = url.match(/\/aanbod\/[^/]+\/([^/]+)\//);
    if (urlMatch) {
      const slug = urlMatch[1];
      const parts = slug.split('-');
      // Common brands to skip
      const commonBrands = ['bmw', 'mercedes', 'audi', 'volkswagen', 'vw', 'peugeot', 'renault', 'citroen', 'ford', 'opel'];
      let startIdx = 0;
      if (commonBrands.includes(parts[0].toLowerCase())) {
        startIdx = 1;
      }
      // Find where model ends (before feature keywords or UUID)
      const featureKeywords = ['full', 'led', 'navi', 'camera', 'pdc', 'benzine', 'diesel', 'wit', 'grijs', 'zwart', 'zilver', 'btw', 'incl', 'pack', 'm', 'l2'];
      let modelEnd = parts.length;
      for (let i = startIdx + 1; i < parts.length; i++) {
        if (featureKeywords.includes(parts[i].toLowerCase()) || parts[i].match(/^[a-f0-9]{8}/)) {
          modelEnd = i;
          break;
        }
      }
      if (modelEnd > startIdx) {
        const modelParts = parts.slice(startIdx, modelEnd);
        model = modelParts.map(p => {
          if (p.match(/^[a-z]\d+$/)) {
            return p.charAt(0).toUpperCase() + p.slice(1).toUpperCase();
          }
          return p.charAt(0).toUpperCase() + p.slice(1);
        }).join(' ');
      }
    }
  }

  // Extract title - use item name if available, otherwise product name
  let title = item.name || product.name || null;
  // Clean up title (remove "van € X" pattern)
  if (title) {
    title = title.replace(/\s*(van\s*)?€\s*[\d.,]+/gi, '').trim();
  }

  // Extract previous owners
  let previousOwners: number | null = null;
  if (item.numberOfPreviousOwners != null) {
    previousOwners = Number(item.numberOfPreviousOwners);
  }

  // Extract fuel consumption
  let fuelConsumption: string | null = null;
  if (item.fuelConsumption) {
    const fc = item.fuelConsumption;
    const value = typeof fc === 'object' ? fc.value : fc;
    const unit = typeof fc === 'object' ? (fc.unitText || fc.unit || 'l/100 km') : 'l/100 km';
    if (value != null) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        fuelConsumption = `${numValue.toFixed(1).replace('.', ',')} ${unit}`;
        if (unit.includes('l/100')) {
          fuelConsumption += ' (comb.)';
        }
      }
    }
  }

  // Extract CO2 emissions
  let co2Emissions: number | null = null;
  if (item.emissionsCO2 != null) {
    co2Emissions = Number(item.emissionsCO2);
  }

  // Extract interior type and color
  let interiorType: string | null = null;
  if (item.vehicleInteriorType) {
    interiorType = item.vehicleInteriorType;
  }

  let interiorColor: string | null = null;
  if (item.vehicleInteriorColor) {
    interiorColor = item.vehicleInteriorColor;
  }

  // Extract condition
  let condition: string | null = null;
  if (offers.itemCondition) {
    condition = offers.itemCondition.replace(/UsedCondition/i, 'Tweedehands').replace(/NewCondition/i, 'Nieuw');
  }

  // Extract number of doors and seating capacity
  let numberOfDoors: number | null = null;
  if (item.numberOfDoors != null) {
    numberOfDoors = Number(item.numberOfDoors);
  }

  let seatingCapacity: number | null = null;
  if (item.seatingCapacity != null) {
    seatingCapacity = Number(item.seatingCapacity);
  }

  return {
    url,
    title,
    description: item.description || product.description || null,
    brand: getBrand(item.brand || product.brand || item.manufacturer),
    model,
    bodyType: item.bodyType || item.vehicleConfiguration || null,
    fuelType,
    transmission,
    mileageKm,
    firstRegistration: yearFormatted || firstRegistration,
    price,
    currency: (offers && offers.priceCurrency) || null,
    power,
    images,
    previousOwners,
    fuelConsumption,
    co2Emissions,
    interiorType,
    interiorColor,
    numberOfDoors,
    seatingCapacity,
    condition,
  };
}

function extractListingHtmlWrappers(html: string): Map<string, string> {
  const wrappers = new Map<string, string>();
  
  // Find all article tags with dp-listing-item__wrapper class
  const articlePattern = /<article[^>]*class="[^"]*dp-listing-item__wrapper[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  let match;
  
  while ((match = articlePattern.exec(html)) !== null) {
    const fullMatch = match[0];
    const openingTag = fullMatch.match(/<article[^>]*>/)?.[0] || '';
    
    // Extract ID from opening tag
    const idMatch = openingTag.match(/id="([^"]+)"/);
    if (idMatch) {
      const id = idMatch[1];
      wrappers.set(id, fullMatch);
    }
  }
  
  return wrappers;
}

async function fetchListingDetails(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      return { url, error: `HTTP ${res.status}` };
    }

    const html = await res.text();
    const ldText = findListingLdJson(html);
    if (!ldText) {
      return { url, error: 'No application/ld+json block found' };
    }

    let raw;
    try {
      raw = JSON.parse(ldText);
    } catch {
      return { url, error: 'Failed to parse ld+json' };
    }

    const extracted = extractRelevantFields(raw, url);
    if (!extracted) {
      return { url, error: 'Failed to extract fields from ld+json' };
    }

    return extracted;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { url, error: error.message || 'Unknown error' };
  }
}

export async function fetchAllListings() {
  try {
    const baseUrl = normalizeDealerUrl(DEALER_URL);
    const seen = new Set<string>();
    const htmlWrappers = new Map<string, string>();

    // Fetch all pages and extract HTML wrappers
    let page = 1;
    while (page <= 50) {
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
      
      // Extract HTML wrappers from this page
      const pageWrappers = extractListingHtmlWrappers(html);
      if (pageWrappers.size > 0) {
        pageWrappers.forEach((html, id) => {
          htmlWrappers.set(id, html);
        });
      }

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

    const listingUrls = Array.from(seen).sort();

    if (listingUrls.length === 0) {
      return [];
    }

    const listings = [];
    const batchSize = 5;

    for (let i = 0; i < listingUrls.length; i += batchSize) {
      const batch = listingUrls.slice(i, i + batchSize);
      const results = await Promise.all(batch.map((url) => fetchListingDetails(url)));
      
      for (const result of results) {
        if (result.error) {
          console.warn(`Error fetching ${result.url}: ${result.error}`);
        } else {
          // Extract ID from URL to match with HTML wrapper
          const urlParts = result.url.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          
          // Extract UUID (36 chars: 8-4-4-4-12)
          const uuidMatch = lastPart.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
          const id = uuidMatch ? uuidMatch[1] : lastPart;
          
          // Add HTML wrapper if available
          const htmlWrapper = htmlWrappers.get(id);
          if (htmlWrapper) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (result as any).htmlWrapper = htmlWrapper;
          }
          
          listings.push(result);
        }
      }
    }

    return listings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching listings:', error);
    return [];
  }
}
