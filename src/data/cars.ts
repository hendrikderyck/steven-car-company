// Mock data – later vervangen door Autoscout24 API
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

export const mockCars: Car[] = [
  {
    id: "1",
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
    features: ["FULL LED", "NAVI", "CAMERA", "CARPLAY", "AIRCO", "1 Jaar Garantie", "Car-Pass"],
    imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    btwAftrekbaar: true,
  },
  {
    id: "2",
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
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    btwAftrekbaar: true,
  },
  {
    id: "3",
    title: "Peugeot 208",
    brand: "Peugeot",
    model: "208",
    price: 12450,
    priceExclBtw: 10743,
    km: 30485,
    year: "01/2023",
    power: "75 PK (55 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["LED", "NAVI", "CARPLAY", "AIRCO", "PDC", "LANE ASSIST"],
    imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
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
    title: "BMW 118",
    brand: "BMW",
    model: "118",
    price: 16999,
    km: 67502,
    year: "02/2019",
    power: "136 PK (100 kW)",
    fuel: "Benzine",
    transmission: "Manueel",
    features: ["FULL LED", "M PACK", "LEDER", "A/C", "PDC"],
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  },
  {
    id: "6",
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
    imageUrl: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80",
    btwAftrekbaar: true,
  },
]
