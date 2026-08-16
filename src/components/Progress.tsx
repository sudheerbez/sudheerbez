import { useEffect, useRef } from "react";
import { scrollState } from "../lib/state";

export function Progress() {
  const bar = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = scrollState.progress;
      if (bar.current) bar.current.style.width = `${p * 100}%`;
      if (hud.current) hud.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")} / 100`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="scroll-progress" ref={bar} />
      <div className="hud-index" ref={hud}>
        000 / 100
      </div>
    </>
  );
}
