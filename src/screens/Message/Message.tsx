import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import useFriends from '../Friend/hooks/useFriend';
import { fetchLatestMessage } from './hooks/useMessage';
import { getSocket } from '../../utils/socket';
import ProfileService from '../../services/profile.service';
import { format, formatDistanceToNow } from 'date-fns';

type Props = {
  navigation: NavigationProp<any>;
};

const Message: React.FC<Props> = ({ navigation }) => {
  const socket = getSocket();
  const { friends, loading, error, fetchFriends } = useFriends();
  const [latestMessages, setLatestMessages] = useState<any[]>([]);
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

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
  
  useFocusEffect(
    useCallback(() => {
      const fetchMessages = async () => {
        const messages = await Promise.all(
          friends.map(async (friend) => {
            const msg = await fetchLatestMessage(friend.friend.id);
            const messageText =
              msg?.message.text || (msg?.message.mediaUrl ? 'Ảnh/Video' : 'Chưa có tin nhắn');

            return {
              friendId: friend.friend.id,
              friend: friend.friend,
              senderId: msg?.senderId || null,
              message: messageText,
              createdAt: msg?.message.createdAt || null,
            };
          })
        );

        const sortedMessages = messages.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setLatestMessages(sortedMessages);
      };

      if (friends.length > 0) {
        fetchMessages();
      }
    }, [friends])
  );

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const { senderId, message } = data;

      const messageText =
        message.type === 'text'
          ? message.text
          : message.type === 'image' || message.type === 'video'
          ? 'Ảnh/Video'
          : 'Tin nhắn';

      setLatestMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.friendId === senderId);
        const newMessage = {
          ...prev[existingIndex],
          message: messageText,
          createdAt: new Date().toISOString(),
        };

        let updatedList;
        if (existingIndex !== -1) {
          updatedList = [...prev];
          updatedList[existingIndex] = newMessage;
        } else {
          const friend = friends.find((f) => f.friend.id === senderId)?.friend;
          if (!friend) return prev;
          updatedList = [...prev, { friendId: senderId, friend, message: messageText, createdAt: new Date().toISOString() }];
        }

        return updatedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    };

    socket?.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket?.off('receiveMessage', handleReceiveMessage);
    };
  }, [friends]);

  const goToChat = (
    friendId: number,
    friendName: string,
    friendUsername: string,
    avatar: string
  ) => {
    navigation.navigate('Chat', {
      friendId,
      friendName,
      friendUsername,
      avatar,
    });
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const messageTime = item.createdAt ? new Date(item.createdAt) : null;
    let timeAgo = '';
  
    if (messageTime) {
      const now = new Date();
      const diffInMilliseconds = now.getTime() - messageTime.getTime();
      const diffInSeconds = diffInMilliseconds / 1000;
      const diffInMinutes = diffInSeconds / 60;
      const diffInHours = diffInMinutes / 60;
      const diffInDays = diffInHours / 24;
      const diffInWeeks = diffInDays / 7;
      const diffInYears = diffInDays / 365;
  
      if (diffInMinutes < 1) {
        timeAgo = 'Vừa xong';
      } else if (diffInMinutes < 60) {
        timeAgo = `${Math.floor(diffInMinutes)} phút trước`;
      } else if (diffInHours < 24) {
        timeAgo = `${Math.floor(diffInHours)} giờ trước`;
      } else if (diffInDays < 2) {
        timeAgo = 'Hôm qua';
      } else if (diffInDays < 7) {
        timeAgo = `${Math.floor(diffInDays)} ngày trước`;
      } else if (diffInWeeks < 5) {
        timeAgo = `${Math.floor(diffInWeeks)} tuần trước`;
      } else {
        timeAgo = diffInYears < 1
          ? format(messageTime, 'dd/MM')
          : format(messageTime, 'dd/MM/yyyy');
      }
    }
  
    return (
      <TouchableOpacity
        onPress={() =>
          goToChat(
            item.friend.id,
            item.friend.profile.name,
            item.friend.profile.username,
            item.friend.profile.urlPublicAvatar || ''
          )
        }
        style={styles.chatItem}
      >
        <Image
          source={
            item.friend.profile.urlPublicAvatar
              ? { uri: item.friend.profile.urlPublicAvatar }
              : require('../../assets/avatar_placeholder.png')
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>
            {item.friend.profile.name}
            {timeAgo ? <Text style={styles.timeAgo}>{`  ·  ${timeAgo}`}</Text> : null}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.senderId === myId ? 'Bạn: ' : ''}
            {item.message.length > 20
              ? item.message.slice(0, 20) + '...'
              : item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };  

  return (
    <View style={styles.message}>
      <StatusBar barStyle="default" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Tin nhắn</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={latestMessages}
          keyExtractor={(item) => item.friendId.toString()}
          renderItem={renderChatItem}
        />
      )}
    </View>
  );
};

export default Message;
