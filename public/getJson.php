<?php
    if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

        if (isset($_POST["id"])) {

            $id = strval($_POST["id"]);
            $url = "./json/" . $id;
            $spotList = json_decode(file_get_contents($url . "/spotList.json"), true);
            $panoramaList = json_decode(file_get_contents($url . "/panoramaList.json"), true);

            $result = array('spotList'=> $spotList, 'panoramaList' => $panoramaList);
            header("Content-type: application/json; charset=UTF-8");
            echo json_encode($result);
            exit;
        }
    }