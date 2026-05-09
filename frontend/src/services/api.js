import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://localhost:5000";

const API = axios.create({
  baseURL: BASE_URL,
});


API.interceptors.request.use((req) => {
  const token = Cookies.get("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
