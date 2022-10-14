import React, { Suspense, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { PageData } from "./RotationListener";

const DebugText = ({ pageData }: { pageData: PageData }) => {
  const [value, setValue] = useState("");
  const [text, setText] = useState(pageData.text);
  useFrame((state) => {
    setText(
      `${pageData.textPage}:${pageData.textOffset}:${pageData.backgroundPage}`
    );
    const theta = Math.atan2(
      state.camera.matrix.elements[0],
      state.camera.matrix.elements[2]
    );
    setValue(`${theta.toPrecision(2)}:${text}`);
  });
  return (
    <Suspense fallback={null}>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation, index) => (
        <Text
          key={`debug-text-${index}`}
          position={[-8 * Math.sin(rotation), 2, -8 * Math.cos(rotation)]}
          rotation={[0, rotation, 0]}
          font="./fonts/NotoSansJP-Regular.otf"
          anchorX={"center"}
          anchorY={"middle"}
          fontSize={1}
          strokeColor={"black"}
          strokeWidth={0.01}
          characters={"0123456789:."}
        >
          {value}
        </Text>
      ))}
    </Suspense>
  );
};

export default DebugText;
