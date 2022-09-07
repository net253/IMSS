import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Container } from "react-bootstrap";

export default function ContentWrap({ content: Content }) {
  return (
    <div>
      <Container>
        <Nav />
        <div style={{ height: "88vh", overflow: "auto" }}>
          <Content />
        </div>
        <Footer />
      </Container>
    </div>
  );
}
