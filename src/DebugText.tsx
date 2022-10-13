import React, { Suspense, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = ({ text }: { text?: string }) => {
  const [value, setValue] = useState("");
  useFrame((state) => {
    const theta = Math.atan2(
      state.camera.matrix.elements[0],
      state.camera.matrix.elements[2]
    );
    setValue(`${theta.toPrecision(2)}:${text}`);
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
        characters={"0123456789:."}
      >
        {value}
      </Text>
      <Text
        position={[-8, 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        font="./NotoSansJP-Regular.otf"
        anchorX={"center"}
        anchorY={"middle"}
        fontSize={1}
        strokeColor={"black"}
        strokeWidth={0.01}
        characters={"0123456789:."}
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
        characters={"0123456789:."}
      >
        {value}
      </Text>
      <Text
        position={[8, 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        font="./NotoSansJP-Regular.otf"
        anchorX={"center"}
        anchorY={"middle"}
        fontSize={1}
        strokeColor={"black"}
        strokeWidth={0.01}
        characters={"0123456789:."}
      >
        {value}
      </Text>
    </Suspense>
  );
};

export default DebugText;
