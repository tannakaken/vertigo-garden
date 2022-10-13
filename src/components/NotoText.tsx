import React from "react";
import { Text } from "@react-three/drei";
import { Vector3Tuple } from "three";

/**
 * VR空間でも表示できるテキスト
 */
const NotoText = ({
  fontSize = 0.3,
  children,
  anchorX = "left",
  position = [0, 0, 0],
}: {
  fontSize?: number;
  position?: Vector3Tuple;
  children: string;
  anchorX?: "left" | "center" | "right";
}) => {
  return (
    <Text
      position={position}
      rotation={[0, 0, 0]}
      font="./fonts/NotoSansJP-Regular.otf"
      anchorX={anchorX}
      anchorY={"middle"}
      fontSize={fontSize}
      strokeColor={"black"}
      color={"black"}
      strokeWidth={0.01}
      characters={children}
    >
      {children}
    </Text>
  );
};

export default NotoText;
