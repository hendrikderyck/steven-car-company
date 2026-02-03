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
        </div>
      </section>
    </>
  )
}
