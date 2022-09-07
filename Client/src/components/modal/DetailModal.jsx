import React from "react";
import { Modal, Button, FormControl, Row, Col, Form } from "react-bootstrap";

import { Selecter, TextInput } from "../InputForm";

const dataConfig = [
  {
    title: "เรื่องที่ต้องการแจ้ง (Matters to be notified) ",
    option: [
      { label: "แจ้งซ่อมเครื่องจักร", value: "fixMachine" },
      { label: "แจ้งสร้างเครื่องจักร", value: "buildMachine" },
      { label: "อื่นๆ", value: "other" },
    ],
    type: "select",
    name: "Topic",
  },
  {
    title: "แผนกที่ยื่นคำร้อง (Division)",
    option: [
      { label: "xxxx", value: "xxxx" },
      { label: "xxxxx", value: "xxxxxx" },
      { label: "อื่นๆ", value: "other" },
    ],
    type: "select",
    name: "Division",
  },

  {
    title: "ผู้ที่ต้องการยื่นคำร้อง (Requisitioner)",
    option: [
      { label: "xxxxxx", value: "xxxxx" },
      { label: "xxxxxx", value: "xxxxx" },
      { label: "xxxxxx", value: "xxx" },
      { label: "อื่นๆ", value: "other" },
    ],
    type: "select",
    name: "NameSupervisor",
  },
  {
    title: "ข้อบกพร่อง / รายละเอียด / สิ่งที่ต้องการให้ทำ (Shortcoming)",
    subTitle: "ความคิดเห็น:",
    type: "textarea",
    name: "Defect",
  },
  {
    title: "ความเร่งด่วนของงาน (Urgency of execution)",
    option: [
      { label: "xxxxxx", value: "xxxxx" },
      { label: "xxxxxx", value: "xxxxx" },
      { label: "xxxxxx", value: "xxx" },
      { label: "อื่นๆ", value: "other" },
    ],
    type: "select",
    name: "Status",
  },
];

const dataConfig2 = [
  {
    title: "ชื่อเครื่องจักร (Machine)",
    option: [
      { label: "xxxx", value: "xxxx" },
      { label: "xxxxx", value: "xxxxxx" },
      { label: "อื่นๆ", value: "other" },
    ],
    type: "select",
    name: "NameMachine",
  },
  {
    title: "หมายเลขเครื่องจักร (Serial Number)",
    option: [
      { label: "123", value: "12" },
      { label: "625", value: "625" },
      { label: "อื่นๆ", value: "other" },
    ],
    type: "select",
    name: "SerialNumber",
  },

  {
    title:
      "ความเห็น / ข้อแนะนำในการดำเนินการ / ถูกต้อง จากหัวหน้างาน (Recommend)",
    subTitle: "ความคิดเห็น:",
    type: "textarea",
    name: "Advice",
  },
  {
    title: " ลงชื่อผู้ยื่นคำร้อง (Requisitioner)",
    option: [
      { label: "นาย ก", value: "ก" },
      { label: "นาย ข", value: "ข" },
      { label: "นาย ค", value: "ค" },
    ],
    type: "select",
    name: "NameSupervisor",
  },
];

export default function DetailModal({ show, handleClose, infos }) {
  if (!infos) {
    return <div></div>;
  }
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียดงานซ่อม/สร้าง </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="px-5">
            <Col xs={12} className="d-flex justify-content-end mb-4">
              <p className="pt-3 pe-3 m-0">เลขที่แจ้ง </p>
              <FormControl
                className="me-3"
                type="number"
                value={infos?.Number}
                style={{ width: "150px" }}
                readOnly
              />
              <FormControl
                style={{ width: "60px" }}
                value={infos?.BU}
                readOnly
              />
            </Col>

            <Col xs={12} md={6}>
              {dataConfig.map((info, i) => (
                <React.Fragment key={i}>
                  {info.type == "select" && (
                    <Form.Group className="text-start mb-4">
                      <Form.Label>{info.title}</Form.Label>
                      <FormControl value={infos[info.name]} readOnly />
                    </Form.Group>
                  )}

                  {info.type == "textarea" && (
                    <Form.Group className="text-start mb-4">
                      <Form.Label>{info.title}</Form.Label>
                      <FormControl
                        as="textarea"
                        value={infos[info.name]}
                        readOnly
                      />
                    </Form.Group>
                  )}
                </React.Fragment>
              ))}
            </Col>

            <Col xs={12} md={6}>
              <p className="text-start mb-2">วันที่ยื่นคำร้อง (Filing Date)</p>
              <FormControl
                className="mb-4"
                value={infos.DateTime ? infos.DateTime.slice(0, 10) : ""}
                readOnly
              />

              {dataConfig2.map((info, i) => (
                <React.Fragment key={i}>
                  {info.type == "select" && (
                    <Form.Group className="text-start mb-4">
                      <Form.Label>{info.title}</Form.Label>
                      <FormControl value={infos[info.name]} readOnly />
                    </Form.Group>
                  )}

                  {info.type == "textarea" && (
                    <Form.Group className="text-start mb-4">
                      <Form.Label>{info.title}</Form.Label>
                      <FormControl
                        as="textarea"
                        value={infos[info.name]}
                        readOnly
                      />
                    </Form.Group>
                  )}
                </React.Fragment>
              ))}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
