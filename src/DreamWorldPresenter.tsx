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
  "あなたは普段の癖で左から周囲を見回す。淡く紫霧がかった花園が限りなく広がる。しかし右に視線を回せば、花は散り樹は灰となり、茫漠たる荒野が広がり始める。空には油絵のような暗雲。地には半ば埋まった宇宙船。だが人の気配はない。なだらかな丘はそのまま湖面の鏡像へと連なる。水面のミラージュは水晶玉が孕む未来にも似て謎めいて歪む。突如摩天楼がにょきにょきと伸びる。色鮮やかなネオン。しかし、そこにも人影はない。主人を失った機械の電子的な夢ばかりが狂い咲く、騒がしい廃墟。そう思った途端、そこは実際に寂れた廃墟であった。そして円環の廃墟を草や蔓が覆いはじめる。石材から生えているのではなく、建物自体が草や蔓に変わって伸びていくのだ。そこであなたは気づく。そこは最初の花園だったのだ。そこから一歩も動いていなかったあなたは、奇妙な目眩に襲われて香り立つ鮮やかな薔薇の上へとへなへなと崩れ落ち、再び眠りへつく。そしてゆっくりと現実へと堕ちていく……";

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
