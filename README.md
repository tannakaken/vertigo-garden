# [目眩の花園](https://vertigo-garden.vercel.app/)

360 度背景に横一列に文字が並び、回転につれ背景や文字が更新されていく小説。

背景は無料の Google Colab 上で Stable Diffusion の InPaint を使うことで生成した。

最初は Stable Diffusion にパノラマ画像を追加学習させようとしたが、同じようなパノラマ画像しかないので、学習させると似たような画像ばかりになってしまうので、
通常の画像で我慢することにした。

このアプリを作成中に [Text2Light](https://github.com/FrozenBurning/Text2Light) という、プロンプトからパノラマ画像を作成するモデルを知ったが、
Inpainting（画像の上書き）ができるかどうかがよくわからなかったのと、
この作品をイグ BFC3 に出すためには今から試行錯誤する時間がなかったので、諦めた。

UI は [react-three-fiber](https://github.com/pmndrs/react-three-fiber) 、[drei](https://github.com/pmndrs/drei) および [react-xr](https://github.com/pmndrs/react-xr) で作成した。

操作は

- マウス及び指によるスクロール、
- スマートフォンの向きの検知
- HMD の VR モード

に対応している。

## 画像の生成方法

まず Stable Diffusion に「360 panorama,skybox,environment map of magnificent rose garden,warm moody light, highly detailed matte fantasy painting」
というプロンプトを与えて画像を生成します（このプロンプトは Twitter 上で見かけたとある[ツイート](https://twitter.com/yoglehonpo/status/1566188435530199040)を参考にしました）。

これで以下の画像が生成されます。

！(最初に生成した画像)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image1.png]

これは左右がつながりませんので、左右反転して、中央の部分を Stable Diffusion の Inpainting で上書きします。

まず左右反転します。

！(左右反転した画像)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image2.png]

真ん中の部分だけを上書きします。

！(上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image3.png]

すると次の画像ができます。

！(上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image4.png]

これで一回転しても繋がる画像ができました。

アプリではスタートから左側に回るとこの画像がずっと表示され続けます。
対して右側に回転した場合は、自然に繋がるように別の画像に変わっていきます。

その画像を作るために、この画像の右側と左側を交換した画像の右側を上書きします（左右がつながる画像なので、右側と左側を交換しても、画像は自然に繋がっています）。

画像を自然につなげるために、上書き部分は真ん中から少しはみ出していますが、人間の視野がそれほど広くないのであまり気になりません。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image5.png]

新しい画像を上書きするために、先ほどのプロンプトを少し変えた「360 panorama,skybox,environment map of fire mountain,dark moody light, highly detailed matte fantasy painting」というものを使ってみました。

すると次のような画像が生成されます。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image6.png]

同じように左右を入れ替えて、同じプロンプトで画像を生成すると、全体がこのプロンプトで生成された画像が手に入ります。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image7.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image8.png]

このように二つおきにプロンプトを変えていくことで、半回転ごとに変わっていく画像が手に入ります。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image9.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image10.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image11.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image12..png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image13.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image14.png]

これを最初の画像につなげるために、
最後の画像の右側と最初の画像の左側をつなげ、真ん中を修正すればいいと考えました。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image15.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image16.png]

これを実際のアプリで繋げようとして問題に気づきます。

真ん中を上書きしてしまったため、画像が繋がらなくなってしまいました。

やり直そうかとも思いましたが、簡単な解決策を見つけました。元の画像も変えてしまえばいのです。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image16.png]

そして、最初の画像とのつなげるために、もう二つ画像を作りました。

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image17.png]

！(次に上書きする部分)[https://raw.githubusercontent.com/tannakaken/vertigo-garden/master/docs/image18.png]

こうして花畑から始まり、半回転ごとに風景が変わり、最後にまた花畑へ終わる、一連の画像ができました。

## ローカルでの起動方法

clone したリポジトリのルートディレクトリで

    yarn install
    yarn start

することで`http://localhost:3000`でページが表示される。

## 姉妹作品

[意志と巻物としての世界](https://tannakaken.xyz/novels/TheWorldAsWillAndScroll)

## 作者

[淡中 圏](https://tannakaken.xyz)（[@tannakaken](https://twitter.com/tannakaken)）
