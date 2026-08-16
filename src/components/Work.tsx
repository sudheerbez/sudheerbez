import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinEl = pin.current;
    const trackEl = track.current;
    if (!pinEl || !trackEl) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 80);

      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="work section" id="work">
      <div className="work-head">
        <div>
          <p className="kicker">03 — Selected work</p>
          <h2>The tape</h2>
        </div>
        <p className="label">Scroll sideways through the systems</p>
      </div>

      <div className="work-pin" ref={pin}>
        <div className="work-track" ref={track}>
          {projects.map((project) => (
            <article className="project" key={project.index} data-cursor>
              <div>
                <div className="project-index">{project.index}</div>
                <p className="kicker project-kicker">{project.kicker}</p>
                <h3>{project.title}</h3>
                <p className="sub">{project.subtitle}</p>
                <p>{project.body}</p>
              </div>
              <div className="project-foot">
                <div>
                  <p className="metric">{project.metric}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <a className="project-link" href={project.href} target="_blank" rel="noreferrer">
                  View <i>↗</i>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
