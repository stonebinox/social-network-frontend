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
