import React, { useCallback, useEffect, useMemo, useRef } from "react";
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

const configTexture = (texture: THREE.Texture) => {
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
};

function App() {
  const texture1 = useLoader(THREE.TextureLoader, "initial_image.png");
  const texture2 = useLoader(THREE.TextureLoader, "second_image.png");
  const texture3 = useLoader(THREE.TextureLoader, "third_image.png");
  const texture4 = useLoader(THREE.TextureLoader, "forth_image.png");
  const texture5 = useLoader(THREE.TextureLoader, "fifth_image.png");
  const texture6 = useLoader(THREE.TextureLoader, "sixth_image.png");
  const texture7 = useLoader(THREE.TextureLoader, "seventh_image.png");
  const texture8 = useLoader(THREE.TextureLoader, "eighth_image.png");
  const texture9 = useLoader(THREE.TextureLoader, "nineth_image.png");
  const texture10 = useLoader(THREE.TextureLoader, "tenth_image.png");
  const texture11 = useLoader(THREE.TextureLoader, "eleventh_image.png");
  const lastTexture = useLoader(THREE.TextureLoader, "last_image.png");
  const textures = useMemo(() => {
    return [
      texture1,
      texture2,
      texture3,
      texture4,
      texture5,
      texture6,
      texture7,
      texture8,
      texture9,
      texture10,
      texture11,
      lastTexture,
      texture1,
    ];
  }, [
    texture1,
    texture2,
    texture3,
    texture4,
    texture5,
    texture6,
    texture7,
    texture8,
    texture9,
    texture10,
    texture11,
    lastTexture,
  ]);

  useEffect(() => {
    configTexture(texture1);
    configTexture(texture2);
    configTexture(texture3);
    configTexture(texture4);
    configTexture(texture5);
    configTexture(texture6);
    configTexture(texture7);
    configTexture(texture8);
    configTexture(texture9);
    configTexture(texture10);
    configTexture(texture11);
    configTexture(lastTexture);
  }, [
    texture1,
    texture2,
    texture3,
    texture4,
    texture5,
    texture6,
    texture7,
    texture8,
    texture9,
    texture10,
    texture11,
    lastTexture,
  ]);
  const orbitControlRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const angleData = useMemo(() => ({ angle: 0, page: 0 }), []);
  const setNextPage = useCallback(() => {
    if (!materialRef.current || !meshRef.current) {
      return;
    }
    if (angleData.page === textures.length - 1) {
      return;
    }
    angleData.page++;
    materialRef.current.map = textures[angleData.page];
    meshRef.current.rotation.y += Math.PI;
  }, [angleData, textures]);

  const setPreviousPage = useCallback(() => {
    if (!materialRef.current || !meshRef.current) {
      return;
    }
    if (angleData.page === 0) {
      return;
    }
    angleData.page--;
    materialRef.current.map = textures[angleData.page];
    meshRef.current.rotation.y -= Math.PI;
  }, [angleData, textures]);

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
              if (!orbitControlRef.current) {
                return;
              }
              const newAngle = orbitControlRef.current.getAzimuthalAngle();
              const oldAngle = angleData.angle;
              if (
                angleData.page % 2 === 0 &&
                oldAngle < -Math.PI / 2 &&
                newAngle > Math.PI / 2 &&
                newAngle - oldAngle >= 1.0
              ) {
                setNextPage();
              } else if (
                angleData.page % 2 === 1 &&
                oldAngle > 0 &&
                newAngle < 0 &&
                oldAngle - newAngle < 1.0
              ) {
                setNextPage();
              } else if (
                angleData.page % 2 === 1 &&
                oldAngle > Math.PI / 2 &&
                newAngle < -Math.PI / 2 &&
                oldAngle - newAngle >= 1.0
              ) {
                setPreviousPage();
              } else if (
                angleData.page % 2 === 0 &&
                oldAngle < 0 &&
                newAngle > 0 &&
                newAngle - oldAngle < 1.0
              ) {
                setPreviousPage();
              }
              angleData.angle = newAngle;
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
