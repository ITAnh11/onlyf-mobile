import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { styles } from './styles';
import TokenService from '../../services/token.service';
import apiClient from '../../networking/apiclient';
import CustomCamera from '../../components/camera';
import ProfileApi from '../../networking/profile.api';
import Posting from './components/Posting';
import { useCameraPermissions } from 'expo-camera';
import { useMediaLibraryPermissions } from 'expo-image-picker';

type Props = {
  navigation: NavigationProp<any>;
};

const Home: React.FC<Props> = ({ navigation }) => {  
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [permission_library, requestPermission_library] = useMediaLibraryPermissions();
  const [permissionsGranted, setPermissionsGranted] = useState(false); // State để theo dõi trạng thái quyền

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
    alert("Đăng xuất thành công!");
  }

  useEffect(() => {
    ProfileApi.getProfile();
  }, []);

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <SafeAreaProvider style={styles.safeArea_style}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flexDirection: "column", flex: 1 }}>
        {/* Các nút chức năng */}
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

        {/* Camera hoặc ảnh đã chụp */}
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
    </SafeAreaProvider>
  );
};

export default Home;
