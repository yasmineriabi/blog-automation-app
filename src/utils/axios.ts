import axios from "axios";
import useAuthStore from "../store/auth/index";
import { HOST_API } from "../config/index";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // Extract error message
    let errorMessage = "Something went wrong";
    if (error.response && error.response.data) {
      if (typeof error.response.data.message === "string") {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      }
    }

    if ([401, 403].includes(error.response?.status)) {
      useAuthStore.getState().logout();
    }

    // Reject the promise with the error message
    return Promise.reject({ message: errorMessage });
  }
);

export default axiosInstance;
