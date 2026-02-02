import axios from "axios";

const api = axios.create({
  baseURL: "https://bsfdfcbackend.onrender.com/",
  withCredentials: true, // sending cookies always
});

export default api;
