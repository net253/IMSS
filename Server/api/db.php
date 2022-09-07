<?php
Header('Access-Control-Allow-Origin: *');
Header('Access-Control-Allow-Headers: *');
Header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header("Content-Type: application/json; charset=UTF-8");
date_default_timezone_set('Asia/Bangkok');

$server = "10.1.1.21";
$username = "iiot-center";
$password = "Snc@2022";
$database = "IMSS";

// $server = "10.1.12.15";
// $username = "root";
// $password = "";
// $database = "imss";
