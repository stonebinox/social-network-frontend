import React, { useState, useEffect } from "react";
import { NavbarComponent } from "./components/navbar/navbar";
import { Col, Row, Container } from "react-bootstrap";
import { Profile } from "./components/profile/profile";
import { StatusUpdates } from "./components/status-updates/status-updates";
import { getNotifications, getUserDataById } from "./api/api";
import { Notifications } from "./components/notifications/notifications";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState(false);

  const loadNotifications = (userId) => {
    if (localStorage.getItem("user")) {
      getNotifications(userId)
        .then((response) => response.json())
        .then((data) => {
          const { data: notificationList } = data;
          setNotifications(notificationList);

          setTimeout(() => {
            loadNotifications(userId);
          }, 5000);
        })
        .catch((e) => {
          console.log(e);

          if (e.error) {
            alert(e.error);
          }
        });
    }
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
    setDisplayNotifications(false);
    setNotifications([]);
  };

  const notificationsClick = () => {
    setDisplayNotifications(true);
    setSelectedUser(null);
  };

  const userClick = (userId) => {
    if (isNaN(userId)) {
      setSelectedUser(userId);
      setDisplayNotifications(false);

      return;
    }

    getUserDataById(userId)
      .then((response) => response.json())
      .then((data) => {
        const { data: userData } = data;
        const { username } = userData;

        setSelectedUser(username);
        setDisplayNotifications(false);
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  useEffect(() => {
    getLocalSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <div>
      <NavbarComponent
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        logout={logout}
        userClick={userClick}
        notificationsCount={notifications.length}
        notificationsClick={notificationsClick}
      />
      {loggedIn && (
        <Container>
          <Row>
            <Col sm="4">
              <Profile userClick={userClick} />
            </Col>
            <Col sm="8">
              {!selectedUser && !displayNotifications ? (
                <StatusUpdates />
              ) : selectedUser ? (
                <Profile username={selectedUser} userClick={userClick} />
              ) : displayNotifications ? (
                <Notifications
                  notifications={notifications}
                  userClick={userClick}
                />
              ) : null}
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
