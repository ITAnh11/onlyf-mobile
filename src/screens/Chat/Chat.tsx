import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StatusBar, Image, KeyboardAvoidingView, Platform} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import styles from './styles'; 
import ProfileService from '../../services/profile.service';
import Colors from '../../constants/Color';
import * as ImagePicker from 'expo-image-picker';
import { get } from 'lodash';
import { getSocket } from '../../utils/socket';

type Message = {
  id: number;
  content: string;
  createdAt: string;
  senderId: number; 
  type?: 'text' | 'image'; 
};

type Props = {
  navigation: any;
};

const Chat: React.FC<Props> = ({ navigation }) => {
  const socket = getSocket();
  const route = useRoute();
  const { friendId, friendName, friendUsername, avatar } = (route.params as { friendId: number; friendName: string; friendUsername: string, avatar: string }) || {};
  const [messages, setMessages] = useState<Message[]>([]);  // Tin nhắn cũ 
  const [newMessage, setNewMessage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    ProfileService.getId().then(setMyId);
  }, []);
  
  useEffect(() => {
    const handleReceiveMessage = (data: { senderId: number; message: string }) => {
      const newMsg: Message = {
        id: Date.now(), // hoặc tạo id khác nếu có backend sinh
        content: data.message,
        createdAt: new Date().toISOString(),
        senderId: data.senderId,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    };
  
    socket?.on('receiveMessage', handleReceiveMessage); // lắng nghe sự kiện nhận tin nhắn từ server
  
    return () => {
      socket?.off('receiveMessage', handleReceiveMessage); // cleanup để tránh trùng listener
    };
  }, [friendId]);  

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (!newMessage.trim()) return; // Không gửi nếu tin nhắn rỗng

    const message = {
      id: Date.now(), 
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderId: myId!,
    };

    // Gửi tin nhắn qua socket
    socket?.emit('sendMessage', { friendId, message });
    console.log('Gửi tin nhắn:', message);

    // Cập nhật tin nhắn trong ứng dụng
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage(''); // Reset tin nhắn sau khi gửi
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
        content: photoUri,
        senderId: myId!,
        createdAt: new Date().toISOString(),
      };
  
      setMessages(prev => [newMessage, ...prev]); // thêm tin nhắn mới vào đầu danh sách
    }
  };
  
  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}
    >
      <View style={styles.message}>
        <StatusBar barStyle="default" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" style={styles.backButton} />
          </TouchableOpacity>
          <Image
          source={avatar
          ? { uri: avatar }
          : require('../../assets/avatar_placeholder.png')}
          style={styles.avatar}
          />
          <View style={styles.headerTitle}>
          <Text style={styles.name}>{friendName}</Text>
          <Text style={styles.username}>{friendUsername}</Text>
          </View>
        </View>

        <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View
                style={[
                  styles.messageBubble,
                  item.senderId === myId ? styles.myMessage : styles.friendMessage,
                ]}
                >
                  <Text style={styles.messageText}>{item.content}</Text>
                  <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
            )}
            contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={openCamera} style={styles.iconsButton}>
            <Ionicons name="camera" style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.iconsButton}>
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
