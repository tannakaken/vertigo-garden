import React from "react";
import { Text } from "@react-three/drei";

type Props = {
  text: String;
};

const period = 60;

const RingText = (props: Props) => {
  const characters = Array.from(props.text);
  return (
    <group>
      {characters.map((character, index) => {
        const i = index + period / 2;
        const theta = -(i * Math.PI * 2) / period;
        return (
          <Text
            position={[8 * Math.sin(theta), 0, 8 * Math.cos(theta)]}
            rotation={[0, theta + Math.PI, 0]}
            font="./NotoSansJP-Regular.otf"
            anchorX={"center"}
            anchorY={"middle"}
            fontSize={1}
            strokeColor={"black"}
            strokeWidth={0.01}
          >
            {character}
          </Text>
        );
      })}
    </group>
  );
};

export default RingText;
