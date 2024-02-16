export const header = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  },
};
