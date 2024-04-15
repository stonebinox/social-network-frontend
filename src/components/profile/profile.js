import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import { getUserData, getUserDataById, getUserFriends } from "../../api/api";
import "./profile.css";

export const Profile = ({ username = null }) => {
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);

  const getLoggedInUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setProfile(user);
  };

  const getUser = (passedUsername) => {
    getUserData(passedUsername)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
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
        <h6>Friends ({friends.length})</h6>
        <ul>
          {friends.map((friend, i) => (
            <li key={i}>
              <a href="#profile">{friend.data.username}</a>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
};
