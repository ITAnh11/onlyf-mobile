import messaging from "@react-native-firebase/messaging";
import * as SecureStore from "expo-secure-store";
import NotificationApi from "../networking/notification.api";
import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import notifee, { AndroidImportance } from '@notifee/react-native';

export class FCM {

  static navigation: NavigationProp<any>;

  // Set navigation từ App.js hoặc nơi khởi tạo
  static setNavigation(nav: NavigationProp<any>) {
    this.navigation = nav;
  }

  static async displayLocalNotification(title: string, body: string) {
    await notifee.requestPermission();
  
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // đặt tên icon của bạn ở đây
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

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

  static handledKeys = new Set<string>();

  static getUniqueKey(data: any): string | null {
    if (data?.messageId) return `reply-${data.messageId}`;
    if (data?.reactType && data?.postId) return `react-${data.reactType}-${data.postId}`;
    if (data?.senderId && !data?.postId) return `friend-${data.senderId}`;
    return null;
  }

  static async handleRemoteMessage(remoteMessage: any, isFromTap = false) {
    if (!remoteMessage) return;
    const { data, notification } = remoteMessage;

    const uniqueKey = this.getUniqueKey(data);
    if (uniqueKey && this.handledKeys.has(uniqueKey)) {
      console.log("Already handled:", uniqueKey);
      return;
    }
    if (uniqueKey) {
      this.handledKeys.add(uniqueKey);
      setTimeout(() => this.handledKeys.delete(uniqueKey), 30000); // Xoá sau 30s
    }

    if (data?.messageId && data?.postId) {
      // Reply to post
      console.log("Template: Reply to Post");
      const ms = data.messageText || notification?.body || "";
      Alert.alert(`${data.senderName} replied to your post: ${ms}`);

      if (isFromTap && this.navigation) {
        this.navigation.navigate("PostDetail", { postId: data.postId });
      }

    } else if (data?.reactType && data?.postId) {
      // React to post
      console.log("Template: Reaction to Post");
      Alert.alert(
        "Reaction",
        `${data.senderName} reacted with "${data.reactType}" to your post.`
      );

      if (isFromTap && this.navigation) {
        this.navigation.navigate("PostDetail", { postId: data.postId });
      }

    } else if (data?.senderId && !data?.postId) {
      // Friend request
      console.log("Template: Friend Request");
      Alert.alert("Friend Request", `${data.senderName} sent you a friend request.`);

      if (isFromTap && this.navigation) {
        this.navigation.navigate("FriendRequests");
      }

    } else {
      // Default: Message or unknown
      console.log("New message");
      const ms = data.messageText || notification?.body || "";
      await this.displayLocalNotification("New Message", `${data.senderName}: ${ms}`);

      if (isFromTap && data?.senderId && this.navigation) {
        this.navigation.navigate("Chat", { userId: data.senderId });
      }
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

    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
