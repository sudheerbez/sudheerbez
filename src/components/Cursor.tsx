import { useEffect, useRef } from "react";
import { pointerState } from "../lib/state";

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const el = root.current;
    const ringEl = ring.current;
    if (!el || !ringEl) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      pointerState.x = x;
      pointerState.y = y;
      pointerState.nx = x / window.innerWidth * 2 - 1;
      pointerState.ny = y / window.innerHeight * 2 - 1;
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, [data-cursor]")) el.classList.add("is-hover");
    };
    const onOut = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, [data-cursor]")) el.classList.remove("is-hover");
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ringEl.style.transform = `translate3d(${rx - x}px, ${ry - y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden>
      <div className="cursor-dot" />
      <div className="cursor-ring" ref={ring} />
    </div>
  );
}
