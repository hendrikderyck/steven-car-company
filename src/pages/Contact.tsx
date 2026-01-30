import { motion } from "framer-motion"

export function Contact() {
  return (
    <>
      <section className="relative bg-ink text-white py-20 sm:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 noise" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-white/50">Bereik ons</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
            Contact
          </h1>
          <p className="font-body text-white/70 mt-5 max-w-2xl leading-relaxed">
            Liever bellen dan mailen? Dat begrijpen we. Wij hebben liever dat u ons belt voor een afspraak – dan staan we meteen voor u klaar.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-editorial">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-xl font-bold text-ink tracking-tight mb-6">Telefoon – voorkeur</h2>
              <a href="tel:0487450331" className="font-display text-2xl sm:text-3xl font-bold text-ink hover:text-accent transition tracking-tight">
                0487 45 03 31
              </a>
              <p className="font-body text-muted mt-2 text-sm leading-relaxed">7/7 bereikbaar op afspraak. Bel voor een bezoek of meer info over een wagen.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
            >
              <h2 className="font-display text-xl font-bold text-ink tracking-tight mb-6">Adres</h2>
              <p className="font-body text-ink leading-relaxed">
                Steven Car Company BV<br />
                Aalstersesteenweg 511A<br />
                9400 Ninove
              </p>
              <p className="font-body text-muted text-sm mt-2">Open op afspraak. Graag vooraf bellen.</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 sm:p-12 bg-surface rounded-sm border border-border text-center"
          >
            <h3 className="font-display text-lg font-semibold text-ink tracking-tight">Bel nu</h3>
            <p className="font-body text-muted mt-2">Kort op de bal – bel ons voor vragen, een afspraak of een overname.</p>
            <a
              href="tel:0487450331"
              className="inline-flex items-center font-display font-semibold bg-ink text-white px-8 py-4 rounded-sm mt-6 tracking-tight hover:bg-ink-soft transition"
            >
              0487 45 03 31
            </a>
          </motion.div>

          <div className="mt-10 text-center">
            <a
              href="https://www.facebook.com/stevencarcompany"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-muted hover:text-ink transition text-sm"
            >
              Volg ons op Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
