import React, { Suspense, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = () => {
  const [value, setValue] = useState("0-0-0");
  useFrame((state) => {
    setValue(
      `${state.camera.matrix.elements[0]},${state.camera.matrix.elements[1]},${state.camera.matrix.elements[2]},${state.camera.matrix.elements[3]}\n${state.camera.matrix.elements[4]},${state.camera.matrix.elements[5]},${state.camera.matrix.elements[6]},${state.camera.matrix.elements[7]}\n${state.camera.matrix.elements[8]},${state.camera.matrix.elements[9]},${state.camera.matrix.elements[10]},${state.camera.matrix.elements[11]}\n${state.camera.matrix.elements[12]},${state.camera.matrix.elements[13]},${state.camera.matrix.elements[14]},${state.camera.matrix.elements[15]}`
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
