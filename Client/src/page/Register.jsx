import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, FormControl, Form, Row, Col, Button } from "react-bootstrap";
import { Selecter, TextInput } from "../components/InputForm";
import axios from "axios";
import { apiPath, dataPath2 } from "../components/Path";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  const intialVale = {
    router: "/Sup-add-data",
    ID: "",
    Number: "",
    DateTime: "",
    Topic: "",
    NameMachine: "",
    SerialNumber: "",
    Division: "",
    NameSupervisor: "",
    Defect: "",
    Advice: "",
    Status: "",
    DeadLine: "",
    Process: "",
    BU: "",
  };
  const [inputOther, setInputOther] = useState({});
  const [inputForm, setInputForm] = useState(intialVale);
  const [mcOption, setMcOption] = useState([]);
  const [serial, setSerial] = useState([]);
  const [sup, setSup] = useState([]);

  // * ONCHANGE FUNCTION * //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputForm({ ...inputForm, [name]: value });
  };
  const handleOther = (e) => {
    const { name, value } = e.target;
    setInputOther({ ...inputOther, [name]: value });
  };

  // * CONFIRM AND CANCEL FUNCTION * //
  const handleConfirm = () => {
    Swal.fire({
      title: "ต้องการบันทึกข้อมูลใช่หรือไม่",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(apiPath, { ...inputForm, ...inputOther })
          .then(({ data }) => {
            if (data.state) {
              Swal.fire({
                title: "Save Completed",
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              }).then(() => navigate("/table"));
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
  const handleCancel = () => {
    Swal.fire({
      icon: "warning",
      text: "ต้องการยกเลิกการแจ้งซ่อม / สร้างเครื่องจักรใช่หรือไม่?",
      confirmButtonText: "ยืนยัน",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
    }).then((data) => {
      if (data.isConfirmed) {
        navigate("/table");
      }
    });
  };

  // ! GET INITIAL INFORMATION ! //

  const [division, setDivision] = useState([]);

  const getBU = () => {
    const BU = inputForm.BU || "";
    const Division = inputForm.Division || "";

    axios
      .post(dataPath2, { router: "/Data-Machine-Sup", BU, Division })
      .then(({ data }) => {
        if (Division == "" && data.state) {
          const arr = data.Division.map((d) => ({
            label: d.Division,
            value: d.Division,
          }));

          // console.log(data.Division.map((d) => d.Division));
          console.log(arr);

          setDivision(arr);
        } else if (Division != "" && data.state) {
          console.log(data);
          const machineName = data.NameMachine.map((info) => ({
            label: info.NameMachine,
            value: info.NameMachine,
          }));
          const uniqueArray = machineName.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.label === value.label)
          );
          setMcOption(uniqueArray);

          const serialNumber = data.NameMachine.filter(
            (info) => info.NameMachine == inputForm.NameMachine
          ).map((info) => ({
            label: info.SerialNumber,
            value: info.SerialNumber,
          }));
          setSerial(serialNumber);
          const NameSupervisor = data.NameSup.map((info) => ({
            label: info.NameConfirm,
            value: info.NameConfirm,
          }));
          setSup(NameSupervisor);
        }
      });
  };

  useEffect(() => {
    getBU();
  }, [inputForm.BU, inputForm.Division, inputForm.NameMachine]);

  // * CHECK EMPTY INPUT * //
  const checkInput = () => {
    const {
      Topic,
      Status,
      SerialNumber,
      NameSupervisor,
      NameMachine,
      Division,
      Defect,
      Advice,
      DateTime,
      BU,
    } = inputForm;
    if (
      Topic != "" &&
      Status != "" &&
      SerialNumber != "" &&
      NameSupervisor != "" &&
      NameMachine != "" &&
      Division != "" &&
      Defect != "" &&
      Advice != "" &&
      DateTime != "" &&
      BU != ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const check = () => {
    const { BU } = inputForm;
    if (BU != "") {
      return false;
    } else {
      return true;
    }
  };

  // ? CONFIG INPUT FORM ? //
  const dataConfig0 = [
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
  const dataConfig = [
    {
      title: "แผนกที่ยื่นคำร้อง (Division)",
      option: [
        { label: "กรุณาเลือกแผนกที่ยื่นคำร้อง", value: "" },

        ...division,
      ],
      type: "select",
      name: "Division",
    },
    {
      title: "เรื่องที่ต้องการแจ้ง (Matters to be notified) ",
      option: [
        { label: "กรุณาเลือกเรื่องที่ต้องการแจ้ง", value: "" },
        { label: "แจ้งซ่อมเครื่องจักร", value: "แจ้งซ่อมเครื่องจักร" },
        { label: "แจ้งสร้างเครื่องจักร", value: "แจ้งสร้างเครื่องจักร" },
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "Topic",
    },

    {
      title: "ชื่อเครื่องจักร (Machine)",
      option: [
        { label: "กรุณาเลือกเครื่องจักร", value: "" },
        ...mcOption,
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "NameMachine",
    },
    {
      title: "หมายเลขเครื่องจักร (Serial Number)",
      option: [
        { label: "กรุณาเลือกหมายเลขเครื่องจักร", value: "" },
        ...serial,
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "SerialNumber",
    },

    {
      title: "ข้อบกพร่อง / รายละเอียด / สิ่งที่ต้องการให้ทำ (Shortcoming)",
      subTitle: "ความคิดเห็น:",
      type: "textarea",
      name: "Defect",
    },
  ];
  const dataConfig2 = [
    {
      title:
        "ความเห็น / ข้อแนะนำในการดำเนินการ / ถูกต้อง จากหัวหน้างาน (Recommend)",
      subTitle: "ความคิดเห็น:",
      type: "textarea",
      name: "Advice",
    },
    {
      title: "ผู้ที่ต้องการยื่นคำร้อง (Requisitioner)",
      option: [
        { label: "กรุณาเลือกผู้ยื่นคำร้อง", value: "" },
        ...sup,
        { label: "อื่นๆ", value: "other" },
      ],
      type: "select",
      name: "NameSupervisor",
    },

    {
      title: "ความเร่งด่วนของงาน (Urgency of execution)",
      option: [
        { label: "กรุณาเลือกความเร่งด่วนของงาน", value: "" },
        { label: "ภายใน 3 วัน", value: 3 },
        { label: "ภายใน 7 วัน", value: 7 },
        { label: "ภายใน 30 วัน", value: 30 },
      ],
      type: "select",
      name: "Status",
    },
  ];
  // console.log(inputForm);
  return (
    <div>
      <Card style={{ border: "none" }} className="card-body ">
        <Card.Body className=" text-center ">
          <Card.Title>
            <font size="4">
              แจ้งซ่อม / สร้าง แผนกซ่อมบำรุง (Maintenance requisition form){" "}
              <br /> แผนกซ่อมบำรุง (Maintenance department)
            </font>
          </Card.Title>

          <Row className="px-lg-5">
            {" "}
            <Col xs={12} md={6}></Col>
            <Col xs={12} md={6} className="d-flex justify-content-end bu mb-4 ">
              {dataConfig0.map((info, i) => (
                <React.Fragment key={i}>
                  {info.type == "select" && (
                    <Selecter
                      options={info.option}
                      name={info.name}
                      onChange={handleChange}
                      inputForm={inputForm[info.name]}
                    />
                  )}
                </React.Fragment>
              ))}
            </Col>
            <Col xs={12} md={6}>
              {dataConfig.map((info, i) => (
                <React.Fragment key={i}>
                  {info.type == "select" && (
                    <Selecter
                      labels={info.title}
                      options={info.option}
                      name={info.name}
                      onChange={handleChange}
                      inputForm={inputForm[info.name]}
                      otherChange={handleOther}
                      disabled={check()}
                    />
                  )}

                  {info.type == "textarea" && (
                    <TextInput
                      title={info.title}
                      subTitle={info.subTitle}
                      name={info.name}
                      onChange={handleChange}
                      disabled={check()}
                    />
                  )}
                </React.Fragment>
              ))}
            </Col>
            <Col xs={12} md={6}>
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
                      disabled={check()}
                    />
                  )}
                  {info.type == "textarea" && (
                    <TextInput
                      title={info.title}
                      subTitle={info.subTitle}
                      name={info.name}
                      onChange={handleChange}
                      disabled={check()}
                    />
                  )}
                </React.Fragment>
              ))}
              <p className="text-start mb-2">วันที่ยื่นคำร้อง (Filing Date)</p>
              <FormControl
                className=" mb-4 "
                type="date"
                name="DateTime"
                onChange={handleChange}
                disabled={check()}
              />
              <p className="text-start mb-2">
                ลงชื่อผู้ยื่นคำร้อง (Requisitioner)
              </p>
              <FormControl
                className=" mb-4 "
                value={
                  inputForm.NameSupervisor != "other"
                    ? inputForm.NameSupervisor
                    : inputOther.NameSupervisor
                }
                readOnly
              />
            </Col>
            {/* Button */}
            <Col className="d-flex justify-content-end mb-4">
              <Button
                className=" button me-4 text "
                variant="success"
                onClick={handleConfirm}
                disabled={checkInput()}
              >
                ยืนยัน
              </Button>
              <Button variant="outline-danger" onClick={handleCancel}>
                ยกเลิก
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
