<?php
require_once('./db.php');
require_once('./line-notify.php');
$runNumber = require('./runnumber.php');

try {
    $dbh = new PDO("sqlsrv:server=$server;database=$database ", $username, $password);
    // $dbh = new PDO('mysql:host=localhost;dbname=imss', $username, $password);
    // echo json_encode(["msg" => "connect"]);
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $Number = $runNumber();
        $req = (object) json_decode(file_get_contents('php://input'));
        $data = array();
        if (isset($req->router)) {
            //!ดูหน้าAll Job
            if ($req->router == '/All-Job') {

                $users = array();
                foreach ($dbh->query("SELECT*from T_Supervisor WHERE BU='$req->BU' ") as $row) {
                    array_push($users, array(
                        'Number' => $row['Number'],
                        'NameMachine' => $row['NameMachine'],
                        'SerialNumber' => $row['SerialNumber'],
                        'Division' => $row['Division'],
                        'Status' => $row['Status'],
                        'DateTime' => $row['DateTime'],
                        'DeadLine' => $row['DeadLine'],
                        'Process' => $row['Process'],
                        'BU' => $row['BU']

                    ));
                }
                echo json_encode($users);
                $dbh = null;
            }
            //!ดูหน้าJob Finished
            else if ($req->router == '/Finished') {

                $users = array();
                foreach ($dbh->query("SELECT*from T_Supervisor WHERE Process='Finished' AND BU='$req->BU' ") as $row) {
                    array_push($users, array(
                        'Number' => $row['Number'],
                        'NameMachine' => $row['NameMachine'],
                        'SerialNumber' => $row['SerialNumber'],
                        'Division' => $row['Division'],
                        'Status' => $row['Status'],
                        'DateTime' => $row['DateTime'],
                        'DeadLine' => $row['DeadLine'],
                        'Process' => $row['Process'],
                        'BU' => $row['BU']

                    ));
                }
                echo json_encode($users);
                $dbh = null;
                // $sql2 = "SELECT * FROM T_Supervisor WHERE Process ='Finished' ";
                // $query2 = $dbh->prepare($sql2);
                // $query2->execute();

                // while ($row = $query2->fetch(PDO::FETCH_ASSOC)) {
                //     array_push($data, $row);
                // }
                // echo json_encode($data);
            }
            //!ดูหน้าIn Process
            else if ($req->router == '/InProcess') {

                $users = array();
                foreach ($dbh->query("SELECT*from T_Supervisor WHERE Process='In Process'AND BU='$req->BU' ") as $row) {
                    array_push($users, array(
                        'Number' => $row['Number'],
                        'NameMachine' => $row['NameMachine'],
                        'SerialNumber' => $row['SerialNumber'],
                        'Division' => $row['Division'],
                        'Status' => $row['Status'],
                        'DateTime' => $row['DateTime'],
                        'DeadLine' => $row['DeadLine'],
                        'Process' => $row['Process'],
                        'BU' => $row['BU']

                    ));
                }
                echo json_encode($users);
                $dbh = null;
                // $sql3 = "SELECT * FROM T_Supervisor where Process ='In Process' ";
                // $query3 = $dbh->prepare($sql3);
                // $query3->execute();

                // while ($row = $query3->fetch(PDO::FETCH_ASSOC)) {
                //     array_push($data, $row);
                // }
                // echo json_encode($data);
            }

            //!Supervisorเพิ่มข้อมูล+แจ้งเตือนไลน์งานเข้า
            else if ($req->router == '/Sup-add-data') {
                $sql4 = "INSERT INTO T_Supervisor VALUES ($Number,'$req->DateTime','$req->Topic','$req->NameMachine','$req->SerialNumber',
                '$req->Division','$req->NameSupervisor','$req->Defect','$req->Advice','$req->Status','$req->DeadLine','In Process','$req->BU');
                INSERT INTO Line_Notify VALUES ('\nงานใหม่!\n\nอาคาร $req->BU:\nลำดับที่: $Number\n$req->Topic\n\nชื่อเครื่องจักร:\n$req->NameMachine\nหมายเลขเครื่องจักร:\n$req->SerialNumber\n\nณ แผนก: $req->Division\nเกิดอาการ: $req->Defect\nแจ้งโดย: $req->NameSupervisor\nวันที่: $req->DateTime\n\nต้องการแจ้งซ่อม\nhttps://iiot-center.sncformer.com/imss/ ','Loading', '$req->DateTime','$req->BU');
                ";

                $stmt = $dbh->prepare("UPDATE T_Supervisor SET DeadLine=DATEADD(day,$req->Status,'$req->DateTime') WHERE Number='$Number'");

                $stmt->bindParam(1, $req->DeadLine);
                $stmt->bindParam(2, $Number);

                // notify_message("\nงานใหม่!\nอาคาร $req->BU\nลำดับที่: $Number\n$req->Topic\nชื่อเครื่องจักร:\n$req->NameMachine\nหมายเลขเครื่องจักร:\n$req->SerialNumber\nณ แผนก: $req->Division\nเกิดอาการ: $req->Defect\nแจ้งโดย: $req->NameSupervisor\nวันที่: $req->DateTime\n\nต้องการแจ้งซ่อม\nhttps://iiot-center.sncformer.com/imss/ ");
                // echo json_encode($res);

                $query4 = $dbh->prepare($sql4);
                $query4->execute();

                // echo json_encode(["state" => true, "msg" => "Insert successful"]);

                if ($stmt->execute()) {
                    echo json_encode(["state" => true, "msg" => "Insert successful"]);
                } else {
                    echo json_encode(["state" => false, "msg" => "Insert error"]);
                }
                $dbh = null;
            }
            // //! เทส
            // else if ($req->router == '/Test') {
            //     // $req->BU = $test;
            //     $Table = "";
            //     if ($req->BU == 'B1') {
            //         $Table = "Line_Test1";
            //     } else if ($req->BU == 'B2') {
            //         $Table = "Line_Test2";
            //     } else if ($req->BU == 'B3') {
            //         $Table = "Line_Test3";
            //     } else if ($req->BU == 'B4') {
            //         $Table = "Line_Test4";
            //     } else if ($req->BU == 'B5') {
            //         $Table = "Line_Test5";
            //     } else if ($req->BU == 'B6') {
            //         $Table = "Line_Test6";
            //     } else if ($req->BU == 'B7') {
            //         $Table = "Line_Test7";
            //     } else if ($req->BU == 'B8') {
            //         $Table = "Line_Test8";
            //     } else if ($req->BU == 'B9') {
            //         $Table = "Line_Test9";
            //     } else if ($req->BU == 'B10') {
            //         $Table = "Line_Test10";
            //     } else if ($req->BU == 'B11') {
            //         $Table = "Line_Test11";
            //     } else if ($req->BU == 'B12') {
            //         $Table = "Line_Test";
            //     } else if ($req->BU == 'B13') {
            //         $Table = "Line_Test13";
            //     } else if ($req->BU == 'B14') {
            //         $Table = "Line_Test14";
            //     } else if ($req->BU == 'B15') {
            //         $Table = "Line_Test15";
            //     } else if ($req->BU == 'B16') {
            //         $Table = "Line_Test16";
            //     } else if ($req->BU == 'B17') {
            //         $Table = "Line_Test17";
            //     } else if ($req->BU == 'B18') {
            //         $Table = "Line_Test18";
            //     } else if ($req->BU == 'B19') {
            //         $Table = "Line_Test19";
            //     } else if ($req->BU == 'B20') {
            //         $Table = "Line_Test20";
            //     } else {
            //         echo json_encode(["satate" => false, "msg" => "Not requrst"]);
            //     }

            // ($req->BU == 'B3') ? "Line_Tests" :
            // $req->BU == 'B4' ? "Line_Test" : 
            // $req->BU == 'B5' ? "Line_Tests" :
            // $req->BU == 'B6' ? "Line_Test" : 
            // $req->BU == 'B7' ? "Line_Tests" :
            // $req->BU == 'B8' ? "Line_Test" : 
            // $req->BU == 'B9' ? "Line_Tests" :
            // $req->BU == 'B10' ? "Line_Test" : 
            // $req->BU == '11' ? "Line_Tests" :
            // $req->BU == 'B12' ? "Line_Test" : 
            // $req->BU == 'B13' ? "Line_Tests" :
            // $req->BU == 'B14' ? "Line_Test" : 
            // $req->BU == 'B15' ? "Line_Tests" :
            // $req->BU == 'B16' ? "Line_Test" : 
            // $req->BU == 'B17' ? "Line_Tests" :
            // $req->BU == 'B18') ? "Line_Test" : 
            // ($req->BU == 'B19' ? "Line_Testse" :
            //     "Line");
            // $sql4 = "INSERT INTO $Table VALUES ('System Test','Loading', '$req->DateTime','$req->BU');
            // ";

            // notify_message("\nงานใหม่!\nอาคาร $req->BU\nลำดับที่: $Number\n$req->Topic\nชื่อเครื่องจักร:\n$req->NameMachine\nหมายเลขเครื่องจักร:\n$req->SerialNumber\nณ แผนก: $req->Division\nเกิดอาการ: $req->Defect\nแจ้งโดย: $req->NameSupervisor\nวันที่: $req->DateTime\n\nต้องการแจ้งซ่อม\nhttps://iiot-center.sncformer.com/imss/ ");
            // echo json_encode($res);

            //     $query4 = $dbh->prepare($sql4);
            //     $query4->execute();

            //     echo json_encode(["state" => true, "msg" => "Insert successful"]);
            // }

            //!Maintenanceเพิ่มข้อมูล+แจ้งเตือนไลน์งานเสร็จ
            else if ($req->router == '/Maintenance-add-data') {

                $sql5 = "INSERT INTO T_Maintenance VALUES ('$req->Number','$req->NameMachine','$req->SerialNumber','$req->ReceiveDate','$req->Maintenance','$req->StartDate','$req->FinishDate','$req->Failear',
                '$req->Solution','$req->Expenses','$req->EnCheck','$req->Controller','$req->DateToDay','$req->Division','$req->BeforePicture','$req->AfterPicture','$req->BU');
                INSERT INTO Line_Notify VALUES ('\nอาคาร $req->BU\nงานลำดับที่: $req->Number\nเสร็จสิ้นแล้ว\n\nชื่อเครื่องจักร:\n$req->NameMachine\nหมายเลขเครื่องจักร:\n$req->SerialNumber\n\nซ่อมโดย: $req->Maintenance\nวันที่: $req->DateToDay\n\nต้องการแจ้งซ่อม\nhttps://iiot-center.sncformer.com/imss/ ','Loading','$req->DateToDay','$req->BU');
                ";

                // $res = notify_message("\nอาคาร $req->BU\nงานลำดับที่: $req->Number\nเสร็จสิ้นแล้ว\nชื่อเครื่องจักร:\n$req->NameMachine\nหมายเลขเครื่องจักร:\n$req->SerialNumber\nซ่อมโดย: $req->Maintenance\nวันที่: $req->DateToDay\n\nต้องการแจ้งซ่อม\nhttps://iiot-center.sncformer.com/imss/ ");
                $stmt = $dbh->prepare("UPDATE T_Supervisor SET Process='Finished' WHERE Number='$req->Number'");

                // echo json_encode($res);

                // $stmt->bindParam(1, $req->Process);
                // $stmt->bindParam(2, $req->Number);

                $query5 = $dbh->prepare($sql5);
                $query5->execute();
                // echo json_encode(["state" => true, "msg" => "Insert successful"]);

                // $query6 = $dbh->prepare($sql6);
                // $query6->execute();
                // echo json_encode(["state" => true, "msg" => "Insert Line Notify successful"]);

                if ($stmt->execute()) {
                    echo json_encode(["state" => true, "msg" => "Insert successful"]);
                } else {
                    echo json_encode(["state" => false, "msg" => "Insert error"]);
                }
                $dbh = null;
            }

            //!ลบข้อมูลที่ supervisor ส่งมา
            else if ($req->router == '/Delete-Data-Sup') {
                $stmt = $dbh->prepare("DELETE FROM T_Supervisor WHERE Number=? AND BU=?");
                $stmt->bindParam(1, $req->Number);
                $stmt->bindParam(2, $req->BU);
                if ($stmt->execute()) {
                    echo json_encode(["state" => true, "msg" => "Delete successful"]);
                } else {
                    echo json_encode(["state" => false, "msg" => "Delete error"]);
                }
            }

            //!mainyenance แก้ไขข้อมูล
            else if ($req->router == '/Matenance-Update') {
                $stmt = $dbh->prepare("UPDATE T_Maintenance SET NameMachine=?,SerialNumber=?,ReceiveDate=?,Maintenance=?,StartDate=?,
            FinishDate=?,Failear=?,Solution=?,Expenses=?,EnCheck=?,Controller=?,DateToDay=?,Division=? WHERE Number=? AND BU=?");

                $stmt->bindParam(1, $req->NameMachine);
                $stmt->bindParam(2, $req->SerialNumber);
                $stmt->bindParam(3, $req->ReceiveDate);
                $stmt->bindParam(4, $req->Maintenance);
                $stmt->bindParam(5, $req->StartDate);
                $stmt->bindParam(6, $req->FinishDate);
                $stmt->bindParam(7, $req->Failear);
                $stmt->bindParam(8, $req->Solution);
                $stmt->bindParam(9, $req->Expenses);
                $stmt->bindParam(10, $req->EnCheck);
                $stmt->bindParam(11, $req->Controller);
                $stmt->bindParam(12, $req->DateToDay);
                $stmt->bindParam(13, $req->Division);
                $stmt->bindParam(14, $req->Number);
                $stmt->bindParam(15, $req->BU); //เรียกตาม prepare ด้านบน
                if ($stmt->execute()) {
                    echo json_encode(["state" => true, "msg" => "Update successful"]);
                } else {
                    echo json_encode(["state" => false, "msg" => "Update error"]);
                }
                $dbh = null;
            }
        } else {
            echo json_encode(["state" => false, "msg" => "Bad request"]);
        }
    }
} catch (PDOException $e) {
    print "Error!:" . $e->getMessage() . "<br>";
    die();
}
