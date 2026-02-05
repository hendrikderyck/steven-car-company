const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export interface KeySpec {
  label: string;
  value: string;
}

export interface DetailPageResult {
  title: string;
  contentHtml: string;
  listingUrl: string;
  /** Image URLs for the listing (from LD+JSON or HTML); first = main image */
  images: string[];
  /** Listing price string (e.g. "€ 16.999") for display next to title */
  price?: string;
  /** Key specs (Kilometerstand, Transmissie, etc.) for the summary table */
  keySpecs?: KeySpec[];
}

/**
 * Gallery images on AutoScout24 are lazy-loaded: the main slide images (image-gallery-slide) are
 * not in the initial HTML, so we cannot parse them. The thumbnail images (image-gallery-thumbnail-image)
 * are present and have URLs like:
 *   .../listing-images/<id>_<id>.jpg/120x90.jpg
 * The same base path supports a big variant:
 *   .../listing-images/<id>_<id>.jpg/1920x1080.webp
 * We extract all thumbnail src URLs, deduplicate by base path, and return the big-variant URLs
 * for use in the listing gallery.
 */
const BIG_IMAGE_SIZE = '1920x1080.webp';

/** Transform thumbnail URL (e.g. .../120x90.jpg) to big variant (e.g. .../1920x1080.webp). */
function thumbnailToBigUrl(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/\/\d+x\d+\.(jpg|webp)$/i, `/${BIG_IMAGE_SIZE}`);
}

/**
 * Extract listing image URLs from the detail page HTML.
 * Uses thumbnail images only (see BIG_IMAGE_SIZE comment above); returns big-variant URLs.
 */
function extractImagesFromHtml(html: string): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  // Match <img ...> that contains image-gallery-thumbnail-image, then extract src (attributes can be in any order)
  const thumbImgPattern = /<img[^>]*image-gallery-thumbnail-image[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = thumbImgPattern.exec(html)) !== null) {
    const tag = m[0];
    const srcMatch = tag.match(/src=["']([^"']+)["']/i);
    const src = srcMatch?.[1];
    if (!src || !src.includes('listing-images')) continue;
    // Deduplicate by base path (before /120x90.jpg or similar)
    const baseKey = src.replace(/\/\d+x\d+\.(jpg|webp)$/i, '');
    if (seen.has(baseKey)) continue;
    seen.add(baseKey);
    urls.push(thumbnailToBigUrl(src));
  }

  return urls;
}

/** Sections we want to keep on the detail page (car data only). */
const KEEP_SECTIONS = [
  'Basisgegevens',
  'Voertuiggeschiedenis',
  'Technische Gegevens',
  'Energieverbruik',
  'Uitrusting',
  'Kleur en Bekleding',
  'Beschrijving',
];

/** Sections that mark end of desired content (do not include these or anything after in a block). */
const STOP_SECTIONS = [
  'Financiering',
  'Leasing',
  'Verzekering',
  'Populariteit',
  'Verkoper',
  'Prijsevaluatie',
];

/**
 * Strip unwanted phrases from HTML (financing, insurance, seller satisfaction).
 * Removes the text so only car-related content remains.
 */
function stripUnwantedText(html: string): string {
  const replacements: [RegExp, string][] = [
    [/\(97%\s*zijn\s*erg\s*tevreden\)/gi, ''],
    [/97%\s*zijn\s*erg\s*tevreden/gi, ''],
    [/Comfort\s*Auto\s*is\s*de\s*autoverzekering\s*van\s*AXA\s*Belgium\.?/gi, ''],
    [/Comfort\s*Auto\s*is\s*de\s*Autoverzekering\s*van\s*AXA\s*Belgium\.?/gi, ''],
    [/Meer info en productfiche op axa\.be\.?\s*/gi, ''],
    [/Let op,\s*geld lenen kost ook geld\.?/gi, ''],
    [/Sterrenbeoordeling\s*\d+\s*van\s*\d\s*sterren/gi, ''],
    [/\d+\s*Beoordelingen/gi, ''],
    [/Krediet aanvragen\s*/gi, ''],
    [/Uw verzekering\s*/gi, ''],
    [/Ontdek je prijs in 5 minuten\s*/gi, ''],
    [/Verzekeringsdetails?\s*hier\s*/gi, ''],
    [/€\s*\d+[.,]\d+\s*,\s*-\s*/gi, ''], // "€ 341,-" monthly financing
  ];
  let out = html;
  for (const [regex, repl] of replacements) {
    out = out.replace(regex, repl);
  }
  return out;
}

/**
 * Extract only the essential car information: images, title, price, key specs, and data sections.
 * No financing, insurance, leasing, seller ratings/satisfaction, or AS24 chrome.
 */
function extractCarContent(html: string): string {
  let content = '';

  // Price and key specs are extracted separately (extractPrice, extractKeySpecs) and rendered in the hero; do not duplicate here.

  // Only the desired h2 sections
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  for (let i = 0; i < h2Matches.length; i++) {
    const h2Text = h2Matches[i][1].replace(/<[^>]+>/g, '').trim();
    const shouldKeep = KEEP_SECTIONS.some((s) =>
      h2Text.toLowerCase().includes(s.toLowerCase())
    );
    if (!shouldKeep) continue;

    const h2Tag = h2Matches[i][0];
    const startPos = h2Matches[i].index! + h2Matches[i][0].length;
    const nextH2Pos =
      i + 1 < h2Matches.length ? h2Matches[i + 1].index! : html.length;
    let sectionContent = html.substring(startPos, nextH2Pos);

    for (const stopSection of STOP_SECTIONS) {
      const stopIndex = sectionContent.search(
        new RegExp(`<h2[^>]*>\\s*${stopSection}`, 'i')
      );
      if (stopIndex > 0) sectionContent = sectionContent.substring(0, stopIndex);
    }
    content += h2Tag + stripUnwantedText(sectionContent);
  }

  return content;
}

/**
 * Aggressively clean HTML: remove all scripts, ads, promotional content, navigation, footer.
 */
function cleanDetailHtml(html: string): string {
  let out = html;

  // Remove all scripts
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<script\b[^>]*\/?>/gi, '');
  
  // Remove all styles
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove all iframes
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
  out = out.replace(/<iframe\b[^>]*\/?>/gi, '');

  // Remove header/navigation
  out = out.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  out = out.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  
  // Remove footer
  out = out.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

  // Remove all promotional/ad sections with aggressive patterns
  const removePatterns = [
    // Financiering/Krediet
    /<section[^>]*>[\s\S]*?Financiering[\s\S]*?<\/section>/gi,
    /<div[^>]*>[\s\S]*?Financiering[\s\S]*?<\/div>/gi,
    /<[^>]*>[\s\S]*?Krediet aanvragen[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?vanaf\s*€[\s\S]*?per maand[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Let op,\s*geld lenen[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Verzekering/Insurance
    /<section[^>]*>[\s\S]*?Verzekering[\s\S]*?<\/section>/gi,
    /<div[^>]*>[\s\S]*?Uw verzekering[\s\S]*?<\/div>/gi,
    /<[^>]*>[\s\S]*?Ontdek je prijs[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?axa\.be[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Comfort Auto[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Verzekeringsdetails?[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Leasing
    /<section[^>]*>[\s\S]*?Leasing[\s\S]*?<\/section>/gi,
    /<div[^>]*>[\s\S]*?Leasing[\s\S]*?<\/div>/gi,
    /<[^>]*>[\s\S]*?shared\.leasing[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Populariteit/Favorites
    /<section[^>]*>[\s\S]*?Populariteit[\s\S]*?<\/section>/gi,
    /<[^>]*>[\s\S]*?Nog niet beslist\?[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Voeg toe aan favorieten[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Favorieten[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Seller ratings/satisfaction (keep seller name/contact elsewhere)
    /<section[^>]*>[\s\S]*?Verkoper[\s\S]*?<\/section>/gi,
    /<div[^>]*>[\s\S]*?Steven Car Company[\s\S]*?Sterrenbeoordeling[\s\S]*?<\/div>/gi,
    /<[^>]*>[\s\S]*?Sterrenbeoordeling\s*\d+\s*van\s*\d[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?97%\s*zijn\s*erg\s*tevreden[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?\d+\s*Beoordelingen[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Action buttons (Bewaar, Deel, Print)
    /<[^>]*>[\s\S]*?Bewaar[\s\S]*?Deel[\s\S]*?Print[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Footer / nav
    /<[^>]*>[\s\S]*?Meer details[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Alternatieve modellen[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*>[\s\S]*?Homepage[\s\S]*?Zoeken[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<section[^>]*>[\s\S]*?Prijsevaluatie[\s\S]*?<\/section>/gi,
    /<[^>]*class="[^"]*header[^"]*"[^>]*>[\s\S]*?Bel[\s\S]*?E-mail[\s\S]*?WhatsApp[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Ad / content banner
    /<[^>]*ContentBanner[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*s24-ad-slot[\s\S]*?<\/[a-zA-Z]+>/gi,
    /<[^>]*ad-slot[\s\S]*?<\/[a-zA-Z]+>/gi,
    // Empty price category block (Prijsevaluatie)
    /<div[^>]*id="priceCategorySection"[^>]*>[\s\S]*?<\/div>/gi,
  ];
  for (const pattern of removePatterns) {
    out = out.replace(pattern, '');
  }
  out = out.replace(/href="https?:\/\/[^"]*autoscout24\.be[^"]*"/gi, 'href="#"');
  out = out.replace(/<section[^>]*>\s*<\/section>/gi, '');
  out = out.replace(/<div[^>]*>\s*<\/div>/gi, '');
  // Final pass: strip any remaining unwanted text (e.g. inside shared elements)
  out = stripUnwantedText(out);
  return out;
}

/**
 * Extract page title from HTML. Prioritize h1 with pipe-separated format (e.g. "BMW 118 | FULL LED | M PACK").
 */
function extractTitle(html: string): string {
  // First try h1 with pipe-separated format (the actual listing title)
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  for (const h1Match of h1Matches) {
    const text = h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text.includes('|')) {
      return text;
    }
  }
  // Fallback to any h1
  if (h1Matches.length > 0) {
    return h1Matches[0][1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }
  // Last resort: title tag
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].replace(/\s+/g, ' ').trim();
  }
  return 'Voertuig';
}

/** Extract listing price string (e.g. "€ 16.999") from body – not financing total or monthly. */
function extractPrice(html: string): string | undefined {
  const priceCandidates = html.matchAll(/<[^>]+>([^<]*(?:€\s*[\d.,]+)[^<]*)<\/[a-zA-Z]+>/gi);
  const candidates: { price: string; value: number }[] = [];
  for (const m of priceCandidates) {
    const inner = m[1];
    if (/per\s*maand|Total|TAEG|maandaflossing|vanaf|maandelijks/i.test(inner)) continue;
    if (/,\d{2}\b/.test(inner)) continue;
    const priceMatch = inner.match(/€\s*([\d.]{1,3}(?:\.\d{3})*)/);
    if (priceMatch) {
      const priceStr = priceMatch[0].trim();
      const numStr = priceMatch[1].replace(/\./g, '');
      const numValue = parseInt(numStr, 10);
      // Skip prices under 1000 (likely monthly payments like € 341)
      if (numValue >= 1000) {
        candidates.push({ price: priceStr, value: numValue });
      }
    }
  }
  // Return the largest price (the actual listing price, not monthly)
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.value - a.value);
    return candidates[0].price;
  }
  return undefined;
}

const KEY_SPEC_LABELS = [
  'Kilometerstand',
  'Transmissie',
  'Bouwjaar',
  'Brandstof',
  'Vermogen',
  'Verkoper',
];

/** Extract key specs (Kilometerstand, Transmissie, etc.) from the overview block. */
function extractKeySpecs(html: string): KeySpec[] {
  const idx = html.search(/Kilometerstand/i);
  if (idx < 0) return [];
  const before = html.slice(Math.max(0, idx - 400), idx);
  const containerStart = before.lastIndexOf('<div');
  const start = containerStart >= 0 ? idx - 400 + containerStart : Math.max(0, idx - 150);
  const rest = html.slice(idx, idx + 1100);
  const endH2 = rest.search(/<h2[\s>]/i);
  const end = endH2 > 0 ? idx + endH2 : idx + 1100;
  const chunk = html.slice(start, end);
  const stripped = stripUnwantedText(chunk);
  if (
    !/Verkoper|Vermogen|Brandstof|Transmissie|Bouwjaar/i.test(stripped) ||
    /Krediet aanvragen|Uw verzekering|Ontdek je prijs|Cofidis|axa\.be/i.test(stripped)
  ) {
    return [];
  }
  const specs: KeySpec[] = [];
  // Try <dt>Label</dt><dd>Value</dd> - handle nested tags by finding matching closing tags
  const dtPattern = /<dt[^>]*>([\s\S]*?)<\/dt>/gi;
  let dtMatch: RegExpExecArray | null;
  while ((dtMatch = dtPattern.exec(stripped)) !== null) {
    const label = dtMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!KEY_SPEC_LABELS.some((k) => label.toLowerCase().includes(k.toLowerCase()))) continue;
    
    // Find the next <dd> after this <dt>
    const afterDt = stripped.substring(dtMatch.index + dtMatch[0].length);
    const ddMatch = afterDt.match(/<dd[^>]*>([\s\S]*?)<\/dd>/i);
    if (!ddMatch) continue;
    
    // Extract value: remove all HTML/SVG content
    let value = ddMatch[1];
    // If there's an SVG tag, only take text before it
    const svgIndex = value.toLowerCase().indexOf('<svg');
    if (svgIndex > 0) {
      value = value.substring(0, svgIndex);
    }
    // Remove SVG elements (including multi-line, self-closing, and incomplete)
    value = value.replace(/<svg[\s\S]*?<\/svg>/gi, '');
    value = value.replace(/<svg[^>]*\/?>/gi, '');
    value = value.replace(/<svg[^>]*>/gi, '');
    // Remove use tags and other SVG-related elements
    value = value.replace(/<use[^>]*\/?>/gi, '');
    // Remove all remaining HTML tags
    value = value.replace(/<[^>]+>/g, '');
    // Remove any leftover SVG-related text/attributes (including partial matches)
    value = value.replace(/<svg[\s\S]*/gi, ''); // Remove incomplete SVG tags
    value = value.replace(/\b(svg|viewBox|color|currentColor|aria-hidden|aria|hidden)\b/gi, '');
    value = value.replace(/="[^"]*"/g, ''); // Remove attribute-like strings
    value = value.replace(/\b0\s+0\s+24\s+24\b/g, ''); // Remove viewBox pattern specifically
    // Clean up whitespace
    value = value.replace(/\s+/g, ' ').trim();
    
    if (value) specs.push({ label, value });
  }
  if (specs.length > 0) return specs;
  // Fallback: find each label in text and take the next non-empty segment as value
  // Remove SVG elements first, then strip all HTML tags
  let text = stripped.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  text = text.replace(/<svg[^>]*\/?>/gi, '');
  text = text.replace(/<use[^>]*\/?>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/svg|viewBox|color|currentColor|aria-hidden/gi, '');
  text = text.replace(/\s+/g, ' ').trim();
  for (const label of KEY_SPEC_LABELS) {
    const re = new RegExp(`${label}\\s*([^•]+?)(?=${KEY_SPEC_LABELS.join('|')}|$)`, 'i');
    const match = text.match(re);
    if (match) {
      const value = match[1].replace(/\s+/g, ' ').trim();
      if (value) specs.push({ label, value });
    }
  }
  return specs;
}

/**
 * Try to isolate main content: keep main, or body content between nav and footer.
 * AutoScout24 pages typically have content in the body, so we extract from there.
 */
function extractMainContent(html: string): string {
  // If HTML is empty or very short, return it as-is (will be handled by caller)
  if (!html || html.trim().length < 50) {
    return html;
  }

  // First, try to find the body content (most reliable)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    const bodyContent = bodyMatch[1];
    
    // Remove header/navigation (usually at the start)
    // Look for common AS24 header patterns and remove them
    let cleanedBody = bodyContent
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove footer (usually at the end)
    cleanedBody = cleanedBody
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<div[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    
    if (cleanedBody.trim().length > 100) {
      return `<div class="as24-detail-main">${cleanedBody}</div>`;
    }
    
    // If cleaning removed too much, use original body content
    if (bodyContent.trim().length > 100) {
      return `<div class="as24-detail-main">${bodyContent}</div>`;
    }
  }
  
  // Fallback: try to find main tag
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch && mainMatch[1].trim().length > 50) {
    return `<main class="as24-detail-main">${mainMatch[1]}</main>`;
  }
  
  // Try to find article tag
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch && articleMatch[1].trim().length > 100) {
    return `<div class="as24-detail-main">${articleMatch[1]}</div>`;
  }
  
  // Last resort: use the entire HTML if it has substantial content
  // This will be cleaned later
  if (html.trim().length > 200) {
    return html;
  }
  
  return html;
}

/**
 * Fetch an AutoScout24 listing detail page, extract only car content, return title and HTML.
 */
export async function fetchDetailPageHtml(
  listingUrl: string
): Promise<DetailPageResult> {
  const res = await fetch(listingUrl, { headers: FETCH_HEADERS });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const html = await res.text();

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch || !bodyMatch[1]) {
    throw new Error('Could not find body content');
  }
  let bodyContent = bodyMatch[1];
  bodyContent = bodyContent
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');

  const images = extractImagesFromHtml(html);
  const title = extractTitle(html);
  const price = extractPrice(bodyContent);
  const keySpecs = extractKeySpecs(bodyContent);

  // Try to extract car-specific content first
  let contentHtml = extractCarContent(bodyContent);
  
  // If extraction didn't find enough content, use a more aggressive cleaning approach
  if (!contentHtml || contentHtml.trim().length < 300) {
    // Use the body content but clean it very aggressively
    contentHtml = cleanDetailHtml(bodyContent);
    
    // If still too short, try to find main/article content
    const mainMatch = bodyContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch && mainMatch[1].trim().length > 300) {
      contentHtml = cleanDetailHtml(mainMatch[1]);
    }
  } else {
    // Clean the extracted content
    contentHtml = cleanDetailHtml(contentHtml);
  }
  
  // Wrap in container
  if (contentHtml && contentHtml.trim().length > 50) {
    contentHtml = `<div class="as24-detail-main">${contentHtml}</div>`;
  }

  return { title, contentHtml: contentHtml || '', listingUrl, images, price, keySpecs };
}
