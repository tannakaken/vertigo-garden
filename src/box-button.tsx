import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

const BoxButton = (props: any) => {
  const ref = useRef<Mesh>();
  const [speed, setSpeed] = useState(0.01);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += speed;
    }
  });
  return (
    <mesh
      {...props}
      ref={ref}
      onClick={() => props.onClick?.()}
      onPointerOver={() => setSpeed(0.03)}
      onPointerOut={() => setSpeed(0.01)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={speed === 0.03 ? "hotpink" : "orange"} />
    </mesh>
  );
};

export default BoxButton;
