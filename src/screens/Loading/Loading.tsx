import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import ProfileApi from '../../networking/profile.api';
import ProfileService from '../../services/profile.service';
import { connectSocket } from '../../utils/socket';
import fcm from '../../services/fcm';
import * as SecureStore from 'expo-secure-store';
import messaging from '@react-native-firebase/messaging';

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

    const initializeFCM = async () => {
        try {
        const authRequest = await fcm.requestUserPermission();
        if (authRequest) {
            const newToken = await fcm.getToken();
            if (!newToken) {
                console.warn('FCM token is null');
                return; // Dừng lại nếu không lấy được token
              }
            const oldToken = await SecureStore.getItemAsync('fcm_token');
            if (newToken !== oldToken) {
                await SecureStore.setItemAsync('fcm_token', newToken);
                await fcm.pushtokentoserver(newToken);
            }
        }}         catch (error) {
            console.error('Error getting FCM token:', error);

        } 

        messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
        );
        fcm.handleRemoteMessage(remoteMessage, true);
        });

        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
        fcm.handleRemoteMessage(remoteMessage);
        });

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        fcm.handleRemoteMessage(remoteMessage);
        });

        return unsubscribe; // Hủy đăng ký khi component bị unmount
    }
    
    initializeFCM();
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
