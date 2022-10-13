import React, { useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3Tuple } from "three";
import { Interactive } from "@react-three/xr";
import { PageData } from "./RotationListener";

const StartAndGallBoxButton = ({
  pageData,
  position = [0, 0, 0],
  onClick = () => {},
}: {
  pageData: PageData;
  position?: Vector3Tuple;
  onClick?: () => void;
}) => {
  const ref = useRef<Mesh>(null);
  const [speed, setSpeed] = useState(0.01);
  const [show, setShow] = useState(true);
  const updateShow = useCallback(() => {
    if (
      !show &&
      (pageData.backgroundPage === 0 || pageData.backgroundPage >= 11)
    ) {
      setShow(true);
    } else if (
      show &&
      !(pageData.backgroundPage === 0 || pageData.backgroundPage >= 11)
    ) {
      setShow(false);
    }
  }, [show, pageData]);
  const updateRotation = useCallback(() => {
    if (ref.current) {
      ref.current.rotation.x += speed;
      ref.current.rotation.y += speed / 2;
    }
  }, [speed]);
  useFrame(() => {
    updateShow();
    updateRotation();
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
        <meshStandardMaterial color={speed === 0.03 ? "hotpink" : "orange"} />
      </mesh>
    </Interactive>
  );
};

export default StartAndGallBoxButton;
