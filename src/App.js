import React, { useState, useEffect } from "react";
import { NavbarComponent } from "./components/navbar/navbar";
import { Col, Row, Container } from "react-bootstrap";
import { Profile } from "./components/profile/profile";
import { StatusUpdates } from "./components/status-updates/status-updates";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getLocalSession = () => {
    if (localStorage.getItem("user")) {
      setLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    getLocalSession();
  }, []);

  return (
    <div>
      <NavbarComponent
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        logout={logout}
        setSelectedUser={setSelectedUser}
      />
      {loggedIn && (
        <Container>
          <Row>
            <Col sm="4">
              <Profile />
            </Col>
            <Col sm="8">
              {!selectedUser ? (
                <StatusUpdates />
              ) : (
                <Profile username={selectedUser} />
              )}
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
