<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no">
  <link rel=stylesheet href="./css/style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/105/three.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/panolens@0.11.0/build/panolens.min.js"></script>
  <script
    src="https://code.jquery.com/jquery-3.6.1.js"
    integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI="
    crossorigin="anonymous">
  </script>
  <script src="./js/index.js"></script>
  <title>panolens Test</title>
</head>

<body>
  <!-- <dialog id="modalDialog">
    <p>I'm a Dialog</p>
    <button id="closeModal">Close</button>
  </dialog> -->

  <!-- モーダルエリアここから -->
  <section id="modalArea" class="modalArea">
    <div id="modalBg" class="modalBg"></div>
    <div class="modalWrapper">
      <div class="modalContents">
        <h1>モーダル</h1>
        <p>テスト </p>
      </div>
      <div id="closeModal" class="closeModal">
        ×
      </div>
    </div>
  </section>
  <!-- モーダルエリアここまで -->

  <audio id="announceAudio"></audio>

  <div id="container"></div>
</body>

</html>