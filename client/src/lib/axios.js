import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_BASE_URL
      : "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const clerkSession = window.Clerk?.session;

      if (clerkSession) {
        const token = await clerkSession.getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn("Failed to attach Clerk token:", err.message);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data?.retryAfter;
      const minutes = Math.ceil(retryAfter / 60);

      toast.error(
        `Too many attempts. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
        { duration: retryAfter * 1000 },
      );

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
