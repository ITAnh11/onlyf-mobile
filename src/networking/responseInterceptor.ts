import apiClient from './apiclient';
import * as SecureStore from 'expo-secure-store';

const setupResponseInterceptor = () => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/refresh-token/refresh-token') &&
        !originalRequest.url.includes('/auth/is-logged-in')
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');

          const res = await apiClient.get('/refresh-token/refresh-token', {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const newAccessToken = res.data.accessToken;
          console.log('New access token:', newAccessToken);
          await SecureStore.setItemAsync('accessToken', newAccessToken);

          // Gửi lại request cũ với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupResponseInterceptor;
