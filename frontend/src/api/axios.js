// axios.js
import axios from "axios";

// ✅ Create global axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Auth API functions
export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await API.post("/auth/login", userData);
  return res.data;
};

export default API;
