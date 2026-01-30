import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CarCard } from "../components/CarCard"
import { mockCars } from "../data/cars"

const featuredCars = mockCars.slice(0, 3)

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Home() {
  return (
    <>
      {/* Hero – editorial noir, gradient + noise, staggered copy */}
      <section className="relative min-h-[75vh] flex flex-col justify-center hero-gradient text-white overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          src="/hero.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10" />
        <div className="absolute inset-0 noise" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.p variants={item} className="font-display text-xs uppercase tracking-[0.3em] text-white/60 mb-6">
              Jonge occasions · Ninove
            </motion.p>
            <motion.h1
              variants={item}
              className="font-display font-bold max-w-4xl mx-auto leading-[1.1] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight"
            >
              Eerlijke aan- en verkoop.<br />Het gezicht achter de zaak.
            </motion.h1>
            <motion.p variants={item} className="font-body text-lg sm:text-xl text-white/80 mt-8 max-w-2xl mx-auto leading-relaxed">
              Bij Steven Car Company bent u geen nummer. Persoonlijk advies, transparantie en kwaliteit staan centraal.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5" aria-label="5 sterren">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-accent text-xl">★</span>
                  ))}
                </div>
                <span className="font-body text-sm text-white/60">46+ reviews op AutoScout24</span>
              </div>
              <a
                href="tel:0487450331"
                className="inline-flex items-center font-display font-semibold text-ink bg-white px-6 py-3.5 rounded-sm tracking-tight hover:bg-white/90 transition"
              >
                Bel nu · 0487 45 03 31
              </a>
            </motion.div>
            <motion.p variants={item} className="font-body text-white/50 text-sm mt-6">
              7/7 open op afspraak · Overname mogelijk
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Uitgelichte wagens – grid + subtle background */}
      <section className="relative py-20 sm:py-28 bg-editorial">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
          >
            <div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
                Uitgelichte wagens
              </h2>
              <p className="font-body text-muted mt-2">Onze actuele voorraad.</p>
            </div>
            <Link
              to="/aanbod"
              className="font-display font-semibold text-ink text-sm tracking-tight hover:underline underline-offset-4 shrink-0"
            >
              Bekijk volledig aanbod →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredCars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 * i }}
              >
                <CarCard car={car} featured />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Waarom wij – numbered blocks */}
      <section className="py-20 sm:py-28 bg-surface relative noise">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink text-center tracking-tight mb-16"
          >
            Waarom Steven Car Company?
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-10 lg:gap-14">
            {[
              { n: "01", title: "Persoonlijk", text: "U spreekt met Steven zelf. Geen anonieme handel, maar een gezicht en een belofte." },
              { n: "02", title: "Eerlijk & transparant", text: "Geen verrassingen. Wij verkopen enkel wagens waar we 100% achter staan." },
              { n: "03", title: "Overname mogelijk", text: "Uw huidige wagen inruilen? Dat regelen we graag voor u." },
            ].map((block, i) => (
              <motion.div
                key={block.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="text-center"
              >
                <span className="font-display text-4xl sm:text-5xl font-bold text-ink/15 tracking-tighter">{block.n}</span>
                <h3 className="font-display font-semibold text-ink text-lg mt-4 tracking-tight">{block.title}</h3>
                <p className="font-body text-muted text-sm mt-3 leading-relaxed max-w-xs mx-auto">{block.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bel nu */}
      <section className="py-20 sm:py-24 bg-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] noise" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Interesse of een afspraak?
          </h2>
          <p className="font-body text-white/70 mt-5">Bel ons. Geen lange formulieren – we staan klaar om u te helpen.</p>
          <a
            href="tel:0487450331"
            className="inline-flex items-center font-display font-semibold bg-white text-ink px-8 py-4 rounded-sm mt-10 tracking-tight hover:bg-white/90 transition"
          >
            Bel 0487 45 03 31
          </a>
        </motion.div>
      </section>
    </>
  )
}
