import React, { useState, useEffect } from "react";
import {
  Card,
  FormControl,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Modal,
  Image,
} from "react-bootstrap";
import { Selecter, TextInput } from "../components/InputForm";
import DetailModal from "../components/modal/DetailModal";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { dataPath2, apiPath } from "../components/Path";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import { RiFileExcel2Line } from "react-icons/ri";
const headers = [
  { label: "เลขที่รับ", key: "Number" },
  { label: "เครื่องจักร (Machine)", key: "NameMachine" },
  { label: "หมายเลขเครื่องจักร (SerialNumber)", key: "SerialNumber" },
  { label: "วันที่รับใบแจ้งซ่อม (Received Date)", key: "DateTime" },
  { label: " ผู้ยื่นคำร้อง (Supervisor)", key: "NameSupervisor" },
  { label: " ผู้รับใบแจ้งซ่อม (Maintenance)", key: "Maintenance" },
  { label: " วันที่เริ่มทำ (Start Date)", key: "StartDate" },
  { label: " วันที่ทำสำเร็จ (Finish Date)", key: "FinishDate" },
  { label: " ข้อบกพร่อง / อาการชำรุดเสียหาย (Failear)", key: "Failear" },
  { label: " แนวทางวิธีการแก้ไข (Solution)", key: "Solution" },
  { label: "ค่าใช้จ่าย (Expenses)", key: "Expenses" },
  { label: "ผู้ตรวจสอบ (Engineer) ", key: "EnCheck" },
  { label: "ผู้ควบคุม (Controller)", key: "Controller" },
  { label: "หน่วยงาน (Division)", key: "Division" },
];
export default function PageConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [modal, setModal] = useState();
  const [show, setshow] = useState(false);
  const handleClose = () => setshow(false);
  const handleOpen = () => setshow(true);

  const [check, setCheck] = useState([]);
  const [inputOther, setInputOther] = useState({});
  const [confirmID, setConfirmID] = useState("");
  const [excel, setExcel] = useState([]);

  const intialVale = {
    router: "/Matenance-Update",
    Number: "",
    ReceiveDate: "",
    Maintenance: "",
    StartDate: "",
    FinishDate: "",
    Failear: "",
    Solution: "",
    Expenses: "",
    EnCheck: "",
    Controller: "",
    DateToDay: "",
    Division: "",
    SerialNumber: "",
    NameMachine: "",
    BU: "",
    ID: "",
  };

  // * ONCHANGE FUNCTION * //
  const [state, setState] = useState({ BeforePicture: "", AfterPicture: "" });
  // const handleOther = (e) => {
  //   const { name, value } = e.target;
  //   setInputOther({ ...inputOther, [name]: value });
  // };
  const [inputForm, setInputForm] = useState(intialVale);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputForm({ ...inputForm, [name]: value });
  };

  // * CONFIRM FUNCTION * //
  const [confirm, setconfirm] = useState(false);
  const confirmShow = () => setconfirm(!confirm);
  const handleConfirm = () => {
    const formAxios = {
      ...inputForm,
      // ...inputOther,
      // Number: modal?.Number,
      // ReceiveDate: modal?.DateTime.split(" ")[0],
      // SerialNumber: modal?.SerialNumber,
      // NameMachine: modal?.NameMachine,
    };

    axios
      .post(dataPath2, {
        router: "/Confirm-Employee-ID",
        Employee_ID: confirmID,
        BU: location.state.BU,
      })
      .then(({ data }) => {
        if (data.state) {
          confirmShow();
          axios
            .post(apiPath, formAxios)
            .then(({ data }) => {
              if (data.state) {
                Swal.fire({
                  title: data.msg,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
            })
            .catch(() => {
              Swal.fire({
                title: "Error",
                icon: "error",
                showConfirmButton: false,
                timer: 3000,
              });
            });
        }
      })
      .catch(() => {
        Swal.fire({
          title: "Check your password",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  // ! GET INITIAL INFORMATION ! //
  const getJobInfo = () => {
    axios
      .post(dataPath2, {
        router: "/Read-Match",
        Number: location.state.Number,
        BU: location.state.BU,
      })
      .then(({ data }) => {
        // console.log(data);
        setInputForm({ ...inputForm, ...data });
        setModal(data);
        setState(data);
        setExcel([data]);
      });
  };
  useEffect(() => {
    getJobInfo();
  }, []);

  // * DOWNLOAD CSV FUNCTION * //
  const checkDownload = () => {
    Swal.fire({
      title: "Request password",
      showCancelButton: true,
      input: "password",
      inputPlaceholder: "Enter your password",
    }).then((data) => {
      if (data.isConfirmed) {
        if (data.value == "iiot-center") {
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
        }
      }
    });
  };

  // ? CONFIG INPUT FORM ? //
  const dataConfig2 = [
    {
      title: "ข้อบกพร่อง / อาการชำรุดเสียหาย (Shortcoming)",
      subTitle: "ความคิดเห็น:",
      type: "textarea",
      name: "Failear",
    },

    {
      title: "ผู้ตรวจสอบ (Engineer)",
      option: [
        { label: "กรุณาเลือกผู้ตรวจสอบ", value: "" },
        ...check,
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "EnCheck",
    },
    {
      title: "ผู้ควบคุม (Controller)",
      option: [
        { label: "กรุณาเลือกผู้ควบคุม", value: "" },
        { label: "นายประดุงค์ เชื้อสามารถ", value: "นายประดุงค์ เชื้อสามารถ" },
        { label: "นายพิเชษฐ์ นางหงษ์", value: "นายพิเชษฐ์ นางหงษ์" },
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "Controller",
    },
  ];
  const dataConfig3 = [
    {
      title: "ผู้รับใบแจ้งซ่อม (Receiver)",
      option: [
        { label: "กรุณาเลือกชื่อผู้รับใบแจ้งซ่อม", value: "" },
        { label: "นายอาทิตย์ ทองศรี", value: "นายอาทิตย์ ทองศรี" },
        { label: "นายอภิสิทธิ์ สายศรี", value: "นายอภิสิทธิ์ สายศรี" },
        { label: "นายพิเชษฐ์ นางหงษ์", value: "นายพิเชษฐ์ นางหงษ์" },
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "Maintenance",
    },

    {
      title: "แนวทางวิธีการแก้ไข (Solution guidelines)",
      subTitle: "ความคิดเห็น:",
      type: "textarea",
      name: "Solution",
    },
  ];
  const dataConfig4 = [
    {
      title: "หน่วยงาน (Division)",
      option: [
        { label: "กรุณาเลือกหน่วยงาน", value: "" },
        { label: "PIPE", value: "PIPE" },
        { label: "PIPE-KIT", value: "PIPE-KIT" },
        { label: "COMPART", value: "COMPART" },
        { label: "COOLING", value: "COOLING" },
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "Division",
    },
  ];

  return (
    <div>
      <Card style={{ border: "none" }} className="card-body">
        <Card.Title className="text-center">
          <font size="4">
            แจ้งซ่อม / สร้าง แผนกซ่อมบำรุง (Maintenance requisition form) <br />{" "}
            สำหรับแผนกซ่อมบำรุง (For Maintenance Section)
          </font>
        </Card.Title>
        <Row className="px-5">
          <Col xs={12} md={6} className="text-lg-start text-end mb-3 ">
            <Button
              className="mb-2"
              style={{ width: "150px" }}
              variant="secondary"
              onClick={handleOpen}
            >
              รายละเอียดงาน
            </Button>
            <Button
              // style={{ width: "50px" }}
              className="excel-box1 mb-2"
              variant="outline-success"
              size="sx"
              onClick={checkDownload}
            >
              <RiFileExcel2Line className="icon" />
            </Button>
          </Col>

          <Col xs={12} md={6} className="d-flex justify-content-end mb-3">
            <p className="pt-3 pe-3 m-0" style={{ minWidth: "60" }}>
              เลขที่รับ{" "}
            </p>
            <FormControl
              style={{ width: "110px" }}
              value={modal?.Number ? modal.Number : ""}
              className="me-3"
              disabled
            />
            <FormControl
              style={{ width: "60px" }}
              value={modal?.BU ? modal.BU : ""}
              disabled
            />
          </Col>
          <Col xs={12} md={6}>
            <p className="text-start mb-2">ชื่อเครื่องจักร (Machine)</p>
            <FormControl
              className=" mb-4 "
              value={modal?.NameMachine ? modal.NameMachine : ""}
              name="NameMachine"
              onChange={handleChange}
              disabled
            />
            <p className="text-start mb-2">
              หมายเลขเครื่องจักร (Serial Number)
            </p>
            <FormControl
              className=" mb-4 "
              value={modal?.SerialNumber ? modal.SerialNumber : ""}
              onChange={handleChange}
              disabled
            />
            <p className="text-start mb-2">
              วันที่รับใบแจ้งซ่อม (Received Date)
            </p>
            <FormControl
              className=" mb-4 "
              type="date"
              value={modal?.DateTime ? modal.DateTime.slice(0, 10) : ""}
              name="ReceiveDate"
              onChange={handleChange}
              disabled
            />
            <p className="text-start mb-2">หน่วยงาน (Division)</p>
            <FormControl
              className=" mb-4 "
              value={modal?.Division ? modal.Division : ""}
              disabled
            />
            <p className="text-start mb-2"> ผู้รับใบแจ้งซ่อม (Receiver)</p>
            <FormControl
              className=" mb-4 "
              value={modal?.Maintenance ? modal.Maintenance : ""}
              onChange={handleChange}
              disabled
            />
            <p className="text-start mb-2">วันที่เริ่มทำ (Start Date)</p>
            <FormControl
              className=" mb-4 "
              type="date"
              name="StartDate"
              onChange={handleChange}
              value={
                inputForm?.StartDate ? inputForm.StartDate.slice(0, 10) : ""
              }
            />
            {dataConfig2.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "textarea" && (
                  <TextInput
                    title={info.title}
                    subTitle={info.subTitle}
                    name={info.name}
                    onChange={handleChange}
                    value={inputForm?.[info.name]}
                  />
                )}
              </React.Fragment>
            ))}
            <p className="text-start mb-2">
              รูปก่อนการซ่อม/สร้าง (Before Picture)
            </p>
            <Image src={state.BeforePicture} width="300px" height="250px" />
          </Col>

          <Col xs={12} md={6}>
            <p className="text-start mb-2"> ค่าใช้จ่าย (Expenses)</p>{" "}
            <InputGroup>
              <FormControl
                className="pt-2 mb-4 "
                type="number"
                name="Expenses"
                onChange={handleChange}
                value={inputForm?.Expenses}
              />
              <InputGroup.Text className="pt-2 mb-4 ">บาท</InputGroup.Text>
            </InputGroup>
            <p className="text-start mb-2">วันที่ทำสำเร็จ (Finish Date)</p>
            <FormControl
              className=" mb-4 "
              type="date"
              name="FinishDate"
              onChange={handleChange}
              value={
                inputForm?.FinishDate ? inputForm.FinishDate.slice(0, 10) : ""
              }
            />
            {dataConfig3.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "textarea" && (
                  <TextInput
                    title={info.title}
                    subTitle={info.subTitle}
                    name={info.name}
                    value={inputForm?.[info.name]}
                    onChange={handleChange}
                  />
                )}
              </React.Fragment>
            ))}
            <p className="text-start mb-2"> ผู้ตรวจสอบ (Engineer)</p>
            <FormControl
              className=" mb-4 "
              value={modal?.EnCheck ? modal.EnCheck : ""}
              onChange={handleChange}
              disabled
            />
            <p className="text-start mb-2"> ผู้ควบคุม (Controller)</p>
            <FormControl
              className=" mb-4 "
              value={modal?.Controller ? modal.Controller : ""}
              onChange={handleChange}
              disabled
            />
            <p className="text-start mb-2">ชื่อคนซ่อม (Maintenance)</p>
            <FormControl
              className=" mb-4 "
              value={modal?.Maintenance ? modal.Maintenance : ""}
              disabled
            />
            <p className="text-start mb-2 mt-4"> วันที่ (Date Today)</p>
            <FormControl
              className="pt-2 mb-4 "
              type="date"
              name="DateToDay"
              onChange={handleChange}
              value={
                inputForm?.DateToDay ? inputForm.DateToDay.slice(0, 10) : ""
              }
            />
            <p className="text-start mb-2">
              รูปหลังจากซ่อม/สร้าง (After Picture)
            </p>
            <Image src={state.AfterPicture} width="300px" height="250px" />
          </Col>

          {/* Button */}
          <Col className="d-flex justify-content-end mb-4 mt-3">
            <Button
              className=" button me-4 text text-sp"
              variant="success"
              onClick={confirmShow}
            >
              ยืนยัน
            </Button>

            <Button variant="outline-danger" onClick={() => navigate("/table")}>
              ยกเลิก
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Export CSV */}
      <div style={{ display: "none" }}>
        <CSVLink
          headers={headers}
          data={excel}
          filename="Report.csv"
          id="download"
        />
      </div>

      <Modal show={confirm} size="xs" centered>
        <Modal.Header closeButton onClick={confirmShow}>
          <Modal.Title>กรอกรหัสยืนยัน</Modal.Title>
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
            onClick={handleConfirm}
          >
            ยืนยัน
          </Button>
          <Button variant="outline-danger" onClick={confirmShow}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

      <DetailModal show={show} handleClose={handleClose} infos={modal} />
    </div>
  );
}
