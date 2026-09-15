import axios from "axios";

const API = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api"
  ).replace(/\/+$/, "") + "/",
});

// Add JWT automatically to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login
export const login = async (username, password) => {
  const response = await API.post("token/", {
    username,
    password,
  });

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export default API;