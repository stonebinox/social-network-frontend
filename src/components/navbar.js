import React from "react";
import { Button, Col, Container, Form, Navbar, Row } from "react-bootstrap";

export const NavbarComponent = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Brand href="#">KOR</Navbar.Brand>

        <Form inline="true">
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="username"
                className="mr-sm-2"
              />
            </Col>
            <Col xs="auto">
              <Button type="button">Login</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Navbar>
  );
};
