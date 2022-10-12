import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import * as THREE from "three";
import { Hands, VRButton, XR } from "@react-three/xr";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RingText from "./RingText";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import DebugText from "./DebugText";

const debug = false;

const allText =
  "あなたはいつもの癖で左回りに周りを見回す。紫の淡い霧がかかった花園がどこまでも広がっていた。しかし右回りで周囲を見回すと、突然花は散り、木は枯れ、茫漠たる荒野が広がり始めた。不思議な機械の乗り物が地面に埋まっている。しかし雲間から差し込む光に浮かび上がる光景には人の気配はない。湖の水面に映る風景の謎めいた歪みに気を取られていると、突然摩天楼が周囲に立ち並び始める。色鮮やかなネオン。しかし、そこにも人の気配はない。主人を失った機械ばかりが狂い咲く、騒がしい廃墟。そう思った途端、ビル群は実際に寂れた廃墟であることがわかる。そして廃墟を草が覆いはじめた。そこは最初の花畑だったのだ。あなたはそこから一歩も動いていない。あなたは奇妙な目眩に襲われて香り立つ鮮やかな薔薇の上へとへなへなと崩れ落ち、再び眠りへ、現実へと堕ちていく。";

const configTexture = (texture: THREE.Texture) => {
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
};

const DreamWorld = () => {
  const [text, setText] = useState(allText.substring(0, 30));
  const [offset, setOffset] = useState(0);
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
  const pageData = useMemo(() => ({ angle: 0, backgroundPage: 0 }), []);
  const [textPage, setTextPage] = useState(0);
  const setNextPage = useCallback(() => {
    if (textPage < 0) {
      return;
    }
    if (!materialRef.current || !meshRef.current) {
      return;
    }
    if (pageData.backgroundPage === textures.length - 1) {
      return;
    }
    pageData.backgroundPage++;
    materialRef.current.map = textures[pageData.backgroundPage];
    meshRef.current.rotation.y += Math.PI;
  }, [pageData, textures, textPage]);

  const setPreviousPage = useCallback(() => {
    if (!materialRef.current || !meshRef.current) {
      return;
    }
    if (pageData.backgroundPage === 0) {
      return;
    }
    pageData.backgroundPage--;
    materialRef.current.map = textures[pageData.backgroundPage];
    meshRef.current.rotation.y -= Math.PI;
  }, [pageData, textures]);
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

  const setNextTextPage = useCallback(() => {
    if (textPage > 25) {
      return;
    }
    const newText = allText.substring((textPage - 1) * 15, (textPage + 3) * 15);
    setText(newText);
    let newOffset = offset;
    if (textPage > 1) {
      newOffset = ((textPage - 1) % 4) * 15;
      setOffset(newOffset);
    }
    console.warn("next", textPage + 1, newText, newOffset);
    setTextPage(textPage + 1);
  }, [textPage, offset]);
  const setPreviousTextPage = useCallback(() => {
    if (textPage < -1) {
      return;
    }
    const previousTextPage = textPage - 1;
    const newText = allText.substring(
      (previousTextPage - 2) * 15,
      (previousTextPage + 2) * 15
    );
    setText(newText);
    let newOffset = offset;
    if (previousTextPage > 1) {
      newOffset = ((previousTextPage - 2) % 4) * 15;
      setOffset(newOffset);
    }
    console.warn("previous", previousTextPage, newText, newOffset);
    setTextPage(previousTextPage);
  }, [textPage, offset]);
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
          <Hands />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <RingText
            text={text}
            offset={offset}
            onRotate={(newAngle) => {
              const oldAngle = pageData.angle;
              // テキストの処理
              if (
                textPage % 4 === 0 &&
                oldAngle > 0 &&
                newAngle <= 0 &&
                oldAngle - newAngle < 1.0
              ) {
                console.warn("angle 0", oldAngle, newAngle);
                setNextTextPage();
              } else if (
                (textPage + 4) % 4 === 1 &&
                oldAngle > -Math.PI / 2 &&
                newAngle <= -Math.PI / 2 &&
                oldAngle - newAngle < 1.0
              ) {
                console.warn("angle -Math.PI / 2", oldAngle, newAngle);
                setNextTextPage();
              } else if (
                (textPage + 4) % 4 === 2 &&
                oldAngle > -Math.PI &&
                newAngle <= Math.PI &&
                newAngle - oldAngle > 3.0
              ) {
                console.warn("angle Math.PI", oldAngle, newAngle);
                setNextTextPage();
              } else if (
                (textPage + 4) % 4 === 3 &&
                oldAngle > Math.PI / 2 &&
                newAngle <= Math.PI / 2 &&
                oldAngle - newAngle < 1.0
              ) {
                console.warn("angle Math.PI / 2", oldAngle, newAngle);
                setNextTextPage();
              } else if (
                (textPage + 4) % 4 === 1 &&
                oldAngle <= 0 &&
                newAngle > 0 &&
                newAngle - oldAngle < 1.0
              ) {
                console.warn("angle 0", oldAngle, newAngle);
                setPreviousTextPage();
              } else if (
                (textPage + 4) % 4 === 2 &&
                oldAngle <= -Math.PI / 2 &&
                newAngle > -Math.PI / 2 &&
                newAngle - oldAngle < 1.0
              ) {
                console.warn("angle Math.PI / 2 ", oldAngle, newAngle);
                setPreviousTextPage();
              } else if (
                (textPage + 4) % 4 === 3 &&
                newAngle <= Math.PI &&
                oldAngle > -Math.PI &&
                oldAngle - newAngle > 3.0
              ) {
                console.warn("angle Math.PI", oldAngle, newAngle);
                setPreviousTextPage();
              } else if (
                textPage % 4 === 0 &&
                oldAngle <= Math.PI / 2 &&
                newAngle > Math.PI / 2 &&
                newAngle - oldAngle < 1.0
              ) {
                console.warn("angle Math.PI / 2 ", oldAngle, newAngle);
                setPreviousTextPage();
              }

              // 背景の処理
              if (
                pageData.backgroundPage % 2 === 0 &&
                oldAngle >= -Math.PI / 2 &&
                newAngle < -Math.PI / 2 &&
                oldAngle - newAngle < 1.0
              ) {
                setNextPage();
              } else if (
                pageData.backgroundPage % 2 === 1 &&
                oldAngle >= Math.PI / 2 &&
                newAngle < Math.PI / 2 &&
                oldAngle - newAngle < 1.0
              ) {
                setNextPage();
              } else if (
                pageData.backgroundPage % 2 === 1 &&
                oldAngle < -Math.PI / 2 &&
                newAngle >= -Math.PI / 2 &&
                newAngle - oldAngle < 1.0
              ) {
                setPreviousPage();
              } else if (
                pageData.backgroundPage % 2 === 0 &&
                oldAngle < Math.PI / 2 &&
                newAngle >= Math.PI / 2 &&
                newAngle - oldAngle < 1.0
              ) {
                setPreviousPage();
              }
              pageData.angle = newAngle;
            }}
          />
          {debug && (
            <DebugText
              text={`${textPage}:${offset}:${pageData.backgroundPage}`}
            />
          )}
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
