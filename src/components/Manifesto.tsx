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

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        end: "center 30%",
        onUpdate: (self) => {
          const n = Math.floor(self.progress * words.length + 0.01);
          words.forEach((word, i) => word.classList.toggle("is-on", i <= n));
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const words = [...manifesto, "REAL-TIME.", "CLOUD-NATIVE.", "MARKET-SPEED."];

  return (
    <section className="manifesto section" id="about" ref={root}>
      <div className="manifesto-pin">
        <p className="kicker">02 — Manifesto</p>
        <p className="manifesto-copy">
          {words.map((word) => (
            <span
              key={word}
              className={`word${word.includes("TAPE") || word.includes("MARKET") ? " accent" : ""}`}
            >
              {word}
            </span>
          ))}
        </p>
        <div className="manifesto-bio">
          <img className="portrait" src="./portrait.png" alt="Sudheer Bezawada" />
          <p>
            I’m a <strong>software engineer at Robinhood</strong> with 5+ years across
            financial trading, healthcare, and community platforms. M.S. Computer Science,
            Wichita State — <strong>3.97 GPA</strong>. I care about the unglamorous
            precision that makes live systems feel inevitable: microservices, event
            streams, cloud-native rails.
          </p>
        </div>
      </div>
    </section>
  );
}
