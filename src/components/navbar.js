import React, { useState } from "react";
import { Button, Col, Container, Form, Navbar, Row } from "react-bootstrap";
import { login } from "../api/api";

export const NavbarComponent = ({ setLoggedIn, loggedIn }) => {
  const [username, setUsername] = useState("");

  const loginClick = () => {
    if (username.trim() === "") return;

    login(username)
      .then((response) => response.json())
      .then((data) => {
        const { data: responseData } = data;
        localStorage.setItem("user", JSON.stringify(responseData));
        setLoggedIn(true);
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Brand href="#">KOR</Navbar.Brand>

        {!loggedIn && (
          <Form inline="true">
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="username"
                  className="mr-sm-2"
                  onChange={(e) => setUsername(e.currentTarget.value)}
                />
              </Col>
              <Col xs="auto">
                <Button type="button" onClick={loginClick}>
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </Navbar>
  );
};
