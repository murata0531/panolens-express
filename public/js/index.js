let currentPanorama, panoramaVideo;
let infospot, infospot2, infospot3, infospot4,titlespot
let viewer, container;
let isModalOpen = false;
let deviceType;

let spotList = [];

// パノラマを変更するボタンやタイトルなどのテストデータ。本番ではredisなどのjsonとして管理する
spotList.push({ id: 1, panoramaId: 1, nextPanoramaId: 2, infospot: null, infoSrc: '../chartest.png', spScale: 750, pcScale: 1500, spPosition: '{"x":750, "y":500, "z":-5000}', pcPosition: '{"x":1500, "y":500, "z":-5000}', type: 'videoPanorama', isHover: true });
spotList.push({ id: 2, panoramaId: 1, nextPanoramaId: 3, infospot: null, infoSrc: '../chartest2.png', spScale: 750, pcScale: 1500, spPosition: '{"x":-750, "y":500, "z":-5000}', pcPosition: '{"x":-2000, "y":500, "z":-5000}', type: 'imagePanorama', isHover: true });
spotList.push({ id: 3, panoramaId: 1, nextPanoramaId: 4, infospot: null, infoSrc: '../chartest3.png', spScale: 750, pcScale: 1500, spPosition: '{"x":750, "y":-1000, "z":-5000}', pcPosition: '{"x":1500, "y":-1500, "z":-5000}', type: 'imagePanorama', isHover: true });
spotList.push({ id: 4, panoramaId: 1, nextPanoramaId: 1, infospot: null, infoSrc: '../chartest4.png', spScale: 750, pcScale: 1500, spPosition: '{"x":-750, "y":-1000, "z":-5000}', pcPosition: '{"x":-2000, "y":-1500, "z":-5000}', type: 'imagePanorama', isHover: true });
spotList.push({ id: 5, panoramaId: 1, nextPanoramaId: null, infospot: null, infoSrc: PANOLENS.DataImage.Info, spScale: 250, pcScale: 500, spPosition: '{"x":-100, "y":-500, "z":-5000}', pcPosition: '{"x":-100, "y":-500, "z":-5000}', type: 'information', isHover: true });
spotList.push({ id: 6, panoramaId: 1, nextPanoramaId: null, infospot: null, infoSrc: '../testtitle.png', panoramaSrc: null, spScale: 400, pcScale: 800, spPosition: '{"x":-100, "y":1500, "z":-5000}', pcPosition: '{"x":-100, "y":2200, "z":-5000}', type: 'title', isHover: false });

let panoramaList = [];
panoramaList.push({ id: 1, panorama: null, type: 'video', panoramaSrc: '../test.mp4' });
panoramaList.push({ id: 2, panorama: null, type: 'image', panoramaSrc: 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' });
panoramaList.push({ id: 3, panorama: null, type: 'image', panoramaSrc: 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' });
panoramaList.push({ id: 4, panorama: null, type: 'image', panoramaSrc: 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' });

// ユーザが動画停止ボタンを押したかモーダル表示で停止されたかを判別
let userPaused = true;

window.onload = function() {
  container = document.querySelector('#container');
  const dialog = document.querySelector("#modalDialog");

  initSpot();

  document.getElementById('closeModal').addEventListener('click', function() {
    dialog['close']();
    isModalOpen = false;
    if (userPaused !== true) { currentPanorama.playVideo(); }
    currentPanorama.toggleInfospotVisibility(true);
  });
  
  // ビデオの再生位置が5秒以上60秒以内ならボタンやタイトルテキストなどのオブジェクトを表示
  function timeAction(panorama, spotList) {
    panoramaVideo = panorama.getVideoElement();

    panoramaVideo.addEventListener("timeupdate", function() {
      if (panoramaVideo.currentTime >= 5 && panoramaVideo.currentTime <= 60 && isModalOpen === false) {

        spotList.map(function(spot) {
          const infospot = spot.infospot;
          panorama.add(infospot);
          infospot.show();
        });
      } else {
        spotList.map(function(spot) {
          const infospot = spot.infospot;
          panorama.remove(infospot);
          infospot.hide();
        });
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

    // パノラマ一覧データのパノラマオブジェクトを設定
    panoramaList.map(function (panorama) {
      if (panorama.type === 'video') {
        panorama.panorama = new PANOLENS.VideoPanorama(panorama.panoramaSrc);
      } else if (panorama.type === 'image') {
        panorama.panorama = new PANOLENS.ImagePanorama(panorama.panoramaSrc);
      }
    });

    //パノラマ上に配置するオブジェクト
    spotList.map(function (spot) {

      // スマホ画面縦持ち
      if (windowWidth <= 767 && angle === 0) {
        spot.infospot = new PANOLENS.Infospot(spot.spScale, spot.infoSrc, spot.isHover);
        const spPosition = JSON.parse(spot.spPosition);
        spot.infospot.position.set(spPosition.x, spPosition.y, spPosition.z);
        deviceType = 'portrait';
      } else {
        spot.infospot = new PANOLENS.Infospot(spot.pcScale, spot.infoSrc, spot.isHover);
        const pcPosition = JSON.parse(spot.pcPosition);
        spot.infospot.position.set(pcPosition.x, pcPosition.y, pcPosition.z);
        deviceType = 'landscape';
      }

      if (spot.type === 'videoPanorama' || spot.type === 'imagePanorama') {
        spot.infospot.addEventListener('click', function() {

          const nextPanorama = $.grep(panoramaList,
            function (obj, index) {
              return (obj.id === spot.nextPanoramaId);
            }
          )
          viewer.setPanorama(nextPanorama[0]['panorama']);

          const nextSpot = $.grep(spotList,
            function (obj, index) {
              if (obj.panoramaId === spot.nextPanoramaId) {
                console.log(spot);
                nextPanorama[0]['panorama'].add(obj.infospot);
                return obj;
              }
            }
          )

          currentPanorama = nextPanorama[0]['panorama'];
          timeAction(currentPanorama, nextSpot);
        });
      } else if (spot.type === 'information') {

        // モーダルの表示・非表示時
        // モーダル表示時には動画を停止
        spot.infospot.addEventListener('click', function() {
          console.log(currentPanorama);
          currentPanorama.toggleInfospotVisibility(false);
          isModalOpen = true;
          userPaused = currentPanorama.isVideoPaused();
          currentPanorama.pauseVideo();
          dialog['show']();
        });
      }
    });

    //ビデオとオブジェクトを配置
    viewer = new PANOLENS.Viewer({ container: container });

    // 一番初めのパノラマオブジェクトを現在のパノラマに設定
    const firstPanorama = panoramaList[0];
    currentPanorama = firstPanorama['panorama'];

    const firstSpot = $.grep(spotList,
      function (obj, index) {
        if (obj.panoramaId === firstPanorama['id']) {
          currentPanorama.add(obj.infospot);
          return obj;
        }
      }
    )

    $.grep(panoramaList,
      function (obj, index) {
        viewer.add(obj.panorama);
      }
    )

    timeAction(currentPanorama, firstSpot);
    
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
      spotList.map(function (spot) {
        const spPosition = JSON.parse(spot.spPosition);
        spot.infospot.scale.x /= 2;
        spot.infospot.scale.y /= 2;
        spot.infospot.position.set(spPosition.x, spPosition.y, spPosition.z);
      });

      deviceType = 'portrait';
    } else if (windowWidth <= 767 && angle !== 0 && deviceType === 'portrait') {
      spotList.map(function (spot) {

        const pcPosition = JSON.parse(spot.pcPosition);
        spot.infospot.scale.x *= 2;
        spot.infospot.scale.y *= 2;
        spot.infospot.position.set(pcPosition.x, pcPosition.y, pcPosition.z);
      });

      deviceType = 'landscape';
    } else if (deviceType === 'portrait') {
      spotList.map(function (spot) {

        const pcPosition = JSON.parse(spot.pcPosition);
        spot.infospot.scale.x *= 2;
        spot.infospot.scale.y *= 2;
        spot.infospot.position.set(pcPosition.x, pcPosition.y, pcPosition.z);
      });
      
      deviceType = 'landscape';
    }
  }, 10);
});

