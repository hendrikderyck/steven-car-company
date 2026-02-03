import { mockCars } from "../data/cars";

const HIGHLIGHT_COUNT = 3;
const highlightedCars = mockCars.slice(0, HIGHLIGHT_COUNT);

function formatPrice(price: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function HomeHero() {
  return (
    <>
      {/* Hero + CTA — Pitch Black & White · Sharp */}
      <section className="home-hero-monolith">
        <video
          src={`/hero.mp4${import.meta.env.DEV ? `?t=${Date.now()}` : ""}`}
          autoPlay
          muted
          loop
          playsInline
          className="home-hero-bg"
          aria-hidden
        />
        <div className="home-hero-overlay" aria-hidden />

        <div className="home-hero-inner">
          <h1 className="home-hero-logo-wrap">
            <img
              src="/logo.png"
              alt="Steven Car Company"
              className="home-hero-logo"
            />
          </h1>
          <div className="home-hero-actions">
            <a href="/aanbod/" className="home-hero-cta home-hero-cta-solid">
              Bekijk aanbod
            </a>
            <a href="tel:0487450331" className="home-hero-cta home-hero-cta-ghost">
              Bel voor afspraak
            </a>
          </div>
        </div>
      </section>

      {/* Over ons + Foto bedrijf */}
      <section className="home-about">
        <div className="home-about-inner">
          <div className="home-about-grid">
            <div className="home-about-text">
              <span className="home-about-label">Over ons</span>
              <h2 className="home-about-title">Steven Car Company</h2>
              <p className="home-about-lead">
                Steven Car Company is een jong en dynamisch autobedrijf uit Ninove, gespecialiseerd in de aan- en verkoop van jonge tweedehandswagens. Wij onderscheiden ons door een strikte selectie op kwaliteit en historiek, waarbij we bewust kiezen voor betrouwbaarheid boven massa.
              </p>
              <a href="/over-ons/" className="home-about-link">
                Meer over ons →
              </a>
            </div>
            <div className="home-about-img-wrap">
              <img src="/banner.png" alt="Steven Car Company, Ninove" />
            </div>
          </div>
        </div>
      </section>

      {/* Diensten — inspiratie KGT: Waarvoor kan u bij ons terecht? */}
      <section className="home-diensten">
        <div className="home-diensten-inner">
          <div className="home-diensten-header">
            <span className="home-diensten-label">Diensten</span>
            <h2 className="home-diensten-title">Waarvoor kan u bij ons terecht?</h2>
          </div>
          <div className="home-diensten-grid">
            <div className="home-diensten-card">
              <h3 className="home-diensten-card-title">Koop uw tweedehandswagen</h3>
              <p className="home-diensten-card-text">
                Jonge occasions, eerlijke prijzen en persoonlijk advies op maat.
              </p>
              <a href="/aanbod/" className="home-diensten-card-btn">
                Bekijk ons aanbod
              </a>
            </div>
            <div className="home-diensten-card">
              <h3 className="home-diensten-card-title">Verkoop uw wagen</h3>
              <p className="home-diensten-card-text">
                Wagen verkopen? Wij kopen graag in en bieden een eerlijke overname.
              </p>
              <a href="/overname/" className="home-diensten-card-btn home-diensten-card-btn-ghost">
                Maak een afspraak
              </a>
            </div>
          </div>

          {/* Uitgelichte wagens uit aanbod — eigen blok zodat het meer opvalt */}
          <section className="home-highlight-section" aria-labelledby="home-highlight-heading">
            <div className="home-highlight-inner">
              <h2 id="home-highlight-heading" className="home-highlight-title">Uit ons aanbod</h2>
              <div className="home-highlight-grid">
                {highlightedCars.map((car) => (
                  <a key={car.id} href={`/aanbod/${car.id}/`} className="home-highlight-card">
                    <div className="home-highlight-img-wrap">
                      <img src={car.imageUrl} alt={car.title} className="home-highlight-img" />
                    </div>
                    <div className="home-highlight-body">
                      <h3 className="home-highlight-card-title">{car.title}</h3>
                      <p className="home-highlight-specs">
                        {car.km.toLocaleString("nl-BE")} km · {car.year} · {car.power}
                      </p>
                      <p className="home-highlight-price">{formatPrice(car.price)}</p>
                    </div>
                  </a>
                ))}
              </div>
              <a href="/aanbod/" className="home-highlight-link">
                Bekijk volledig aanbod →
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
