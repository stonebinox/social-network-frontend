import React, { useEffect, useState } from "react";
import { Button, Container, Form, ListGroup } from "react-bootstrap";

import "./status-updates.css";
import { getStatusUpdates, postStatusUpdate } from "../../api/api";

export const StatusUpdates = ({ userId = null }) => {
  const [updates, setUpdates] = useState([]);
  const [updateContent, setUpdateContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

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

  const postUpdate = () => {
    if (updateContent.trim() === "") return;

    postStatusUpdate(currentUserId, updateContent)
      .then((response) => response.json())
      .then((data) => {
        setUpdateContent("");
        getUserUpdates(currentUserId);
      })
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
      setCurrentUserId(user.id);
    } else {
      getUserUpdates(userId);
      setCurrentUserId(userId);
    }
  }, [userId]);

  return (
    <div className="status-updates">
      <Container>
        {(currentUserId === userId || userId === null) && (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Post an update</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  placeholder="Post about something you ate"
                  onChange={(e) => setUpdateContent(e.currentTarget.value)}
                  value={updateContent}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                className="flex-end"
                onClick={postUpdate}
              >
                Post
              </Button>
            </Form>
            <hr />
          </>
        )}
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
