import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StatusBar, Image, KeyboardAvoidingView, Platform,
  Vibration,
  TouchableWithoutFeedback, StyleSheet, 
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import ProfileService from '../../services/profile.service';
import Colors from '../../constants/Color';
import { getSocket } from '../../utils/socket';
import Video from 'react-native-video';
import useChat from './hooks/useChat';
import { FirebaseService } from '../../services/firebase.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { launchImageLibrary, Asset, launchCamera } from 'react-native-image-picker';

type Message = {
  senderId: number;
  recipientId: number;
  message: {
    type: 'text' | 'image' | 'video';
    text?: string;
    mediaUrl?: string;
    createdAt: string;
  };
  post?: {
    urlPublicImage?: string;
    hlsUrlVideo?: string;
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
  const flatListRef = useRef<FlatList>(null); 
  const isUserScrolling = useRef<boolean>(false); 
  const previousMessageCount = useRef<number>(0); 
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

  
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
  } = useChat('', 50, friendId);

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

  // Hàm xử lý media (ảnh hoặc video)
  const handleMedia = async (asset: Asset | undefined) => {
    if (!asset || !asset.uri || !asset.type) return;

    const uri = asset.uri;
    const type = asset.type;

    try {
      if (type.startsWith('image')) {
        const imageUrl = await FirebaseService.uploadImage_chat(uri);
        if (imageUrl) {
          sendMessage('image', imageUrl.urlPublicImageChat);
        }
      } else if (type.startsWith('video')) {
        const videoUrl = await CloudinaryService.uploadVideo_chat(uri);
        if (videoUrl) {
          sendMessage('video', videoUrl.urlPublicVideo); 
        }
      } else {
        console.warn('Không hỗ trợ định dạng media:', type);
      }
    } catch (error) {
      console.error('Lỗi khi upload media:', error);
    }
  };

  // Mở camera
  const openCamera = (mode: 'photo' | 'video') => {
    launchCamera(
      {
        mediaType: mode === 'photo' ? 'photo' : 'video',
        cameraType: 'back',
        videoQuality: 'high', 
        durationLimit: 60,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) {
          console.warn('Camera bị hủy hoặc lỗi:', response.errorMessage);
          return;
        }
        const asset = response.assets?.[0];
        await handleMedia(asset);
      }
    );
  };

  // Mở thư viện ảnh
  const openGallery = async () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
      },
      async (response) => {
        if (response.didCancel || response.errorCode) {
          console.warn('Gallery bị hủy hoặc lỗi:', response.errorMessage);
          return;
        }
        const asset = response.assets?.[0];
        await handleMedia(asset);
      }
    );
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
                {item.message.type === 'text' && (
                  <Text
                    style={[ 
                      item.senderId === myId ? styles.myMessageText : styles.friendMessageText 
                    ]}
                  >
                    {item.message.text}
                  </Text>
                )}
                {item.message.type === 'image' && item.message.mediaUrl && (
                  <TouchableOpacity onPress={() => {
                    setSelectedMedia({ type: 'image', url: item.message.mediaUrl });
                    setIsModalVisible(true);
                  }}>
                    <Image source={{ uri: item.message.mediaUrl }} style={styles.image} resizeMode="contain" />
                  </TouchableOpacity>                )}
                {item.message.type === 'video' && item.message.mediaUrl && (
                  <TouchableOpacity onPress={() => {
                    setSelectedMedia({ type: 'video', url: item.message.mediaUrl });
                    setIsModalVisible(true);
                  }}>
                    <Video source={{ uri: item.message.mediaUrl }} style={styles.video} controls repeat resizeMode="contain" paused={true} />
                  </TouchableOpacity>
                )}

                {item.postId && (
                  <TouchableOpacity>
                    {item.post.urlPublicImage && (
                      <TouchableOpacity onPress={() => {
                        setSelectedMedia({ type: 'image', url: item.post.urlPublicImage });
                        setIsModalVisible(true);
                      }}>
                        <Image source={{ uri: item.post.urlPublicImage }} style={styles.image} resizeMode="contain" />
                      </TouchableOpacity>
                    )}
                    {item.post.hlsUrlVideo && (
                      <TouchableOpacity onPress={() => {
                        setSelectedMedia({ type: 'video', url: item.post.hlsUrlVideo });
                        setIsModalVisible(true);
                      }}>
                        <Video source={{ uri: item.post.hlsUrlVideo }} style={styles.video} controls repeat resizeMode="contain" paused={true} />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
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
            <Ionicons name="chevron-down" style={styles.newMessageText}/>
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.iconsButton}>
            <Ionicons name="camera" style={styles.icons} />
          </TouchableOpacity>
          {showOptions && (
            <Modal
              transparent
              animationType="fade"
              visible={showOptions}
              onRequestClose={() => setShowOptions(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.optionBox}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowOptions(false);
                          openCamera('photo');
                        }}
                      >
                        <Text style={styles.option}>Chụp ảnh</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowOptions(false);
                          openCamera('video');
                        }}
                      >
                        <Text style={styles.option}>Quay video</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

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

          <Modal
            visible={isModalVisible}
            transparent={false}  // <-- quan trọng với video
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'black' }}>
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 20,
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>✕</Text>
              </TouchableOpacity>

              {/* Media Viewer */}
              {selectedMedia?.type === 'image' ? (
                <Image
                  source={{ uri: selectedMedia.url }}
                  style={{ flex: 1, resizeMode: 'contain' }}
                />
              ) : selectedMedia?.type === 'video' ? (
                <Video
                  source={{ uri: selectedMedia.url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  controls
                  paused={false} // <- Cho tự động chạy
                />
              ) : null}
            </View>
          </Modal>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
