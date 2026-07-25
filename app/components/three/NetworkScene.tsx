"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ACCENTS = ["#DE6B24", "#EEAF30", "#4E8E89"];
const CONNECT_DISTANCE = 3.4;

function generateNodes(count: number): THREE.Vector3[] {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const radius = 6 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nodes.push(
      new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.55,
        radius * Math.cos(phi)
      )
    );
  }
  return nodes;
}

function buildEdgePositions(nodes: THREE.Vector3[]): Float32Array {
  const positions: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < CONNECT_DISTANCE) {
        positions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
  return new Float32Array(positions);
}

function Network({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const groupRef = React.useRef<THREE.Group>(null);

  const nodes = React.useMemo(() => generateNodes(count), [count]);

  const nodePositions = React.useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  const nodeColors = React.useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((_, i) => {
      const c = new THREE.Color(ACCENTS[i % ACCENTS.length]);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [nodes]);

  const edgePositions = React.useMemo(() => buildEdgePositions(nodes), [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current || reduceMotion) return;
    groupRef.current.rotation.y += delta * 0.035;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edgePositions.length / 3}
            array={edgePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#DE6B24" transparent opacity={0.14} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.length}
            array={nodePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodes.length}
            array={nodeColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.11} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  );
}

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn("NetworkScene failed to render, falling back silently:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function NetworkScene() {
  const [ready, setReady] = React.useState(false);
  const [count, setCount] = React.useState(70);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    setCount(window.innerWidth < 768 ? 34 : 70);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="!absolute inset-0"
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
      >
        <Network count={count} reduceMotion={reduceMotion} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
