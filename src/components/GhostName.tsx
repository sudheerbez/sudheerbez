import { useEffect, useRef } from "react";
import { scrollState } from "../lib/state";

export function GhostName() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (el.current) {
        el.current.style.transform = `translate3d(${scrollState.progress * -12}vw, ${scrollState.progress * -18}vh, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="ghost-name" ref={el} aria-hidden>
      Sudheer
    </div>
  );
}
