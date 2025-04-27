import messaging from "@react-native-firebase/messaging";
import * as SecureStore from "expo-secure-store";
import NotificationApi from "../networking/notification.api";
import { Alert } from "react-native";

export class FCM {
  static async requestUserPermission(): Promise<boolean> {
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
  }

  static async pushTokenToServer(token: string) {
    try {
      const response = await NotificationApi.pushNotification(token);
      console.log("Push notification response:", response);
    } catch (error) {
      console.error("Error pushing notification:", error);
    }
  }

  static async handleRemoteMessage(remoteMessage: any, isFromTap = false) {
    if (!remoteMessage) return;
    const { data, notification } = remoteMessage;

    console.log("Handling notification:", data, notification);

    if (data?.messageId && data?.postId) {
      console.log("Template: Reply to Post");
      Alert.alert("Reply to your post", notification?.body || "");
    } else if (data?.reactType && data?.postId) {
      console.log("Template: Reaction to Post");
    } else if (data?.senderId && !data?.postId) {
      console.log("Template: Friend Request");
    } else {
      console.log("Unknown notification type");
      Alert.alert(
        "Notification",
        notification?.body || "You have a new message!"
      );
    }
  }

  static async getToken() {
    if (!this.requestUserPermission()) return null;
    try {
      const token = await messaging().getToken();
      console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  static async saveTokenToSecureStore(token: string) {
    try {
      await SecureStore.setItemAsync("fcmToken", token);
      console.log("FCM token saved to secure store:", token);
    } catch (error) {
      console.error("Error saving FCM token to secure store:", error);
    }
  }

  static async getTokenFromSecureStore() {
    try {
      const token = await SecureStore.getItemAsync("fcmToken");
      console.log("FCM token retrieved from secure store:", token);
      return token;
    } catch (error) {
      console.error("Error retrieving FCM token from secure store:", error);
      return null;
    }
  }

  static async initializeFCM() {
    try {
      const authRequest = await this.requestUserPermission();
      if (authRequest) {
        const newToken = await this.getToken();
        if (!newToken) {
          console.warn("FCM token is null");
          return; // Dừng lại nếu không lấy được token
        }
        const oldToken = await SecureStore.getItemAsync("fcm_token");
        console.log("Old token:", oldToken);
        if (newToken !== oldToken) {
          await SecureStore.setItemAsync("fcm_token", newToken);
          await this.pushTokenToServer(newToken);
        }
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
      this.handleRemoteMessage(remoteMessage, true);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      this.handleRemoteMessage(remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
      this.handleRemoteMessage(remoteMessage);
    });

    return unsubscribe; // Hủy đăng ký khi component bị unmount
  }

  static async deleteTokenFromSecureStore() {
    try {
      await SecureStore.deleteItemAsync("fcm_token");
      console.log("FCM token deleted from secure store");
    } catch (error) {
      console.error("Error deleting FCM token from secure store:", error);
    }
  }
}

export default FCM;
