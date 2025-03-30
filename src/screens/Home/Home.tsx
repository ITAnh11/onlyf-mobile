import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { styles } from './styles';
import TokenService from '../../services/token.service';
import apiClient from '../../networking/apiclient';

type Props = {
  navigation: NavigationProp<any>;
};

const Home: React.FC<Props> = ({ navigation }) => {  
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đây là màn hình "Home" nha</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;
