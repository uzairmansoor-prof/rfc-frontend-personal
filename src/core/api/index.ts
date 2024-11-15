import axios from "axios";
import { API_BASE_PATH } from "../constants/env-constants";

export const refreshAuthToken = async () => {
  try {
    const response = await axios.get(`${API_BASE_PATH}/auth/access-token`, {
      withCredentials: true,
    });

    console.log({ response });
    if (response.data?.success) {
      return response?.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: API_BASE_PATH, // Your API base URL
  withCredentials: true, // Include credentials (cookies) in requests
});

// Request interceptor to attach the access token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    config.responseType = "blob";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token expiration (401)
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response as is if successful
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the response status is 401 and we haven't tried to refresh the token yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Flag to prevent infinite retry loop

      try {
        // Attempt to refresh the token using your custom refresh logic
        const refreshTokenResult = await refreshAuthToken(); // Call your token refresh function
        if (refreshTokenResult?.success) {
          console.log({ refreshTokenResult });

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } else {
          console.log("logot here");
          // store.dispatch(authActions.clearAuth());
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle token refresh failure (e.g., logout, redirect to login, etc.)
      }
    }

    // If the error is not 401, or token refresh failed, reject the promise
    return Promise.reject(error);
  },
);

export default axiosInstance;
