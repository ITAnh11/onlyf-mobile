// // networking/responseInterceptor.ts
// import apiClient from "./apiclient";

// apiClient.interceptors.response.use(
//   (response) => response, // Trả về response nếu thành công
//   async (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         console.log("Token hết hạn, cần đăng nhập lại!");
//       }
//       if (error.response.status === 500) {
//         console.log("Lỗi server, vui lòng thử lại sau!");
//       }
//     }
//     return Promise.reject(error);
//   }
// );
