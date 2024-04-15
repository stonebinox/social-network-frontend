import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";

import {
  getFriendship,
  getUserData,
  getUserDataById,
  getUserFriends,
  sendRequest,
} from "../../api/api";
import "./profile.css";
import { StatusUpdates } from "../status-updates/status-updates";

export const Profile = ({ username = null }) => {
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [displayAddFriend, setDisplayAddFriend] = useState(false);
  const [friendData, setFriendData] = useState(null);

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

    const { status, user_id, friend_id } = friendData;

    if (status === 1 && profile.id === user_id) {
      return (
        <Button variant="success" size="sm">
          Accept friend request
        </Button>
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
        getFriendsData();
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
    } else {
      getUser(username);
    }
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
        <ul>
          {friends.map((friend, i) => (
            <li key={i}>
              <a href="#profile">{friend.data.username}</a>
            </li>
          ))}
        </ul>
        {username !== null && <StatusUpdates userId={profile.id} />}
      </Container>
    </div>
  );
};
