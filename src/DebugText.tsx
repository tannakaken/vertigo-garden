import React, { Suspense, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = ({
  orientation,
}: {
  orientation: { alpha: number; beta: number; gamma: number };
}) => {
  const [value, setValue] = useState("0-0-0");
  useFrame(() => {
    setValue(
      `${orientation.alpha.toPrecision(3)}-${orientation.beta.toPrecision(
        3
      )}-${orientation.gamma.toPrecision(3)}`
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
    </Suspense>
  );
};

export default DebugText;
