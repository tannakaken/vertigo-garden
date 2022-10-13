import React, { useCallback, useEffect, useMemo } from "react";
import "./App.css";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import DreamWorldPresenter, {
  allText,
  Orientation,
} from "./DreamWorldPresenter";
import { quater } from "./components/RingText";
import { PageData } from "./components/RotationListener";

/**
 * 背景素材は球の内側に貼るため、普通に貼ると左右が逆になるので、左右反転する。
 *
 * またencodingを調節しないと、360度背景が白っぽくなる。
 *
 * これはガンマ補正（ディスプレイに正しい色を表示させるためデータを調節すること）の問題で、
 * ThreeのデフォルトはLinearEncodingだが、今回はこれだと白っぽくなるようだ（ちゃんとわかってない）。
 *
 *
 * @see https://github.com/pmndrs/react-three-fiber/discussions/1240
 * @see https://qiita.com/nemutas/items/22effe2aa99b6de0b8d5
 */
const configTexture = (texture: THREE.Texture) => {
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
};

/**
 * 全天球の背景と文章を回転で変更していく3DのUI。
 *
 * スマホの向きで操作することも、HMDで見ることも可能。
 */
const DreamWorld = () => {
  /**
   * 使用する背景素材全体
   */
  const textureList = useLoader(THREE.TextureLoader, [
    "img/initial_image.webp",
    "img/second_image.webp",
    "img/third_image.webp",
    "img/forth_image.webp",
    "img/fifth_image.webp",
    "img/sixth_image.webp",
    "img/seventh_image.webp",
    "img/eighth_image.webp",
    "img/nineth_image.webp",
    "img/tenth_image.webp",
    "img/eleventh_image.webp",
    "img/last_image.webp",
  ]);
  /**
   * 最後に最初のページに戻るようにした背景素材のリスト
   */
  const textures = useMemo(() => {
    if (textureList.length === 0) {
      throw new Error("no background image");
    }
    return [...textureList, textureList[0]];
  }, [textureList]);

  // 初回にテクスチャーの設定をする。
  useEffect(() => {
    textureList.forEach((texture) => {
      configTexture(texture);
    });
  }, [textureList]);

  const setNextBackground = useCallback(
    (
      pageData: PageData,
      material: THREE.MeshBasicMaterial,
      mesh: THREE.Mesh
    ) => {
      // 左に回転して、テキストがまだ始まっていない場合は背景を変えない
      if (pageData.textPage < 0) {
        return;
      }
      if (pageData.backgroundPage === textures.length - 1) {
        return;
      }
      pageData.backgroundPage++;
      material.map = textures[pageData.backgroundPage];
      // 最初は画像の左側1/4でスタート。
      // そして右に移動して画像の右側3/4で次の画像の1/4になる。
      // なので画像が変わるたびに新しい画像を1/2回転する必要がある。
      mesh.rotation.y += Math.PI;
    },
    [textures]
  );

  const setPreviousBackground = useCallback(
    (
      pageData: PageData,
      material: THREE.MeshBasicMaterial,
      mesh: THREE.Mesh
    ) => {
      if (pageData.backgroundPage === 0) {
        return;
      }
      pageData.backgroundPage--;
      material.map = textures[pageData.backgroundPage];
      // 戻る時も、画像が変わるたびに新しい画像を1_2回転する必要がある。
      mesh.rotation.y -= Math.PI;
    },
    [textures]
  );

  const setNextText = useCallback((pageData: PageData) => {
    // 26はテキストが終わって消える数字の実測値。
    if (pageData.textPage > 26) {
      return;
    }
    // 1/4回転するごとに、テキストを1/4回転分追加し、1/4消していく
    pageData.text = allText.substring(
      (pageData.textPage - 1) * quater,
      (pageData.textPage + 3) * quater
    );
    // スタートに近い場所ではオフセットは0にしておく。
    if (pageData.textPage > 1) {
      pageData.textOffset = ((pageData.textPage - 1) % 4) * quater;
    }
    pageData.textPage++;
  }, []);

  const setPreviousText = useCallback((pageData: PageData) => {
    if (pageData.textPage < -1) {
      return;
    }
    const previousTextPage = pageData.textPage - 1;
    // 1/4回転するごとに、テキストを1/4回転分追加し、1/4消していく。逆回転も同じ。
    pageData.text = allText.substring(
      (previousTextPage - 2) * quater,
      (previousTextPage + 2) * quater
    );
    // スタートに近い場所ではオフセットは0にしておく。
    if (previousTextPage > 1) {
      pageData.textOffset = ((previousTextPage - 2) % 4) * quater;
    }
    pageData.textPage = previousTextPage;
  }, []);

  /**
   * 横回転の検知。
   *
   * 向きのデータの取得開始時の向きを基準にするために、相対的に計算している。
   *
   * スマホのカメラを水平に向けた時、alphaとgammaが不安定になる（おそらくDeviceOrientationEventの角度がオイラー角であるために、ジンバルロックが起きている）。
   * なので、alphaとgammaの値を両方使い、補正している。
   *
   * @see https://en.wikipedia.org/wiki/Euler_angles
   */
  const handleHorizontalOrientation = useCallback(
    (
      event: DeviceOrientationEvent,
      orbitControls: OrbitControlsImpl,
      orientation: Orientation
    ) => {
      if (event.alpha && event.gamma) {
        // 正確に一回転にならない
        const diffAlpha = ((event.alpha - orientation.alpha) / 90) * Math.PI;
        const diffGamma = ((event.gamma - orientation.gamma) / 90) * Math.PI;
        orbitControls.setAzimuthalAngle(
          orbitControls.getAzimuthalAngle() + diffAlpha + diffGamma
        );
        orientation.alpha = event.alpha;
        orientation.gamma = event.gamma;
      }
    },
    []
  );

  /**
   * 縦回転の検知。
   *
   * 実際の水平線を基準にするために、絶対的に計算している。
   */
  const handleVerticalOrientation = useCallback(
    (
      event: DeviceOrientationEvent,
      orbitControls: OrbitControlsImpl,
      orientation: Orientation
    ) => {
      if (event.beta) {
        const newPolarAngle = (event.beta / 180) * Math.PI;
        orbitControls.setPolarAngle(newPolarAngle);

        orientation.beta = event.beta;
      }
    },
    []
  );

  /**
   * ページやテキストを更新する。
   *
   * 前のフレームでの角度の数値と新しい角度の数値の差を使って、どちらに回転しているかを決定している。
   */
  const onRotate = useCallback(
    (
      newAngle: number,
      pageData: PageData,
      material: THREE.MeshBasicMaterial,
      mesh: THREE.Mesh
    ) => {
      const oldAngle = pageData.angle;
      // テキストの処理
      if (
        pageData.textPage % 4 === 0 &&
        oldAngle > 0 &&
        newAngle <= 0 &&
        oldAngle - newAngle < 1.0
      ) {
        // スタートから見て右側90度
        setNextText(pageData);
      } else if (
        (pageData.textPage + 4) % 4 === 1 &&
        oldAngle > -Math.PI / 2 &&
        newAngle <= -Math.PI / 2 &&
        oldAngle - newAngle < 1.0
      ) {
        // スタートから見て真後ろ
        setNextText(pageData);
      } else if (
        (pageData.textPage + 4) % 4 === 2 &&
        oldAngle > -Math.PI &&
        newAngle <= Math.PI &&
        newAngle - oldAngle > 3.0
      ) {
        // スタートから見て左側90度
        setNextText(pageData);
      } else if (
        (pageData.textPage + 4) % 4 === 3 &&
        oldAngle > Math.PI / 2 &&
        newAngle <= Math.PI / 2 &&
        oldAngle - newAngle < 1.0
      ) {
        // スタート位置
        setNextText(pageData);
      } else if (
        (pageData.textPage + 4) % 4 === 1 &&
        oldAngle <= 0 &&
        newAngle > 0 &&
        newAngle - oldAngle < 1.0
      ) {
        // スタートから見て右側90度
        setPreviousText(pageData);
      } else if (
        (pageData.textPage + 4) % 4 === 2 &&
        oldAngle <= -Math.PI / 2 &&
        newAngle > -Math.PI / 2 &&
        newAngle - oldAngle < 1.0
      ) {
        // スタートから見て真後ろ
        setPreviousText(pageData);
      } else if (
        (pageData.textPage + 4) % 4 === 3 &&
        newAngle <= Math.PI &&
        oldAngle > -Math.PI &&
        oldAngle - newAngle > 3.0
      ) {
        // スタートから見て左側90度
        setPreviousText(pageData);
      } else if (
        pageData.textPage % 4 === 0 &&
        oldAngle <= Math.PI / 2 &&
        newAngle > Math.PI / 2 &&
        newAngle - oldAngle < 1.0
      ) {
        // スタート位置
        setPreviousText(pageData);
      }

      // 背景の処理
      // 最初は画像の左から1/4でスタートする。
      // 右側へ進んで最初の画像の左側3/4で次の画像に写る。
      // そこから半回転ごとに次の画像にうつっていく。
      if (
        pageData.backgroundPage % 2 === 0 &&
        oldAngle >= -Math.PI / 2 &&
        newAngle < -Math.PI / 2 &&
        oldAngle - newAngle < 1.0
      ) {
        // スタートから見て真後ろ
        setNextBackground(pageData, material, mesh);
      } else if (
        pageData.backgroundPage % 2 === 1 &&
        oldAngle >= Math.PI / 2 &&
        newAngle < Math.PI / 2 &&
        oldAngle - newAngle < 1.0
      ) {
        // スタート位置
        setNextBackground(pageData, material, mesh);
      } else if (
        pageData.backgroundPage % 2 === 1 &&
        oldAngle < -Math.PI / 2 &&
        newAngle >= -Math.PI / 2 &&
        newAngle - oldAngle < 1.0
      ) {
        // スタートから見て真後ろ
        setPreviousBackground(pageData, material, mesh);
      } else if (
        pageData.backgroundPage % 2 === 0 &&
        oldAngle < Math.PI / 2 &&
        newAngle >= Math.PI / 2 &&
        newAngle - oldAngle < 1.0
      ) {
        //　スタート位置
        setPreviousBackground(pageData, material, mesh);
      }
      pageData.angle = newAngle;
    },
    [setNextBackground, setPreviousBackground, setNextText, setPreviousText]
  );

  return (
    <DreamWorldPresenter
      initialTexture={textures[0]}
      handleHorizontalOrientation={handleHorizontalOrientation}
      handleVerticalOrientation={handleVerticalOrientation}
      onRotate={onRotate}
    />
  );
};

export default DreamWorld;
