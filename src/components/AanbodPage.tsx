import { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AanbodCard } from "./AanbodCard"
import type { Car } from "../data/cars"
import { transformApiListingsToCars } from "../utils/api-listing-to-car"
import type { ApiListing } from "../utils/api-listing-to-car"

const SORT_OPTIONS = [
  { value: "default", label: "Standaard resultaten" },
  { value: "price-asc", label: "Prijs oplopend" },
  { value: "price-desc", label: "Prijs aflopend" },
  { value: "newest", label: "Nieuwste voertuigen eerst" },
  { value: "km-asc", label: "Kilometerstand oplopend" },
  { value: "km-desc", label: "Kilometerstand aflopend" },
  { value: "year-asc", label: "Bouwjaar oplopend" },
  { value: "year-desc", label: "Bouwjaar aflopend" },
] as const

interface AanbodPageProps {
  /** Cars from build-time - deprecated, now fetched at runtime */
  cars: Car[]
}

function getBrands(cars: Car[]): string[] {
  return ["Alle", ...[...new Set(cars.map((c) => c.brand))].sort()]
}

function getFuels(cars: Car[]): string[] {
  return ["Alle", ...[...new Set(cars.map((c) => c.fuel))].sort()]
}

function yearValue(y: string): number {
  const [mm, yyyy] = y.split("/").map(Number)
  return (yyyy ?? 0) + (mm ?? 0) / 12
}

function yearNumber(y: string): number {
  const parts = y.split("/")
  return Number(parts[1] ?? parts[0] ?? 0)
}

function filterAndSort(
  cars: Car[],
  filters: { brand: string; fuel: string; yearMin: string; yearMax: string; priceMin: string; priceMax: string },
  sort: string
): Car[] {
  const list = cars.filter((car) => {
    if (filters.brand !== "Alle" && car.brand !== filters.brand) return false
    if (filters.fuel !== "Alle" && car.fuel !== filters.fuel) return false
    const carYear = yearNumber(car.year)
    if (filters.yearMin && carYear < Number(filters.yearMin)) return false
    if (filters.yearMax && carYear > Number(filters.yearMax)) return false
    if (filters.priceMin && car.price < Number(filters.priceMin)) return false
    if (filters.priceMax && car.price > Number(filters.priceMax)) return false
    return true
  })

  const sorted = [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return yearValue(b.year) - yearValue(a.year)
      case "km-asc":
        return a.km - b.km
      case "km-desc":
        return b.km - a.km
      case "year-asc":
        return yearValue(a.year) - yearValue(b.year)
      case "year-desc":
        return yearValue(b.year) - yearValue(a.year)
      default:
        return 0
    }
  })
  return sorted
}

export function AanbodPage({ cars: propCars }: AanbodPageProps) {
  const [cars, setCars] = useState<Car[]>(propCars)
  const [isLoading, setIsLoading] = useState(propCars.length === 0)
  const [sort, setSort] = useState<string>("default")
  const [filters, setFilters] = useState({
    brand: "Alle",
    fuel: "Alle",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
  })

  // Fetch listings at runtime
  useEffect(() => {
    if (propCars.length > 0) {
      // If props are provided (fallback), use them
      return;
    }

    async function fetchListings() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/listings.json');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        const listings = data.listings as ApiListing[];
        const transformedCars = transformApiListingsToCars(listings);
        setCars(transformedCars);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [propCars.length]);

  const brands = useMemo(() => getBrands(cars), [cars])
  const fuels = useMemo(() => getFuels(cars), [cars])

  const filteredCars = useMemo(
    () => filterAndSort(cars, filters, sort),
    [cars, filters, sort]
  )

  return (
    <>
      <section className="py-8 sm:py-10 bg-editorial min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="font-body text-ink font-medium">
              {filteredCars.length} Resultaten
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-aanbod" className="font-body text-sm text-muted shrink-0">
                Sorteren:
              </label>
              <select
                id="sort-aanbod"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="font-body text-sm text-ink bg-surface border border-border rounded px-3 py-2 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <aside className="lg:w-56 shrink-0">
              <div className="bg-surface border border-border rounded p-5 space-y-5 sticky top-24">
                <h2 className="font-display font-semibold text-ink text-sm tracking-tight uppercase">
                  Filter voor
                </h2>

                <div>
                  <label className="font-body text-xs text-muted block mb-1.5">Merk</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full font-body text-sm text-ink bg-bg border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs text-muted block mb-1.5">Brandstof</label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => setFilters((f) => ({ ...f, fuel: e.target.value }))}
                    className="w-full font-body text-sm text-ink bg-bg border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
                  >
                    {fuels.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs text-muted block mb-1.5">Bouwjaar van</label>
                  <input
                    type="number"
                    min={2010}
                    max={2026}
                    placeholder="bijv. 2018"
                    value={filters.yearMin}
                    onChange={(e) => setFilters((f) => ({ ...f, yearMin: e.target.value }))}
                    className="w-full font-body text-sm text-ink bg-bg border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-muted block mb-1.5">Bouwjaar tot</label>
                  <input
                    type="number"
                    min={2010}
                    max={2026}
                    placeholder="bijv. 2024"
                    value={filters.yearMax}
                    onChange={(e) => setFilters((f) => ({ ...f, yearMax: e.target.value }))}
                    className="w-full font-body text-sm text-ink bg-bg border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-muted block mb-1.5">Prijs van (€)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="bijv. 5000"
                    value={filters.priceMin}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
                    className="w-full font-body text-sm text-ink bg-bg border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-muted block mb-1.5">Prijs tot (€)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="bijv. 25000"
                    value={filters.priceMax}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
                    className="w-full font-body text-sm text-ink bg-bg border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
                  />
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0" data-embed-target="true">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="font-body text-muted">Laden...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {filteredCars.map((car, i) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                      >
                        <AanbodCard car={car} />
                      </motion.div>
                    ))}
                  </div>
                  {filteredCars.length === 0 && (
                    <p className="font-body text-muted text-center py-12">
                      Geen voertuigen gevonden met deze filters. Pas de filters aan of{" "}
                      <a href="https://www.autoscout24.be/nl/verkopers/steven-car-company-bv" target="_blank" rel="noopener noreferrer" className="text-ink font-medium hover:underline">
                        bekijk ons volledige aanbod op AutoScout24
                      </a>
                      .
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
