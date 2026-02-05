import type { Car } from '../data/cars';
import type { ScrapedListing } from './autoscout24-scraper';

/**
 * Extract ID from AutoScout24 URL
 * Example: https://www.autoscout24.be/nl/aanbod/bmw/bmw-118/.../12345678
 * Also handles: /nl/aanbod/bmw-118-full-led-...-uuid format
 */
function extractIdFromUrl(url: string): string {
  // Try to find numeric ID at the end
  const numericMatch = url.match(/\/(\d+)(?:\?|$)/);
  if (numericMatch) {
    return numericMatch[1];
  }
  
  // Fallback: use the last part of URL (might be UUID or slug)
  const parts = url.split('/').filter(p => p);
  const lastPart = parts[parts.length - 1];
  
  // If it contains a UUID pattern, use that
  const uuidMatch = lastPart.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (uuidMatch) {
    return uuidMatch[1];
  }
  
  // Otherwise use the full slug as ID
  return lastPart || 'unknown';
}

/**
 * Extract model name from AutoScout24 URL or ID
 * Examples:
 * - /nl/aanbod/bmw/bmw-118/... -> "118"
 * - bmw-118-full-led-... -> "118"
 * - citroen-c3-aircross-... -> "C3 Aircross"
 */
function extractModelFromUrl(url: string, id?: string): string | null {
  // Try extracting from URL path first (more reliable)
  // URL format: /nl/aanbod/brand/brand-model-features-uuid
  const urlMatch = url.match(/\/aanbod\/[^/]+\/([^/]+)\//);
  if (urlMatch) {
    const slug = urlMatch[1];
    const slugParts = slug.split('-');
    
    if (slugParts.length >= 2) {
      // Find where model ends (usually before feature keywords or UUID)
      const featureKeywords = ['full', 'led', 'navi', 'camera', 'pdc', 'benzine', 'diesel', 'wit', 'grijs', 'zwart', 'zilver', 'btw', 'incl', 'pack', 'm', 'l2'];
      const commonBrands = ['bmw', 'mercedes', 'audi', 'volkswagen', 'vw', 'peugeot', 'renault', 'citroen', 'ford', 'opel'];
      
      // Check if first part is brand
      const firstPart = slugParts[0].toLowerCase();
      let startIdx = commonBrands.includes(firstPart) ? 1 : 0;
      
      // Find end of model (before features or UUID pattern)
      let modelEnd = slugParts.length;
      for (let i = startIdx + 1; i < slugParts.length; i++) {
        const part = slugParts[i].toLowerCase();
        // Stop at feature keywords or UUID-like patterns
        if (featureKeywords.includes(part) || part.match(/^[a-f0-9]{8}/)) {
          modelEnd = i;
          break;
        }
      }
      
      if (modelEnd > startIdx) {
        const modelParts = slugParts.slice(startIdx, modelEnd);
        if (modelParts.length > 0) {
          // Capitalize first letter of each word
          return modelParts.map(p => {
            // Handle special cases like "x1", "c3" -> "X1", "C3"
            if (p.match(/^[a-z]\d+$/)) {
              return p.charAt(0).toUpperCase() + p.slice(1).toUpperCase();
            }
            return p.charAt(0).toUpperCase() + p.slice(1);
          }).join(' ');
        }
      }
    }
  }
  
  // Try extracting from ID as fallback (if it's a slug, not UUID)
  if (id && !id.match(/^[a-f0-9-]{36}$/i)) {
    // Pattern: brand-model-features-...
    const idParts = id.split('-');
    if (idParts.length >= 2) {
      const featureKeywords = ['full', 'led', 'navi', 'camera', 'pdc', 'benzine', 'diesel', 'wit', 'grijs', 'zwart', 'zilver'];
      let modelEnd = idParts.length;
      for (let i = 2; i < idParts.length; i++) {
        if (featureKeywords.includes(idParts[i].toLowerCase())) {
          modelEnd = i;
          break;
        }
      }
      if (modelEnd > 1) {
        const modelParts = idParts.slice(1, modelEnd);
        if (modelParts.length > 0) {
          return modelParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        }
      }
    }
  }
  
  // Try extracting from URL path
  const match = url.match(/\/aanbod\/[^/]+\/([^/]+)\//);
  if (match) {
    const slug = match[1];
    // Remove brand prefix if present (e.g., "bmw-118" -> "118")
    const parts = slug.split('-');
    if (parts.length > 1) {
      // Check if first part is likely the brand (common brands)
      const commonBrands = ['bmw', 'mercedes', 'audi', 'volkswagen', 'vw', 'peugeot', 'renault', 'citroen', 'ford', 'opel'];
      if (commonBrands.includes(parts[0].toLowerCase())) {
        return parts.slice(1).join(' ').replace(/-/g, ' ');
      }
    }
    return slug.replace(/-/g, ' ');
  }
  return null;
}

/**
 * Format date to MM/YYYY format
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  
  // Handle ISO date format (YYYY-MM-DD)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    const [year, month] = dateStr.split('-');
    return `${month}/${year}`;
  }
  
  // Handle other formats - try to extract year
  const yearMatch = dateStr.match(/\d{4}/);
  const monthMatch = dateStr.match(/\d{2}/);
  if (yearMatch && monthMatch) {
    return `${monthMatch[0]}/${yearMatch[0]}`;
  }
  
  return dateStr;
}

/**
 * Extract power from description or rawLdJson
 */
function extractPower(listing: ScrapedListing): string {
  // Try rawLdJson first (more reliable)
  if (listing.rawLdJson) {
    const item = listing.rawLdJson.itemOffered || listing.rawLdJson;
    const engine = item.engine;
    if (engine) {
      const power = engine.power || engine.powerOutput || engine.powerOutputValue;
      if (power) {
        const value = typeof power === 'object' ? power.value : power;
        const unit = typeof power === 'object' ? (power.unit || 'kW') : 'kW';
        if (value) {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            // Convert kW to PK if needed (1 kW ≈ 1.36 PK)
            if (unit === 'kW' || unit === 'kilowatt' || unit === 'KILOWATT') {
              const pk = Math.round(numValue * 1.36);
              return `${pk} PK (${numValue} kW)`;
            }
            return `${numValue} ${unit}`;
          }
        }
      }
    }
  }
  
  // Try to find power in description
  if (listing.description) {
    const powerMatch = listing.description.match(/(\d+)\s*(?:PK|pk|kW|kw)/i);
    if (powerMatch) {
      const kw = listing.description.match(/(\d+)\s*kW/i);
      if (kw) {
        return `${powerMatch[1]} PK (${kw[1]} kW)`;
      }
      return `${powerMatch[1]} PK`;
    }
  }
  
  return 'Onbekend';
}

/**
 * Extract features from description and URL
 */
function extractFeatures(listing: ScrapedListing): string[] {
  const features: string[] = [];
  
  // Extract from URL slug (common pattern in AutoScout24 URLs)
  const urlMatch = listing.url.match(/\/aanbod\/[^/]+\/([^/]+)\//);
  if (urlMatch) {
    const slug = urlMatch[1].toUpperCase();
    const urlFeatures = [
      'FULL LED', 'LED', 'NAVI', 'CAMERA', 'PDC', 'CARPLAY', 'A/C', 'AIRCO',
      'CRUISE', 'LEDER', 'M PACK', 'BLUETOOTH', 'BTW INCL', 'BLACK EDITION',
      'BOSE', 'DUAL AIRCO'
    ];
    for (const feature of urlFeatures) {
      if (slug.includes(feature.replace(/\s+/g, '-'))) {
        features.push(feature);
      }
    }
  }
  
  // Extract from description
  if (listing.description) {
    const desc = listing.description.toUpperCase();
    
    // Common features to look for
    const featureKeywords = [
      'FULL LED', 'LED', 'NAVI', 'NAVIGATIE', 'CAMERA', 'PDC', 'PARK ASSIST',
      'CARPLAY', 'ANDROID AUTO', 'BLUETOOTH', 'A/C', 'AIRCO', 'CLIMATE',
      'CRUISE CONTROL', 'CRUISE', 'LEDER', 'LEATHER', 'M PACK', 'SPORT',
      'GARANTIE', 'CAR-PASS', 'KEURING', 'XENON', 'BI-XENON', 'HUD',
      'PANORAMA', 'SUNROOF', 'KEYLESS', 'START/STOP', 'STOP/START',
      'DUAL AIRCO', 'BLACK EDITION', 'BOSE'
    ];
    
    for (const keyword of featureKeywords) {
      if (desc.includes(keyword) && !features.includes(keyword)) {
        features.push(keyword);
      }
    }
  }
  
  return features.slice(0, 8); // Limit to 8 features
}

/**
 * Get image URL from listing
 */
function getImageUrl(listing: ScrapedListing): string {
  if (listing.images && listing.images.length > 0) {
    const imgUrl = listing.images[0];
    // If it's an AutoScout24 CDN URL, use it directly
    if (imgUrl.includes('autoscout24.net') || imgUrl.includes('prod.pictures')) {
      return imgUrl;
    }
    // Otherwise return as-is
    return imgUrl;
  }
  
  // Fallback placeholder
  return 'https://via.placeholder.com/800x600?text=Geen+afbeelding';
}

/**
 * Transform scraped listing to Car interface
 */
export function transformListingToCar(listing: ScrapedListing): Car | null {
  // Skip listings with errors
  if (listing.error) {
    return null;
  }
  
  // Require essential fields
  if (!listing.title || !listing.price || listing.price === 0) {
    return null;
  }
  
  const id = extractIdFromUrl(listing.url);
  
  // Extract brand and model - prioritize structured data, then URL/ID, then title
  let brand = listing.brand || '';
  let model = listing.model || '';
  
  // Try to extract from URL/ID if not available
  if (!model) {
    const urlModel = extractModelFromUrl(listing.url, id);
    if (urlModel) {
      model = urlModel;
    }
  }
  
  // Extract from title as fallback
  if (!brand || !model) {
    // Title format is often "BMW van € 16.999" or "BMW 118" or "BMW X1"
    const title = listing.title;
    // Remove price info: "van € X" or "€ X"
    const cleanedTitle = title.replace(/\s*(van\s*)?€\s*[\d.,]+/gi, '').trim();
    const titleParts = cleanedTitle.split(/\s+/);
    
    if (titleParts.length >= 1) {
      brand = brand || titleParts[0];
    }
    if (titleParts.length >= 2 && !model) {
      // Take everything after brand as model
      model = titleParts.slice(1).join(' ');
    }
  }
  
  // Final fallbacks
  if (!brand) brand = 'Onbekend';
  if (!model) {
    // Try to get from URL one more time
    const urlModel = extractModelFromUrl(listing.url);
    model = urlModel || listing.title.replace(/\s*(van\s*)?€\s*[\d.,]+/gi, '').trim() || 'Onbekend';
  }
  
  // Extract other fields with better parsing
  const year = formatDate(listing.firstRegistration);
  const km = listing.mileageKm || 0;
  
  // Better fuel type extraction
  let fuel = listing.fuelType || '';
  if (!fuel && listing.rawLdJson) {
    const item = listing.rawLdJson.itemOffered || listing.rawLdJson;
    fuel = item.fuelType || item.fuelEfficiency?.fuelType || '';
  }
  // Normalize fuel names
  if (fuel) {
    fuel = fuel.replace(/petrol/i, 'Benzine').replace(/diesel/i, 'Diesel').replace(/electric/i, 'Elektrisch');
  }
  fuel = fuel || 'Onbekend';
  
  // Better transmission extraction
  let transmission = listing.transmission || '';
  if (!transmission && listing.rawLdJson) {
    const item = listing.rawLdJson.itemOffered || listing.rawLdJson;
    transmission = item.vehicleTransmission || item.transmission || '';
  }
  // Normalize transmission
  if (transmission) {
    transmission = transmission.replace(/manual/i, 'Manueel').replace(/automatic/i, 'Automaat');
  }
  transmission = transmission || 'Manueel'; // Default to manual for Belgian market
  
  const power = extractPower(listing);
  const features = extractFeatures(listing);
  const imageUrl = getImageUrl(listing);
  
  // Build a better title from brand and model
  const title = `${brand} ${model}`.trim() || listing.title;
  
  // Calculate priceExclBtw (assuming 21% VAT for Belgium)
  // Only set if price seems to include VAT (common for B2C)
  const priceExclBtw = Math.round(listing.price / 1.21);
  const btwAftrekbaar = listing.price > 10000; // Heuristic: cars over 10k often have VAT deduction
  
  return {
    id,
    title,
    brand,
    model,
    price: listing.price,
    priceExclBtw: btwAftrekbaar ? priceExclBtw : undefined,
    km,
    year: year || 'Onbekend',
    power,
    fuel,
    transmission,
    features,
    imageUrl,
    btwAftrekbaar: btwAftrekbaar ? true : undefined,
  };
}

/**
 * Transform multiple listings to cars, filtering out invalid ones
 */
export function transformListingsToCars(listings: ScrapedListing[]): Car[] {
  return listings
    .map(transformListingToCar)
    .filter((car): car is Car => car !== null);
}
