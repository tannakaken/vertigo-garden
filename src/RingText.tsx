import React, { Suspense } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type Props = {
  text: String;
  onRotate: (newAngle: number) => void;
};

const period = 60;

const RingText = (props: Props) => {
  const characters = Array.from(props.text);
  useFrame((state) => {
    const newAngle = Math.atan2(
      state.camera.matrix.elements[0],
      state.camera.matrix.elements[2]
    );
    props.onRotate(newAngle);
  });
  return (
    <Suspense fallback={null}>
      <group>
        {characters.map((character, index) => {
          const i = index + period / 2;
          const theta = -(i * Math.PI * 2) / period;
          return (
            <Text
              key={`ringtext-${character}-${index}`}
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
    </Suspense>
  );
};

export default RingText;
