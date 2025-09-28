import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/passwords";

// Create axios instance
const axiosInstance = axios.create();

// Intercept every request to add token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token saved after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const createPassword = (data) => axiosInstance.post(`${API_URL}/create`, data);
const getAllPasswords = (id) => axiosInstance.get(`${API_URL}/getAll/${id}`);
const deletePassword = (id) => axiosInstance.delete(`${API_URL}/delete/${id}`);
const deleteAllPasswords = (id) => axiosInstance.delete(`${API_URL}/deleteAll/${id}`);
const updatePassword = (id, data) => axiosInstance.patch(`${API_URL}/update/${id}`, data);


const PasswordService = { createPassword, getAllPasswords, updatePassword, deletePassword, deleteAllPasswords };

export default PasswordService;
