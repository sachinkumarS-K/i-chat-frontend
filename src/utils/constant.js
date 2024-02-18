export const frontendUrl = "https://ichat-bj06.onrender.com/";
// export const frontendUrl = "http://localhost:8000/";

export const header = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  },
};
