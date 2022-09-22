let panorama, panorama2, panorama3, panorama4, panorama5, panoramaVideo;
let infospot, infospot2, infospot3, infospot4,titlespot
let viewer, container;
let isModalOpen = false;
let deviceType;

// ユーザが動画停止ボタンを押したかモーダル表示で停止されたかを判別
let userPaused = true;

window.onload = function() {
  container = document.querySelector('#container');
  const dialog = document.querySelector("#modalDialog");

  // 現在のパノラマ
  panorama  = new PANOLENS.VideoPanorama('../test.mp4', { 
    autoplay: true,
    muted: true,
    playsinline: true
  });

  // 遷移先のパノラマ一覧
  panorama2 = new PANOLENS.VideoPanorama('../test.mp4', { autoplay: true });
  panorama3 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
  panorama4 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');
  panorama5 = new PANOLENS.ImagePanorama('https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg');

  initSpot();
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

  // モーダルの表示・非表示時
  // モーダル表示時には動画を停止
  infospot5.addEventListener('click', function() {
    panorama.toggleInfospotVisibility(false);
    isModalOpen = true;
    userPaused = panorama.isVideoPaused();
    panorama.pauseVideo();
    dialog['show']();
  });
  document.getElementById('closeModal').addEventListener('click', function() {
    dialog['close']();
    isModalOpen = false;
    if (userPaused !== true) { panorama.playVideo(); }
    panorama.toggleInfospotVisibility(true);
  });

  //ビデオとオブジェクトを配置
  viewer = new PANOLENS.Viewer({ container: container });
  panorama.add(infospot5);
  viewer.add(panorama, panorama2, panorama3, panorama4, panorama5);
  
  // ビデオの再生位置が5秒以上60秒以内ならボタンやタイトルテキストなどのオブジェクトを表示
  timeAction(panorama);
  function timeAction(panorama) {
    panoramaVideo = panorama.getVideoElement();

    panoramaVideo.addEventListener("timeupdate", function() {
      if (panoramaVideo.currentTime >= 5 && panoramaVideo.currentTime <= 60 && isModalOpen === false) {
        panorama.add(infospot, infospot2, infospot3, infospot4, titlespot);

        infospot.show();
        infospot2.show();
        infospot3.show();
        infospot4.show();
        titlespot.show();
      } else {
        panorama.remove(infospot, infospot2, infospot3, infospot4, titlespot);
        infospot.hide();
        infospot2.hide();
        infospot3.hide();
        infospot4.hide();
        titlespot.hide();
      }
    });
  }

  // 初期ロード時にスマホの縦・横・pcでオブジェクトの大きさと配置を変える
  function initSpot() {
    
    // 画面の向きを取得
    let angle = screen && screen.orientation && screen.orientation.angle;
    let windowWidth = $(window).width();

    if ( angle === undefined ) {
      angle = window.orientation; // iOS用
    }

    // スマホ画面縦持ち
    if (windowWidth <= 767 && angle === 0) {

      // パノラマを変更するボタン
      infospot = new PANOLENS.Infospot(750, '../chartest.png');
      infospot2 = new PANOLENS.Infospot(750, '../chartest2.png');
      infospot3 = new PANOLENS.Infospot(750, '../chartest3.png');
      infospot4 = new PANOLENS.Infospot(750, '../chartest4.png');

      // 白丸のインフォメーションマーク
      infospot5 = new PANOLENS.Infospot( 250, PANOLENS.DataImage.Info );

      // タイトル表示
      titlespot = new PANOLENS.Infospot(400, '../testtitle.png', false);

      // ボタンの位置を決める
      // {x: -100, y: -500, z: -5000 } => 自分の目の前に配置
      infospot.position.set(750, 500, -5000);
      infospot2.position.set(-750, 500, -5000);
      infospot3.position.set(750, -1500, -5000);
      infospot4.position.set(-750, -1500, -5000);
      infospot5.position.set(-100, -500, -5000);
      titlespot.position.set(-100, 2200, -5000);

      deviceType = 'portrait';

    } else if (windowWidth <= 767 && angle !== 0) {
      //スマホ画面横持ち

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

      deviceType = 'landscape';
    } else {

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

      deviceType = 'pc';
    }      
  }
}

window.addEventListener('resize', function() {

  setTimeout(() => {

    // 画面の向きを取得
    let angle = screen && screen.orientation && screen.orientation.angle;
    let windowWidth = $(window).width();

    if ( angle === undefined ) {
      angle = window.orientation; // iOS用
    }

    // スマホ画面縦持ち
    if (windowWidth <= 767 && angle === 0 && deviceType !== 'portrait') {

      infospot.scale.x /= 2;
      infospot2.scale.x /= 2;
      infospot3.scale.x /= 2;
      infospot4.scale.x /= 2;
      infospot5.scale.x /= 2;
      titlespot.scale.x /= 2;
      
      infospot.scale.y /= 2;
      infospot2.scale.y /= 2;
      infospot3.scale.y /= 2;
      infospot4.scale.y /= 2;
      infospot5.scale.y /= 2;
      titlespot.scale.y /= 2;

      infospot.position.set(750, 500, -5000);
      infospot2.position.set(-750, 500, -5000);
      infospot3.position.set(750, -1500, -5000);
      infospot4.position.set(-750, -1500, -5000);
      infospot5.position.set(-100, -500, -5000);
      titlespot.position.set(-100, 2200, -5000);

      deviceType = 'portrait';

    } else if (windowWidth <= 767 && angle !== 0 && deviceType === 'portrait') {

      // スマホ画面横持ち
      infospot.scale.x *= 2;
      infospot2.scale.x *= 2;
      infospot3.scale.x *= 2;
      infospot4.scale.x *= 2;
      infospot5.scale.x *= 2;
      titlespot.scale.x *= 2;
      
      infospot.scale.y *= 2;
      infospot2.scale.y *= 2;
      infospot3.scale.y *= 2;
      infospot4.scale.y *= 2;
      infospot5.scale.y *= 2;
      titlespot.scale.y *= 2;

      infospot.position.set(1500, 500, -5000);
      infospot2.position.set(-2000, 500, -5000);
      infospot3.position.set(1500, -1500, -5000);
      infospot4.position.set(-2000, -1500, -5000);
      infospot5.position.set(-100, -500, -5000);
      titlespot.position.set(-100, 2200, -5000);

      deviceType = 'landscape';
    } else if (deviceType === 'portrait') {

      // pc
      infospot.scale.x *= 2;
      infospot2.scale.x *= 2;
      infospot3.scale.x *= 2;
      infospot4.scale.x *= 2;
      infospot5.scale.x *= 2;
      titlespot.scale.x *= 2;
      
      infospot.scale.y *= 2;
      infospot2.scale.y *= 2;
      infospot3.scale.y *= 2;
      infospot4.scale.y *= 2;
      infospot5.scale.y *= 2;
      titlespot.scale.y *= 2;

      infospot.position.set(1500, 500, -5000);
      infospot2.position.set(-2000, 500, -5000);
      infospot3.position.set(1500, -1500, -5000);
      infospot4.position.set(-2000, -1500, -5000);
      infospot5.position.set(-100, -500, -5000);
      titlespot.position.set(-100, 2200, -5000);

      deviceType = 'pc'; 
      
    }
  }, 10);
});

