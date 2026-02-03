import { motion } from "framer-motion"

const ease = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease },
}

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease },
}

const IMG_INTRO = "/banner.png"

const icons = {
  filter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  exchange: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14v2H5z" />
      <path d="M7 13l2-2 2 2 4-4" />
      <path d="M3 9h2v4H3zM19 9h2v4h-2z" />
      <rect x="2" y="5" width="20" height="8" rx="1" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="0" ry="0" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
}

export function OverOnsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="overons-hero">
        <motion.div
          className="overons-hero-img-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease }}
        >
          <img src={IMG_INTRO} alt="" />
          <div className="overons-hero-overlay" aria-hidden />
        </motion.div>
        <motion.div
          className="overons-hero-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="overons-hero-label">Het verhaal</p>
          <h1 className="overons-hero-title">Over Steven Car Company</h1>
          <p className="overons-hero-lead">
            Een jong en dynamisch autobedrijf in Ninove. Wij richten ons op de aan- en verkoop van jonge tweedehandswagens — geen massa, maar een selectief aanbod waar wij volledig achter staan.
          </p>
        </motion.div>
      </section>

      {/* Vier thema's: tekst alleen, geen stockfoto's, rustige opbouw */}
      <section className="overons-section overons-blocks">
        <div className="overons-container overons-blocks-inner">
          <motion.div className="overons-block" {...fadeUp}>
            <span className="overons-icon" aria-hidden>{icons.filter}</span>
            <p className="overons-label">Selectief in aankoop</p>
            <p className="overons-text">
              Kwaliteit begint bij de bron. Wij zijn zeer kritisch in welke wagens we toevoegen aan onze stock. Elke wagen wordt grondig nagekeken op technische staat, onderhoudshistoriek en algemeen voorkomen vooraleer deze in de verkoop gaat. Hierdoor kunnen wij een wisselend aanbod presenteren van recente wagens die in nieuwstaat verkeren, maar dan aan een competitieve tweedehandsprijs.
            </p>
          </motion.div>

          <motion.div className="overons-block" {...fadeUp}>
            <span className="overons-icon" aria-hidden>{icons.shield}</span>
            <p className="overons-label">Transparantie en vertrouwen</p>
            <p className="overons-text">
              Wij geloven dat het kopen van een auto een helder en eerlijk proces moet zijn. Bij Steven Car Company geen kleine lettertjes of vage beloftes, maar duidelijke afspraken. Omdat wij niet werken met een groot team van wisselende verkopers, heeft u altijd rechtstreeks contact met de zaakvoerder. Dit zorgt voor korte communicatielijnen en een dossierkennis die bij grote concessies vaak ontbreekt. Onze klanten weten exact wat ze kopen: een eerlijke wagen met een kloppend verhaal.
            </p>
          </motion.div>

          <motion.div className="overons-block" {...fadeUp}>
            <span className="overons-icon" aria-hidden>{icons.exchange}</span>
            <p className="overons-label">Dienstverlening en overname</p>
            <p className="overons-text">
              Wij helpen u graag bij de wissel van uw voertuig. Heeft u momenteel een wagen die u wenst te verkopen? Bij de aankoop van een wagen uit onze stock is overname van uw huidige auto altijd bespreekbaar. Wij zorgen voor een correcte marktwaardebepaling zodat u direct de overstap kunt maken naar uw nieuwe aankoop.
            </p>
          </motion.div>

          <motion.div className="overons-block" {...fadeUp}>
            <span className="overons-icon" aria-hidden>{icons.calendar}</span>
            <p className="overons-label">Werken op afspraak</p>
            <p className="overons-text">
              Om elke klant de nodige aandacht te geven en wachttijden te vermijden, werken wij uitsluitend op afspraak. Dit stelt ons in staat om de tijd te nemen voor een bezichtiging en al uw vragen rustig te beantwoorden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="overons-cta-section">
        <motion.div
          className="overons-container"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="overons-cta-text">
            Wilt u één van onze wagens bezichtigen of heeft u specifieke vragen? Wij zijn telefonisch vlot bereikbaar.
          </p>
          <a href="tel:0487450331" className="overons-cta-link">
            0487 45 03 31
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </motion.div>
      </section>
    </div>
  )
}
