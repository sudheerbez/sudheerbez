import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "../data/content";

type Props = {
  ready: boolean;
};

export function Hero({ ready }: Props) {
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ready || !title.current) return;
    const lines = title.current.querySelectorAll(".line span");
    gsap.fromTo(
      lines,
      { yPercent: 120, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.35,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.05,
      },
    );
  }, [ready]);

  return (
    <section className="hero section" id="intro">
      <div className="hero-top">
        <p className="hero-index">01 — Intro</p>
        <p className="hero-aside">AI systems that hold when the market doesn’t blink.</p>
      </div>

      <h1 className="hero-title" ref={title} aria-label={`${site.first} ${site.last}`}>
        <span className="line">
          <span>{site.first}</span>
        </span>
        <span className="line last">
          <span>{site.last}</span>
        </span>
      </h1>

      <div className="hero-foot">
        <p className="hero-role">
          {site.role}
          <br />
          <strong>{site.company}</strong> / Markets &amp; AI
        </p>
        <div className="scroll-cue" aria-hidden>
          <span>Scroll</span>
          <div className="mouse">
            <i />
          </div>
        </div>
        <p className="hero-loc">
          {site.location}
          <br />
          United States
        </p>
      </div>
    </section>
  );
}
