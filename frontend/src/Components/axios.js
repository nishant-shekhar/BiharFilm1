import axios from "axios";

const api = axios.create({
  baseURL: "https://film.bihar.gov.in",
  withCredentials: true, // sending cookies always
});

export default api;
