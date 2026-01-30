import { motion } from "framer-motion"

export function OverOns() {
  return (
    <>
      <section className="relative bg-ink text-white py-20 sm:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 noise" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-white/50">Het verhaal</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
            Over ons
          </h1>
          <p className="font-body text-white/70 mt-5 max-w-2xl leading-relaxed">
            Steven Car Company is geen anonieme handel. Hier vindt u het gezicht achter de zaak – en de belofte van eerlijkheid en kwaliteit.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-surface relative noise">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold text-ink tracking-tight"
            >
              Het gezicht achter de zaak
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-body text-muted mt-6 leading-relaxed"
            >
              Steven Car Company draait om één ding: eerlijke aan- en verkoop van wagens, met een menselijk gezicht.
              Geen grote showroom waar u een nummer bent, maar een persoonlijke aanpak waarbij u weet met wie u zaken doet.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-muted mt-5 leading-relaxed"
            >
              Wij verkopen enkel wagens waar we zelf 100% achter staan. Transparantie is bij ons geen optie, maar de standaard.
              Of u nu komt om te kopen of om uw wagen te verkopen of in te ruilen – u spreekt met iemand die luistert en meedenkt.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-body text-muted mt-5 leading-relaxed"
            >
              Onze klanten komen uit heel België, maar we zijn lokaal geworteld in Ninove. De foto's van onze wagens zijn "bij het huis" genomen –
              dat past bij de sfeer die we willen uitstralen: geen glanzende marketing, wel eerlijkheid en kwaliteit.
            </motion.p>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 gap-8">
            {[
              { title: "Eerlijkheid & kwaliteit", text: "Geen verborgen gebreken, geen overdreven beloftes. Wat we zeggen, doen we." },
              { title: "Persoonlijke touch", text: "U spreekt met Steven. Geen callcenter, geen doorverwijzingen." },
            ].map((block, i) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="p-6 lg:p-8 bg-bg rounded-sm border border-border"
              >
                <h3 className="font-display font-semibold text-ink tracking-tight">{block.title}</h3>
                <p className="font-body text-muted text-sm mt-2 leading-relaxed">{block.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 sm:p-10 bg-ink text-white rounded-sm text-center"
          >
            <p className="font-body text-white/70">Vragen? Bel ons – we staan klaar.</p>
            <a href="tel:0487450331" className="font-display font-semibold text-xl mt-4 inline-block hover:text-accent-soft transition tracking-tight">0487 45 03 31</a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
