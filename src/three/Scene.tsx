import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointerState, scrollState } from "../lib/state";

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 20;
      data[i * 3 + 1] = (Math.random() - 0.5) * 14;
      data[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return data;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.018 + scrollState.progress * 0.9;
    ref.current.rotation.x = scrollState.progress * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#d6ff3f"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = scrollState.progress;
    if (group.current) {
      group.current.rotation.y = t * 0.12 + p * Math.PI * 1.4;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.12 + p * 0.35;
      group.current.position.y = Math.sin(t * 0.4) * 0.12 - p * 0.6;
      const s = 1 + p * 0.45;
      group.current.scale.setScalar(s);
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.25;
    }
  });

  return (
    <group ref={group} position={[1.15, 0.15, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.28, 0]} />
        <meshStandardMaterial color="#ece6da" metalness={1} roughness={0.16} />
      </mesh>
      <mesh scale={1.012}>
        <icosahedronGeometry args={[1.28, 0]} />
        <meshBasicMaterial color="#d6ff3f" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={inner} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.012, 12, 96]} />
        <meshBasicMaterial color="#d6ff3f" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[0.4, 0.6, 0.2]}>
        <torusGeometry args={[2.35, 0.008, 12, 80]} />
        <meshBasicMaterial color="#ff6a3d" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Shards() {
  const ref = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        position: [
          Math.cos(i * 0.9) * (2.8 + (i % 3) * 0.4),
          Math.sin(i * 1.3) * 1.6,
          Math.sin(i * 0.7) * 2.2,
        ] as [number, number, number],
        scale: 0.06 + (i % 4) * 0.03,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.08 + scrollState.progress * 0.6;
  });

  return (
    <group ref={ref}>
      {items.map((item, i) => (
        <mesh key={i} position={item.position} scale={item.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#d6ff3f" : "#ece6da"}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const p = scrollState.progress;
    const target = vec.set(
      pointerState.nx * 0.45 + 0.15,
      0.25 + pointerState.ny * -0.25 + p * 0.85,
      5.1 - p * 1.35,
    );
    camera.position.lerp(target, 0.06);
    camera.lookAt(0.4, 0.1 - p * 0.4, 0);
  });

  return null;
}

export function Scene() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 900;

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 7, 18]} />
      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#d6ff3f", "#140e0a", 0.28]} />
      <spotLight position={[6, 8, 5]} intensity={55} color="#fff4e3" angle={0.45} penumbra={0.9} />
      <pointLight position={[-5, 1, 3]} intensity={22} color="#d6ff3f" distance={16} />
      <pointLight position={[4, -2, -3]} intensity={16} color="#ff6a3d" distance={14} />
      <gridHelper args={[24, 24, "#1a1a14", "#0e0e0e"]} position={[0, -2.35, 0]} />
      <Core />
      <Shards />
      <Particles count={mobile ? 420 : 1100} />
      <Rig />
    </>
  );
}
