import React, { useEffect, useState } from "react";
import { Container, Button, ButtonGroup, ListGroup } from "react-bootstrap";

import {
  acceptRequest,
  getFriendship,
  getPendingRequests,
  getUserData,
  getUserDataById,
  getUserFriends,
  rejectRequest,
  sendRequest,
} from "../../api/api";
import "./profile.css";
import { StatusUpdates } from "../status-updates/status-updates";

export const Profile = ({ username = null, userClick }) => {
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [displayAddFriend, setDisplayAddFriend] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [pendingFriends, setPendingFriends] = useState([]);

  const getLoggedInUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setProfile(user);
  };

  const getUser = (passedUsername) => {
    getUserData(passedUsername)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data.data);
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  const getFriendsData = () => {
    getUserFriends(profile.id)
      .then((response) => response.json())
      .then((data) => {
        const { data: friends } = data;

        const promises = friends.map((friend) => {
          const friendId =
            friend.user_id === profile.id ? friend.friend_id : friend.user_id;

          return getUserDataById(friendId)
            .then((response) => response.json())
            .then((data) => data);
        });

        Promise.all(promises).then((responses) => setFriends(responses));
      });

    if (username !== null) {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      getFriendship(loggedInUser.id, profile.id)
        .then((response) => response.json())
        .then((data) => {
          const { success, data: friendship } = data;

          if (loggedInUser.id === profile.id) {
            setDisplayAddFriend(false);
            return;
          }

          if (success && friendship === null) {
            setDisplayAddFriend(true);
          } else if (success && friendship !== null) {
            setFriendData(friendship);
          }
        });
    }
  };

  const getFriendButton = () => {
    if (!friendData) return;

    const { status, user_id, friend_id, id } = friendData;

    if (status === 1 && profile.id === user_id) {
      return (
        <ButtonGroup>
          <Button variant="success" size="sm" onClick={() => acceptClick(id)}>
            Accept friend request
          </Button>
          <Button variant="danger" size="sm" onClick={() => rejectClick(id)}>
            Reject friend request
          </Button>
        </ButtonGroup>
      );
    } else if (status === 1 && profile.id === friend_id) {
      return (
        <Button variant="primary" size="sm" disabled="true">
          Awaiting confirmation
        </Button>
      );
    }

    return null;
  };

  const requestClick = () => {
    if (username === null) return;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    sendRequest(loggedInUser.id, profile.id)
      .then((response) => response.json())
      .then((data) => {
        setDisplayAddFriend(false);
        getFriendsData();
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  const acceptClick = (id) => {
    acceptRequest(id)
      .then((response) => response.json())
      .then((data) => {
        getFriendsData();
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  const rejectClick = (id) => {
    rejectRequest(id)
      .then((response) => response.json())
      .then((data) => {
        getFriendsData();
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  const getPendingRequestsData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    getPendingRequests(user?.id)
      .then((response) => response.json())
      .then((data) => {
        const { data: friends } = data;

        const promises = friends.map((friend) => {
          return getUserDataById(friend.user_id)
            .then((response) => response.json())
            .then((data) => data);
        });

        Promise.all(promises).then((responses) => setPendingFriends(responses));
      })
      .catch((e) => {
        console.log(e);

        if (e.error) {
          alert(e.error);
        }
      });
  };

  useEffect(() => {
    if (username === null) {
      getLoggedInUser();
      getPendingRequestsData();
    } else {
      getUser(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    if (profile?.id) {
      getFriendsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  if (profile === null) return null;
  const { username: profileUsername } = profile;

  return (
    <div className="profile-container">
      <Container>
        <h4>{profileUsername}</h4>
        {displayAddFriend ? (
          <Button variant="primary" size="sm" onClick={requestClick}>
            + Send friend request
          </Button>
        ) : (
          getFriendButton()
        )}
        <hr />
        <h6>Friends ({friends.length})</h6>
        <ListGroup>
          {friends.map((friend, i) => {
            return (
              <ListGroup.Item
                action="true"
                key={i}
                onClick={() => userClick(friend.data.username)}
              >
                {friend.data.username}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        {pendingFriends.length > 0 && (
          <>
            <hr />
            <h6>Pending requests</h6>
            <ListGroup>
              {pendingFriends.map((friend, i) => {
                return (
                  <ListGroup.Item
                    action="true"
                    key={i}
                    onClick={() => userClick(friend.data.username)}
                  >
                    {friend.data.username}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </>
        )}
        {username !== null && <StatusUpdates userId={profile.id} />}
      </Container>
    </div>
  );
};
