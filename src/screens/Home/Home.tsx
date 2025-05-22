import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Button, FlatList, Platform, ViewToken, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import TokenService from '../../services/token.service';
import apiClient from '../../networking/apiclient';
import CustomCamera from '../../components/camera'; // Ensure this file exists in the specified path
import ProfileApi from '../../networking/profile.api';
import Posting from './components/Posting';
import ButtonList from './components/ButtonList';
import ChoosedButton from './components/ChoosedButton';
import { FriendItem, PostItem } from './components/Type';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useMediaLibraryPermissions } from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Global/PostStore';
import { addPost, addPosts, clearPosts, setHasMore, setNextCursor } from './Global/PostSlice';
import PostView from './components/PostView';
import AllImageView from './components/AllImageView';
import ProfileService from '../../services/profile.service';
import 'expo-dev-client';
// import { useSearchParams } from './Hooks/useSearchParams';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { set } from 'lodash';

type Props = {
  navigation: NavigationProp<any>;
};


const Home: React.FC<Props> = ({ navigation }) => {  
  const [compressedUri, setCompressedUri] = useState<string | null>(null); 

  const [userId, setUserID] = useState<string | number>(); // State để lưu id người dùng
  const [userAvatar, setUserAvatar] = useState<string | null>(null); // State để lưu avatar người dùng
  // lấy thông tin người dùng từ ProfileService
  ProfileService.getId().then((id) => {
      if (id !== null) {
          setUserID(id); // Cập nhật state userId với giá trị từ ProfileService
      }
  });

  ProfileService.geturlPublicAvatar().then((avatar) => {
      if (avatar !== null) {
          setUserAvatar(avatar); // Cập nhật state userAvatar với giá trị từ ProfileService
      }
  });

  // State để xem người dùng có muốn nạp không
  const [isComfirmedPremium, setIsComfirmedPremium] = useState(false);
  useEffect(() => {
    if (isComfirmedPremium) {
      navigation.navigate("Payment");
      setIsComfirmedPremium(false);
    }
  }, [isComfirmedPremium]);
  
  // State để theo dõi trạng thái quyền
  const [permission, requestPermission] = useCameraPermissions();
  const [permission_library, requestPermission_library] = useMediaLibraryPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [permissionsGranted, setPermissionsGranted] = useState(false); // State để theo dõi trạng thái quyền
  
  // Trạng thái loading của toàn trang home
  const [isLoading, setIsLoading] = useState(false); 

  //Theo dõi danh sách các bài post (trạng thái lọc tất cả hoặc của một người bạn cụ thể)
  const [choosedItem, setChoosedItem] = useState("Tất cả bạn bè");
  const [idItem, setIdItem] = useState("Tất cả bạn bè");
  const [choosing, setChoosing] = useState(false);


  // State để theo dõi trạng thái load các bài post
  const [loading, setLoading] = useState(false);

    //useEffect lấy danh sách bạn bè
  const [friendList, setFriendList] = useState<FriendItem[]>([]);
  const fetchAPI = async () => {
    try {
      const accessToken = await TokenService.getAccessToken();
      const response = await apiClient.get(`/friend/get-friends`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFriendList(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API của get Friends:", error);
    }
  };

  // Gọi lại mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchAPI();
    }, [])
  );

  // Khởi tạo dispatch từ Redux
  const dispatch = useDispatch(); 

  // Các thông tin về tất cả bài post
  const danhSach = useSelector((state: RootState) => state.postManager.danhSach);
  const nextCursor = useSelector((state: RootState) => state.postManager.nextCursor);
  const hasMore = useSelector((state: RootState) => state.postManager.hasdmore);

  //trang thái đang ở trang các bài post hay là trang xem tất cả ảnh
  const [isAllImageView, setIsAllImageView] = useState(false); 
  const [isLinkToPostView, setIsLinkToPostView] = useState(false);//trang thái link từ ảnh của trang AllImageView tới trang postView
  const [postIndexToLink, setPostIndexToLink] = useState(0); // vị trí bài post đưuọc chọn để dẫn từ bên trang AllPostImageView

  //Trạng thái xem đã đăng bài hay chưa
  const [isPosted, setIsPosted] = useState(false);
  //Trang thái xem xóa bài hay chưa
  const [isDelete, setIsDelete] = useState(false);
  
  // Lấy các tham số từ deeplink
  const route = useRoute();
  const [postId, setPostId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const lastHandledTs = useRef<number | null>(null);
  useFocusEffect(
    React.useCallback(() => {
    const params = route.params as { postId?: string; ownerId?: string ; _ts?: number; type?:string} | undefined;

    // Kiểm tra nếu params tồn tại và khác với state hiện tại
    const paramsTs = params && typeof params._ts !== 'undefined' ? Number(params._ts) : null;
    if (params?.postId && params.postId !== postId && paramsTs !== lastHandledTs.current) {
      lastHandledTs.current = paramsTs; // Cập nhật timestamp đã xử lý
      setPostId(params.postId);
      setOwnerId(params.ownerId || null);

      console.log('postId:', params.postId);
      console.log('ownerId:', params.ownerId);
    }
    }, [route.params])
  );


  //State để theo dõi vị trí trang hiện tại trong Flatlist
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backToFirstPage, setBacktoFirstPage] = useState(false);
  const [backToHomePage, setBackToHomePage] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0); // cập nhật index đầu tiên đang hiển thị
      const currentItem = viewableItems[0].item; // Lấy item đầu tiên đang hiển thị
      console.log('Item hiện tại:', currentItem.id); // Log item.id
      setCurrentPostId(currentItem.id); // Cập nhật item.id hiện tại
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  // Tạo ref cho FlatList
  const flatListRef = useRef<FlatList>(null); 
  const [waitingForDeeplinkScroll, setWaitingForDeeplinkScroll] = useState(false);
useEffect(() => {
  if (
    postId &&
    postId !== '0' &&
    friendList.length > 0 &&
    danhSach.length > 0 &&
    ownerId !== null
  ) {
    const name = friendList.find(
      (item) => String(item.friend.id) === String(ownerId)
    )?.friend?.profile?.name || '';

    if (name === '') {
      console.log("Không tìm thấy tên người dùng");
      navigation.navigate("Friend");
      return; 
    }
    setChoosedItem(name);
    setIdItem(ownerId);
    setWaitingForDeeplinkScroll(true);
  }
}, [postId,danhSach]);

// Khi danhSach hoặc idItem thay đổi, mới tìm index và cuộn
useEffect(() => {
  if (
    waitingForDeeplinkScroll &&
    postId &&
    postId !== '0' &&
    danhSach.length > 0
  ) {
    const postIndexToLink = danhSach.findIndex((item) => String(item.id) === String(postId));
    console.log('postIndexLink:', postIndexToLink)
    setIsLoading(true);
    if (postIndexToLink !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: Number(postIndexToLink), animated: false });
        setPostId('0');
        setWaitingForDeeplinkScroll(false);
      }, 300); // delay 300ms, có thể tăng lên nếu máy yếu
    }
    setIsLoading(false);
  }
}, [danhSach]);
  
  useEffect(() => {
    if (backToFirstPage) {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false }); // Cuộn đến trang thứ 2
      setBacktoFirstPage(false); // Đặt lại trạng thái để tránh cuộn lại liên tục
    }
  
    if (backToHomePage) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: false }); // Cuộn đến trang thứ 1
      setBackToHomePage(false); // Đặt lại trạng thái để tránh cuộn lại liên tục
    }

    if (isLinkToPostView) {
      flatListRef.current?.scrollToIndex({ index: postIndexToLink + 1, animated: false});// +1 do bên AllPosstImage không có trang home
      setIsLinkToPostView(false);
    }
  }, [backToFirstPage, backToHomePage, isLinkToPostView ]);

  // Hàm khởi tạo các bài post
  const initAllPost = async () => {
    dispatch(addPost({ id: 'home', caption: 'Home', urlPublicImage: '', createdAt: '', user: { id: '', profile: { name: '', urlPublicAvatar: '' } } })); // Thêm home vào danh sách bài post
    if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
    setLoading(true); // Bắt đầu trạng thái tải
    const accessToken = await TokenService.getAccessToken();
    try {
      const response = await apiClient.get(`/post/get-posts/`, {
        params: {
          limit: 30, // Số lượng bài post muốn lấy
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
      console.error("Lỗi khi gọi API get POST 1:", error); // Xử lý lỗi nếu có
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  }
  //useEffect để khỏi tạo các bài post đầu tiên
  useEffect(() => {
    initAllPost(); 
  }, []);

  //useEffect để render lại các bài post sau khi đăng ảnh
  useEffect(() => {
    if(isPosted || isDelete) {
      dispatch(clearPosts());
      initAllPost();
      setIsPosted(false);
      setIsDelete(false);
    }
  },[isPosted, isDelete])

  //hàm thay đổi danh sách bài post khi người dùng thay đổi lựa chọn.
  const isFirstRender = useRef(true); // Theo dõi lần render đầu tiên
  useEffect(() => {
    const fetchCards = async () => {
      if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
      setIsLoading(true); // Bắt đầu trạng thái tải xoay xaoy cho cả trang Home
      setLoading(true); // Bắt đầu trạng thái tải
      const accessToken = await TokenService.getAccessToken();
      try {
        const params: any = {
          limit: 30, // Số lượng bài post muốn lấy
        };
        
        let response: any;
        // Nếu idItem khác "Tất cả bạn bè", thêm thuộc tính friendId
        if (idItem !== "Tất cả bạn bè" && idItem !== `${userId}`) {
          params.friendId = idItem;
          response  = await apiClient.get(`/post/get-posts/`, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
            },
          });
        } else if (idItem === `${userId}`) {
          response  = await apiClient.get(`/post/get-my-posts`, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
            },
          });       
        } else {
          response  = await apiClient.get(`/post/get-posts/`, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
            },
          });
        }
        dispatch(clearPosts());
        dispatch(addPost({ id: 'home', caption: 'Home', urlPublicImage: '', createdAt: '', user: { id: '', profile: { name: '', urlPublicAvatar: '' } } })); // Thêm home vào danh sách bài post
        dispatch(addPosts(response.data.posts)); // Cập nhật state `data` với bài post mới
        dispatch(setNextCursor(response.data.nextCursor)); // Cập nhật con trỏ tiếp theo
        dispatch(setHasMore(response.data.hasMore)); // Cập nhật trạng thái có thêm bài post hay không
        // Chỉ gọi setBacktoFirstPage(true) nếu không phải lần render đầu tiên
        if (!isFirstRender.current) {
          setBacktoFirstPage(true);
        }
        isFirstRender.current = false; // Đánh dấu rằng lần render đầu tiên đã hoàn tất
      } catch (error) {
        console.error("Lỗi khi gọi API get POST 2:", error); // Xử lý lỗi nếu có
        console.log(idItem);
        console.log("ID: ", userId); // Xử lý lỗi nếu có
      } finally {
        setIsLoading(false); // Kết thúc trạng thái tải xoay xaoy cho cả trang Home
        setLoading(false); // Kết thúc trạng thái tải
      }
    };
    fetchCards();
  }, [idItem]);

  // Hàm gọi API để lấy danh sách bài post
  const fetchCards = async () => {
      if (nextCursor !== null && hasMore) { // Kiểm tra xem có con trỏ tiếp theo và còn bài post để tải không
          if (loading) return; // Ngăn việc gọi API nhiều lần khi đang tải
          setLoading(true); // Bắt đầu trạng thái tải
          const accessToken = await TokenService.getAccessToken();
          try {
            const params: any = {
              limit: 30, // Số lượng bài post muốn lấy
              cursor: nextCursor // Tham số con trỏ để phân trang
            };
            let response: any;
            // Nếu idItem khác "Tất cả bạn bè", thêm thuộc tính friendId
            if (idItem !== "Tất cả bạn bè" && idItem !== `${userId}`) {
              params.friendId = idItem;
              response  = await apiClient.get(`/post/get-posts/`, {
                params,
                headers: {
                  Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
                },
              });
            } else if (idItem === `${userId}`) {
              response  = await apiClient.get(`/post/get-my-posts`, {
                params,
                headers: {
                  Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
                },
              });       
            } else {
              response  = await apiClient.get(`/post/get-posts/`, {
                params,
                headers: {
                  Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
                },
              });
            }
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
    let micGranted = microphonePermission?.granted;
    let libraryGranted = permission_library?.granted;
    if (!cameraGranted) {
      const cameraPermission = await requestPermission();
      cameraGranted = cameraPermission.granted;
    }
    if (!libraryGranted) {
      const libraryPermission = await requestPermission_library();
      libraryGranted = libraryPermission.granted;
    }
    if (!micGranted) {
      const mic = await requestMicrophonePermission();
      micGranted = mic.granted;
    }
    // Cập nhật trạng thái nếu cả hai quyền đều được cấp
    if (cameraGranted && libraryGranted && micGranted) {
      setPermissionsGranted(true);
    }
  };

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
                  <Posting compressedUri={compressedUri} setCompressedUri={setCompressedUri} setIsPosted={setIsPosted} setIsComfirmedPremium={setIsComfirmedPremium}/>
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
        <PostView post={item} setBackToHomePage={setBackToHomePage} setIsAllImageView={setIsAllImageView} currentPostId={currentPostId} setIsDelete={setIsDelete}/> // Hiển thị bài post
      );
    }

  };

    //Khởi tạo quảng cáo
    const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true,
    });
    const currentIndexRef = useRef(currentIndex);
    useEffect(() => {
      currentIndexRef.current = currentIndex; // Cập nhật giá trị ref mỗi khi currentIndex thay đổi
    }, [currentIndex]);

    //mở quảng cáo khi nó được tải
    const lastShownRef = useRef(0);
    const showInterstitialAdIfNeeded = async () => {
      if (await ProfileService.isPremium() === true) return;
      const now = Date.now();
      const FIVE_MINUTES = process.env.EXPO_PUBLIC_AD_TIME_LIMIT;
      const enoughTimePassed = now - lastShownRef.current >= FIVE_MINUTES;
      if (enoughTimePassed && currentIndexRef.current !== 0) {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          interstitial.show();
          lastShownRef.current = Date.now();
          unsubscribe();
        });
  
        interstitial.load();
      } else {
        console.log('Chưa đủ 5 phút, chưa hiển thị quảng cáo', currentIndexRef.current);
      }
    };

    // ⏰ Lặp lại quảng cáo mỗi 5 phút
    useEffect(() => {
      // Hiển thị quảng cáo lần đầu sau khi app mở
      showInterstitialAdIfNeeded();
  
      const interval = setInterval(() => {
        showInterstitialAdIfNeeded();
      }, process.env.EXPO_PUBLIC_AD_TIME_LIMIT); // 5 phút
  
      return () => clearInterval(interval);
    }, []);
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={{backgroundColor: '#111111',height: height,justifyContent:'center'}}>
        <View style={styles.list_button}>
            <TouchableOpacity style={[styles.button, { marginLeft: 20 }]} onPress={() => {navigation.navigate("Profile");}}>
              { userAvatar ? (
                  <Image source={{ uri: userAvatar }} resizeMode="cover" style={{ width: '90%', height: '90%', borderRadius: 50 }} />
                ) : (
                  <Image source={require("../../assets/user.png")} resizeMode="cover" style={{ width: 33, height: 33 }}/>
                )
              }
            </TouchableOpacity>
            {(currentIndex === 0 && isAllImageView === false) ? (
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

        { isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size={80} color="#fff" />
          </View>
          )
        }

        { (isAllImageView === false) ? (
            (danhSach.length > 1 || currentIndex === 0) ? (
              <FlatList
                ref={flatListRef}
                data={danhSach}
                renderItem={({ item }) => renderItem({ item })}
                keyExtractor={(item, index) => item.id === 'home' ? `home-${index}` : item.id.toString()}
                contentContainerStyle={{ flexGrow: 1 }} // Đảm bảo FlatList chiếm toàn bộ không gian
                showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
                onEndReached={fetchCards}
                initialNumToRender={10} // Số lượng bài post đầu tiên được render
                maxToRenderPerBatch={10} // Số lượng bài post tối đa được render mỗi lần
                windowSize={5} // Kích thước cửa sổ để render các bài post
                onEndReachedThreshold={0.5}
                pagingEnabled={true} // Bật chế độ cuộn trang
                getItemLayout={(_data, index) => (
                  { length: height, offset: height * index, index } // Cung cấp chiều cao của mỗi mục
                )}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
              />
            ) : (
              <View style={styles.safeArea_style}>
                <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center', fontStyle: 'italic', fontWeight:'bold' }}>Không có bài post nào!</Text>
              </View>
            )
          ) : (
            <AllImageView setIsAllImageView={setIsAllImageView} danhSach={danhSach} fetchCards={fetchCards} idItem={idItem} setBackToHomePage={setBackToHomePage} setIsLinkToPostView={setIsLinkToPostView} setPostIndexToLink={setPostIndexToLink}/>
          )}
      </View>
    </>
  );
};

export default Home;
