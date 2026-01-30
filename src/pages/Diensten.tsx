import { motion } from "framer-motion"

export function Diensten() {
  return (
    <>
      <section className="relative bg-ink text-white py-20 sm:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 noise" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-white/50">Wat we doen</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
            Diensten
          </h1>
          <p className="font-body text-white/70 mt-5 max-w-2xl leading-relaxed">
            Steven Car Company is gespecialiseerd in de aan- en verkoop van jonge occasions. Eén duidelijke dienst, persoonlijk en transparant.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-surface relative noise">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-border rounded-sm p-8 lg:p-10 bg-bg/50"
            >
              <h2 className="font-display text-xl font-bold text-ink tracking-tight">Aankoop</h2>
              <p className="font-body text-muted mt-5 leading-relaxed">
                U zoekt een betrouwbare jonge occasion? Wij selecteren onze wagens zorgvuldig en verkopen enkel wat we zelf zouden rijden.
                Transparante prijzen, duidelijke info over kilometerstand en onderhoud. Geen testritten, wel een afspraak om de wagen in het echt te bekijken.
              </p>
              <ul className="mt-5 font-body text-muted text-sm space-y-2 leading-relaxed">
                <li>· Jonge, kwalitatieve occasions</li>
                <li>· Eerlijke prijzen en volledige transparantie</li>
                <li>· Persoonlijk advies op maat</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="border border-border rounded-sm p-8 lg:p-10 bg-bg/50"
            >
              <h2 className="font-display text-xl font-bold text-ink tracking-tight">Verkoop / Overname</h2>
              <p className="font-body text-muted mt-5 leading-relaxed">
                Heeft u een wagen die u wilt verkopen of inruilen? Wij kopen graag in en bieden een eerlijke overname.
                Geen gedoe – bel ons voor een afspraak en we bekijken samen de mogelijkheden.
              </p>
              <ul className="mt-5 font-body text-muted text-sm space-y-2 leading-relaxed">
                <li>· Overname mogelijk</li>
                <li>· Eerlijke prijs voor uw wagen</li>
                <li>· Eén contactpersoon: Steven</li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 sm:p-10 bg-bg rounded-sm border border-border text-center"
          >
            <p className="font-body text-muted">Geen testritten. Wel een persoonlijk gesprek en een kijkje op afspraak.</p>
            <a
              href="tel:0487450331"
              className="inline-flex items-center font-display font-semibold bg-ink text-white px-8 py-4 rounded-sm mt-6 tracking-tight hover:bg-ink-soft transition"
            >
              Bel 0487 45 03 31
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
