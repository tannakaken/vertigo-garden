import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import * as THREE from "three";
import { Controllers, VRButton, XR } from "@react-three/xr";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RingText from "./RingText";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const text =
  "おはようございます。あなたは今ここにいますか？　もしそこにいるなら、そこがどこか私に教えてくれませんか？";

const configTexture = (texture: THREE.Texture) => {
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
};

const DreamWorld = () => {
  const textureList = useLoader(THREE.TextureLoader, [
    "initial_image.webp",
    "second_image.webp",
    "third_image.webp",
    "forth_image.webp",
    "fifth_image.webp",
    "sixth_image.webp",
    "seventh_image.webp",
    "eighth_image.webp",
    "nineth_image.webp",
    "tenth_image.webp",
    "eleventh_image.webp",
    "last_image.webp",
  ]);
  const textures = useMemo(() => {
    if (textureList.length === 0) {
      throw new Error("no background image");
    }
    return [...textureList, textureList[0]];
  }, [textureList]);

  useEffect(() => {
    textureList.forEach((texture) => {
      configTexture(texture);
    });
  }, [textureList]);
  const orbitControlRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const angleData = useMemo(() => ({ angle: 0, page: 0 }), []);
  const setNextPage = useCallback(() => {
    if (!materialRef.current || !meshRef.current) {
      return;
    }
    if (angleData.page === textures.length - 1) {
      return;
    }
    angleData.page++;
    materialRef.current.map = textures[angleData.page];
    meshRef.current.rotation.y += Math.PI;
  }, [angleData, textures]);

  const setPreviousPage = useCallback(() => {
    if (!materialRef.current || !meshRef.current) {
      return;
    }
    if (angleData.page === 0) {
      return;
    }
    angleData.page--;
    materialRef.current.map = textures[angleData.page];
    meshRef.current.rotation.y -= Math.PI;
  }, [angleData, textures]);
  const orientation = useMemo(() => ({ alpha: 0, beta: 0, gamma: 0 }), []);
  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (orbitControlRef.current) {
        if (event.alpha && event.gamma) {
          // 正確に一回転にならない
          const diffAlpha = ((event.alpha - orientation.alpha) / 90) * Math.PI;
          const diffGamma = ((event.gamma - orientation.gamma) / 90) * Math.PI;
          orbitControlRef.current.setAzimuthalAngle(
            orbitControlRef.current.getAzimuthalAngle() + diffAlpha + diffGamma
          );
          orientation.alpha = event.alpha;
          orientation.gamma = event.gamma;
        }
        if (event.beta) {
          const newPolarAngle = (event.beta / 180) * Math.PI;
          orbitControlRef.current.setPolarAngle(newPolarAngle);

          orientation.beta = event.beta;
        }
        orbitControlRef.current.update();
      }
    },
    [orientation]
  );
  const [windowMode, setWindowMode] = useState(false);
  return (
    <div style={{ height: "100vh" }}>
      <VRButton className="desktop" />
      {!windowMode && (
        <button
          className="mobile"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "24px",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "4px",
            padding: "12px 24px",
            cursor: "pointer",
          }}
          onClick={() => {
            if (
              // @ts-ignore
              typeof DeviceOrientationEvent["requestPermission"] === "function"
            ) {
              // @ts-ignore
              DeviceOrientationEvent["requestPermission"]()
                .then((permissionStatus: string) => {
                  if (permissionStatus === "granted") {
                    window.addEventListener(
                      "deviceorientation",
                      handleOrientation
                    );
                  }
                })
                .catch((error: any) => console.error(error));
            } else {
              window.addEventListener("deviceorientation", handleOrientation);
            }
            setWindowMode(true);
          }}
        >
          あちらへの窓
        </button>
      )}
      <Canvas>
        <XR>
          <OrbitControls
            ref={orbitControlRef}
            enableZoom={false}
            enablePan={false}
            enableDamping
            reverseOrbit
            dampingFactor={0.2}
          />
          <Controllers />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <RingText
            text={text}
            onRotate={(newAngle) => {
              const oldAngle = angleData.angle;
              if (
                angleData.page % 2 === 0 &&
                oldAngle > -Math.PI / 2 &&
                newAngle < -Math.PI / 2 &&
                oldAngle - newAngle < 1.0
              ) {
                setNextPage();
              } else if (
                angleData.page % 2 === 1 &&
                oldAngle > Math.PI / 2 &&
                newAngle < Math.PI / 2 &&
                oldAngle - newAngle < 1.0
              ) {
                setNextPage();
              } else if (
                angleData.page % 2 === 1 &&
                oldAngle < -Math.PI / 2 &&
                newAngle > -Math.PI / 2 &&
                newAngle - oldAngle < 1.0
              ) {
                setPreviousPage();
              } else if (
                angleData.page % 2 === 0 &&
                oldAngle < Math.PI / 2 &&
                newAngle > Math.PI / 2 &&
                newAngle - oldAngle < 1.0
              ) {
                setPreviousPage();
              }
              angleData.angle = newAngle;
            }}
          />
          <mesh ref={meshRef} rotation={[0, 0, 0]}>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial
              ref={materialRef}
              attach="material"
              map={textures[0]}
              side={THREE.BackSide}
            />
          </mesh>
        </XR>
      </Canvas>
    </div>
  );
};

export default DreamWorld;
