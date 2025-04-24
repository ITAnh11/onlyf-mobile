// import React from 'react';
// import { Provider } from 'react-redux';
// import PostStore from './src/screens/Home/Global/PostStore'; // Import PostStore
// import AppNavigator from './src/navigation/NavigationContainer';

import { StatusBar
 } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import React from 'react';


export default function App() {
  // return (
  //   <Provider store={PostStore}>
  //     <AppNavigator />
  //   </Provider>
  // );

  const requestUserPermission = async (): Promise<boolean> => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
        return true; // Trả về true nếu quyền được cấp
      }
      return false; // Trả về false nếu quyền không được cấp
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false; // Trả về false nếu có lỗi
    }
  };

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const authStatus = await requestUserPermission(); // Đợi kết quả của requestUserPermission
        if (authStatus) {
          const token = await messaging().getToken();
          console.log("FCM Token:", token);
        } else {
          console.log("Permission not granted");
        }

        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log(
            "Notification caused app to open from quit state:",
            initialNotification.notification
          );
        }

        messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        });

        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background!", remoteMessage);
        });

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        });

        return unsubscribe; // Hủy đăng ký khi component bị unmount
      } catch (error) {
        console.error("Error initializing FCM:", error);
      }
    };

    initializeFCM(); // Gọi hàm bất đồng bộ
  }, []);

  return (
    <View style={styles.container}>
      <Text>FCM</Text>
      <StatusBar style="auto" />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
