# 目眩の花園

360 度背景に横一列に文字が並び、回転につれ背景や文字が更新されていく小説。

背景は無料の Google Colab 上で Stable Diffusion の InPaint を使うことで生成した。

最初は Stable Diffusion にパノラマ画像を追加学習させようとしたが、同じようなパノラマ画像しかないので、学習させると似たような画像ばかりになってしまうので、
通常の画像で我慢することにした。

このアプリを作成中に [Text2Light](https://github.com/FrozenBurning/Text2Light) という、プロンプトからパノラマ画像を作成するモデルを知ったが、
InPainting（画像の上書き）ができるかどうかがよくわからなかったのと、
この作品をイグ BFC3 に出すためには今から試行錯誤する時間がなかったので、諦めた。

UI は [react-three-fiber](https://github.com/pmndrs/react-three-fiber) 、[drei](https://github.com/pmndrs/drei) および [react-xr](https://github.com/pmndrs/react-xr) で作成した。

操作は

- マウス及び指によるスクロール、
- スマートフォンの向きの検知
- HMD の VR モード

に対応している。

## 画像の生成方法



## ローカルでの起動方法

clone したリポジトリのルートディレクトリで

    yarn install
    yarn start

することで`http://localhost:3000`でページが表示される。

## 姉妹作品

[意志と巻物としての世界](https://tannakaken.xyz/novels/TheWorldAsWillAndScroll)

## 作者

[淡中 圏](https://tannakaken.xyz)（[@tannakaken](https://twitter.com/tannakaken)）
