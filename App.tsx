import React from 'react';
import { Provider } from 'react-redux';
import PostStore from './src/screens/Home/Global/PostStore'; // Import PostStore
import AppNavigator from './src/navigation/NavigationContainer';
import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import NotificationApi from './src/networking/notification.api';

export default function App() {
  return (
    <Provider store={PostStore}>
      <AppNavigator />
    </Provider>
  );

  // const requestUserPermission = async (): Promise<boolean> => {
  //   try {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);
  //       return true; // Trả về true nếu quyền được cấp
  //     }
  //     return false; // Trả về false nếu quyền không được cấp
  //   } catch (error) {
  //     console.error("Error requesting permission:", error);
  //     return false; // Trả về false nếu có lỗi
  //   }
  // };

  // const pushtokentoserver = async (token: string) => {
  //   try {
  //     const response = await NotificationApi.pushNotification(token);
  //     console.log("Push notification response:", response);
  //   } catch (error) {
  //     console.error("Error pushing notification:", error);
  //   }
  // }

  // const handleRemoteMessage = async (remoteMessage: any, isFromTap = false) => {
  //   if (!remoteMessage) return;
  //   const { data, notification } = remoteMessage;

  //   console.log('Handling notification:', data, notification);

  //   if (data?.messageId && data?.postId) {
  //     console.log('Template: Reply to Post');
  //     // TODO: Điều hướng user tới chi tiết bài post
  //     Alert.alert('Reply to your post', notification?.body || '');
  //   } else if (data?.reactType && data?.postId) {
  //     console.log('Template: Reaction to Post');
  //     Alert.alert('Reaction', notification?.body || '');
  //   } else if (data?.senderId && !data?.postId) {
  //     console.log('Template: Friend Request');
  //     Alert.alert('Friend Request', notification?.body || '');
  //   } else {
  //     console.log('Unknown notification type');
  //     Alert.alert('Notification', notification?.body || 'You have a new message!');
  //   }
  // };

  // useEffect(() => {
  //   const initializeFCM = async () => {
  //     try {
  //       const authStatus = await requestUserPermission(); // Đợi kết quả của requestUserPermission
  //       if (authStatus) {
  //         const newtoken = await messaging().getToken();
  //         const oldToken = await SecureStore.getItemAsync("fcmToken");

  //         if (newtoken !== oldToken) {
  //           await pushtokentoserver(newtoken); // Gọi hàm để gửi token mới lên server
  //           await SecureStore.setItemAsync("fcmToken", newtoken); // Lưu token mới vào SecureStore         
  //       } else {
  //           console.log("Token has not changed, no need to update server.");
  //         }
  //       }

  //       messaging().onNotificationOpenedApp((remoteMessage) => {
  //         console.log(
  //           "Notification caused app to open from background state:",
  //           remoteMessage.notification
  //         );
  //         handleRemoteMessage(remoteMessage, true);
  //       });

  //       messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //         console.log("Message handled in the background!", remoteMessage);
  //         handleRemoteMessage(remoteMessage);
  //       });

  //       const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //         Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  //         handleRemoteMessage(remoteMessage);
  //       });

  //       return unsubscribe; // Hủy đăng ký khi component bị unmount
  //     } catch (error) {
  //       console.error("Error initializing FCM:", error);
  //     }
  //   };

  //   initializeFCM(); // Gọi hàm bất đồng bộ
  // }, []);

  // return (
  //   <View style={styles.container}>
  //     <Text>FCM</Text>
  //     <StatusBar style="auto" />
  //   </View>
  //)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});



