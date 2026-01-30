import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { mockCars } from "../data/cars"

export function AanbodDetail() {
  const { id } = useParams()
  const car = mockCars.find((c) => c.id === id)

  if (!car) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center font-body">
        <p className="text-muted">Deze wagen werd niet gevonden.</p>
        <Link to="/aanbod" className="font-display font-semibold text-ink mt-4 inline-block hover:underline">← Terug naar aanbod</Link>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(car.price)

  return (
    <>
      <section className="bg-bg py-8 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link to="/aanbod" className="font-body text-sm text-muted hover:text-ink transition">← Terug naar aanbod</Link>
        </div>
      </section>
      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-16"
          >
            <div className="aspect-[4/3] bg-border/30 rounded-sm overflow-hidden">
              <img src={car.imageUrl} alt={car.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">{car.title}</h1>
              <p className="font-body text-muted mt-2">
                {car.km.toLocaleString("nl-BE")} km · {car.year} · {car.power} · {car.transmission} · {car.fuel}
              </p>
              <div className="mt-8">
                <span className="font-display text-2xl font-bold text-ink tracking-tight">{formattedPrice}</span>
                {car.btwAftrekbaar && <span className="font-body ml-2 text-sm text-muted">incl. BTW (BTW aftrekbaar)</span>}
              </div>
              {car.priceExclBtw && (
                <p className="font-body text-sm text-muted mt-1">
                  {new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(car.priceExclBtw)} excl. BTW
                </p>
              )}
              {car.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display font-semibold text-ink text-sm tracking-tight mb-2">Uitrusting</h3>
                  <p className="font-body text-muted text-sm leading-relaxed">{car.features.join(" · ")}</p>
                </div>
              )}
              <p className="font-body text-sm text-muted mt-8 leading-relaxed">Overname mogelijk. Geen testritten – wel graag een afspraak om de wagen te bekijken.</p>
              <a
                href="tel:0487450331"
                className="mt-8 inline-flex items-center font-display font-semibold bg-ink text-white px-6 py-3.5 rounded-sm tracking-tight hover:bg-ink-soft transition"
              >
                Bel voor afspraak · 0487 45 03 31
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
