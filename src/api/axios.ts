import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach token to every request if it exists in localStorage
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("taskduty_user");
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
