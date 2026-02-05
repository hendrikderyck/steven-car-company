// Data van AutoScout24 dealerpagina Steven Car Company BV
// https://www.autoscout24.be/nl/verkopers/steven-car-company-bv
export interface Car {
  id: string
  title: string
  brand: string
  model: string
  price: number
  priceExclBtw?: number
  km: number
  year: string
  power: string
  fuel: string
  transmission: string
  features: string[]
  imageUrl: string
  btwAftrekbaar?: boolean
  // Additional fields
  bodyType?: string
  condition?: string // "Tweedehands" etc
  previousOwners?: number
  fuelConsumption?: string // "5,0 l/100 km (comb.)"
  co2Emissions?: number // g/km
  interiorType?: string
  interiorColor?: string
  numberOfDoors?: number
  seatingCapacity?: number
  htmlWrapper?: string
  /** Full AutoScout24 listing URL for the detail page fetch */
  listingUrl?: string
}

