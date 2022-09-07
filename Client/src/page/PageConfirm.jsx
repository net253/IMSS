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
} from "react-bootstrap";
import { Selecter, TextInput } from "../components/InputForm";
import DetailModal from "../components/modal/DetailModal";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { dataPath2, apiPath } from "../components/Path";
import Swal from "sweetalert2";

export default function PageConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [modal, setModal] = useState([]);
  const [show, setshow] = useState(false);
  const handleClose = () => setshow(false);
  const handleOpen = () => setshow(true);
  const [check, setCheck] = useState([]);
  const [inputOther, setInputOther] = useState({});
  const [state, setState] = useState({ BeforePicture: "", AfterPicture: "" });
  const [confirmID, setConfirmID] = useState("");

  const intialVale = {
    router: "/Maintenance-add-data",
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
    BeforePicture: "",
    AfterPicture: "",
    SerialNumber: "",
    NameMachine: "",
    BU: "",
    ID: "",
  };

  // * ONCHANGE AND BASE64 FUNCTION * //
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();

      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  const handleFileInputChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    getBase64(file).then((result) => {
      setState({ ...state, [name]: result });
    });
  };
  const handleOther = (e) => {
    const { name, value } = e.target;
    setInputOther({ ...inputOther, [name]: value });
  };
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
      ...inputOther,
      ...state,
      Number: modal?.Number,
      ReceiveDate: modal?.DateTime.slice(0, 10),
      SerialNumber: modal?.SerialNumber,
      NameMachine: modal?.NameMachine,
      BU: modal?.BU,
    };

    axios
      .post(dataPath2, {
        router: "/Confirm-Employee-ID",
        Employee_ID: confirmID,
        BU: location.state.BU,
      })
      .then(({ data }) => {
        if (data.state) {
          Swal.fire({
            title: `<p class="font-thai">กำลังบันทึกข้อมูล </p><span>(Saving information)</span>`,
            html: `<p class="font-thai">กรุณารอสักครู่ ใช้เวลาไม่เกิน 5 นาที <br /> <span>(Please wait until processing completed)</span> </p>`,
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          confirmShow();

          axios.post(apiPath, formAxios).then(({ data }) => {
            if (data.state) {
              Swal.close();
              Swal.fire({
                title: data.msg,
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              });
              navigate("/table");
            }
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
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
  };

  // ! GET INITIAL INFORMATION ! //
  const getJobInfo = () => {
    axios
      .post(dataPath2, {
        router: "/Read-One",
        Number: location.state.Number,
        BU: location.state.BU,
      })
      .then(({ data }) => {
        setModal(data);
      });
  };

  //*Engineer */
  const getEnCheck = () => {
    axios
      .post(dataPath2, {
        router: "/Data-Name-Check",
        BU: location.state.BU,
        Division: modal.Division,
      })
      .then(({ data }) => {
        const EnCheck = (data.NameCheck || []).map((a) => ({
          label: a.NameConfirm,
          value: a.NameConfirm,
        }));
        setCheck(EnCheck);
      });
  };

  useEffect(() => {
    getJobInfo();
    getEnCheck();
  }, [modal.BU, modal.Division]);
  // * CHECK EMPTY INPUT * //
  const checkInput = () => {
    const {
      Maintenance,
      StartDate,
      FinishDate,
      Failear,
      Solution,
      EnCheck,
      Controller,
      DateToDay,
      Expenses,
      BeforePicture,
      AfterPicture,
    } = inputForm && state;
    if (
      Maintenance != "" &&
      StartDate != "" &&
      FinishDate != "" &&
      Failear != "" &&
      Solution != "" &&
      EnCheck != "" &&
      Controller != "" &&
      DateToDay != "" &&
      Expenses != "" &&
      BeforePicture != "" &&
      AfterPicture != ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  // ? CONFIG INPUT FORM ? //
  const dataConfig2 = [
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
  ];
  const dataConfig3 = [
    {
      title: "ข้อบกพร่อง / อาการชำรุดเสียหาย (Shortcoming)",
      subTitle: "ความคิดเห็น:",
      type: "textarea",
      name: "Failear",
    },
  ];
  const dataConfig4 = [
    {
      title: "แนวทางวิธีการแก้ไข (Solution guidelines)",
      subTitle: "ความคิดเห็น:",
      type: "textarea",
      name: "Solution",
    },
    {
      title: " ผู้ตรวจสอบ (Engineer)",
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
          <Col xs={12} md={6} className="text-lg-start text-end mb-3">
            <Button
              style={{ width: "150px" }}
              variant="secondary"
              onClick={handleOpen}
            >
              รายละเอียดงาน
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
              วันที่รับใบแจ้งซ่อม (Received Date){" "}
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
              onChange={handleChange}
              disabled
            />
            {dataConfig2.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "select" && (
                  <Selecter
                    labels={info.title}
                    options={info.option}
                    name={info.name}
                    onChange={handleChange}
                    inputForm={inputForm[info.name]}
                    otherChange={handleOther}
                  />
                )}
              </React.Fragment>
            ))}

            <p className="text-start mb-2">วันที่เริ่มทำ (Start Date)</p>
            <FormControl
              className=" mb-4 "
              type="date"
              name="StartDate"
              onChange={handleChange}
            />
            {dataConfig3.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "textarea" && (
                  <TextInput
                    title={info.title}
                    subTitle={info.subTitle}
                    name={info.name}
                    onChange={handleChange}
                  />
                )}
              </React.Fragment>
            ))}

            <p className="text-start mb-2">
              รูปก่อนซ่อม/สร้าง (Before Picture)
            </p>
            <div className="mb-4">
              <input
                type="file"
                accept="image/png, image/jpeg"
                name="BeforePicture"
                onChange={handleFileInputChange}
              />
            </div>
          </Col>

          <Col xs={12} md={6}>
            <p className="text-start mb-2"> ค่าใช้จ่าย (Expenses)</p>{" "}
            <InputGroup>
              <FormControl
                className="pt-2 mb-4 "
                type="number"
                name="Expenses"
                onChange={handleChange}
              />

              <InputGroup.Text className="pt-2 mb-4 "> บาท</InputGroup.Text>
            </InputGroup>
            <p className="text-start mb-2">วันที่ทำสำเร็จ (Finish Date)</p>
            <FormControl
              className=" mb-4 "
              type="date"
              name="FinishDate"
              onChange={handleChange}
            />
            {dataConfig4.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "textarea" && (
                  <TextInput
                    title={info.title}
                    subTitle={info.subTitle}
                    name={info.name}
                    onChange={handleChange}
                  />
                )}
              </React.Fragment>
            ))}
            {dataConfig4.map((info, i) => (
              <React.Fragment key={i}>
                {info.type == "select" && (
                  <Selecter
                    labels={info.title}
                    options={info.option}
                    name={info.name}
                    onChange={handleChange}
                    inputForm={inputForm[info.name]}
                  />
                )}
              </React.Fragment>
            ))}
            <p className="text-start mb-2">ชื่อคนซ่อม (Maintenance) </p>
            <FormControl
              className=" mb-4 "
              value={
                inputForm.Maintenance != "other"
                  ? inputForm.Maintenance
                  : inputOther.Maintenance
              }
              readOnly
            />
            <p className="text-start mb-2 mt-4"> วันที่ (Date Today)</p>
            <FormControl
              className="pt-2 mb-4 "
              type="date"
              name="DateToDay"
              onChange={handleChange}
            />
            <p className="text-start mb-2">รูปหลังซ่อม/สร้าง (After Picture)</p>
            <div>
              <input
                className=" text-start mb-2 "
                type="file"
                accept="image/png, image/jpeg"
                name="AfterPicture"
                onChange={handleFileInputChange}
              />
            </div>
          </Col>

          {/* Button */}
          <Col className="d-flex justify-content-end mb-4 mt-3">
            <Button
              className=" button me-4 text "
              variant="success"
              onClick={confirmShow}
              disabled={checkInput()}
            >
              ยืนยัน
            </Button>
            <Button variant="outline-danger" onClick={() => navigate("/table")}>
              ยกเลิก
            </Button>
          </Col>
        </Row>
      </Card>

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
