import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logo from "../image/logo2.png";

export default function NavManu() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar className="bg-nav" expand="lg">
        <Container>
          <Navbar.Brand>
            {/* <Image src={logo} className="logo" /> */}
            <Image src="./assets/logo2.4da8abf9.png" className="logo" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link onClick={() => navigate("/")} className="text-sp">
                สำหรับแจ้งซ่อม
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/table")} className="text-sp">
                สำหรับแผนกซ่อมบำรุง
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
