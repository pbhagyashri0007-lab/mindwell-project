import axios from "axios";

const API = axios.create({
  baseURL: "https://mindwell-project-caob.onrender.com/api",
});

export default API;
