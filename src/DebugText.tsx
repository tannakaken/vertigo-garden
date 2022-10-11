import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = () => {
  const [value, setValue] = useState(0);
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.gamma) {
      setValue(event.gamma);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [handleOrientation]);

  // useFrame((state) => {
  //   setValue(state.camera.rotation.y);
  // });
  return (
    <Text
      position={[0, 2, -8]}
      rotation={[0, 0, 0]}
      font="./NotoSansJP-Regular.otf"
      anchorX={"center"}
      anchorY={"middle"}
      fontSize={1}
      strokeColor={"black"}
      strokeWidth={0.01}
    >
      {value.toPrecision(3)}
    </Text>
  );
};

export default DebugText;
