import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StatusBar, Image, KeyboardAvoidingView, Platform,
  Vibration
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import ProfileService from '../../services/profile.service';
import Colors from '../../constants/Color';
import * as ImagePicker from 'expo-image-picker';
import { getSocket } from '../../utils/socket';
import Video from 'react-native-video';
import useChat from './hooks/useChat';

type Message = {
  senderId: number;
  recipientId: number;
  message: {
    type: 'text' | 'image' | 'video';
    text?: string;
    mediaUrl?: string;
    createdAt: string;
  };
};

type Props = {
  navigation: any;
};

const Chat: React.FC<Props> = ({ navigation }) => {
  const socket = getSocket(); 
  const route = useRoute();

  const { friendId, friendName, friendUsername, avatar } = route.params as {
    friendId: number;
    friendName: string;
    friendUsername: string;
    avatar: string;
  };

  const [messages, setMessages] = useState<Message[]>([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const [myId, setMyId] = useState<number | null>(null); 
  const flatListRef = useRef<FlatList>(null); // Ref để cuộn FlatList
  const isUserScrolling = useRef<boolean>(false); // Cờ đánh dấu người dùng đang cuộn
  const previousMessageCount = useRef<number>(0); // Đếm số lượng tin nhắn trước đó
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  
  const isCloseToTop = ({ contentOffset }: any) => {
    const paddingToTop = 100;
    return contentOffset.y <= paddingToTop;
  };  
  
  const {
    messages: fetchedMessages,
    loading: messagesLoading,
    error,
    loadMoreMessages,
    hasMore,
  } = useChat('', 30, friendId);

  useEffect(() => {
    ProfileService.getId().then((id) => {
      if (id) {
        setMyId(id);
      } else {
        console.log("Không thể lấy myId");
      }
    }).catch((error) => {
      console.log("Lỗi khi lấy myId: ", error);
    });
  }, []);  

  /* Xử lý nhận tin nhắn mới qua socket */
  useEffect(() => {
    const handleReceiveMessage = (data: {
      senderId: number;
      message: {
        type: 'text' | 'image' | 'video';
        text?: string;
        mediaUrl?: string;
        createdAt: string;
      };
    }) => {
      if (data.senderId !== friendId) return;

      const newMsg: Message = {
        senderId: data.senderId,
        recipientId: myId!,
        message: data.message,
      };

      Vibration.vibrate(200);
      setMessages((prev) => [newMsg, ...prev]);
    };

    socket?.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket?.off('receiveMessage', handleReceiveMessage);
    };
  }, [friendId, myId]);

  // Xử lý cuộn FlatList khi có tin nhắn mới
  useEffect(() => {
    if (!flatListRef.current) return;
  
    if (!isUserScrolling.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      setShowNewMessageAlert(false);
    } else {
      setShowNewMessageAlert(true);
    }
  }, [messages]);

  /* Hàm gửi tin nhắn */
  const sendMessage = (type: 'text' | 'image' | 'video', content: string) => {
    if (!myId) return;

    const newMsg: Message = {
      senderId: myId,
      recipientId: friendId,
      message: {
        type,
        ...(type === 'text' && { text: content }),
        ...(type !== 'text' && { mediaUrl: content }),
        createdAt: new Date().toISOString(),
      },
    };

    setMessages((prev) => [newMsg, ...prev]); 

    // Gửi tin nhắn qua socket
    if (socket?.connected) {
      console.log('Gửi tin nhắn:', newMsg);
      socket.emit('sendMessage', newMsg, (response: any) => {
        if (!response.success) {
          alert('Gửi tin nhắn không thành công');
        }
      });
    } else {
      alert('Mất kết nối với server');
    }
  };

  /* Gộp tin nhắn từ server và tin nhắn mới */
  const combinedMessages = [
    ...new Map([...messages, ...fetchedMessages].map(item => [item.message.createdAt, item])).values(),
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessage('text', newMessage);
    setNewMessage('');
  };

  /* Mở camera để chụp ảnh/gửi video */
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Không có quyền truy cập camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const type = asset.type;

      if (type === 'image') sendMessage('image', uri);
      else if (type === 'video') sendMessage('video', uri);
    }
  };

  /* Mở thư viện để chọn ảnh/video */
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Không có quyền truy cập thư viện');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const type = asset.type;

      if (type === 'image') sendMessage('image', uri);
      else if (type === 'video') sendMessage('video', uri);
    }
  };

  /* Xử lý cuộn và cập nhật chiều cao nội dung */
  const onContentSizeChange = () => {
    previousMessageCount.current = messages.length;
  };

  const handleScroll = (event: any) => {
    const closeToTop = isCloseToTop(event.nativeEvent);
    isUserScrolling.current = !closeToTop;
    if (closeToTop) {
      setShowNewMessageAlert(false); 
    }
  };  

  if (messagesLoading) return <Text>Đang tải...</Text>;
  if (error) return <Text>{error}</Text>;

  // Format thời gian tin nhắn
  const formatMessengerTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
  
    const isToday = date.toDateString() === now.toDateString();
  
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  
    const isSameYear = date.getFullYear() === now.getFullYear();
  
    if (isSameYear) {
      return `${date.getDate()} thg ${date.getMonth() + 1}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  
    return `${date.getDate()} thg ${date.getMonth() + 1}, ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.message}>
        <StatusBar barStyle="default" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" style={styles.backButton} />
          </TouchableOpacity>
          <Image source={avatar ? { uri: avatar } : require('../../assets/avatar_placeholder.png')} style={styles.avatar} />
          <View style={styles.headerTitle}>
            <Text style={styles.name}>{friendName}</Text>
            <Text style={styles.username}>{friendUsername}</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={combinedMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              {item.message?.createdAt && (
                <Text style={styles.time}>
                  {formatMessengerTime(item.message.createdAt)}
                </Text>
              )}

              <View
                style={[ 
                  styles.messageBubble, 
                  item.senderId === myId ? styles.myMessage : styles.friendMessage 
                ]}>
                {item.message?.type === 'text' && (
                  <Text
                    style={[ 
                      item.senderId === myId ? styles.myMessageText : styles.friendMessageText 
                    ]}
                  >
                    {item.message.text}
                  </Text>
                )}
                {item.message?.type === 'image' && item.message.mediaUrl && (
                  <Image source={{ uri: item.message.mediaUrl }} style={styles.image} resizeMode="contain" />
                )}
                {item.message?.type === 'video' && item.message.mediaUrl && (
                  <Video source={{ uri: item.message.mediaUrl }} style={styles.video} resizeMode="contain" paused={true} />
                )}

                {item.postId && (
                  <View>
                    {item.post.urlPublicImage && (
                      <Image source={{ uri: item.post.urlPublicImage }} style={styles.image} resizeMode="contain" />
                    )}
                    {item.post.urlPublicVideo && (
                      <Video source={{ uri: item.post.urlPublicVideo }} style={styles.video} resizeMode="contain" paused={true} />
                    )}
                  </View>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          inverted
          onContentSizeChange={onContentSizeChange}
          onScroll={handleScroll}
          scrollEventThrottle={100}
        />
        {showNewMessageAlert && (
          <TouchableOpacity
            style={styles.newMessageAlert}
            onPress={() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
              setShowNewMessageAlert(false);
            }}
          >
            <Text style={styles.newMessageText}>Tin nhắn mới</Text>
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={openCamera} style={styles.iconsButton}>
            <Ionicons name="camera" style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={styles.iconsButton}>
            <Ionicons name="image" style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.iconsButton}>
            <Ionicons name="mic" style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.iconsButton}>
            <MaterialCommunityIcons name="sticker-emoji" style={styles.icons} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Gửi tin nhắn..."
              placeholderTextColor={Colors.secondary_text}
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons name="send" style={styles.iconSend} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
