import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { styles } from './styles';
import TokenService from '../../services/token.service';
import apiClient from '../../networking/apiclient';
import CustomCamera from '../../components/camera';
import ProfileApi from '../../networking/profile.api';


type Props = {
  navigation: NavigationProp<any>;
};

const Home: React.FC<Props> = ({ navigation }) => {  
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  
  
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
      
  
  // Hàm xử lý ảnh đã chụp
  useEffect(() => {
    console.log("Giá trị mới của count:", compressedUri);
  }, [compressedUri]);

    return (
      <SafeAreaProvider style={styles.safeArea_style}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView>
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

          {/* Camera */}
          <View style={styles.camera_container}>
            <CustomCamera onPhotoTaken={setCompressedUri} />
          </View>

        </SafeAreaView>
      </SafeAreaProvider>
    );
};

export default Home;
