import React, { useCallback, useMemo, useRef, useState } from "react";
import "./App.css";
import * as THREE from "three";
import { Controllers, Hands, VRButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RingText from "./components/RingText";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import DebugText from "./components/DebugText";
import StartAndGallBoxButton from "./components/StartAndGallBoxButton";
import CommentaryModal3D from "./components/CommentaryModal3D";
import RotationListener, { PageData } from "./components/RotationListener";

/**
 * trueにするとデバッグ用のUIが表示される
 */
const debug = false;

/**
 * 小説本文
 */
export const allText =
  "あなたはいつもの癖で左回りに周りを見回す。紫の淡い霧がかかった花園がどこまでも広がっていた。しかし右回りで周囲を見回すと、突然花は散り、木は枯れ、茫漠たる荒野が広がり始めた。不思議な機械の乗り物が地面に埋まっている。しかし雲間から差し込む光に浮かび上がる光景には人の気配はない。湖の水面に映る風景の謎めいた歪みに気を取られていると、突然摩天楼が周囲に立ち並び始める。色鮮やかなネオン。しかし、そこにも人の気配はない。主人を失った機械ばかりが狂い咲く、騒がしい廃墟。そう思った途端、ビル群は実際に寂れた廃墟であることがわかる。そして廃墟を草が覆いはじめた。そこは最初の花園だったのだ。あなたはそこから一歩も動いていない。あなたは奇妙な目眩に襲われて香り立つ鮮やかな薔薇の上へとへなへなと崩れ落ち、再び眠りへ、現実へと堕ちていく。";

export type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

type Props = {
  initialTexture: THREE.Texture;
  handleHorizontalOrientation: (
    event: DeviceOrientationEvent,
    orbitControls: OrbitControlsImpl,
    orientation: Orientation
  ) => void;
  handleVerticalOrientation: (
    event: DeviceOrientationEvent,
    orbitControls: OrbitControlsImpl,
    orientation: Orientation
  ) => void;
  onRotate: (
    newAngle: number,
    pageData: PageData,
    material: THREE.MeshBasicMaterial,
    mesh: THREE.Mesh
  ) => void;
};

/**
 * DreamWorldの表示部分。
 *
 * refに直結した
 */
const DreamWorldPresenter = (props: Props) => {
  const orbitControlRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  /**
   * 現在のページに関するデータを格納するオブジェクト。
   */
  const pageData: PageData = useMemo(
    () => ({
      angle: 0,
      backgroundPage: 0,
      textPage: 0,
      textOffset: 0,
      text: allText.substring(0, 30),
    }),
    []
  );

  /**
   * 画面の向きのデータを格納するオブジェクト
   */
  const orientation = useMemo(() => ({ alpha: 0, beta: 0, gamma: 0 }), []);

  /**
   * スマートフォンの向きのデータに合わせて、OrbitControlsを動かすためのハンドラー。
   *
   * 向きのデータはスマートフォンに対して相対的。絶対座標による向きのデータの取得はiOSではまだ実装されていない（2022-10-13）
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
   */
  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (orbitControlRef.current === null) {
        return;
      }
      props.handleHorizontalOrientation(
        event,
        orbitControlRef.current,
        orientation
      );
      props.handleVerticalOrientation(
        event,
        orbitControlRef.current,
        orientation
      );
      orbitControlRef.current.update();
    },
    [props, orientation]
  );

  /**
   * スマートフォンの向きのデータの取得を開始するためのハンドラー。
   *
   * iOSでは向きの動きの取得は必ず許可が必要で、許可の取得には必ずユーザーのUIへのアクションが必要（ページ表示時に許可を取得しようとするとエラーが起こる）。
   *
   * androidにはそもそもDeviceOrientationEvent.requestPermission関数は実装されていないので、許可を得ずに向きのデータの取得を開始する。
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
   */
  const setHandleOrientation = useCallback(() => {
    if (
      // @ts-ignore
      typeof DeviceOrientationEvent["requestPermission"] === "function"
    ) {
      // @ts-ignore
      DeviceOrientationEvent["requestPermission"]()
        .then((permissionStatus: string) => {
          if (permissionStatus === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch((error: any) => console.error(error));
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    setWindowMode(true);
  }, [handleOrientation]);
  const [windowMode, setWindowMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * 画面の横回転時のハンドリング。
   */
  const onRotate = useCallback(
    (newAngle: number) => {
      if (meshRef.current === null || materialRef.current === null) {
        return;
      }
      props.onRotate(newAngle, pageData, materialRef.current, meshRef.current);
    },
    [pageData, props]
  );

  return (
    <div style={{ height: "100vh" }}>
      <VRButton className="desktop" />
      {!windowMode && (
        <button className="mobile vr-btn" onClick={setHandleOrientation}>
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
          <Hands />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <RingText pageData={pageData} />
          {debug && (
            <DebugText
              text={`${pageData.textPage}:${pageData.textOffset}:${pageData.backgroundPage}`}
            />
          )}
          <StartAndGallBoxButton
            position={[0, 1, -8]}
            onClick={() => {
              setShowModal(true);
            }}
            pageData={pageData}
          />
          <mesh ref={meshRef} rotation={[0, 0, 0]}>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial
              ref={materialRef}
              attach="material"
              map={props.initialTexture}
              side={THREE.BackSide}
            />
          </mesh>
          <CommentaryModal3D
            show={showModal}
            onClose={() => setShowModal(false)}
          />
          <RotationListener onRotate={onRotate} />
        </XR>
      </Canvas>
    </div>
  );
};

export default DreamWorldPresenter;
