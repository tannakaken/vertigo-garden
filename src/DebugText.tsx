import React, { useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";

const DebugText = () => {
  const gazeController = useController("none");
  const [value, setValue] = useState(0);
  useFrame((state) => {
    //setValue(state.camera.rotation.y);
    if (gazeController) {
      setValue(gazeController.rotation.y);
    }
  });
  return (
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
      {value.toPrecision(3)}
    </Text>
  );
};

export default DebugText;
