import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Table,
  Tab,
  Tabs,
  Badge,
  FormControl,
  Modal,
  Image,
  Container,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { apiPath, dataPath2 } from "../components/Path";
import { differenceInDays, differenceInHours, format } from "date-fns";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import { Selecter } from "../components/InputForm";
import { RiFileExcel2Line } from "react-icons/ri";
const headers = [
  { label: "หมายเลขใบแจ้ง (Number.)", key: "Number" },
  { label: "เครื่องจักร (Machine)", key: "NameMachine" },
  { label: "หมายเลขเครื่องจักร (SerialNumber)", key: "SerialNumber" },
  { label: "วันที่รับใบแจ้งซ่อม (Received date)", key: "DateTime" },
  { label: "วันที่ทำสำเร็จ (Finish date)", key: "DeadLine" },
  { label: "แผนกที่ยื่นคำร้อง (Division)", key: "Division" },
];

export default function TablePage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("All-Job");
  const [information, setInformation] = useState([]);
  const [realData, setrealData] = useState([]);
  const [confirmID, setConfirmID] = useState("");
  const [division, setDivision] = useState("");
  const [inputForm, setInputForm] = useState({ Division: "", BU: "" });
  const [bu, setBU] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputForm({ ...inputForm, [name]: value });
  };

  const getDate = (endDate) => {
    let dateEnd = new Date(endDate);
    let datenow = new Date();

    // console.log(
    //   Date.parse(format(new Date(dateEnd), "dd MMM, y"))
    // );

    let diff = differenceInDays(Date.parse(dateEnd), Date.parse(datenow));
    let blink = false;
    let unit = " Days ";
    if (diff == 0) {
      diff = differenceInHours(Date.parse(dateEnd), Date.parse(datenow));
      blink = true;
      unit = " Hr. ";
    } else if (diff < 0) {
      diff = " Overdue ! ";
      unit = "";
      blink = true;
    }
    return { diff: diff + unit, blink };
  };

  // * SEARCH AND CANCEL FUNCTION * //
  const handleSearch = (e) => {
    const { value } = e.target;
    const dataFilter = realData.filter(
      (info) =>
        info?.NameMachine?.toLowerCase()?.includes(value?.toLowerCase()) ||
        info?.Number?.toLowerCase()?.includes(value?.toLowerCase())
    );
    setInformation(dataFilter);
  };
  const [confirm, setconfirm] = useState(false);
  const [number, setNumber] = useState("");

  const confirmShow = (number) => {
    setconfirm(!confirm);
    setNumber(number);
  };
  const handleCancel = () => {
    axios
      .post(dataPath2, {
        router: "/Confirm-Employee-ID",
        Employee_ID: confirmID,
        BU: inputForm.BU,
      })
      .then(({ data }) => {
        if (data.state) {
          confirmShow();
          axios
            .post(apiPath, {
              router: "/Delete-Data-Sup",
              Number: number,
              BU: inputForm.BU,
            })
            .then(({ data }) => {
              if (data.state) {
                Swal.fire({
                  title: "Delete successful",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 3000,
                });
                getBU();
              } else {
                Swal.fire({
                  title: "Error",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
            });
        }
      });
  };

  // ! GET INITIAL INFORMATION ! //

  const getBU = () => {
    const BU = inputForm.BU || "";
    axios
      .post(apiPath, { router: `/${status}`, BU })
      .then(({ data }) => {
        setBU(data);
        setInformation(data);
        setrealData(data);
      })
      .catch((err) => {
        console.error(err);
        setInformation([]);
      });
  };

  useEffect(() => {
    const initPage = setTimeout(
      () => getBU(),

      0
    );
    const timer6s = setInterval(() => getBU(), 6000);

    return () => {
      clearTimeout(initPage);
      clearInterval(timer6s);
    };
  }, [inputForm.BU, status]);

  // * DOWNLOAD CSV FUNCTION * //
  const [excelID, setExcelID] = useState("");
  const [excel, setexcel] = useState(false);
  const excelShow = () => {
    setexcel(!excel);
  };
  const checkDownload = () => {
    if (excelID == "iiot-center") {
      Swal.fire({
        icon: "success",
        title: "Download",
        showConfirmButton: false,
        timer: 3000,
      });
      document.getElementById("download").click();
    } else {
      Swal.fire({
        title: "Incorrect password",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      // }
    }
  };
  const dataConfig0 = [
    {
      option: [
        { label: "กรุณาเลือกแผนก", value: "" },
        { label: "PIPE", value: "PIPE" },
        { label: "PIPE-KIT", value: "PIPE-KIT" },
        { label: "COMPART", value: "COMPART" },
        { label: "COOLING", value: "COOLING" },
      ],
      type: "select",
      name: "Division",
    },
  ];
  const dataConfig = [
    {
      option: [
        { label: "กรุณาเลือกอาคาร", value: "" },
        { label: "อาคาร 5", value: "B5" },
        { label: "อาคาร 12", value: "B12" },
      ],
      type: "select",
      name: "BU",
    },
  ];

  return (
    <Card style={{ border: "none" }} className="bg-nav">
      <Card.Title className="text-center">
        <font size="5">
          แจ้งซ่อม / สร้าง แผนกซ่อมบำรุง <br /> (Maintenance requisition form)
        </font>
      </Card.Title>
      <Form className="d-flex ">
        <Container className="d-flex justify-content-between">
          <Form.Control
            style={{ width: "120px", height: "37px", minWidth: "20%" }}
            type="search"
            placeholder="Search Machine Name"
            onChange={handleSearch}
            className="alert-dismissible p-2 mt-4 mr-5"
          />

          {dataConfig.map((info, i) => (
            <React.Fragment key={i}>
              {info.type == "select" && (
                <Selecter
                  options={info.option}
                  name={info.name}
                  onChange={handleChange}
                  inputForm={inputForm[info.name]}
                  className="bupage  "
                />
              )}
            </React.Fragment>
          ))}
        </Container>
        <Button
          className="excel-box1  m-4  "
          variant="outline-success"
          size="sm"
          onClick={excelShow}
        >
          <RiFileExcel2Line className="icon" />
        </Button>{" "}
      </Form>

      <Tabs className="mb-2  tab1  " onSelect={(key) => setStatus(key)}>
        <Tab eventKey="All-Job" title="All Job" />
        <Tab eventKey="InProcess" title="In Process" />
        <Tab eventKey="Finished" title="Finished" />
      </Tabs>
      <div style={{ height: "74vh", overflow: "auto" }}>
        <Table className="text-align-left">
          <thead>
            <tr className="tab tab-text">
              <th>
                ลำดับ <br /> (No.)
              </th>
              <th style={{ minWidth: "120px" }}>
                หมายเลขใบแจ้ง <br />
                (Number)
              </th>
              <th style={{ minWidth: "170px" }}>
                ชื่อเครื่องจักร <br />
                (Machine)
              </th>
              <th style={{ minWidth: "150px" }}>
                หมายเลขเครื่องจักร
                <br />
                (Serial Number)
              </th>
              <th style={{ minWidth: "150px" }}>
                เวลาที่เหลือ
                <br />
                (Time Remaining)
              </th>
              <th style={{ minWidth: "250px" }}>
                วันที่รับใบแจ้ง-วันที่สำเร็จ
                <br />
                (Received date - Finish date)
              </th>
              <th style={{ minWidth: "200px" }}>
                ดำเนินการ
                <br />
                (Execute)
              </th>
            </tr>
          </thead>

          <tbody>
            {information.map((info, i) => (
              <tr key={i} className="text-align-left text1 ">
                <td>{i + 1}</td>
                <td>{info?.Number}</td>
                <td>{info?.NameMachine}</td>
                <td>{info?.SerialNumber}</td>
                <td>
                  {info.Process == "Finished" ? (
                    <Badge pill className="badge-status w-75 " bg="secondary">
                      Finished
                    </Badge>
                  ) : (
                    <Badge
                      pill
                      className={`badge-status w-75  ${
                        getDate(info?.DeadLine).blink && "blink-status"
                      }`}
                      bg={`${
                        getDate(info?.DeadLine).blink ? "danger" : "success"
                      }`}
                    >
                      {getDate(info?.DeadLine).diff}
                    </Badge>
                  )}
                </td>
                <td>
                  {" "}
                  {info?.DateTime?.slice(0, 10)} -{" "}
                  {info?.DeadLine?.slice(0, 10)}
                </td>
                <td style={{ minWidth: "200px" }}>
                  {info.Process == "Finished" ? (
                    <Button
                      variant="secondary"
                      className="button-item background-cancel me-2 text1"
                      onClick={() =>
                        navigate("/edit", {
                          state: { Number: info.Number, BU: info.BU },
                        })
                      }
                      size="sm"
                    >
                      แก้ไข
                    </Button>
                  ) : (
                    <React.Fragment>
                      <Button
                        variant="success"
                        className="button-item background-confirm me-2 text1"
                        onClick={() =>
                          navigate("/confirm", {
                            state: { Number: info.Number, BU: info.BU },
                          })
                        }
                        size="sm"
                      >
                        ยืนยัน
                      </Button>
                      <Button
                        variant="danger"
                        className="button-item background-cancel me-2 text1"
                        size="sm"
                        onClick={() => confirmShow(info.Number, info.BU)}
                      >
                        ยกเลิก
                      </Button>
                    </React.Fragment>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div style={{ display: "none" }}>
        <CSVLink
          headers={headers}
          data={information.filter((info) => info.Division == division)}
          filename="Report.csv"
          id="download"
        />
      </div>
      {/* cencle */}
      <Modal show={confirm} size="xs" centered>
        <Modal.Header closeButton onClick={confirmShow}>
          <Modal.Title>กรอกรหัสเพื่อยกเลิก</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>รหัสพนักงาน</Form.Label>
              <Form.Control
                onChange={({ target: { value: id } }) => setConfirmID(id)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className=" button me-4 text "
            variant="info"
            onClick={handleCancel}
          >
            ยืนยัน
          </Button>
          <Button variant="outline-danger" onClick={confirmShow}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Export excel */}
      <Modal show={excel} size="xs" centered>
        <Modal.Header closeButton onClick={excelShow}>
          <Modal.Title>Export excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {dataConfig0.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "select" && (
                  <Selecter
                    options={info.option}
                    name={info.name}
                    otherChange={handleChange}
                    inputForm={inputForm[info.name]}
                    onChange={({ target: { value: id } }) => setDivision(id)}
                  />
                )}
              </React.Fragment>
            ))}

            <Form.Group className="mb-5 mt-3">
              <Form.Label>Request password</Form.Label>
              <Form.Control
                type="password"
                onChange={({ target: { value: id } }) => setExcelID(id)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className=" button me-4 text "
            variant="info"
            onClick={checkDownload}
          >
            ยืนยัน
          </Button>
          <Button variant="outline-danger" onClick={excelShow}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
