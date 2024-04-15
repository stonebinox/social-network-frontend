import React, { useState, useEffect } from "react";
import { NavbarComponent } from "./components/navbar";
import { Col, Row } from "react-bootstrap";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const getLocalSession = () => {
    if (localStorage.getItem("user")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    getLocalSession();
  }, []);

  return (
    <div>
      <NavbarComponent setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
      <Row>
        <Col xs="auto">hello</Col>
        <Col xs="auto">main</Col>
      </Row>
    </div>
  );
}

export default App;
