import { Link } from "react-router-dom"
import type { Car } from "../data/cars"

interface AanbodCardProps {
  car: Car
}

/**
 * AutoScout24-style listing card: image, title with features, price + badge, specs.
 * Layout matches AS24 dealer page for consistent first impression before embed.
 */
export function AanbodCard({ car }: AanbodCardProps) {
  const priceFormatted = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(car.price)

  const priceExclFormatted = car.priceExclBtw
    ? new Intl.NumberFormat("nl-BE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(car.priceExclBtw)
    : null

  const titleWithFeatures =
    car.features.length > 0
      ? `${car.title} | ${car.features.slice(0, 6).join(" | ")}`
      : car.title

  return (
    <article className="bg-surface border border-border rounded overflow-hidden hover:border-ink/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200">
      <Link to={`/aanbod/${car.id}`} className="flex flex-col sm:flex-row sm:min-h-0">
        {/* Image – AS24 ratio ~250x188 */}
        <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-[188px] bg-border/50 overflow-hidden">
          <img
            src={car.imageUrl}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-semibold text-ink text-base sm:text-lg tracking-tight line-clamp-2">
              {titleWithFeatures}
            </h2>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display font-bold text-lg text-ink tracking-tight">
                {priceFormatted}
              </span>
              {car.btwAftrekbaar && (
                <span className="font-body text-xs text-muted">incl. BTW</span>
              )}
              {priceExclFormatted && (
                <span className="font-body text-xs text-muted">
                  {priceExclFormatted} excl. BTW
                </span>
              )}
              <span className="inline-flex items-center font-body text-xs text-muted bg-ink/5 text-ink/80 px-2 py-0.5 rounded">
                Goede prijs
              </span>
            </div>
            <p className="font-body text-sm text-muted mt-2">
              {car.km.toLocaleString("nl-BE")} km · {car.year} · {car.power} ·
              Tweedehands · Manueel · {car.fuel}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
