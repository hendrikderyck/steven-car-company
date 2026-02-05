import type { Car } from '../data/cars';
import { extractIdFromListingUrl } from './listings';

/** Shape of a listing from /api/listings.json */
export interface ApiListing {
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
  power: string | null;
  images: string[];
  previousOwners?: number | null;
  fuelConsumption?: string | null;
  co2Emissions?: number | null;
  interiorType?: string | null;
  interiorColor?: string | null;
  numberOfDoors?: number | null;
  seatingCapacity?: number | null;
  condition?: string | null;
  htmlWrapper?: string;
}

export function transformApiListingToCar(listing: ApiListing): Car | null {
  if (!listing || typeof listing.url !== 'string') {
    return null;
  }
  if (!listing.title || !listing.price || listing.price === 0) {
    return null;
  }

  const id = extractIdFromListingUrl(listing.url);

  const features: string[] = [];
  const urlMatch2 = listing.url.match(/\/aanbod\/[^/]+\/([^/]+)\//);
  if (urlMatch2) {
    const slug = urlMatch2[1].toUpperCase();
    const featureKeywords = [
      'FULL LED', 'LED', 'NAVI', 'NAVIGATIE', 'CAMERA', 'PDC', 'PARK ASSIST',
      'CARPLAY', 'ANDROID AUTO', 'BLUETOOTH', 'A/C', 'AIRCO', 'CLIMATE',
      'CRUISE CONTROL', 'CRUISE', 'LEDER', 'LEATHER', 'M PACK', 'SPORT',
      'GARANTIE', 'CAR-PASS', 'KEURING', 'XENON', 'BI-XENON', 'HUD',
      'PANORAMA', 'SUNROOF', 'KEYLESS', 'START/STOP', 'STOP/START',
      'DUAL AIRCO', 'BLACK EDITION', 'BOSE', 'BTW INCL', 'PACK', 'SW',
      'PARELMOER', 'L2'
    ];
    for (const keyword of featureKeywords) {
      const slugKeyword = keyword.replace(/\s+/g, '-');
      if (slug.includes(slugKeyword) && !features.includes(keyword)) {
        features.push(keyword);
      }
    }
  }

  if (listing.description) {
    const desc = listing.description.toUpperCase();
    const descFeatures = [
      'GARANTIE', 'CAR-PASS', 'KEURING', 'JAAR GARANTIE'
    ];
    for (const keyword of descFeatures) {
      if (desc.includes(keyword) && !features.includes(keyword)) {
        if (keyword === 'JAAR GARANTIE') {
          const match = listing.description!.match(/(\d+)\s*(?:jaar|year)\s*garantie/i);
          if (match) {
            features.push(`${match[1]} Jaar Garantie`);
          } else {
            features.push('Garantie');
          }
        } else {
          features.push(keyword);
        }
      }
    }
  }

  if (listing.interiorType && !features.includes(listing.interiorType.toUpperCase())) {
    features.push(listing.interiorType);
  }

  const imageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://via.placeholder.com/800x600?text=Geen+afbeelding';

  const priceExclBtw = Math.round(listing.price / 1.21);
  const btwAftrekbaar = listing.price > 10000;

  return {
    id,
    title: listing.title,
    brand: listing.brand || 'Onbekend',
    model: listing.model || 'Onbekend',
    price: listing.price,
    priceExclBtw: btwAftrekbaar ? priceExclBtw : undefined,
    km: listing.mileageKm || 0,
    year: listing.firstRegistration || 'Onbekend',
    power: listing.power || 'Onbekend',
    fuel: listing.fuelType || 'Onbekend',
    transmission: listing.transmission || 'Manueel',
    features: features.slice(0, 8),
    imageUrl,
    btwAftrekbaar: btwAftrekbaar ? true : undefined,
    bodyType: listing.bodyType || undefined,
    condition: listing.condition || 'Tweedehands',
    previousOwners: listing.previousOwners || undefined,
    fuelConsumption: listing.fuelConsumption || undefined,
    co2Emissions: listing.co2Emissions || undefined,
    interiorType: listing.interiorType || undefined,
    interiorColor: listing.interiorColor || undefined,
    numberOfDoors: listing.numberOfDoors || undefined,
    seatingCapacity: listing.seatingCapacity || undefined,
    htmlWrapper: listing.htmlWrapper,
    listingUrl: listing.url,
  };
}

export function transformApiListingsToCars(listings: unknown): Car[] {
  if (!Array.isArray(listings)) {
    return [];
  }
  return listings
    .map((item) => transformApiListingToCar(item as ApiListing))
    .filter((car): car is Car => car !== null);
}
