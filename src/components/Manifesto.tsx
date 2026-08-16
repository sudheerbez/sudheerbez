import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { manifesto } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const words = el.querySelectorAll(".word");
    const mm = gsap.matchMedia();

    const paint = (progress: number) => {
      const n = Math.floor(progress * words.length + 0.01);
      words.forEach((word, i) => word.classList.toggle("is-on", i <= n));
    };

    mm.add("(min-width: 901px)", () => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=140%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => paint(self.progress),
      });
    });

    mm.add("(max-width: 900px)", () => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 40%",
        onUpdate: (self) => paint(self.progress),
      });
    });

    return () => mm.revert();
  }, []);

  const words = [...manifesto, "REAL-TIME.", "AI-NATIVE.", "MARKET-SPEED."];

  return (
    <section className="manifesto section" id="about" ref={root}>
      <div className="manifesto-pin">
        <p className="kicker">02 — Manifesto</p>
        <p className="manifesto-copy">
          {words.map((word) => (
            <span
              key={word}
              className={`word${word.includes("TAPE") || word.includes("MARKET") || word.includes("AI") ? " accent" : ""}`}
            >
              {word}
            </span>
          ))}
        </p>
        <div className="manifesto-bio">
          <img className="portrait" src="./portrait.png" alt="Sudheer Bezawada" />
          <p>
            I’m a <strong>software engineer at Robinhood in New York</strong> with 5+ years
            across trading, healthcare, and community platforms. M.S. Computer Science,
            Wichita State, <strong>Jan 2023 — May 2024, 3.97 GPA</strong>. I ship Java
            microservices, Kafka, GCP/AWS — and LLM systems (OpenAI, LangChain, RAG,
            Spring AI) that turn live market data into investor insight.
          </p>
        </div>
      </div>
    </section>
  );
}
