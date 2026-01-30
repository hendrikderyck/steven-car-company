import { motion } from "framer-motion"
import { CarCard } from "../components/CarCard"
import { mockCars } from "../data/cars"

export function Aanbod() {
  return (
    <>
      <section className="relative bg-ink text-white py-20 sm:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 noise" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-white/50">Stock</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
            Ons aanbod
          </h1>
          <p className="font-body text-white/70 mt-5 max-w-2xl leading-relaxed">
            Onze actuele voorraad jonge occasions. Zorgvuldig geselecteerd, eerlijk geprijsd. Kom gerust langs op afspraak of bel voor meer info.
          </p>
          <div className="mt-8 flex items-center gap-3 font-body text-sm text-white/60">
            <span className="flex gap-0.5 text-accent">★★★★★</span>
            <span>46+ reviews op AutoScout24</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-editorial">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-4 mb-10 p-5 bg-surface rounded-sm border border-border font-body text-sm text-muted">
            <span>Filters (bij API):</span>
            <span className="text-muted-soft">Merk · Bouwjaar · Prijs · Brandstof</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {mockCars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.03 * i }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
