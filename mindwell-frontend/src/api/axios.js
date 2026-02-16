import axios from "axios";

const API = axios.create({
  baseURL: "https://mindwell-project-caob.onrender.com"
});

// Add token automatically to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
