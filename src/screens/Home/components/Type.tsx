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

  export type ReactItem = {
    count: number;        
    type: string;          
  };

  //định nghĩa một bài post
  export type PostItem = {
    id: string;
    caption: string;
    type: 'image' | 'video';
    urlPublicImage: string;
    urlPublicVideo?: string;
    hlsUrlVideo?: string;
    createdAt: string;
    user: User;
    reacts: ReactItem[];
  };