import React, { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

import "./status-updates.css";
import { getStatusUpdates } from "../../api/api";

export const StatusUpdates = ({ userId = null }) => {
  const [updates, setUpdates] = useState([]);

  const getUserUpdates = (id) => {
    getStatusUpdates(id)
      .then((response) => response.json())
      .then((data) => setUpdates(data.data))
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  useEffect(() => {
    if (userId === null) {
      const user = JSON.parse(localStorage.getItem("user"));
      getUserUpdates(user.id);
    } else {
      getUserUpdates(userId);
    }
  }, [userId]);

  return (
    <div className="status-updates">
      <Container>
        <h5>Status updates ({updates.length})</h5>
        <ListGroup>
          {updates.map((update, i) => {
            const date = new Date(update.created_at);

            return (
              <ListGroup.Item key={i}>
                <div className="fw-bold">{update.description}</div>
                <div>
                  Posted on {date.getDate()}/{date.getMonth() + 1}/
                  {date.getFullYear()} at {date.getHours()}:{date.getMinutes()}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Container>
    </div>
  );
};
