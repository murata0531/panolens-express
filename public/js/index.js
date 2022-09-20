let panorama, panorama2, panorama3, panorama4, panorama5;
let infospot, infospot2, infospot3, infospot4
let viewer, container;

container = document.querySelector('#container');

// 現在のパノラマ
panorama  = new PANOLENS.VideoPanorama('../test.mp4', { autoplay: true });

// 遷移先のパノラマ一覧
panorama2 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
panorama3 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
panorama4 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
panorama5 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');

// パノラマを変更するボタン
infospot = new PANOLENS.Infospot(1000, '../test.png');
infospot2 = new PANOLENS.Infospot(1000, '../test2.png');
infospot3 = new PANOLENS.Infospot(1000, '../test3.png');
infospot4 = new PANOLENS.Infospot(1000, '../test4.png');
// infospot4 = new PANOLENS.Infospot( 500, PANOLENS.DataImage.Info );

// ボタンの位置を決める
// {x: -100, y: -500, z: -5000 } => 自分の目の前に配置
infospot.position.set(1000, 1000, -5000);
infospot2.position.set(-2000, 1000, -5000);
infospot3.position.set(1000, -1000, -5000);
infospot4.position.set(-2000, -1000, -5000);

// 各ボタンのフォバーテキストを設定
infospot.addHoverText("テスト1");
infospot2.addHoverText("テスト2");
infospot3.addHoverText("テスト3");
infospot4.addHoverText("テスト4");

// ボタンを押すと現在のパノラマを変更する
infospot.addEventListener('click', function() {
  viewer.setPanorama(panorama2);
  panorama2.add(infospot, infospot2, infospot3, infospot4);
  alert("テスト1");
});
infospot2.addEventListener('click', function() {
  viewer.setPanorama(panorama3);
  panorama3.add(infospot, infospot2, infospot3, infospot4);
  alert("テスト2");
});
infospot3.addEventListener('click', function() {
  viewer.setPanorama(panorama4);
  panorama4.add(infospot, infospot2, infospot3, infospot4);
  alert("テスト3");
});
infospot4.addEventListener('click', function() {
  viewer.setPanorama(panorama5);
  panorama5.add(infospot, infospot2, infospot3, infospot4);
  alert("テスト4");
});

panorama.add(infospot, infospot2, infospot3, infospot4);

viewer = new PANOLENS.Viewer({ container: container });
viewer.add(panorama, panorama2, panorama3, panorama4, panorama5);

viewer.addUpdateCallback(function() {
});

let panoramaVideo = panorama.getVideoElement();

function timeAction() {
  if (panoramaVideo.currentTime >= 5) {
    alert("5秒経ちました");
    panoramaVideo.removeEventListener("timeupdate", timeAction, false);
  } 
}

panoramaVideo.addEventListener("timeupdate", timeAction, false);
if (panorama.isVideoPaused()) {

}