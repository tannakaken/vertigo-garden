import React from "react";
import { useFrame } from "@react-three/fiber";

export type PageData = {
  /**
   * 現在のカメラの角度
   */
  angle: number;
  /**
   * 現在表示されているテキスト
   */
  text: string;
  /**
   * 現在表示されているテキストのページ番号
   */
  textPage: number;
  /**
   * テキストの表示をスタート位置からどれくらいズラすか
   */
  textOffset: number;
  /**
   * 現在表示されている背景の番号
   */
  backgroundPage: number;
};

export type Props = {
  onRotate: (newAngle: number) => void;
};

/**
 * カメラの横方向の動きをフレームごとに検知して、アクションを実行する。
 */
const RotationListener = ({ onRotate }: Props) => {
  useFrame((state) => {
    // webglのカメラ行列からカメラの横方向の回転を計算している。
    const newAngle = Math.atan2(
      state.camera.matrix.elements[0],
      state.camera.matrix.elements[2]
    );
    onRotate(newAngle);
  });
  return <></>;
};

export default RotationListener;
