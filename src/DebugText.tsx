import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DebugText = ({ orientation }: { orientation: { angle: number } }) => {
  // const [value, setValue] = useState(0);
  // const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
  //   if (event.gamma) {
  //     setValue(event.gamma);
  //   }
  // }, []);
  // useEffect(() => {
  //   // @ts-ignore
  //   if (typeof DeviceOrientationEvent["requestPermission"] === "function") {
  //     // @ts-ignore
  //     DeviceOrientationEvent["requestPermission"]()
  //       .then((permissionStatus: string) => {
  //         alert(permissionStatus);
  //         if (permissionStatus === "granted") {
  //           window.addEventListener("deviceorientation", handleOrientation);
  //         }
  //       })
  //       .catch((error: any) => alert(error));
  //   } else {
  //     window.addEventListener("deviceorientation", handleOrientation);
  //   }
  //   return () => {
  //     window.removeEventListener("deviceorientation", handleOrientation);
  //   };
  // }, [handleOrientation]);

  // useFrame((state) => {
  //   setValue(state.camera.rotation.y);
  // });
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
      {orientation.angle.toPrecision(3)}
    </Text>
  );
};

export default DebugText;
