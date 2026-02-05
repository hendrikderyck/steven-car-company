export const DEALER_URL = 'https://www.autoscout24.be/nl/verkopers/steven-car-company-bv';
const STOP_CHARS = ' \t\n"\'>)';
export const BASE = 'https://www.autoscout24.be';

export function extractListingUrls(source: string): string[] {
  const urls = new Set<string>();
  const startFull = `${BASE}/nl/aanbod/`;
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
    urls.add(BASE + path);
    i = end;
  }
  return Array.from(urls);
}

export function normalizeDealerUrl(url: string): string {
  const u = new URL(url);
  u.searchParams.delete('page');
  return u.toString();
}

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export async function fetchAllListingUrls(
  url: string = DEALER_URL,
  maxPages: number = 50
): Promise<string[]> {
  const baseUrl = normalizeDealerUrl(url);
  const seen = new Set<string>();
  let page = 1;
  while (page <= maxPages) {
    const pageUrl = new URL(baseUrl);
    pageUrl.searchParams.set('page', String(page));
    const res = await fetch(pageUrl.toString(), { headers: FETCH_HEADERS });
    if (!res.ok) break;
    const html = await res.text();
    const pageUrls = extractListingUrls(html);
    if (pageUrls.length === 0) break;
    const newUrls = pageUrls.filter((u) => !seen.has(u));
    if (newUrls.length === 0) break;
    newUrls.forEach((u) => seen.add(u));
    page += 1;
  }
  return Array.from(seen).sort();
}

export function extractIdFromListingUrl(listingUrl: string): string {
  const lastPart = listingUrl.split('/').pop() || '';
  const uuidMatch = lastPart.match(
    /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
  );
  return uuidMatch ? uuidMatch[1] : lastPart;
}

/** True if id is a UUID from a real listing; mock cars use "1", "2", etc. and have no detail page. */
export function isRealListingId(id: string): boolean {
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
}

/** Last path segment of the listing URL (full slug, e.g. bmw-118-full-led-...-uuid). Used for AS24-style URLs. */
export function extractSlugFromListingUrl(listingUrl: string): string {
  const segments = new URL(listingUrl).pathname.split('/').filter(Boolean);
  return segments.pop() || extractIdFromListingUrl(listingUrl);
}
