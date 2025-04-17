import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Button, FlatList, Platform, ViewToken } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { styles } from './styles';
import TokenService from '../../services/token.service';
import apiClient from '../../networking/apiclient';
import CustomCamera from '../../components/camera'; // Ensure this file exists in the specified path
import ProfileApi from '../../networking/profile.api';
import Posting from './components/Posting';
import ButtonList from './components/ButtonList';
import ChoosedButton from './components/ChoosedButton';
import { FriendItem, PostItem } from './components/Type';
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

  // Khởi tạo dispatch từ Redux
  const dispatch = useDispatch(); 

  // Các thông tin về tất cả bài post
  const danhSach = useSelector((state: RootState) => state.postManager.danhSach);
  const nextCursor = useSelector((state: RootState) => state.postManager.nextCursor);
  const hasMore = useSelector((state: RootState) => state.postManager.hasdmore);

  
  //State để theo dõi vị trí trang hiện tại trong Flatlist
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0); // cập nhật index đầu tiên đang hiển thị
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  //Theo dõi danh sách các bài post (trạng thái lọc tất cả hoặc của một người bạn cụ thể)
  const [choosedItem, setChoosedItem] = useState("Tất cả bạn bè");
  const [idItem, setIdItem] = useState("Tất cả bạn bè");
  const [choosing, setChoosing] = useState(false);

  //useEffect lấy danh sách bạn bè
  const [friendList, setFriendList] = useState<FriendItem[]>([]);
    useEffect(() => {
      const fetchAPI = async () => {
      try{
        const accessToken = await TokenService.getAccessToken();
        const response = await apiClient.get(`/friend/get-friends`,{
          headers: {
            Authorization: `Bearer ${accessToken}` // Thêm access token vào header
          }
        });
        setFriendList(response.data);
      }catch (error) {
        console.error("Lỗi khi gọi API của get Friends:", error); // Xử lý lỗi nếu có
      }
    };
    fetchAPI();
  },[]);

  // useEffect(() => {
  //   console.log('Danh sách bạn bè:');
  //   friendList.forEach((item) => {
  //     console.log(item.friend.profile.urlPublicAvatar, item.friend.profile.name);
  //   });
  // },[friendList]);


  //useEffect để thêm home vào data array khi component mount
  useEffect(() => {
    dispatch(addPost({ id: 'home', caption: 'Home', urlPublicImage: '', createdAt: '', user: { id: '', profile: { name: '', urlPublicAvatar: '' } } })); // Thêm home vào danh sách bài post
  }, []);

  // useEffect(() => {
  //   console.log("danhSach đã thay đổi:", danhSach, "\n");
  // }, [danhSach]);


  //useEffect để khỏi tạo các bài post đầu tiên
  useEffect(() => {
    const fetchCards = async () => {
      if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
      setLoading(true); // Bắt đầu trạng thái tải
      const accessToken = await TokenService.getAccessToken();
      try {
        const response = await apiClient.get(`/post/get-posts/`, {
          params: {
            limit: 20, // Số lượng bài post muốn lấy
          },
          headers: {
            Authorization: `Bearer ${accessToken}` // Thêm access token vào header
          }
        });
        // console.log("response of POST", response.data.posts); // Kiểm tra dữ liệu trả về từ API
        dispatch(addPosts(response.data.posts)); // Cập nhật state `data` với bài post mới
        dispatch(setNextCursor(response.data.nextCursor)); // Cập nhật con trỏ tiếp theo
        dispatch(setHasMore(response.data.hasMore)); // Cập nhật trạng thái có thêm bài post hay khôngr
      } catch (error) {
        console.error("Lỗi khi gọi API get POST:", error); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    }
    fetchCards(); 
  }, []);

  //hàm thay đổi danh sách bài post khi người dùng thay đổi lựa chọn.
  useEffect(() => {
    const fetchCards = async () => {
      if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
      setLoading(true); // Bắt đầu trạng thái tải
      const accessToken = await TokenService.getAccessToken();
      try {
        const params: any = {
          limit: 20, // Số lượng bài post muốn lấy
        };
  
        // Nếu idItem khác "Tất cả bạn bè", thêm thuộc tính friendId
        if (idItem !== "Tất cả bạn bè") {
          params.friendId = idItem;
        }
        const response = await apiClient.get(`/post/get-posts/`, {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}` // Thêm access token vào header
          }
        });
        // console.log("response of POST", response.data.posts); // Kiểm tra dữ liệu trả về từ API
        dispatch(clearPosts());
        setCurrentIndex(1);
        dispatch(addPost({ id: 'home', caption: 'Home', urlPublicImage: '', createdAt: '', user: { id: '', profile: { name: '', urlPublicAvatar: '' } } })); // Thêm home vào danh sách bài post
        dispatch(addPosts(response.data.posts)); // Cập nhật state `data` với bài post mới
        dispatch(setNextCursor(response.data.nextCursor)); // Cập nhật con trỏ tiếp theo
        dispatch(setHasMore(response.data.hasMore)); // Cập nhật trạng thái có thêm bài post hay không
        
      } catch (error) {
        console.error("Lỗi khi gọi API get POST:", error); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    }
    fetchCards(); 
  }, [idItem])

  // Hàm gọi API để lấy danh sách bài post
  const fetchCards = async () => {
      if (nextCursor !== null && hasMore) { // Kiểm tra xem có con trỏ tiếp theo và còn bài post để tải không
          if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
          setLoading(true); // Bắt đầu trạng thái tải
          const accessToken = await TokenService.getAccessToken();
          try {
            const params: any = {
              limit: 20, // Số lượng bài post muốn lấy
              cursor: nextCursor // Tham số con trỏ để phân trang
            };
            // Nếu idItem khác "Tất cả bạn bè", thêm thuộc tính friendId
            if (idItem !== "Tất cả bạn bè") {
              params.friendId = idItem;
            }
            const response = await apiClient.get(`/post/get-posts/`, {
              params,
              headers: {
                Authorization: `Bearer ${accessToken}` // Thêm access token vào header
              }
            });
            dispatch(addPosts(response.data.posts)); // Cập nhật state `data` với bài post mới
            dispatch(setNextCursor(response.data.nextCursor)); // Cập nhật con trỏ tiếp theo
            dispatch(setHasMore(response.data.hasMore)); // Cập nhật trạng thái có thêm bài post hay khôngr
          } catch (error) {
            console.error("Lỗi khi gọi API của get POST:", error); // Xử lý lỗi nếu có
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
      <View style={{backgroundColor: '#111111',height: height,justifyContent:'center'}}>
        <View style={styles.list_button}>
            <TouchableOpacity style={[styles.button, { marginLeft: 20 }]} onPress={() => navigation.navigate("Profile")}>
              <Image source={require("../../assets/user.png")} resizeMode="contain" style={{ width: 33, height: 33 }} />
            </TouchableOpacity>
            {(currentIndex === 0) ? (
              <TouchableOpacity style={styles.button_friend} onPress={() => navigation.navigate("Friend")}>
                <Image source={require("../../assets/add-friend.png")} resizeMode="contain" style={{ width: 20, height: 20, marginLeft: 20 }} />
                <Text style = {{fontSize: 15, fontWeight: 'bold', color: "white", marginLeft: 7, marginRight: 20}}>Bạn bè</Text>
              </TouchableOpacity>
            ) : (
              <ChoosedButton choosedItem = {choosedItem} setChoosing={setChoosing}/>
            )}
            <TouchableOpacity style={[styles.button, { marginRight: 20 }]} onPress={() => navigation.navigate("Message")}>
              <Image source={require("../../assets/message.png")} resizeMode="contain" style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            {/* <Button title="Đăng xuất" onPress={handleLogout} color="#FF0000" /> */}
        </View>

        {
          choosing && (
            <View style = {{height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)' , position: 'absolute', zIndex: 10, alignItems: 'center'}}>
              <ButtonList friendList = {friendList} idItem={idItem} setChoosing = {setChoosing} setChoosedItem = {setChoosedItem} setIdItem={setIdItem}/>
            </View>
          )
        }

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
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
      </View>
    </>
  );
};

export default Home;


