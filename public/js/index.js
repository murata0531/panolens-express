let panorama, panorama2, panorama3, panorama4, panorama5;
let infospot, infospot2, infospot3, infospot4,titlespot
let viewer, container;

container = document.querySelector('#container');

// 現在のパノラマ
panorama  = new PANOLENS.VideoPanorama('../test.mp4', { autoplay: true });

// 遷移先のパノラマ一覧
panorama2 = new PANOLENS.VideoPanorama('../test.mp4', { autoplay: true });
panorama3 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
panorama4 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
panorama5 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');

// パノラマを変更するボタン
infospot = new PANOLENS.Infospot(1500, '../chartest.png');
infospot2 = new PANOLENS.Infospot(1500, '../chartest2.png');
infospot3 = new PANOLENS.Infospot(1500, '../chartest3.png');
infospot4 = new PANOLENS.Infospot(1500, '../chartest4.png');

// 白丸のインフォメーションマーク
infospot5 = new PANOLENS.Infospot( 500, PANOLENS.DataImage.Info );

// タイトル表示
titlespot = new PANOLENS.Infospot(800, '../testtitle.png', false);

// ボタンの位置を決める
// {x: -100, y: -500, z: -5000 } => 自分の目の前に配置
infospot.position.set(1500, 500, -5000);
infospot2.position.set(-2000, 500, -5000);
infospot3.position.set(1500, -1500, -5000);
infospot4.position.set(-2000, -1500, -5000);
infospot5.position.set(-100, -500, -5000);
titlespot.position.set(-100, 2200, -5000);

// ボタンを押すと現在のパノラマを変更する
infospot.addEventListener('click', function() {
  viewer.setPanorama(panorama2);
  panorama2.add(infospot, infospot2, infospot3, infospot4, infospot5);
  timeAction(panorama2);
  alert("テスト1");
});
infospot2.addEventListener('click', function() {
  viewer.setPanorama(panorama3);
  panorama3.add(infospot, infospot2, infospot3, infospot4, infospot5);
  alert("テスト2");
});
infospot3.addEventListener('click', function() {
  viewer.setPanorama(panorama4);
  panorama4.add(infospot, infospot2, infospot3, infospot4, infospot5);
  alert("テスト3");
});
infospot4.addEventListener('click', function() {
  viewer.setPanorama(panorama5);
  panorama5.add(infospot, infospot2, infospot3, infospot4, infospot5);
  alert("テスト4");
});
viewer = new PANOLENS.Viewer({ container: container });
panorama.add(infospot5);
viewer.add(panorama, panorama2, panorama3, panorama4, panorama5);

// ビデオの再生位置が5秒以上60秒以内ならボタンやタイトルテキストなどのオブジェクトを表示
timeAction(panorama);
function timeAction(panorama) {
  let panoramaVideo = panorama.getVideoElement();

  panoramaVideo.addEventListener("timeupdate", function() {
    if (panoramaVideo.currentTime >= 5 && panoramaVideo.currentTime <= 60) {
      panorama.add(infospot, infospot2, infospot3, infospot4, titlespot);

      // panorama.toggleInfospotVisibility(true);
      infospot.show();
      infospot2.show();
      infospot3.show();
      infospot4.show();
      titlespot.show();
    } else {
      // panorama.toggleInfospotVisibility(false);
      infospot.hide();
      infospot2.hide();
      infospot3.hide();
      infospot4.hide();
      titlespot.hide();
    }
  });
}

if (panorama.isVideoPaused()) {

}