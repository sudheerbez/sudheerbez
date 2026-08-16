import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  onDone: () => void;
};

export function Loader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        const hide = gsap.timeline({
          onComplete: onDone,
        });
        hide.to(root.current, {
          yPercent: -110,
          duration: 1.05,
          ease: "power4.inOut",
        });
      },
    });

    tl.to(obj, {
      n: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(obj.n)).padStart(3, "0");
        if (bar.current) bar.current.style.width = `${obj.n}%`;
      },
    });

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div className="loader" ref={root}>
      <div className="loader-inner">
        <div className="loader-brand">Sudheer</div>
        <div className="loader-row">
          <p className="loader-meta">Initializing systems / WebGL / 2026</p>
          <div className="loader-count" ref={count}>
            000
          </div>
        </div>
        <div className="loader-bar">
          <span ref={bar} />
        </div>
      </div>
    </div>
  );
}
