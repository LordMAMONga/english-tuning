import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

apiClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("auth_storage");
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state.token && !config.url?.includes("/oauth2/android")) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch {}
  }
  return config;
});
