import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StatusBar, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import ProfileService from '../../services/profile.service';
import Colors from '../../constants/Color';
import * as ImagePicker from 'expo-image-picker';
import { getSocket } from '../../utils/socket';
import useMessage from '../Message/hooks/useMessage';
import Video from 'react-native-video';

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
  const {
    messages: fetchedMessages,
    loading: messagesLoading,
    error,
    loadMoreMessages,
    hasMore,
  } = useMessage('', 20, friendId);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    ProfileService.getId().then(setMyId);
  }, []);

  useEffect(() => {
    // Lắng nghe tin nhắn mới và xử lý sự kiện 'receiveMessage'
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
      setMessages((prev) => [...prev, newMsg]);
    };

    socket?.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket?.off('receiveMessage', handleReceiveMessage);
    };
  }, [friendId, myId]);

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

    setMessages((prev) => [...prev, newMsg]);

    if (socket?.connected) {
      socket.emit('sendMessage', newMsg, (response: any) => {
        if (!response.success) {
          alert('Gửi tin nhắn không thành công');
        }
      });
    } else {
      alert('Mất kết nối với server');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessage('text', newMessage);
    setNewMessage('');
  };

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

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (messagesLoading) return <Text>Đang tải...</Text>;
  if (error) return <Text>{error}</Text>;

  const combinedMessages = [...fetchedMessages, ...messages];

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
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderId === myId ? styles.myMessage : styles.friendMessage,
              ]}
            >
              {item.message.type === 'text' && <Text style={styles.messageText}>{item.message.text}</Text>}
              {item.message.type === 'image' && <Image source={{ uri: item.message.mediaUrl }} style={styles.image} resizeMode="contain" />}
              {item.message.type === 'video' && <Video source={{ uri: item.message.mediaUrl }} style={styles.video} resizeMode="contain" paused={true} />}
              
              <Text style={styles.time}>
                {new Date(item.message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
        />

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
