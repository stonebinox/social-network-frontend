import React, { useState, useEffect } from "react";
import { NavbarComponent } from "./components/navbar/navbar";
import { Col, Row, Container } from "react-bootstrap";
import { Profile } from "./components/profile/profile";
import { StatusUpdates } from "./components/status-updates/status-updates";
import { getNotifications } from "./api/api";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = (userId) => {
    getNotifications(userId)
      .then((response) => response.json())
      .then((data) => {
        const { data: notificationList } = data;
        setNotifications(notificationList);
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  const getLocalSession = () => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      const { id } = user;
      loadNotifications(id);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavbarComponent
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        logout={logout}
        setSelectedUser={setSelectedUser}
        notificationsCount={notifications.length}
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
