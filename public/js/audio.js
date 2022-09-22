let panorama, viewer, container, infospot, audioSphere, audioPlayButton, audioBuffer, panner;

container = document.querySelector( '#container' );

panorama = new PANOLENS.ImagePanorama( 'https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/tunnel.jpg' );

panorama.add( new THREE.PointLight( 0xffffbb, 0.9 ) );

viewer = new PANOLENS.Viewer( { container: container } );
viewer.add( panorama );

// For mobile browser needs a user trigger action

if ( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i) ) {
audioPlayButton = document.querySelector( '#audio-play-button' );
audioPlayButton.style.display = 'block';
audioPlayButton.addEventListener( 'touchstart', function(){

    let audioCtx = listener.context;

    // create empty buffer
    let buffer = audioCtx.createBuffer(1, 1, 22050);
    let source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;

    // connect to output (your speakers)
    source.connect(audioCtx.destination);

    // play the file
    source.start();

} );

}

// Spatial Audio
let rotationRadius = 400;
audioSphere = new THREE.Mesh(
new THREE.SphereGeometry(50, 16, 16),
new THREE.MeshStandardMaterial({
    shading: THREE.FlatShading
})
);

let listener = new THREE.AudioListener();
viewer.getCamera().add( listener );

let audioLoader = new THREE.AudioLoader();
let sound = new THREE.PositionalAudio( listener );
audioLoader.load( 'https://threejs.org/examples/sounds/358232_j_s_song.mp3', function( buffer ) {
audioBuffer = buffer;
sound.setBuffer( buffer );
sound.setRefDistance( 100 );
sound.setLoop( true );
sound.play();
}
                );
audioSphere.add( sound );

panorama.add( audioSphere );

viewer.addUpdateCallback(function(){
audioSphere.position.set(
    rotationRadius * Math.cos(Date.now() * 0.0005),
    0,
    rotationRadius * Math.sin(Date.now() * 0.0005)
);
});