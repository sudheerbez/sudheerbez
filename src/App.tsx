import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Contact } from "./components/Contact";
import { Craft } from "./components/Craft";
import { Cursor } from "./components/Cursor";
import { Experience } from "./components/Experience";
import { GhostName } from "./components/GhostName";
import { Hero } from "./components/Hero";
import { Loader } from "./components/Loader";
import { Manifesto } from "./components/Manifesto";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Progress } from "./components/Progress";
import { Work } from "./components/Work";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

const Canvas3D = lazy(() =>
  import("./components/Canvas3D").then((mod) => ({ default: mod.Canvas3D })),
);

export default function App() {
  const [booting, setBooting] = useState(true);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useSmoothScroll(!booting);

  useEffect(() => {
    document.body.classList.toggle("is-loading", booting);
  }, [booting]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setWebgl(!reduce);
    if (reduce) {
      setBooting(false);
      setReady(true);
    }
  }, []);

  const onDone = useCallback(() => {
    setBooting(false);
    setReady(true);
  }, []);

  return (
    <>
      {booting && <Loader onDone={onDone} />}
      <Cursor />
      <div className="grain" />
      <div className="vignette" />
      <span className="frame tl" />
      <span className="frame tr" />
      <span className="frame bl" />
      <span className="frame br" />
      {webgl && (
        <Suspense fallback={null}>
          <Canvas3D />
        </Suspense>
      )}
      <GhostName />
      <Nav />
      <Progress />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Manifesto />
        <Work />
        <Experience />
        <Craft />
        <Contact />
      </main>
    </>
  );
}
