// src/api/axios.js

import axios from "axios";
import { useAuth } from "../store/useAuth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;

  console.log("TOKEN QUE VA AL BACKEND:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
