let panorama, panorama2, viewer, container, infospot;

container = document.querySelector( '#container' );

panorama = panorama = new PANOLENS.VideoPanorama( '../test.mp4', { autoplay: true } );
panorama2 = new PANOLENS.ImagePanorama( 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/sunset.jpg' );

infospot = new PANOLENS.Infospot( 500, 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/tunnel.jpg' );
let infospot2 = new PANOLENS.Infospot( 500, PANOLENS.DataImage.Info );
let infospot3 = new PANOLENS.Infospot( 500, PANOLENS.DataImage.Info );
let infospot4 = new PANOLENS.Infospot( 500, PANOLENS.DataImage.Info );

infospot.position.set( -100, -500, -5000 );
infospot2.position.set( -100, -0, -5000 );
infospot3.position.set( -100, 500, -5000 );
infospot4.position.set( -100, 1000, -5000 );
infospot.addHoverText( "The Story" );
infospot.addEventListener( 'click', function(){
  viewer.setPanorama( panorama2 );
} );

panorama.add( infospot, infospot2, infospot3, infospot4 );

viewer = new PANOLENS.Viewer( { container: container } );
viewer.add( panorama, panorama2 );

viewer.addUpdateCallback(function(){
  
});

// let container, panorama, viewer;

// container = document.querySelector('#container');

//イメージ表示
// panorama = new PANOLENS.ImagePanorama('../test.png');

// 動画表示
// panorama = new PANOLENS.VideoPanorama( '../test.mp4', { autoplay: true } );
// let panorama2 = new PANOLENS.ImagePanorama('../test2.png');
// let panorama3 = new PANOLENS.ImagePanorama('../test2.png');
// let panorama4 = new PANOLENS.ImagePanorama('../test2.png');
// let panorama5 = new PANOLENS.ImagePanorama('../test2.png');

// viewer = new PANOLENS.Viewer({container: container});
// viewer.add(panorama);
// viewer.add(panorama2);
// viewer.add(panorama3);
// viewer.add(panorama4);
// viewer.add(panorama5);

// // x: 奥行, y: 縦, z: 横
// // {x:-100,y:-500,z:-5000 } => 自分の目の前の座標
// panorama.link(panorama,{x:4000,y:0,z:-5000},
//   1500,
//   "../test2.png",
// );
// panorama.link(panorama2,{x:4000,y:-1500,z:-5000},
//   1500,
//   "../test2.png",
// );
// panorama.link(panorama3,{x:4000,y:1500,z:-5000},
//   1500,
//   "../test2.png",
// );
// panorama.link(panorama4,{x:4000,y:-3000,z:-5000},
//   1500,
//   "../test2.png",
// );
// panorama.link(panorama5,{x:4000,y:3000,z:-5000},
//   1500,
//   "../test2.png",
// );

// let panoramavideo = panorama.getVideoElement();
// panoramavideo.addEventListener('timeupdate', function() {
//     if (panoramavideo.currentTime !== 0) {
//       console.log(panoramavideo.currentTime);
//     } else {
//       console.log('0:00');
//     }
// })
// if (panorama.isVideoPaused()) {

// }

// viewer.toggleVideoPlay(function(pause) {
// });
