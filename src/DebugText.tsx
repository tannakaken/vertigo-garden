import React, { Suspense, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = ({
  orientation,
}: {
  orientation: { alpha: number; beta: number };
}) => {
  const textRef = useRef<Text>(null);
  useFrame(() => {
    if (textRef.current) {
      textRef.current.textContent = `${orientation.alpha.toPrecision(
        3
      )}-${orientation.beta.toPrecision(3)}`;
    }
  });
  return (
    <Suspense fallback={null}>
      <Text
        ref={textRef}
        position={[0, 2, -8]}
        rotation={[0, 0, 0]}
        font="./NotoSansJP-Regular.otf"
        anchorX={"center"}
        anchorY={"middle"}
        fontSize={1}
        strokeColor={"black"}
        strokeWidth={0.01}
      >
        0-0
      </Text>
    </Suspense>
  );
};

export default DebugText;
