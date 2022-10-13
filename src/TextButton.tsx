import React, { useState } from "react";
import { Text } from "@react-three/drei";
import { Vector3Tuple } from "three";
import { Interactive } from "@react-three/xr";

const blue = "#5555FF" as const;
const deepBlue = "#0000FF" as const;

/**
 * VR空間でも表示できる、リンクテキスト
 */
const TextButton = ({
  children,
  position = [0, 0, 0],
  onClick = () => {},
}: {
  position?: Vector3Tuple;
  onClick?: () => void;
  children: string;
}) => {
  const [color, setColor] = useState<"#5555FF" | "#0000FF">(blue);
  return (
    <Interactive
      onHover={() => {
        setColor(deepBlue);
      }}
      onBlur={() => {
        setColor(blue);
      }}
      onSelect={() => {
        onClick();
      }}
    >
      <Text
        position={position}
        rotation={[0, 0, 0]}
        font="./NotoSansJP-Regular.otf"
        anchorX={"left"}
        anchorY={"middle"}
        fontSize={0.3}
        strokeColor={color}
        color={color}
        strokeWidth={0.01}
        onPointerEnter={() => {
          setColor(deepBlue);
        }}
        onPointerLeave={() => {
          setColor(blue);
        }}
        onClick={() => {
          onClick();
        }}
        characters={children}
      >
        {children}
      </Text>
    </Interactive>
  );
};

export default TextButton;
