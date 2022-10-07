import React, { useMemo, useRef } from "react";
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
  const texture1 = useLoader(THREE.TextureLoader, "initial_image.png");
  texture1.encoding = THREE.sRGBEncoding;
  texture1.wrapS = THREE.RepeatWrapping;
  texture1.repeat.x = -1;
  const texture2 = useLoader(THREE.TextureLoader, "second_image.png");
  texture2.encoding = THREE.sRGBEncoding;
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.repeat.x = -1;
  const orbitControlRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const angleData = useMemo(() => ({ angle: 0, page: 0 }), []);

  return (
    <div style={{ height: "100vh" }}>
      <VRButton />
      <Canvas>
        <XR>
          <OrbitControls
            ref={orbitControlRef}
            enableZoom={false}
            enablePan={false}
            enableDamping
            reverseOrbit
            dampingFactor={0.2}
            onChange={() => {
              if (
                orbitControlRef.current &&
                materialRef.current &&
                meshRef.current
              ) {
                const newAngle = orbitControlRef.current.getAzimuthalAngle();
                const oldAngle = angleData.angle;
                if (
                  angleData.page < 1 &&
                  oldAngle < -Math.PI / 2 &&
                  newAngle > Math.PI / 2
                ) {
                  materialRef.current.map = texture2;
                  meshRef.current.rotation.y += Math.PI;
                  angleData.page++;
                } else if (
                  angleData.page > 0 &&
                  oldAngle > Math.PI / 2 &&
                  newAngle < -Math.PI / 2
                ) {
                  materialRef.current.map = texture1;
                  meshRef.current.rotation.y -= Math.PI;
                  angleData.page--;
                }
                angleData.angle = newAngle;
                console.warn(angleData);
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
          <mesh ref={meshRef} rotation={[0, 0, 0]}>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial
              ref={materialRef}
              attach="material"
              map={texture1}
              side={THREE.BackSide}
            />
          </mesh>
        </XR>
      </Canvas>
    </div>
  );
}

export default App;
