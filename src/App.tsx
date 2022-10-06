import React, { useRef } from "react";
import "./App.css";
import * as THREE from "three";
import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BoxButton from "./box-button";
import RingText from "./RingText";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import DebugText from "./DebugText";

const text =
  "おはようございます。あなたは今ここにいますか？　もしそこにいるなら、そこがどこか私に教えてくれませんか？";

function App() {
  const texture = useLoader(THREE.TextureLoader, "sample1.png");
  const ref = useRef<OrbitControlsImpl>(null);

  return (
    <div style={{ height: "100vh" }}>
      <VRButton />
      <Canvas>
        <XR>
          <OrbitControls
            ref={ref}
            enableZoom={false}
            enablePan={false}
            enableDamping
            reverseOrbit
            dampingFactor={0.2}
            onChange={() => {
              if (ref.current) {
                const angle = ref.current.getAzimuthalAngle();
                console.warn(angle);
              }
            }}
          />
          <Controllers />
          <Hands />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <BoxButton position={[2, 0, -10]} />
          <BoxButton position={[-2, 0, -10]} />
          <RingText text={text} />
          <DebugText />
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial
              attach="material"
              map={texture}
              side={THREE.BackSide}
            />
          </mesh>
        </XR>
      </Canvas>
    </div>
  );
}

export default App;
