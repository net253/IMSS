<?php
require_once('./db.php');
// $RunNumber = require('./runnumber.php');
session_start();

try {
    $dbh = new PDO("sqlsrv:server=$server;database=$database ", $username, $password);
    // echo json_endcoe(["msg" => "connect"]);
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $req = (object) json_decode(file_get_contents('php://input'));
        $data = array();
        if (isset($req->router)) {
            //!รายชื่อ Manchine + Serial Number
            if ($req->router == '/Data-Machine') {
                $sql1 = "SELECT * FROM T_Name_Machine";
                $query1 = $dbh->prepare($sql1);
                $query1->execute();

                while ($row = $query1->fetch(PDO::FETCH_ASSOC)) {
                    array_push($data, $row);
                }
                echo json_encode($data);
            }
            //!รายชื่อคนที่สามารถกดยืนยันได้
            else if ($req->router == '/Name-Confirm') {
                $sql2 = "SELECT * FROM T_Name_Confirm WHERE Rank='Confirm'";
                $query2 = $dbh->prepare($sql2);
                $query2->execute();

                while ($row = $query2->fetch(PDO::FETCH_ASSOC)) {
                    array_push($data, $row);
                }
                echo json_encode($data);
            }

            //!รายชื่อคนที่สามารถส่งคำร้องได้
            else if ($req->router == '/Name-Request') {
                $sql2 = "SELECT * FROM T_Name_Confirm WHERE Rank='Sup' ";
                $query2 = $dbh->prepare($sql2);
                $query2->execute();

                while ($row = $query2->fetch(PDO::FETCH_ASSOC)) {
                    array_push($data, $row);
                }
                echo json_encode($data);
            }

            //!รายชื่อคนที่สามารถตรวจสอบได้
            else if ($req->router == '/Name-Check') {
                $sql2 = "SELECT * FROM T_Name_Confirm WHERE Rank='Check' ";
                $query2 = $dbh->prepare($sql2);
                $query2->execute();

                while ($row = $query2->fetch(PDO::FETCH_ASSOC)) {
                    array_push($data, $row);
                }
                echo json_encode($data);
            }

            //!เรียกดู 1 รายการ
            else if ($req->router == '/Read-One') {
                $stmt = $dbh->prepare("SELECT*FROM T_Supervisor WHERE Number  =? ");
                $stmt->execute([$_GET['Number']]);
                foreach ($stmt as $row); {
                    $user = array(
                        'Number' => $row['Number'],
                        'Topic' => $row['Topic'],
                        'DateTime' => $row['DateTime'],
                        'NameMachine' => $row['NameMachine'],
                        'SerialNumber' => $row['SerialNumber'],
                        'NameSupervisor' => $row['NameSupervisor'],
                        'Division' => $row['Division'],
                        'Defect' => $row['Defect'],
                        'Advice' => $row['Advice'],
                        'Status' => $row['Status']

                    );
                    echo json_encode($user);
                }
                $dbh = null;
            }
            //!เรียกดู 1 รายการ ที่มีทั้งSupervisor และ Maintenance
            else if ($req->router == '/Read-Match') {

                $stmt = $dbh->prepare("SELECT*FROM vw_Read_Match WHERE Number  = ? ");
                $stmt->execute([$_GET['Number']]);
                foreach ($stmt as $row); {
                    $user = array(
                        'Number' => $row['Number'],
                        'Topic' => $row['Topic'],
                        'DateTime' => $row['DateTime'],
                        'NameMachine' => $row['NameMachine'],
                        'SerialNumber' => $row['SerialNumber'],
                        'NameSupervisor' => $row['NameSupervisor'],
                        'Division' => $row['Division'],
                        'Defect' => $row['Defect'],
                        'Advice' => $row['Advice'],
                        'Status' => $row['Status'],

                        'Maintenance' => $row['Maintenance'],
                        'StartDate' => $row['StartDate'],
                        'FinishDate' => $row['FinishDate'],
                        'Failear' => $row['Failear'],
                        'Solution' => $row['Solution'],
                        'Expenses' => $row['Expenses'],
                        'EnCheck' => $row['EnCheck'],
                        'Controller' => $row['Controller'],
                        'DateToDay' => $row['DateToDay'],
                        'BeforePicture' => $row['BeforePicture'],
                        'AfterPicture' => $row['AfterPicture']


                    );
                    echo json_encode($user);
                }
                $dbh = null;
            }

            //!ใส่รหัส พนง. ยืนยันตอนกดส่งงานที่ทำเสร็จ

            else if ($req->router == '/Confirm-Employee-ID') {
                // echo "connect";
                // $check_data = $dbh->prepare("SELECT * FROM T_Name_Confirm WHERE NameConfirm=:NameConfirm");
                // $check_data->bindParam(":NameConfirm", $NameConfirm);
                // $check_data->execute();
                // $row = $check_data->fetch(PDO::FETCH_ASSOC);

                // $NameConfirm = $_POST['NameConfirm'];
                // $Employee_ID = $_POST['Employee_ID'];
                if (!empty($req)) {
                    // $NameConfirm = $req->NameConfirm;
                    $Employee_ID = $req->Employee_ID;

                    if (empty($Employee_ID)) {
                        echo json_encode(["msg" => " Password is required", "state" => false]);
                        // http_response_code(400);
                    } else {
                        // $Employee_ID = md5($Employee_ID);
                        // $sql3 = "SELECT * FROM T_Name_Confirm WHERE NameConfirm = '" . $NameConfirm . "' AND Employee_ID = '" . $Employee_ID . "'";
                        // $result = $dbh->query($sql3);

                        $check_data = $dbh->prepare("SELECT * FROM vw_Confirm WHERE Employee_ID=:Employee_ID ");
                        $check_data->bindParam(":Employee_ID", $Employee_ID);
                        $check_data->execute();
                        $row = $check_data->fetch(PDO::FETCH_ASSOC);


                        // if ($check_data->rowCount() !== 1) {
                        if ($Employee_ID == $row['Employee_ID']) {
                            // if (password_verify($Employee_ID, $row['Employee_ID'])) {
                            echo json_encode(["msg" => "Confirm successfully.", "state" => true]);
                        }
                        // $_SESSION['NameConfirm'] = $NameConfirm;
                        // $_SESSION['timeout'] = time() + 1800;

                        // echo json_encode(["msg" => "Confirm successfully.", "state" => true]);
                        // http_response_code(200); 
                        else {
                            echo json_encode(["msg" => "Confirm failed.", "state" => false]);
                            // http_response_code(400);
                        }
                        // }
                    }
                } else {
                    echo json_encode(["msg" => "Username & password is required", "state" => false]);
                    // http_response_code(400);
                }
            }
        }
    } else {
        echo json_encode(["state" => false, "msg" => "Bad request"]);
    }
} catch (PDOException $e) {
    print "Error!:" . $e->getMessage() . "<br>";
    die();
}
