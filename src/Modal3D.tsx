import React, { Suspense } from "react";
import NotoText from "./NotoText";
import TextButton from "./TextButton";

type Props = {
  show: boolean;
  onClose: () => void;
};

const Modal3D = ({ show, onClose }: Props) => {
  if (!show) {
    return <></>;
  }
  return (
    <Suspense fallback={null}>
      <group>
        <mesh position={[0, 0, -5.1]} rotation={[0, 0, 0]} scale={[12, 6, 5]}>
          <planeBufferGeometry />
          <meshBasicMaterial color="white" />
        </mesh>
        <NotoText position={[0, 2, -5]} anchorX={"center"} fontSize={1}>
          目眩の花園
        </NotoText>
        <NotoText position={[-5, 1, -5]}>作者：</NotoText>
        <TextButton
          position={[-4.1, 1, -5]}
          onClick={() => {
            window.open("https://tannakaken.xyz/");
          }}
        >
          淡中圏
        </TextButton>
        <NotoText position={[-3.2, 1, -5]}>（</NotoText>
        <TextButton
          position={[-2.9, 1, -5]}
          onClick={() => {
            window.open("https://twitter.com/tannakaken/");
          }}
        >
          @tannakaken
        </TextButton>
        <NotoText position={[-0.9, 1, -5]}>）</NotoText>
        <NotoText position={[-5, 0.4, -5]}>
          巻物について考えていたらこの作品のアイディアを思いつきました。
        </NotoText>
        <NotoText position={[-5, -0.2, -5]}>
          もう一つの発想の元は福永信の『アクロバット前夜』です。
        </NotoText>
        <NotoText position={[-5, -0.8, -5]}>
          背景はStable Diffusionを使って生成しました。
        </NotoText>
        <NotoText position={[-5, -1.4, -5]}>
          背景生成のColabのコードやwebページ自体のソースコードは
        </NotoText>
        <TextButton
          position={[3.3, -1.4, -5]}
          onClick={() => {
            window.open("https://github.com/tannakaken/vr-z-novel");
          }}
        >
          github
        </TextButton>
        <NotoText position={[4.2, -1.4, -5]}>にあります。</NotoText>
        <TextButton
          position={[-5, -2.0, -5]}
          onClick={() => {
            window.open(
              "https://tannakaken.xyz/novels/TheWorldAsWillAndScroll"
            );
          }}
        >
          姉妹作小説
        </TextButton>
        <TextButton position={[-4.8, -2.6, -5]} onClick={onClose}>
          閉じる
        </TextButton>
      </group>
    </Suspense>
  );
};

export default Modal3D;
