import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, TextInput } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import ProfileService from '../../services/profile.service'; // Import ProfileService
import TokenService from '../../services/token.service'; // Import TokenService
import apiClient from '../../networking/apiclient'; // Import apiClient
import { Modalize } from 'react-native-modalize'; // Import Modalize
import type { Modalize as ModalizeType } from 'react-native-modalize';
import ProfileApi from '../../networking/profile.api';


type Props = {
  navigation: NavigationProp<any>;
};

const Profile: React.FC<{ navigation: any ; route: any }> = ({ navigation, route }) => {
  const [name, setName] = useState<string | null>('Người dùng');
  const [avatar, setAvatar] = useState<string | null>(null); // Lưu đường dẫn ảnh avatar
  const [username, setUsername] = useState<string | null>(null); // Hiển thị username
  const modalRef = useRef<ModalizeType>(null);
  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    modalRef.current?.open();
    setTimeout(() => {
      setModalHeight(800); // Chiều cao mong muốn
    }, 120); // Delay nhẹ để tránh animation trượt lên
  }, []);

  // Đóng và quay lại Home khi vuốt xuống
  const handleClosed = () => {
    navigation.navigate('Home');
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
    alert("Đăng xuất thành công!");
  }

  // Hàm xóa tài khoản
  const handleDeleteAccount = async () => {
    const accessToken = await TokenService.getAccessToken();
    if (!accessToken) {
      navigation.reset(
        {
          index: 0,
          routes: [{ name: 'Welcome' }],
        }
      );
      return;
    } else {
      try {
        await apiClient.delete("/auth/delete-account", {
          headers: {
            Authorization: `Bearer ${accessToken}`
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
    alert("Xóa tài khoản thành công!");
  }

  // Hàm lấy tên từ ProfileApi
  function getName() {
    ProfileApi.getProfile()
      .then((response) => {
        setName(response.name || null); // Lưu tên từ server
      })
      .catch((error) => {
        console.error('Error fetching name:', error);
      });
    console.log('Name:', name);
  }

  // Hàm lấy username từ ProfileApi
  function getusername() {
    ProfileApi.getProfile()
      .then((response) => {
        setUsername(response.username || null); // Lưu username từ server
      })
      .catch((error) => {
        console.error('Error fetching username:', error);
      });
    console.log('username:', username);
  }

  // Hàm lấy avatar từ ProfileApi
  function getAvatar() {   
    ProfileApi.getProfile()
      .then((response) => {
        console.log('Avatar từ server:', response.urlPublicAvatar); // Log giá trị avatar từ server
        setAvatar(response.urlPublicAvatar || null); // Đảm bảo avatar là chuỗi hoặc null
      })
      .catch((error) => {
        console.error('Error fetching avatar:', error);
      });
    console.log('Avatar:', avatar);
  }

  useFocusEffect(
    React.useCallback(() => {
      getAvatar(); // Lấy avatar mới từ server khi màn hình được focus
      getName(); // Lấy tên mới từ server khi
      getusername(); // Lấy username mới từ server khi
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111111', }}>
      <Modalize
        ref={modalRef}
        modalHeight={modalHeight}
        onClosed={handleClosed}
        modalStyle={styles.modal}
        handleStyle={styles.handle}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
      >
        <FlatList
          data={[
            { key: 'avatar' },
            { key: 'name' },
            { key: 'sửa' },
            { key: 'addfriend' },
            { key: 'tien ich' },
            { key: 'tong quat' },
            { key: 'rieng tu va bao mat' },
            { key: 'gioi thieu' },
            { key: 'vung nguy hiem' },
          ]}
          renderItem={({ item }) => {
            switch (item.key) {

              case 'avatar':
                return (
                  <View style={{flex : 1, alignContent: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity style={styles.avatarButton}
                    onPress={() => {
                      navigation.navigate('CameraScreen');
                    }}>
                    {avatar ? (
                      <Image source={{ uri: avatar }} style={styles.avatarImage} />
                    ) : (
                      <Image source={require("../../assets/user.png")} style={styles.avatarImage} />
                    )}
                  </TouchableOpacity>
                  </View>
                );
          
              case 'name':
                return (
                  <View
                    style={{
                      paddingVertical: 10,
                      backgroundColor: '#111111',
                      borderRadius: 10,
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 30, alignItems: 'center', justifyContent: 'center' }}>{name}</Text>
                  </View>
                );

                case 'sửa':
                  return (
                    <View style={{marginBottom: 10}}>
                    {/* Hiển thị hai ô trên cùng một hàng */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Ô hiển thị username */}
                      <View style={[styles.box, { flex: 1 }]}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('EditUserName')} // Điều hướng sang trang EditName
                        >
                          <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>@{username}</Text>
                        </TouchableOpacity>
                      </View>
                      {/* Ô sửa tên */}
                      <View style={[styles.box, { flex: 1 }]}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('EditName')} // Điều hướng sang trang EditName
                        >
                          <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>Sửa thông tin</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  );
                
                  case 'addfriend':
                    return (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Share')}> // Điều hướng sang trang Share đường link kết bạn
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#222',
                          padding: 30,
                          borderRadius: 30,
                          marginBottom: 10,
                        }}
                      >
                        {/* Avatar nhỏ bên trái */}
                        {avatar ? (
                      <Image source={{ uri: avatar }} style={[styles.avatarImage, {width: 50, height: 50, borderRadius: 25 }]} />
                    ) : (
                      <Image source={require("../../assets/user.png")} style={[styles.avatarButton, {width: 50, height: 50, borderRadius: 25 }]} />
                    )}
                  
                        {/* Lời mời kết bạn bên phải */}
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={{ color: 'white', fontSize: 17 }}>Mời bạn bè tham gia OnlyF</Text>
                        </View>
                      </View>
                       </TouchableOpacity>
                    );

                    case 'tien ich':
                      return (
                        <View>
                        <View style={{ paddingVertical: 7, backgroundColor: '#111111', borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: 17 }}>Thiết lập Tiện ích</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#222',
                            padding: 20,
                            borderRadius: 30,
                            marginBottom: 10,
                          }}
                        >
                          {/* Nút "Thêm tiện ích" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Thêm tiện ích', 'Bạn đã nhấn vào nút Thêm tiện ích!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Thêm tiện ích</Text>
                          </TouchableOpacity>

                          {/* Nút "Hướng dẫn về tiện ích" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Hướng dẫn', 'Đây là hướng dẫn về tiện ích!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Hướng dẫn về tiện ích</Text>
                          </TouchableOpacity>
                        </View>
                        </View>
                );

                case 'tong quat':
                      return (
                        <View>
                        <View style={{ paddingVertical: 7, backgroundColor: '#111111', borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: 17 }}>Tổng quát</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#222',
                            padding: 20,
                            borderRadius: 30,
                            marginBottom: 10,
                          }}
                        >
                          {/* Nút "Thay đổi email" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Thay đổi email', 'Bạn đã nhấn vào nút Thay đổi email!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Thay đổi địa chỉ email</Text>
                          </TouchableOpacity>

                          {/* Nút "Thay đổi ngày sinh" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Thay đổi ngày sinh', 'Bạn đã nhấn vào nút Thay đổi ngày sinh!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Gửi đề xuất</Text>
                          </TouchableOpacity>

                          {/* Nút "Báo cáo sự cố" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Báo cáo sự cố', 'Đây là báo cáo sự cố!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Báo cáo sự cố</Text>
                          </TouchableOpacity>
                        </View>
                        </View>
                    );

                case 'rieng tu va bao mat':
                  return (
                    <View>
                        <View style={{ paddingVertical: 7, backgroundColor: '#111111', borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: 17 }}>Riêng tư & bảo mật</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#222',
                            padding: 20,
                            borderRadius: 30,
                            marginBottom: 10,
                          }}
                        >
                          {/* Nút "Hiển thị tài khoản" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Hiển thị tài khoản', 'Bạn đã nhấn vào nút Hiển thị tài khoản!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Hiển thị tài khoản</Text>
                          </TouchableOpacity>

                          {/* Nút "Hiển thị các thiết bị đăng nhập" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => navigation.navigate('LoggedDevices')} // Điều hướng sang trang LoggedDevices
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Các thiết bị đăng nhập</Text>
                          </TouchableOpacity>  
                        </View>
                        </View>
                  );

                  case 'gioi thieu':
                  return (
                    <View>
                        <View style={{ paddingVertical: 7, backgroundColor: '#111111', borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: 17 }}>Giới thiệu</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#222',
                            padding: 20,
                            borderRadius: 30,
                            marginBottom: 10,
                          }}
                        >
                          
                          {/* Nút "TikTok" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('TikTok', 'Bạn đã nhấn vào nút TikTok!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>TikTok</Text>
                          </TouchableOpacity>  

                          {/* Nút "Instagram" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Instagram', 'Bạn đã nhấn vào nút Instagram!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Instagram</Text>
                          </TouchableOpacity>

                          {/* Nút "Twitter" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Twitter', 'Bạn đã nhấn vào nút Twitter!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Twitter</Text>
                          </TouchableOpacity>

                          {/* Nút "Chia sẻ OnlyF" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Chia sẻ OnlyF', 'Bạn đã nhấn vào nút Chia sẻ OnlyF!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Chia sẻ Locket</Text>
                          </TouchableOpacity>

                          {/* Nút "Đánh giá OnlyF" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Đánh giá OnlyF', 'Bạn đã nhấn vào nút Đánh giá OnlyF!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Đánh giá OnlyF</Text>
                          </TouchableOpacity>

                          {/* Nút "Điều khoản dịch vụ" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Điều khoản dịch vụ', 'Bạn đã nhấn vào nút Điều khoản dịch vụ!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Điều khoản dịch vụ</Text>
                          </TouchableOpacity>

                          {/* Nút "Chính sách quyền riêng tư" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => Alert.alert('Chính sách quyền riêng tư', 'Bạn đã nhấn vào nút Chính sách quyền riêng tư!')}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Chính sách quyền riêng tư</Text>
                          </TouchableOpacity>
                        </View>
                        </View>
                  );

                  case 'vung nguy hiem':
                  return (
                    <View>
                        <View style={{ paddingVertical: 7, backgroundColor: '#111111', borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: 17 }}>Vùng nguy hiểm</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#222',
                            padding: 20,
                            borderRadius: 30,
                            marginBottom: 10,
                          }}
                        >
                          {/* Nút "Đăng xuất" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() => handleLogout()}
                          >
                            <Text style={{ color: 'white', fontSize: 16 }}>Đăng xuất</Text>
                          </TouchableOpacity>  

                          {/* Nút "Xóa tài khoản" */}
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#222',
                              padding: 15,
                              borderRadius: 5,
                              width: '100%',
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Xóa tài khoản',
                                'Bạn chắc chắn muốn xóa tài khoản?',
                                [
                                  {
                                    text: 'Hủy',
                                    onPress: () => console.log('Hủy xóa tài khoản'),
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'Có',
                                    onPress: () => handleDeleteAccount(), // Gọi hàm xóa tài khoản nếu người dùng chọn "Có"
                                  },
                                ],
                                { cancelable: false }
                              )
                            }
                          >
                            <Text style={{ color: 'red', fontSize: 16 }}>Xóa tài khoản</Text>
                          </TouchableOpacity>  
                        </View>
                        </View>
                  );
          
              default:
                return (
                  <View
                    style={{
                      paddingVertical: 30,
                      backgroundColor: 'pink',
                      marginBottom: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 20 }}>{item.key}</Text>
                  </View>
                );
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          style={{ width: '100%', padding: 20 }}
        />
      )
    </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Màu nền cho camera
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  box: {
    width: '100%',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  avatarButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 20,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#444',
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    color: 'white',
    fontSize: 16,
    alignContent: 'center',
    justifyContent: 'center',
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  dragHandle: {
    width: 60,
    height: 10,
    backgroundColor: '#888',
    borderRadius: 5,
    marginTop: 10,
  },
  modal: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: '#666',
    width: 60,
  },
});

export default Profile;