import axios from "axios";
import { useAuthStore } from "@/store/authStore";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return axios(original);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const newToken = await useAuthStore.getState().refreshAccessToken();
        if (newToken) {
          processQueue(null, newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return axios(original);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const currentSearch = window.location.search;

          const authPages = ["/login", "/signup", "/reset-password"];
          const isOnAuthPage = authPages.some((page) =>
            currentPath.startsWith(page)
          );

          if (!isOnAuthPage) {
            const currentUrl = currentPath + currentSearch;
            useAuthStore.getState().setRedirectUrl(currentUrl);

            const redirectParam = encodeURIComponent(currentUrl);
            const loginUrl = `/login?redirect=${redirectParam}`;

            useAuthStore.getState().logout(false);
            window.location.href = loginUrl;
          } else {
            useAuthStore.getState().logout(false);
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
