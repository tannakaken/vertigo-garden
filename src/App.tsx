import React from "react";
import "./App.css";
import * as THREE from "three";
import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BoxButton from "./box-button";
import RingText from "./RingText";

const text =
  "おはようございます。あなたは今ここにいますか？　もしそこにいるなら、そこがどこか私に教えてくれませんか？";

function App() {
  const texture = useLoader(THREE.TextureLoader, "front.jpg");
  return (
    <div style={{ height: "100vh" }}>
      <VRButton />
      <Canvas>
        <XR>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            reverseOrbit
            dampingFactor={0.2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Controllers />
          <Hands />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <BoxButton position={[2, 0, -10]} />
          <BoxButton position={[-2, 0, -10]} />
          <RingText text={text} />
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
