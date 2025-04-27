import apiClient from "./apiclient";
import * as SecureStore from "expo-secure-store";

const setupRequestInterceptor = () => {
  apiClient.interceptors.request.use(
    async (config) => {
      if (
        !config.url?.includes("/refresh-token/refresh-token") &&
        !config.url?.includes("/auth") &&
        !config.url?.includes("/fcm-token")
      ) {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupRequestInterceptor;
