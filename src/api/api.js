const base = "http://localhost:3001";

export const login = (username) =>
  fetch(`${base}/user?username=${username}`, {
    method: "POST",
  });
