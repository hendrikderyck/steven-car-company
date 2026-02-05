import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Car } from "../data/cars";
import { mockCars } from "../data/cars";
import { isRealListingId } from "../utils/listings";

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_COUNT = 3;

interface HomeHeroProps {
  /** First N listings from aanbod; when empty, falls back to mock data */
  highlightedCars?: Car[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function HomeHero({ highlightedCars: propCars = [] }: HomeHeroProps) {
  const highlightedCars =
    propCars.length > 0 ? propCars.slice(0, HIGHLIGHT_COUNT) : mockCars.slice(0, HIGHLIGHT_COUNT);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const heroLogoWrapRef = useRef<HTMLHeadingElement>(null);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  const heroCtasRef = useRef<HTMLAnchorElement[]>([]);
  const highlightSectionRef = useRef<HTMLElement>(null);
  const highlightHeaderRef = useRef<HTMLDivElement>(null);
  const highlightGridRef = useRef<HTMLDivElement>(null);
  const highlightCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const highlightLinkRef = useRef<HTMLAnchorElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);
  const aboutImgRef = useRef<HTMLDivElement>(null);
  const dienstenSectionRef = useRef<HTMLElement>(null);
  const dienstenHeaderRef = useRef<HTMLDivElement>(null);
  const dienstenImgRef = useRef<HTMLDivElement>(null);
  const dienstenCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = "power3.out";

      // —— Hero: video fade, overlay, logo scale up, CTAs stagger ——
      gsap.set(heroVideoRef.current, { scale: 1.08, opacity: 0 });
      gsap.set(heroOverlayRef.current, { opacity: 0 });
      gsap.set(heroInnerRef.current, { opacity: 0 });
      gsap.set(heroLogoWrapRef.current, { scale: 0.85, opacity: 0, y: 24 });
      gsap.set(heroActionsRef.current?.children ?? [], { opacity: 0, y: 20 });

      const heroTl = gsap.timeline({ defaults: { ease } });
      heroTl
        .to(heroVideoRef.current, { scale: 1, opacity: 1, duration: 1.2 })
        .to(heroOverlayRef.current, { opacity: 1, duration: 0.5 }, "-=0.8")
        .to(heroInnerRef.current, { opacity: 1, duration: 0.4 }, "-=0.3")
        .to(heroLogoWrapRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.2)" }, "-=0.2")
        .to(heroActionsRef.current?.children ?? [], { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, "-=0.4");

      // —— In de kijker: scroll-triggered ——
      const highlightHeader = highlightHeaderRef.current;
      const highlightGrid = highlightGridRef.current;
      const highlightCards = highlightCardsRef.current.filter(Boolean) as HTMLElement[];
      const highlightLink = highlightLinkRef.current;

      if (highlightSectionRef.current) {
        gsap.set(highlightHeader?.querySelector(".home-highlight-label"), { opacity: 0, y: 16 });
        gsap.set(highlightHeader?.querySelector(".home-highlight-title"), { opacity: 0, y: 24 });
        gsap.set(highlightCards, { opacity: 0, y: 40, scale: 0.96 });
        gsap.set(highlightLink, { opacity: 0, y: 12 });
      }

      ScrollTrigger.create({
        trigger: highlightSectionRef.current,
        start: "top 82%",
        onEnter: () => {
          gsap.to(highlightHeader?.querySelector(".home-highlight-label"), { opacity: 1, y: 0, duration: 0.5, ease });
          gsap.to(highlightHeader?.querySelector(".home-highlight-title"), { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
          gsap.to(highlightCards, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease }, "-=0.4");
          gsap.to(highlightLink, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
        },
      });

      // —— Over ons: scroll-triggered ——
      const aboutText = aboutTextRef.current;
      const aboutImg = aboutImgRef.current;
      if (aboutSectionRef.current) {
        gsap.set(aboutText?.querySelector(".home-about-label"), { opacity: 0, x: -20 });
        gsap.set(aboutText?.querySelector(".home-about-title"), { opacity: 0, y: 20 });
        gsap.set(aboutText?.querySelector(".home-about-lead"), { opacity: 0, y: 16 });
        gsap.set(aboutText?.querySelector(".home-about-link"), { opacity: 0, x: -12 });
        gsap.set(aboutImg, { opacity: 0, x: 40, scale: 0.98 });
      }

      ScrollTrigger.create({
        trigger: aboutSectionRef.current,
        start: "top 82%",
        onEnter: () => {
          gsap.to(aboutText?.querySelector(".home-about-label"), { opacity: 1, x: 0, duration: 0.45, ease });
          gsap.to(aboutText?.querySelector(".home-about-title"), { opacity: 1, y: 0, duration: 0.55 }, "-=0.3");
          gsap.to(aboutText?.querySelector(".home-about-lead"), { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
          gsap.to(aboutText?.querySelector(".home-about-link"), { opacity: 1, x: 0, duration: 0.4 }, "-=0.25");
          gsap.to(aboutImg, { opacity: 1, x: 0, scale: 1, duration: 0.65 }, "-=0.5");
        },
      });

      // —— Diensten: scroll-triggered ——
      const dienstenHeader = dienstenHeaderRef.current;
      const dienstenImg = dienstenImgRef.current;
      const dienstenCards = dienstenCardsRef.current.filter(Boolean) as HTMLElement[];

      if (dienstenSectionRef.current) {
        gsap.set(dienstenHeader?.querySelector(".home-diensten-label"), { opacity: 0, x: 20 });
        gsap.set(dienstenHeader?.querySelector(".home-diensten-title"), { opacity: 0, y: 24 });
        gsap.set(dienstenImg, { opacity: 0, x: -40, scale: 0.98 });
        gsap.set(dienstenCards, { opacity: 0, y: 32 });
      }

      ScrollTrigger.create({
        trigger: dienstenSectionRef.current,
        start: "top 82%",
        onEnter: () => {
          gsap.to(dienstenHeader?.querySelector(".home-diensten-label"), { opacity: 1, x: 0, duration: 0.45, ease });
          gsap.to(dienstenHeader?.querySelector(".home-diensten-title"), { opacity: 1, y: 0, duration: 0.55 }, "-=0.3");
          gsap.to(dienstenImg, { opacity: 1, x: 0, scale: 1, duration: 0.6 }, "-=0.4");
          gsap.to(dienstenCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease }, "-=0.35");
        },
      });

      // —— Hero CTA hover ——
      heroCtasRef.current.forEach((cta) => {
        if (!cta) return;
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(cta, { scale: 1.04, y: -2, duration: 0.2, ease: "power2.out" });
        cta.addEventListener("mouseenter", () => hoverTl.play());
        cta.addEventListener("mouseleave", () => hoverTl.reverse());
      });

      // —— Car cards hover ——
      highlightCards.forEach((card) => {
        const imgWrap = card.querySelector(".home-highlight-img-wrap");
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(imgWrap, { scale: 1.06, duration: 0.35, ease: "power2.out" });
        card.addEventListener("mouseenter", () => hoverTl.play());
        card.addEventListener("mouseleave", () => hoverTl.reverse());
      });

      // —— Diensten cards hover ——
      dienstenCards.forEach((card) => {
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(card, { y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)", duration: 0.25, ease: "power2.out" });
        card.addEventListener("mouseenter", () => hoverTl.play());
        card.addEventListener("mouseleave", () => hoverTl.reverse());
      });

      // —— Highlight link hover ——
      if (highlightLink) {
        const linkHover = gsap.timeline({ paused: true });
        linkHover.to(highlightLink, { x: 6, duration: 0.2, ease: "power2.out" });
        highlightLink.addEventListener("mouseenter", () => linkHover.play());
        highlightLink.addEventListener("mouseleave", () => linkHover.reverse());
      }

      // —— About link hover ——
      const aboutLink = aboutTextRef.current?.querySelector(".home-about-link");
      if (aboutLink) {
        const linkHover = gsap.timeline({ paused: true });
        linkHover.to(aboutLink, { x: 6, duration: 0.2, ease: "power2.out" });
        aboutLink.addEventListener("mouseenter", () => linkHover.play());
        aboutLink.addEventListener("mouseleave", () => linkHover.reverse());
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hero + CTA — Pitch Black & White · Sharp */}
      <section className="home-hero-monolith">
        <video
          ref={heroVideoRef}
          src="/hero.mp4"
          className="home-hero-bg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <div ref={heroOverlayRef} className="home-hero-overlay" aria-hidden />

        <div ref={heroInnerRef} className="home-hero-inner">
          <h1 ref={heroLogoWrapRef} className="home-hero-logo-wrap">
            <img
              src="/logo.png"
              alt="Steven Car Company"
              className="home-hero-logo"
            />
          </h1>
          <div ref={heroActionsRef} className="home-hero-actions">
            <a
              ref={(el) => { heroCtasRef.current[0] = el; }}
              href="/aanbod/"
              className="home-hero-cta home-hero-cta-solid"
            >
              Bekijk aanbod
            </a>
            <a
              ref={(el) => { heroCtasRef.current[1] = el; }}
              href="tel:0487450331"
              className="home-hero-cta home-hero-cta-ghost"
            >
              Bel voor afspraak
            </a>
          </div>
        </div>
      </section>

      {/* In de kijker — uitgelichte wagens, direct onder de hero */}
      <section ref={highlightSectionRef} className="home-highlight-section" aria-labelledby="home-highlight-heading">
        <div className="home-highlight-inner">
          <div ref={highlightHeaderRef} className="home-highlight-header">
            <span className="home-highlight-label">Aanbod</span>
            <h2 id="home-highlight-heading" className="home-highlight-title">In de kijker</h2>
          </div>
          <div ref={highlightGridRef} className="home-highlight-grid">
            {highlightedCars.map((car, i) => (
              <a
                key={car.id}
                ref={(el) => { highlightCardsRef.current[i] = el; }}
                href={isRealListingId(car.id) ? `/aanbod/${car.id}/` : "/aanbod/"}
                className="home-highlight-card"
              >
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
          <a ref={highlightLinkRef} href="/aanbod/" className="home-highlight-link">
            Bekijk volledig aanbod →
          </a>
        </div>
      </section>

      {/* Over ons + Foto bedrijf */}
      <section ref={aboutSectionRef} className="home-about">
        <div className="home-about-inner">
          <div className="home-about-grid">
            <div ref={aboutTextRef} className="home-about-text">
              <span className="home-about-label">Over ons</span>
              <h2 className="home-about-title">Steven Car Company</h2>
              <p className="home-about-lead">
                Steven Car Company is een jong en dynamisch autobedrijf uit Ninove, gespecialiseerd in de aan- en verkoop van jonge tweedehandswagens. Wij onderscheiden ons door een strikte selectie op kwaliteit en historiek, waarbij we bewust kiezen voor betrouwbaarheid boven massa.
              </p>
              <a href="/over-ons/" className="home-about-link">
                Meer over ons →
              </a>
            </div>
            <div ref={aboutImgRef} className="home-about-img-wrap">
              <img src="/home_page_over_ons.jpeg" alt="Steven Car Company, Ninove" />
            </div>
          </div>
        </div>
      </section>

      {/* Diensten — inspiratie KGT: Waarvoor kan u bij ons terecht? */}
      <section ref={dienstenSectionRef} className="home-diensten">
        <div className="home-diensten-inner">
          <div ref={dienstenHeaderRef} className="home-diensten-header">
            <span className="home-diensten-label">Diensten</span>
            <h2 className="home-diensten-title">Waarvoor kan u bij ons terecht?</h2>
          </div>
          <div className="home-diensten-layout">
            <div ref={dienstenImgRef} className="home-diensten-img-wrap">
              <img src="/home_page_diensten.jpeg" alt="Steven Car Company, ons aanbod" />
            </div>
            <div className="home-diensten-cards">
              <div ref={(el) => { dienstenCardsRef.current[0] = el; }} className="home-diensten-card">
                <h3 className="home-diensten-card-title">Koop uw tweedehandswagen</h3>
                <p className="home-diensten-card-text">
                  Jonge occasions, eerlijke prijzen en persoonlijk advies op maat.
                </p>
                <a href="/aanbod/" className="home-diensten-card-btn">
                  Bekijk ons aanbod
                </a>
              </div>
              <div ref={(el) => { dienstenCardsRef.current[1] = el; }} className="home-diensten-card">
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
        </div>
      </section>
    </>
  )
}
