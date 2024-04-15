const base = "http://localhost:3001";

export const login = (username) =>
  fetch(`${base}/user?username=${username}`, {
    method: "POST",
  });

export const getUserData = (username) =>
  fetch(`${base}/user?username=${username}`);

export const getUserFriends = (userId) =>
  fetch(`${base}/friends?user_id=${userId}`);

export const getUserDataById = (userId) =>
  fetch(`${base}/user/id?id=${userId}`);

export const getStatusUpdates = (userId) =>
  fetch(`${base}/status/user?user_id=${userId}`);

export const postStatusUpdate = (userId, description) =>
  fetch(
    `${base}/status?user_id=${userId}&description=${encodeURI(description)}`,
    {
      method: "POST",
    }
  );

export const searchUsers = (search) =>
  fetch(`${base}/users?search=${encodeURI(search)}`);

export const getFriendship = (userId, friendId) =>
  fetch(`${base}/friendship?user_id=${userId}&friend_id=${friendId}`);

export const sendRequest = (userId, friendId) =>
  fetch(`${base}/friend?user_id=${userId}&friend_id=${friendId}`, {
    method: "POST",
  });
