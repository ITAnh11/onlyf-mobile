import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import ProfileApi from '../../networking/profile.api';
import ProfileService from '../../services/profile.service';
import { connectSocket } from '../../utils/socket';

type Props = {
  navigation: NavigationProp<any>;
};

const Loading: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    const loadData = async () => {
      try {
        // Gọi API để lấy thông tin người dùng
        const response = await ProfileApi.getProfile();
        ProfileService.saveProfile(response);

        // Kết nối socket
        await connectSocket();

        // Sau khi tải xong, điều hướng đến Home
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setIsLoading(false); // Kết thúc trạng thái tải
      }
    };

    loadData();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#555' }}>Đang tải dữ liệu...</Text>
        </>
      ) : (
        <Text style={{ fontSize: 16, color: '#555' }}>Đã tải xong!</Text>
      )}
    </View>
  );
};

export default Loading;
