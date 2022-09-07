<?php
require_once('./db.php');

return function () {
    global $dbh;
    $now = new DateTime();
    $year = substr(strval(intval($now->format('Y')) + 543), 2);
    $month = $now->format('m');
    $number = $year . $month;
    $numStart = $number . "000";
    $numEnd = $number . "999";

    $sql = "SELECT  Number FROM T_Supervisor WHERE Number BETWEEN '$numStart' AND '$numEnd' ORDER BY Number DESC ";
    $result = $dbh->query($sql);

    if ($result->rowCount() == 0) {
        return (int)$numStart + 1;
    } else {
        return $result->fetchObject()->Number + 1;
    }
};



// return function () {
//     global $dbh;
//     $now = new DateTime();
//     $year = substr(strval(intval($now->format('Y')) + 543), 2);
//     $month = $now->format('m');
//     $number = $year . $month;
//     $sql = "SELECT 
//                 COUNT(DISTINCT Number) AS Number 
//                 FROM T_Supervisor
//                 WHERE Number BETWEEN '$number" . "000' AND '" . $number . "999' ;";
//     $result = $dbh->query($sql);
//     $totalNumber = ($result->fetchObject()->Number) + 1;
//     $result->closeCursor();
//     return $number . ($totalNumber > 99 ? $totalNumber : ($totalNumber > 9 ? "0" . $totalNumber : "00" . $totalNumber));
// };

// return function () {
//     global $dbh;
//     $now = new DateTime();
//     $year = substr(strval(intval($now->format('Y')) + 543), 2);
//     $month = $now->format('m');
//     $number = $year . $month;
//     $numStart = $number . "000";
//     $numEnd = $number . "999";
//     $sql = "SELECT  Number FROM T_Supervisor WHERE Number BETWEEN '$numStart' AND '$numEnd'  ";
//     $result = $dbh->query($sql);

//     if ($result->rowCount() > 0) {
//         $totalNumber = ($result->fetchObject()->Number) + 1;
//         $result->closeCursor();
//         return $number . ($totalNumber > 99 ? $totalNumber : ($totalNumber > 9 ? "0" . $totalNumber : "00" . $totalNumber));
//     } else {
//         return (int)$numStart += 1;
//     }
// };
