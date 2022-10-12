import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3Tuple } from "three";
import { Interactive } from "@react-three/xr";

const BoxButton = ({
  show = true,
  position = [0, 0, 0],
  onClick = () => {},
}: {
  show?: boolean;
  position?: Vector3Tuple;
  onClick?: () => void;
}) => {
  const ref = useRef<Mesh>(null);
  const [speed, setSpeed] = useState(0.01);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += speed;
      ref.current.rotation.y += speed / 2;
    }
  });
  if (!show) {
    return <></>;
  }
  return (
    <Interactive
      onHover={() => {
        setSpeed(0.03);
      }}
      onBlur={() => {
        setSpeed(0.01);
      }}
      onSelect={() => {
        onClick();
        setSpeed(0.05);
      }}
    >
      <mesh
        position={position}
        scale={0.5}
        rotation={[0, Math.PI / 4, Math.PI / 2]}
        ref={ref}
        onClick={() => onClick()}
        onPointerOver={() => setSpeed(0.03)}
        onPointerOut={() => setSpeed(0.01)}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={
            speed === 0.05 ? "lightblue" : speed === 0.03 ? "hotpink" : "orange"
          }
        />
      </mesh>
    </Interactive>
  );
};

export default BoxButton;
