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

type Message = {
  id: number;
  message: string;
  createdAt: string;
  senderId: number;
  recipientId?: number;
  type?: 'text' | 'image';
};

type Props = {
  navigation: any;
};

const Chat: React.FC<Props> = ({ navigation }) => {
  const socket = getSocket();
  const route = useRoute();
  const { friendId, friendName, friendUsername, avatar } = route.params as { friendId: number; friendName: string; friendUsername: string; avatar: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [myId, setMyId] = useState<number | null>(null);
  const { messages: fetchedMessages, loading: messagesLoading, error, loadMoreMessages, hasMore } = useMessage('', 20, friendId); 
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    ProfileService.getId().then(setMyId);
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (data: { senderId: number; message: string }) => {
      const newMsg: Message = {
        id: Date.now(),
        message: data.message,
        createdAt: new Date().toISOString(),
        senderId: data.senderId,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    };
  
    socket?.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket?.off('receiveMessage', handleReceiveMessage);
    };
  }, [friendId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return; // Kiểm tra tin nhắn rỗng
    
    if (myId == null) {
      alert('Không thể gửi tin nhắn vì không có ID người dùng');
      return;
    }
    
    const message: Message = {
      recipientId: friendId,
      senderId: myId,
      message: newMessage,
      createdAt: new Date().toISOString(),
      id: Date.now(),
      type: 'text',  
    };
  
    setMessages((prevMessages) => [...prevMessages, message]);
  
    if (socket?.connected) {
      socket.emit('sendMessage', message, (response: any) => {
        console.log('Response from server:', response);
        if (!response.success) {
          alert('Gửi tin nhắn không thành công');
        }
      });
    } else {
      alert('Mất kết nối với server');
    }
  
    setNewMessage(''); 
  };  

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Không có quyền truy cập camera');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
  
    if (!result.canceled) {
      const photoUri = result.assets[0].uri;

      const newMessage: Message = {
        id: Date.now(),
        type: 'image',
        message: photoUri,
        senderId: myId!,
        createdAt: new Date().toISOString(),
      };
  
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Không có quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      const photoUri = result.assets[0].uri;

      const newMessage: Message = {
        id: Date.now(),
        type: 'image',
        message: photoUri,
        senderId: myId!,
        createdAt: new Date().toISOString(),
      };
  
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (messagesLoading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

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
          data={[...fetchedMessages, ...messages]} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.senderId === myId ? styles.myMessage : styles.friendMessage]}>
              {item.type === 'image' ? (
                <Image source={{ uri: item.message }} style={styles.image} />
              ) : (
                <Text style={styles.messageText}>{item.message}</Text>
              )}
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
