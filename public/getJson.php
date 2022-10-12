<?php
    if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

        if (isset($_POST["id"]) && $_POST["id"] == 1) {

            $spotList = json_decode(file_get_contents("./js/spotList.json"), true);
            $panoramaList = json_decode(file_get_contents("./js/panoramaList.json"), true);

            $result = array('spotList'=> $spotList, 'panoramaList' => $panoramaList);
            header("Content-type: application/json; charset=UTF-8");
            echo json_encode($result);
        }
    }