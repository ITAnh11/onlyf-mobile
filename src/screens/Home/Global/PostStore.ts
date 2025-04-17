import { configureStore } from '@reduxjs/toolkit';
import postReducer from './PostSlice'; // Import reducer từ PostSlice

const PostStore = configureStore({
  reducer: {
    postManager: postReducer, // Tích hợp PostOfFriendSlice vào store
  },
});

// Export các kiểu dữ liệu để sử dụng trong ứng dụng
export type RootState = ReturnType<typeof PostStore.getState>;
export type AppDispatch = typeof PostStore.dispatch;

export default PostStore;