// networking/UserApi.ts
import { API_URL } from "../constants/config.constants";
import apiClient from "./apiclient";

const UserApi = {
  // API lấy danh sách người dùng
  getUsers: async () => {
    try {
      const response = await apiClient.get(API_URL.USERS);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      return [];
    }
  },

  // API đăng nhập
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post(API_URL.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return null;
    }
  },

  //API logout
  logout: async () => {
    try {
      const response = await apiClient.delete(API_URL.LOGOUT);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      return null;
    }
  },
};

    

export default UserApi;
