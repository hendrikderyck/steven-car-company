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
}

// AutoScout24 CDN: path eindigt op .jpg, size bv. 250x188 of 800x600
const AS24_IMG = (path: string, size = "800x600") =>
  `https://prod.pictures.autoscout24.net/listing-images/${path}/${size}.webp`

export const mockCars: Car[] = [
  {
    id: "1",
    title: "BMW 118",
    brand: "BMW",
    model: "118",
    price: 16999,
    km: 67502,
    year: "02/2019",
    power: "136 PK (100 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["FULL LED", "M PACK", "LEDER", "A/C", "PDC", "1 Jaar Garantie", "Car-Pass", "keuring op 90 extra punten"],
    imageUrl: AS24_IMG("6b17f310-39a7-4f10-aa7f-4aafa0fde646_affd668b-2687-432b-9c48-10ce2281bed6.jpg"),
  },
  {
    id: "2",
    title: "Peugeot 208",
    brand: "Peugeot",
    model: "208",
    price: 10450,
    priceExclBtw: 9090,
    km: 62548,
    year: "09/2020",
    power: "75 PK (55 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["FULL LED", "NAVI", "CAMERA", "CARPLAY", "AIRCO"],
    imageUrl: AS24_IMG("e0c05bd4-f8f0-43bb-9a59-bc244fe444e7_c40f551b-8c5e-4d72-b3a5-769fc02a4ceb.jpg"),
    btwAftrekbaar: true,
  },
  {
    id: "3",
    title: "Citroën C3 Aircross",
    brand: "Citroën",
    model: "C3 Aircross",
    price: 9999,
    priceExclBtw: 8264,
    km: 70551,
    year: "01/2020",
    power: "82 PK (60 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["LED", "NAVI", "CRUISE", "A/C", "CARPLAY"],
    imageUrl: AS24_IMG("20f002af-7273-4d19-aa84-33461b00b8e1_a409b541-8c27-4e56-b33c-822e17a86dfb.jpg"),
    btwAftrekbaar: true,
  },
  {
    id: "4",
    title: "BMW X1",
    brand: "BMW",
    model: "X1",
    price: 18250,
    priceExclBtw: 14421,
    km: 104878,
    year: "02/2020",
    power: "136 PK (100 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["FULL LED", "NAVI", "DUAL AIRCO", "PDC", "BLUETOOTH"],
    imageUrl: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
    btwAftrekbaar: true,
  },
  {
    id: "5",
    title: "Volvo XC40",
    brand: "Volvo",
    model: "XC40",
    price: 19999,
    km: 75279,
    year: "08/2020",
    power: "129 PK (95 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["FULL LED", "NAVI", "CAMERA", "PDC", "CARPLAY"],
    imageUrl: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80",
  },
  {
    id: "6",
    title: "Peugeot Partner",
    brand: "Peugeot",
    model: "Partner",
    price: 12450,
    priceExclBtw: 10289,
    km: 112984,
    year: "01/2021",
    power: "102 PK (75 kW)",
    fuel: "Diesel",
    transmission: "Manueel",
    features: ["BTW INCL", "L2", "A/C", "CRUISE", "CARPLAY"],
    imageUrl: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80",
    btwAftrekbaar: true,
  },
  {
    id: "7",
    title: "Renault Express",
    brand: "Renault",
    model: "Express",
    price: 16999,
    priceExclBtw: 14049,
    km: 26023,
    year: "01/2024",
    power: "75 PK (55 kW)",
    fuel: "Diesel",
    transmission: "Manueel",
    features: ["BTW INCL", "LED", "CAMERA", "PDC", "A/C", "BLUETOOTH"],
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    btwAftrekbaar: true,
  },
]
