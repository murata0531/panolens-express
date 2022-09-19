let container, panorama, viewer;

container = document.querySelector('#container');

//イメージ表示
// panorama = new PANOLENS.ImagePanorama('../test.png');

// 動画表示
panorama = new PANOLENS.VideoPanorama( '../test.mp4', { autoplay: true } );
let panorama2 = new PANOLENS.ImagePanorama('../test2.png');
let panorama3 = new PANOLENS.ImagePanorama('../test2.png');
let panorama4 = new PANOLENS.ImagePanorama('../test2.png');
let panorama5 = new PANOLENS.ImagePanorama('../test2.png');

viewer = new PANOLENS.Viewer({container: container});
viewer.add(panorama);
viewer.add(panorama2);
viewer.add(panorama3);
viewer.add(panorama4);
viewer.add(panorama5);

// x: 奥行, y: 縦, z: 横
panorama.link(panorama2,{x:300,y:300,z:600},
  300,
  "../test2.png",
);
panorama.link(panorama3,{x:300,y:900,z:600},
  300,
  "../test2.png",
);
panorama.link(panorama4,{x:300,y:1200,z:600},
  300,
  "../test2.png",
);
panorama.link(panorama5,{x:300,y:1800,z:600},
  300,
  "../test2.png",
);

let panoramavideo = panorama.getVideoElement();
panoramavideo.addEventListener('timeupdate', function() {
    if (panoramavideo.currentTime !== 0) {
      console.log(panoramavideo.currentTime);
    } else {
      console.log('0:00');
    }
  })
if (panorama.isVideoPaused()) {

} else {
    alert("sss");
}

viewer.toggleVideoPlay(function(pause) {

    alert("aaaaaa");
});
