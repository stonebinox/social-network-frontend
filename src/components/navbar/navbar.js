import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Navbar,
  Row,
  ListGroup,
} from "react-bootstrap";
import { login, searchUsers } from "../../api/api";
import "./navbar.css";

export const NavbarComponent = ({ setLoggedIn, loggedIn, logout }) => {
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const searchForUsers = (text) => {
    searchUsers(text)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.data);
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }

    searchForUsers(search);
  }, [search]);

  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Brand href="#">KOR</Navbar.Brand>

        {!loggedIn ? (
          <Form inline="true" onSubmit={(e) => e.preventDefault()}>
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
        ) : (
          <>
            <Form inline="true" onSubmit={(e) => e.preventDefault()}>
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="search"
                    placeholder="search for users"
                    className="mr-sm-2"
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                  />
                  <div className="search-container">
                    <ListGroup>
                      {searchResults.map((result, i) => (
                        <ListGroup.Item key={i} action="true">
                          {result.username}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Col>
                <Col xs="auto">
                  <Button type="button" variant="primary">
                    Search
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button type="button" variant="secondary" onClick={logout}>
                    Log out
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        )}
      </Container>
    </Navbar>
  );
};
