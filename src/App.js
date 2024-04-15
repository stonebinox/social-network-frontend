import React, { useState, useEffect } from "react";
import { NavbarComponent } from "./components/navbar/navbar";
import { Col, Row } from "react-bootstrap";
import { Profile } from "./components/profile/profile";
import { StatusUpdates } from "./components/status-updates/status-updates";

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
      {loggedIn && (
        <Row>
          <Col sm="4">
            <Profile />
          </Col>
          <Col sm="8">
            <StatusUpdates />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default App;
