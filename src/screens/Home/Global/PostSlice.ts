import { createSlice } from '@reduxjs/toolkit';
import { PostItem } from '../components/Type';

const postSlice = createSlice({
  name: 'PostManager',
  initialState: {
    danhSach: [] as PostItem[] , //  Đây là mảng toàn cục bạn muốn
    hasdmore: false, // Biến này dùng để kiểm tra xem có thêm nhiều hơn hay không
    nextCursor: null, // Biến này dùng để lưu trữ con trỏ tiếp theo
  },
  reducers: {
    setHasMore: (state, action) => {
      state.hasdmore = action.payload; // Cập nhật biến hasMore
    },
    setNextCursor: (state, action) => {
      state.nextCursor = action.payload; // Cập nhật biến nextCursor
    },
    addPosts: (state, action) => {
      state.danhSach.push(...action.payload)  // Cập nhật danh sách bài post
    },
    clearPosts: (state) => {
      state.danhSach = []; // Xóa danh sách bài post
    },
    addPost: (state, action) => {
      state.danhSach.unshift(action.payload); // Thêm bài post mới vào đầu danh sách
    },
    removePost: (state, action) => {
      state.danhSach = state.danhSach.filter((post) => post.id !== action.payload); // Xóa bài post theo ID
    }
  }
});

export const {setHasMore, setNextCursor, clearPosts, addPost, removePost, addPosts} = postSlice.actions;
export default postSlice.reducer;