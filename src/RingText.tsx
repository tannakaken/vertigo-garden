import React, { Suspense, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { PageData } from "./RotationListener";

type Props = {
  pageData: PageData;
};

/**
 * 一周の文字数
 */
export const period = 60;
/**
 * 四半周の文字数
 */
export const quater = period / 4;

/**
 * ユーザーの周囲に円形に表示されるテキスト
 */
const RingText = ({ pageData }: Props) => {
  const [currentText, setCurrentText] = useState(pageData.text);
  // const characters = Array.from(text);
  useFrame(() => {
    if (pageData.text !== currentText) {
      setCurrentText(pageData.text);
    }
  });
  return (
    <Suspense fallback={null}>
      <group>
        {Array.from(currentText).map((character, index) => {
          const i = index + period / 2 + pageData.textOffset;
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
              characters={character}
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
