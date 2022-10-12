let currentPanorama;
let announceAudio;
let infospot, infospot2, infospot3, infospot4,titlespot
let viewer, container;
let isModalOpen = false;
let isAudioPlaying = false;
let deviceType;
let spotList,panoramaList;

// let spotList = [];

// パノラマを変更するボタンやタイトルなどのテストデータ。本番ではredisなどのjsonとして管理する
// spotList.push({ id: 1, panoramaId: 1, nextPanoramaId: 2, infospot: null, infoSrc: '../chartest.png', spScale: 750, pcScale: 1500, spPosition: '{"x":750, "y":500, "z":-5000}', pcPosition: '{"x":1500, "y":500, "z":-5000}', type: 'videoPanorama', isHover: false });
// spotList.push({ id: 2, panoramaId: 1, nextPanoramaId: 3, infospot: null, infoSrc: '../chartest2.png', spScale: 750, pcScale: 1500, spPosition: '{"x":-750, "y":500, "z":-5000}', pcPosition: '{"x":-2000, "y":500, "z":-5000}', type: 'imagePanorama', isHover: true });
// spotList.push({ id: 3, panoramaId: 1, nextPanoramaId: 4, infospot: null, infoSrc: '../chartest3.png', spScale: 750, pcScale: 1500, spPosition: '{"x":750, "y":-1000, "z":-5000}', pcPosition: '{"x":1500, "y":-1500, "z":-5000}', type: 'imagePanorama', isHover: true });
// spotList.push({ id: 4, panoramaId: 1, nextPanoramaId: 1, infospot: null, infoSrc: '../chartest4.png', spScale: 750, pcScale: 1500, spPosition: '{"x":-750, "y":-1000, "z":-5000}', pcPosition: '{"x":-2000, "y":-1500, "z":-5000}', type: 'imagePanorama', isHover: true });
// spotList.push({ id: 5, panoramaId: 1, nextPanoramaId: null, infospot: null, infoSrc: PANOLENS.DataImage.Info, spScale: 250, pcScale: 500, spPosition: '{"x":-100, "y":-500, "z":-5000}', pcPosition: '{"x":-100, "y":-500, "z":-5000}', type: 'information', isHover: true });
// spotList.push({ id: 5, panoramaId: 1, nextPanoramaId: null, infospot: null, infoSrc: PANOLENS.DataImage.Info, spScale: 250, pcScale: 500, spPosition: '{"x":-500, "y":-500, "z":-5000}', pcPosition: '{"x":-100, "y":-500, "z":-5000}', type: 'announce', announceSrc: '../test_announce.mp3', isHover: true });
// spotList.push({ id: 6, panoramaId: 1, nextPanoramaId: null, infospot: null, infoSrc: '../testtitle.png', panoramaSrc: null, spScale: 400, pcScale: 800, spPosition: '{"x":-100, "y":1500, "z":-5000}', pcPosition: '{"x":-100, "y":2200, "z":-5000}', type: 'title', isHover: false });

// let panoramaList = [];
// panoramaList.push({ id: 1, panorama: null, type: 'video', panoramaSrc: '../test.mp4', startTime: 5, endTime: 60, totalTime: null });
// panoramaList.push({ id: 2, panorama: null, type: 'image', panoramaSrc: 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' });
// panoramaList.push({ id: 3, panorama: null, type: 'image', panoramaSrc: 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' });
// panoramaList.push({ id: 4, panorama: null, type: 'image', panoramaSrc: 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' });

// ユーザが動画停止ボタンを押したかモーダル表示で停止されたかを判別
let userPaused = true;

$(window).on("load", function() {

  // jsonデータ読み取り
  $.ajax({
    type: "POST",
      url: "getJson.php",
      data:{ id:1 },
      dataType:'json'
  }).fail(function(){
    console.log('error');
  }).done(function(result){
    spotList = result["spotList"];
    panoramaList = result["panoramaList"];
    initSpot();
  });

  container = document.querySelector('#container');
  announceAudio = $('#announceAudio').get(0);

  $(document).on('touchend click','#volumeBtn', function() {

    if(currentPanorama['panorama'].isVideoMuted()) {
      $('#volumeBtn').css('background-image', 'url(https://cdn.sove-x.com/player/images/sound_off.png)');      
      currentPanorama['panorama'].unmuteVideo();
    } else {
      $('#volumeBtn').css('background-image', 'url(https://cdn.sove-x.com/player/images/sound_on.png)');
      currentPanorama['panorama'].muteVideo();
    }
  });

  $(document).on("ended", '#announceAudio', function() {

    if (currentPanorama['type'] === 'video') {
      let panoramaVideo = currentPanorama['panorama'].getVideoElement();
      panoramaVideo.volume = 1;
      isAudioPlaying = false;
    }
  });

  $(document).on('click', '#closeModal , #modalBg', function()　{
    $('#modalArea').fadeOut();
    isModalOpen = false;
    if (userPaused !== true) { currentPanorama['panorama'].playVideo(); }
    currentPanorama['panorama'].toggleInfospotVisibility(true);
  });
  
  // 再生時間の表記を「mm:ss」に整える
  const convertTime = function(currentTime) {
    
    currentTime = Math.floor(currentTime);
    var res = null;

    if( 60 <= currentTime ) {
      res = Math.floor(currentTime / 60);
      res += ":" + Math.floor(currentTime % 60).toString().padStart( 2, '0');
    } else {
      res = "0:" + Math.floor(currentTime % 60).toString().padStart( 2, '0');
    }

    return res;
  };

  // ビデオの再生位置が5秒以上60秒以内ならボタンやタイトルテキストなどのオブジェクトを表示
  function timeAction(panorama, spotList) {

    const panoramaObj = panorama['panorama'];
    const startTime = Number(panorama['startTime']);
    const endTime = Number(panorama['endTime']);
    let panoramaVideo = panoramaObj.getVideoElement();

    panoramaVideo.addEventListener("timeupdate", function() {

      const timePosition = convertTime(panoramaVideo.currentTime);
      const timeDuration = convertTime(panoramaVideo.duration);
      // currentTime">00:02　/　00:26</span>
      $('#currentTime').text(timePosition + " / " + timeDuration);
      if (panoramaVideo.currentTime >= startTime && panoramaVideo.currentTime <= endTime && isModalOpen === false) {

        spotList.map(function(spot) {
          const infospot = spot.infospot;
          panoramaObj.add(infospot);
          infospot.show();
        });
      } else {
        spotList.map(function(spot) {
          const infospot = spot.infospot;
          panoramaObj.remove(infospot);
          infospot.hide();
        });
      }
    });
  }

  // ビデオのボリュームを下げアナウンスを流す
  function volumeControll(panorama) {
    let panoramaVideo = panorama.getVideoElement();
    isAudioPlaying = !isAudioPlaying;
    if (isAudioPlaying) {
      announceAudio.play();
      panoramaVideo.volume = 0.3;
    } else {
      announceAudio.pause();
      panoramaVideo.volume = 1;
    }
  }

  // 初期ロード時にスマホの縦・横・pcでオブジェクトの大きさと配置を変える
  function initSpot() {
    
    // 画面の向きを取得
    let angle = screen && screen.orientation && screen.orientation.angle;

    if ( angle === undefined ) {
      angle = window.orientation; // iOS用
    }

    // パノラマ一覧データのパノラマオブジェクトを設定
    panoramaList.map(function (panorama) {
      if (panorama.type === 'video') {
        panorama.panorama = new PANOLENS.VideoPanorama(panorama.panoramaSrc, {muted: false});
      } else if (panorama.type === 'image') {
        panorama.panorama = new PANOLENS.ImagePanorama(panorama.panoramaSrc);
      }
    });

    //パノラマ上に配置するオブジェクト
    spotList.map(function (spot) {

      let infoSrc = '';

      if (spot.type === 'information' || spot.type === 'announce') {
        infoSrc = (new Function("return " + spot.infoSrc))();
      } else {
        infoSrc = spot.infoSrc;
      }
      
      // スマホ、タブレット画面縦持ち => portrait
      // タブレット横持ち、pc => landscape
      if (angle === 0) {
        spot.infospot = new PANOLENS.Infospot(spot.spScale, infoSrc, spot.isHover);
        const spPosition = JSON.parse(spot.spPosition);
        spot.infospot.position.set(spPosition.x, spPosition.y, spPosition.z);
        deviceType = 'portrait';
      } else {
        spot.infospot = new PANOLENS.Infospot(spot.pcScale, infoSrc, spot.isHover);
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
                nextPanorama[0]['panorama'].add(obj.infospot);
                return obj;
              }
            }
          )

          currentPanorama = nextPanorama[0];

          if (announceAudio.src) {
            announceAudio.src = '';
          }
          if (currentPanorama['type'] === 'video') {
            timeAction(currentPanorama, nextSpot);
            $('#timeArea').show();
            $('#currentTime').show();
            $('#volumeBtn').show();
          } else {
            $('#timeArea').hide();
            $('#currentTime').hide();
            $('#volumeBtn').hide();
          }
        });
      } else if (spot.type === 'information') {

        // モーダルの表示
        // モーダル表示時には動画を停止
        spot.infospot.addEventListener('click', function() {
          currentPanorama['panorama'].toggleInfospotVisibility(false);
          isModalOpen = true;
          userPaused = currentPanorama['panorama'].isVideoPaused();
          currentPanorama['panorama'].pauseVideo();
          $('#modalArea').fadeIn();
        });
      } else if (spot.type === 'announce') {
        spot.infospot.addEventListener('click', function() {
          if(currentPanorama['type'] === 'video') {
            volumeControll(currentPanorama['panorama'], spot.announceSrc);
          }
        });
      }
    });

    //ビデオとオブジェクトを配置
    viewer = new PANOLENS.Viewer({
      container: container,
      controlButtons: ['fullscreen', 'video'],
      autoHideInfospot: true,
      animated: false,
      initialLookAt: new THREE.Vector3( 1000, 5000, 1)
    });

    // 一番初めのパノラマオブジェクトを現在のパノラマに設定
    currentPanorama = panoramaList[0];

    const firstSpot = $.grep(spotList,
      function (obj, index) {
        if (obj.panoramaId === currentPanorama['id']) {
          currentPanorama['panorama'].add(obj.infospot);
          return obj;
        }
      }
    )

    const audioSpot = $.grep(firstSpot,
      function (obj, index) {
        if (obj.type === 'announce') {
          return obj;
        }
      }
    )
    
    announceAudio.src = audioSpot[0].announceSrc;
    
    $.grep(panoramaList,
      function (obj, index) {
        viewer.add(obj.panorama);
      }
    )

    if (currentPanorama['type'] === 'video') {
      let canvasArea = $('#container').find('div').eq(1);
      let timeArea = canvasArea.find('span').eq(-1);
      timeArea.attr('id', 'timeArea');
      timeArea.insertBefore($('#container').find('div').eq(0));
      timeArea.find('div').eq(0).css('background-color','rgba(15,85,241,.9)');
      timeArea.find('div').eq(1).css('background-color','rgba(15,85,241,.9)');
      timeArea.css({
        'position': 'fixed',
        'bottom': '44px',
        'width': '100%'
      })

      canvasArea.append(`<span id="volumeBtn"></span>`);

      $('#volumeBtn').css({
        'cursor': 'pointer',
        'float': 'left',
        'width': '44px',
        'height': '100%',
        'background-size': '60%',
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'user-select': 'none',
        'position': 'relative',
        'pointer-events': 'auto;',
        'pointer-events': 'auto',
        'background-image': 'url("https://cdn.sove-x.com/player/images/sound_off.png"'
      })
      canvasArea.append(`<span id="currentTime">0:00 / 0:00</span>`);

      $('#currentTime').css({
        'cursor': 'pointer',
        'float': 'left',
        'width': '100px',
        'height': '50%',
        'color': 'white',
        'font-size': '12px',
        'position': 'relative',
        'top': '30%',
        'left': '10px'
      });
    }

    // let ua = navigator.userAgent;
    // if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 || ua.indexOf('iPad') > 0) {
    //   viewer.toggleNextControl();
    // }

    timeAction(currentPanorama, firstSpot);
    
  }
});

$(window).on("resize", function() {

  setTimeout(() => {

    // 画面の向きを取得
    let angle = screen && screen.orientation && screen.orientation.angle;

    if ( angle === undefined ) {
      angle = window.orientation; // iOS用
    }

    // スマホ、タブレット画面縦持ち
    if (angle === 0 && deviceType !== 'portrait') {
      spotList.map(function (spot) {
        const spPosition = JSON.parse(spot.spPosition);
        spot.infospot.scale.x /= 2;
        spot.infospot.scale.y /= 2;
        spot.infospot.position.set(spPosition.x, spPosition.y, spPosition.z);
      });

      deviceType = 'portrait';
    } else if (angle !== 0 && deviceType === 'portrait') {
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

    // let ua = navigator.userAgent;
    // if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 || ua.indexOf('iPad') > 0) {
    //   viewer.toggleNextControl();
    // }
  }, 10);
});

