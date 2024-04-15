import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import "./notifications.css";

export const Notifications = ({ notifications, userClick }) => {
  return (
    <div className="notifications">
      <Container>
        <h3>Notifications</h3>

        <ListGroup>
          {notifications.map((notification, i) => {
            const { created_at, user_id } = notification;
            const date = new Date(created_at);

            return (
              <ListGroup.Item
                action="true"
                key={i}
                onClick={() => userClick(user_id)}
              >
                {notification.notification}&nbsp;&bull;&nbsp;{date.getDate()}/
                {date.getMonth() + 1}/{date.getFullYear()} {date.getHours()}:
                {date.getMinutes()}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Container>
    </div>
  );
};
