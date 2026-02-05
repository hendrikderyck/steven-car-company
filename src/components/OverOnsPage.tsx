import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const IMG_INTRO = "/banner.webp"

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

const blocks = [
  {
    key: "selectief",
    icon: icons.filter,
    label: "Selectief in aankoop",
    text: "Kwaliteit begint bij de bron. Wij zijn zeer kritisch in welke wagens we toevoegen aan onze stock. Elke wagen wordt grondig nagekeken op technische staat, onderhoudshistoriek en algemeen voorkomen vooraleer deze in de verkoop gaat. Hierdoor kunnen wij een wisselend aanbod presenteren van recente wagens die in nieuwstaat verkeren, maar dan aan een competitieve tweedehandsprijs.",
  },
  {
    key: "transparantie",
    icon: icons.shield,
    label: "Transparantie en vertrouwen",
    text: "Wij geloven dat het kopen van een auto een helder en eerlijk proces moet zijn. Bij Steven Car Company geen kleine lettertjes of vage beloftes, maar duidelijke afspraken. Omdat wij niet werken met een groot team van wisselende verkopers, heeft u altijd rechtstreeks contact met de zaakvoerder. Dit zorgt voor korte communicatielijnen en een dossierkennis die bij grote concessies vaak ontbreekt. Onze klanten weten exact wat ze kopen: een eerlijke wagen met een kloppend verhaal.",
  },
  {
    key: "overname",
    icon: icons.exchange,
    label: "Dienstverlening en overname",
    text: "Wij helpen u graag bij de wissel van uw voertuig. Heeft u momenteel een wagen die u wenst te verkopen? Bij de aankoop van een wagen uit onze stock is overname van uw huidige auto altijd bespreekbaar. Wij zorgen voor een correcte marktwaardebepaling zodat u direct de overstap kunt maken naar uw nieuwe aankoop.",
  },
  {
    key: "afspraak",
    icon: icons.calendar,
    label: "Werken op afspraak",
    text: "Om elke klant de nodige aandacht te geven en wachttijden te vermijden, werken wij uitsluitend op afspraak. Dit stelt ons in staat om de tijd te nemen voor een bezichtiging en al uw vragen rustig te beantwoorden.",
  },
]

export function OverOnsPage() {
  const heroImgWrapRef = useRef<HTMLDivElement>(null)
  const heroOverlayRef = useRef<HTMLDivElement>(null)
  const heroInnerRef = useRef<HTMLDivElement>(null)
  const heroLabelRef = useRef<HTMLParagraphElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroLeadRef = useRef<HTMLParagraphElement>(null)
  const blocksInnerRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = "power3.out"

      // —— Hero: image scale + fade (overlay stays visible so no dark flash), then text stagger ——
      const heroTl = gsap.timeline({ defaults: { ease } })
      heroTl
        .set(heroImgWrapRef.current, { scale: 1.08, opacity: 0 })
        .set([heroLabelRef.current, heroTitleRef.current, heroLeadRef.current], { opacity: 0, y: 28 })
        .to(heroImgWrapRef.current, { scale: 1, opacity: 1, duration: 1.2 })
        .to(heroLabelRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .to(heroTitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.45")
        .to(heroLeadRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")

      // —— Blocks: each block animates when it scrolls into view, but not before hero is done ——
      const HERO_DURATION = 2.2
      const loadTime = Date.now()
      const blockEls = blockRefs.current.filter(Boolean) as HTMLDivElement[]

      function animateBlock(block: HTMLDivElement, delay = 0) {
        const icon = block.querySelector(".overons-icon")
        const label = block.querySelector(".overons-label")
        const text = block.querySelector(".overons-text")
        gsap.to(block, { opacity: 1, y: 0, duration: 0.7, delay, ease })
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            delay: delay + 0.15,
            ease: "back.out(1.4)",
          })
        }
        if (label) {
          gsap.to(label, { opacity: 1, x: 0, duration: 0.5, delay: delay + 0.2, ease })
        }
        if (text) {
          gsap.to(text, { opacity: 1, y: 0, duration: 0.6, delay: delay + 0.28, ease })
        }
      }

      if (blockEls.length) {
        gsap.set(blockEls, { opacity: 0, y: 48 })
        blockEls.forEach((block) => {
          const icon = block.querySelector(".overons-icon")
          const label = block.querySelector(".overons-label")
          const text = block.querySelector(".overons-text")
          if (icon) gsap.set(icon, { scale: 0.6, opacity: 0, rotation: -8 })
          if (label) gsap.set(label, { opacity: 0, x: -20 })
          if (text) gsap.set(text, { opacity: 0, y: 16 })
        })

        blockEls.forEach((block) => {
          ScrollTrigger.create({
            trigger: block,
            start: "top 88%",
            onEnter: () => {
              const elapsed = (Date.now() - loadTime) / 1000
              const delay = Math.max(0, HERO_DURATION - elapsed)
              animateBlock(block, delay)
            },
          })
        })
      }

      // —— CTA: fade up + slight scale on scroll ——
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 32, scale: 0.98 })
        gsap.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
        const ctaLink = ctaRef.current.querySelector(".overons-cta-link")
        if (ctaLink) {
          gsap.set(ctaLink, { opacity: 0, y: 12 })
          gsap.to(ctaLink, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.25,
            ease,
            scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none none" },
          })
        }
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="overons-hero">
        <div ref={heroImgWrapRef} className="overons-hero-img-wrap">
          <img src={IMG_INTRO} alt="" />
          <div ref={heroOverlayRef} className="overons-hero-overlay" aria-hidden />
        </div>
        <div ref={heroInnerRef} className="overons-hero-inner">
          <div className="overons-hero-content">
            <p ref={heroLabelRef} className="overons-hero-label">Het verhaal</p>
            <h1 ref={heroTitleRef} className="overons-hero-title">Over Steven Car Company</h1>
            <p ref={heroLeadRef} className="overons-hero-lead">
              Een jong en dynamisch autobedrijf in Ninove. Wij richten ons op de aan- en verkoop van jonge tweedehandswagens — geen massa, maar een selectief aanbod waar wij volledig achter staan.
            </p>
          </div>
        </div>
      </section>

      {/* Vier thema's */}
      <section className="overons-section overons-blocks">
        <div ref={blocksInnerRef} className="overons-container overons-blocks-inner">
          {blocks.map((block, i) => (
            <div
              key={block.key}
              ref={(el) => { blockRefs.current[i] = el }}
              className="overons-block"
            >
              <span className="overons-icon" aria-hidden>{block.icon}</span>
              <div className="overons-block-content">
                <p className="overons-label">{block.label}</p>
                <p className="overons-text">{block.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="overons-cta-section">
        <div ref={ctaRef} className="overons-container">
          <p className="overons-cta-text">
            Wilt u één van onze wagens bezichtigen of heeft u specifieke vragen? Bel ons.
          </p>
          <a href="tel:0487450331" className="overons-cta-link">
            0487 45 03 31
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
