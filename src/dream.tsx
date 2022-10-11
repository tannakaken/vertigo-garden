import React, { useCallback, useEffect, useMemo, useRef } from "react";
import "./App.css";
import * as THREE from "three";
import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls, DeviceOrientationControls } from "@react-three/drei";
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

const Dream = () => {
  const textureList = useLoader(THREE.TextureLoader, [
    "initial_image.webp",
    "second_image.webp",
    "third_image.webp",
    "forth_image.webp",
    "fifth_image.webp",
    "sixth_image.webp",
    "seventh_image.webp",
    "eighth_image.webp",
    "nineth_image.webp",
    "tenth_image.webp",
    "eleventh_image.webp",
    "last_image.webp",
  ]);
  const textures = useMemo(() => {
    if (textureList.length === 0) {
      throw new Error("no background image");
    }
    return [...textureList, textureList[0]];
  }, [textureList]);

  useEffect(() => {
    textureList.forEach((texture) => {
      configTexture(texture);
    });
  }, [textureList]);
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
          <DeviceOrientationControls />
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
              map={textures[0]}
              side={THREE.BackSide}
            />
          </mesh>
        </XR>
      </Canvas>
    </div>
  );
};

export default Dream;
