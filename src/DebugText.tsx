import React, { Suspense, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = () => {
  const [value, setValue] = useState("0-0-0");
  useFrame((state) => {
    setValue(
      `${state.camera.matrix.elements[0].toPrecision(
        2
      )},${state.camera.matrix.elements[2].toPrecision(
        2
      )}\n${state.camera.matrix.elements[8].toPrecision(
        2
      )},${state.camera.matrix.elements[10].toPrecision(2)}`
    );
  });
  return (
    <Suspense fallback={null}>
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
        {value}
      </Text>
      <Text
        position={[0, 2, +8]}
        rotation={[0, Math.PI, 0]}
        font="./NotoSansJP-Regular.otf"
        anchorX={"center"}
        anchorY={"middle"}
        fontSize={1}
        strokeColor={"black"}
        strokeWidth={0.01}
      >
        {value}
      </Text>
    </Suspense>
  );
};

export default DebugText;
