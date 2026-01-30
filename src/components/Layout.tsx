import { Link, Outlet, useLocation } from "react-router-dom"

const nav = [
  { to: "/", label: "Home" },
  { to: "/aanbod", label: "Aanbod" },
  { to: "/diensten", label: "Diensten" },
  { to: "/over-ons", label: "Over Ons" },
  { to: "/contact", label: "Contact" },
]

export function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 overflow-visible">
          <Link to="/" className="flex items-center group -my-2 sm:-my-3">
            <img src="/logo.png" alt="Steven Car Company BV" className="h-20 sm:h-24 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {nav.map(({ to, label }) => {
              const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative font-body text-sm font-medium transition-colors py-1 ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-accent" aria-hidden />
                  )}
                </Link>
              )
            })}
          </nav>
          <a
            href="tel:0487450331"
            className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-sm font-display font-semibold text-sm tracking-tight hover:bg-ink-soft transition shrink-0"
          >
            <span className="hidden sm:inline">Bel nu</span>
            <span>0487 45 03 31</span>
          </a>
        </div>
        <div className="md:hidden border-t border-border px-4 py-2.5 flex gap-6 overflow-x-auto">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm whitespace-nowrap font-body ${
                location.pathname === to ? "text-ink font-medium" : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <img src="/logo.png" alt="Steven Car Company BV" className="h-10 w-auto object-contain invert mb-4" />
              <p className="text-muted-soft text-sm font-body leading-relaxed">Eerlijke aan- en verkoop van jonge occasions. Overname mogelijk.</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm tracking-tight mb-3">Contact</h3>
              <p className="text-white/70 text-sm font-body">Aalstersesteenweg 511A<br />9400 Ninove</p>
              <a href="tel:0487450331" className="text-white font-display font-semibold mt-2 block hover:text-accent-soft transition">0487 45 03 31</a>
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm tracking-tight mb-3">Open op afspraak</h3>
              <p className="text-white/70 text-sm font-body">7/7 bereikbaar voor een afspraak. Bel ons.</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm tracking-tight mb-3">Volg ons</h3>
              <a
                href="https://www.facebook.com/stevencarcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition font-body text-sm"
              >
                Facebook
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-white/50 text-sm text-center font-body">
            © {new Date().getFullYear()} Steven Car Company BV
          </div>
        </div>
      </footer>
    </div>
  )
}
