import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "../three/Scene";

class WebGLGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function Canvas3D() {
  return (
    <div className="webgl" aria-hidden>
      <WebGLGuard>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.6]}
          camera={{ position: [0.2, 0.25, 5.1], fov: 42, near: 0.1, far: 40 }}
          frameloop="always"
        >
          <Scene />
        </Canvas>
      </WebGLGuard>
    </div>
  );
}
