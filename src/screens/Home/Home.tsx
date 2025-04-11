import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Button, FlatList, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { styles } from './styles';
import TokenService from '../../services/token.service';
import apiClient from '../../networking/apiclient';
import CustomCamera from '../../components/camera'; // Ensure this file exists in the specified path
import ProfileApi from '../../networking/profile.api';
import Posting from './components/Posting';
import { useCameraPermissions } from 'expo-camera';
import { useMediaLibraryPermissions } from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Global/PostStore';
import { addPost, addPosts, clearPosts, setHasMore, setNextCursor } from './Global/PostSlice';
import PostView from './components/PostView';
import ProfileService from '../../services/profile.service';


type Props = {
  navigation: NavigationProp<any>;
};

const Home: React.FC<Props> = ({ navigation }) => {  
  const [compressedUri, setCompressedUri] = useState<string | null>(null); 

  const avatar = ProfileService.getAvatar(); // Lấy avatar từ ProfileService
  // State để theo dõi trạng thái quyền
  const [permission, requestPermission] = useCameraPermissions();
  const [permission_library, requestPermission_library] = useMediaLibraryPermissions();
  const [permissionsGranted, setPermissionsGranted] = useState(false); // State để theo dõi trạng thái quyền


  // State để theo dõi số lượng các bài post
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch(); // Khởi tạo dispatch từ Redux
  const danhSach = useSelector((state: RootState) => state.postManager.danhSach);
  const nextCursor = useSelector((state: RootState) => state.postManager.nextCursor);
  const hasMore = useSelector((state: RootState) => state.postManager.hasdmore);
  
  
  //useEffect để thêm home vào data array khi component mount
  useEffect(() => {
    dispatch(addPost({ id: 'home', caption: 'Home', urlPublicImage: '', createdAt: '', user: { id: '', profile: { name: '', urlPublicAvatar: '' } } })); // Thêm home vào danh sách bài post
  }, []);

  useEffect(() => {
    console.log("danhSach đã thay đổi:", danhSach, "\n");
  }, [danhSach]);


  //useEffect để khỏi tạo các bài post đầu tiên
  useEffect(() => {
    const fetchCards = async () => {
      if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
      setLoading(true); // Bắt đầu trạng thái tải
      const accessToken = await TokenService.getAccessToken();
      try {
        const response = await apiClient.get(`/post/get-posts/`, {
          params: {
            limit: 4, // Số lượng bài post muốn lấy
          },
          headers: {
            Authorization: `Bearer ${accessToken}` // Thêm access token vào header
          }
        });
        console.log("response", response.data.posts); // Kiểm tra dữ liệu trả về từ API
        dispatch(addPosts(response.data.posts)); // Cập nhật state `data` với bài post mới
        dispatch(setNextCursor(response.data.nextCursor)); // Cập nhật con trỏ tiếp theo
        dispatch(setHasMore(response.data.hasMore)); // Cập nhật trạng thái có thêm bài post hay khôngr
      } catch (error) {
        console.error("Lỗi khi gọi API:", error); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    }
    fetchCards(); // Gọi hàm fetchCards khi component mount
  }, []);

 // Hàm gọi API để lấy danh sách bài post
  const fetchCards = async () => {
      if (nextCursor !== null && hasMore) { // Kiểm tra xem có con trỏ tiếp theo và còn bài post để tải không
          if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
          setLoading(true); // Bắt đầu trạng thái tải
          const accessToken = await TokenService.getAccessToken();
          try {
            const response = await apiClient.get(`/post/get-posts/`, {
              params: {
                limit: 4, // Số lượng bài post muốn lấy
                cursor: nextCursor // Tham số con trỏ để phân trang
              },
              headers: {
                Authorization: `Bearer ${accessToken}` // Thêm access token vào header
              }
            });
            console.log("response", response.data.posts); // Kiểm tra dữ liệu trả về từ API
            dispatch(addPosts(response.data.posts)); // Cập nhật state `data` với bài post mới
            dispatch(setNextCursor(response.data.nextCursor)); // Cập nhật con trỏ tiếp theo
            dispatch(setHasMore(response.data.hasMore)); // Cập nhật trạng thái có thêm bài post hay khôngr
          } catch (error) {
            console.error("Lỗi khi gọi API:", error); // Xử lý lỗi nếu có
          } finally {
            setLoading(false); // Kết thúc trạng thái tải
          }
      } else { return; } // Nếu không còn bài post nào để tải thêm, không làm gì cả
  };

  
  //Ham xử lý cấp quyền camera và thư viện ảnh
  const checkPermissions = async () => {
    let cameraGranted = permission?.granted;
    let libraryGranted = permission_library?.granted;



    if (!cameraGranted) {
      const cameraPermission = await requestPermission();
      cameraGranted = cameraPermission.granted;
    }

    if (!libraryGranted) {
      const libraryPermission = await requestPermission_library();
      libraryGranted = libraryPermission.granted;
    }

    // Cập nhật trạng thái nếu cả hai quyền đều được cấp
    if (cameraGranted && libraryGranted) {
      setPermissionsGranted(true);
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) {
      navigation.reset(
        {
          index: 0,
          routes: [{ name: 'Welcome' }],
        }
      );
      return;
    } else {
      try {
        await apiClient.delete("/auth/logout", {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      }
    } 
    TokenService.removeTokens();
    navigation.reset(
      {
        index: 0,
        routes: [{ name: 'Welcome' }],
      }
    );
    dispatch(clearPosts());
    alert("Đăng xuất thành công!");
  }

  //lấy thông tin người dùng khi component mount
  useEffect(() => {
    ProfileApi.getProfile(); // Lấy thông tin người dùng từ ProfileApi
  }, []);

  // Kiểm tra quyền camera và thư viện ảnh khi component mount
  useEffect(() => {
    checkPermissions();
  }, []);

  type UserProfile = {
    name: string;
    urlPublicAvatar: string;
  };

  type User = {
    id: string;
    profile: UserProfile;
  };

  type PostItem = {
    id: string;
    caption: string;
    urlPublicImage: string;
    createdAt: string;
    user: User;
  };


  const height = Dimensions.get('screen').height;
  const renderItem = ({ item }: { item: PostItem }) => {
    if (item.id === 'home') {
      return (
        <View >
          {/* Nội dung trang Home giống như bạn viết ở trên */}
          <SafeAreaView style={{ flexDirection: "column",flex: 1, height: height, backgroundColor: '#111111' }}>
            {permissionsGranted ? (
              compressedUri ? (
                <View style={styles.camera_container}>
                  <Posting compressedUri={compressedUri} setCompressedUri={setCompressedUri} />
                </View>
              ) : (
                <View style={styles.camera_container}>
                  <CustomCamera onPhotoTaken={setCompressedUri} />
                </View>
              )
            ) : (
              <View style={styles.camera_container}>
                <Text>Đang chờ cấp quyền...</Text>
              </View>
            )}
          </SafeAreaView>
        </View>
      );
    } else {
      return (
        <PostView post={item} /> // Hiển thị bài post
      );
    }

  };
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={{backgroundColor: '#111111',height: height}}>
        <View style={styles.list_button}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
              <Image source={require("../../assets/user.png")} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Friend")}>
              <Image source={require("../../assets/add-friend.png")} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Message")}>
              <Image source={require("../../assets/message.png")} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
            <Button title="Đăng xuất" onPress={handleLogout} color="#FF0000" />
        </View>

        <FlatList
          data={danhSach}
          renderItem={({ item }) => renderItem({ item })}
          keyExtractor={(item, index) => item.id === 'home' ? `home-${index}` : item.id.toString()}
          contentContainerStyle={{ flexGrow: 1 }} // Đảm bảo FlatList chiếm toàn bộ không gian
          showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
          onEndReached={fetchCards}
          onEndReachedThreshold={0.3}
          pagingEnabled={true} // Bật chế độ cuộn trang
          getItemLayout={(_data, index) => (
            { length: height, offset: height * index, index } // Cung cấp chiều cao của mỗi mục
          )}
          />
      </View>
    </>
  );
};

export default Home;


