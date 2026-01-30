import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { Car } from "../data/cars"

interface CarCardProps {
  car: Car
  featured?: boolean
}

export function CarCard({ car, featured }: CarCardProps) {
  const formattedPrice = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(car.price)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group bg-surface border border-border rounded-sm overflow-hidden hover:border-ink/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ${featured ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)]" : ""}`}
    >
      <Link to={`/aanbod/${car.id}`} className="block">
        <div className="aspect-[4/3] bg-border/50 overflow-hidden">
          <img
            src={car.imageUrl}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-ink text-lg tracking-tight">{car.title}</h3>
          <p className="font-body text-sm text-muted mt-1">
            {car.km.toLocaleString("nl-BE")} km · {car.year} · {car.power} · {car.transmission} · {car.fuel}
          </p>
          {car.features.length > 0 && (
            <p className="font-body text-xs text-muted-soft mt-2 line-clamp-1">{car.features.slice(0, 4).join(" · ")}</p>
          )}
          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="font-display font-bold text-xl text-ink tracking-tight">{formattedPrice}</span>
            {car.btwAftrekbaar && (
              <span className="font-body text-xs text-muted-soft">BTW aftrekbaar</span>
            )}
          </div>
          {car.priceExclBtw && (
            <p className="font-body text-xs text-muted-soft mt-1">
              {new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(car.priceExclBtw)} excl. BTW
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
