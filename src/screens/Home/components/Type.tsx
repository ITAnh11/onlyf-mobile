  // Định nghĩa kiểu dữ liệu cho profile
  export type Profile = {
    name: string;
    username: string;
    urlPublicAvatar: string | null;
  };

  // Kiểu dữ liệu cho friend
  export type Friend = {
    id: number;
    profile: Profile;
  };

  // Kiểu dữ liệu cho phần tử trong danh sách friendList
  export type FriendItem = {
    id: number;
    friend: Friend;
  };

  export type UserProfile = {
    name: string;
    urlPublicAvatar: string;
  };

  export type User = {
    id: string;
    profile: UserProfile;
  };

  //định nghĩa một bài post
  export type PostItem = {
    id: string;
    caption: string;
    urlPublicImage: string;
    createdAt: string;
    user: User;
  };