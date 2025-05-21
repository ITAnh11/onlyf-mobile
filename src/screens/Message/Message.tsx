import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import useFriends from '../Friend/hooks/useFriend';
import { fetchLatestMessages } from './hooks/useMessage';
import { getSocket } from '../../utils/socket';
import ProfileService from '../../services/profile.service';
import { format } from 'date-fns';

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
    ProfileService.getId()
      .then((id) => {
        if (id) setMyId(id);
        else console.log("Không thể lấy myId");
      })
      .catch((error) => console.log("Lỗi khi lấy myId: ", error));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchMessages = async () => {
        const allMessages = await fetchLatestMessages();

        const messages = allMessages
          .map((msg) => {
            const messageText =
              msg.message.type === 'text'
                ? msg.message.text
                : msg.message.type === 'image'
                ? 'Hình ảnh'
                : msg.message.type === 'video'
                ? 'Video'
                : '';

            return {
              friendId: msg.friendId,
              friend: friends.find(f => f.friend.id === msg.friendId)?.friend,
              senderId: msg.senderId,
              message: messageText,
              createdAt: msg.message.createdAt,
              status: msg.message.status,
            };
          })
          .filter((msg) => msg.friend);

        const sortedMessages = messages.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const allFriendIdsWithMessages = sortedMessages.map(msg => msg.friendId);
        const friendsWithoutMessages = friends
          .filter(f => !allFriendIdsWithMessages.includes(f.friend.id))
          .map(f => ({
            friendId: f.friend.id,
            friend: f.friend,
            message: '',
            createdAt: '',
            senderId: null,
            status: null,
          }));

        setLatestMessages([...sortedMessages, ...friendsWithoutMessages]);
      };

      if (friends.length > 0) fetchMessages();
    }, [friends])
  );

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const { senderId, message } = data;

      const messageText =
        message.type === 'text'
          ? message.text
          : message.type === 'image'
          ? 'Hình ảnh'
          : message.type === 'video'
          ? 'Video'
          : 'Tin nhắn';

      setLatestMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.friendId === senderId);
        const newMessage = {
          ...prev[existingIndex],
          message: messageText,
          createdAt: new Date().toISOString(),
          status: message.status,
        };

        let updatedList;
        if (existingIndex !== -1) {
          updatedList = [...prev];
          updatedList[existingIndex] = newMessage;
        } else {
          const friend = friends.find((f) => f.friend.id === senderId)?.friend;
          if (!friend) return prev;
          updatedList = [...prev, {
            friendId: senderId,
            friend,
            message: messageText,
            createdAt: new Date().toISOString(),
            senderId,
            status: message.status
          }];
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
    socket?.emit('markMessageAsRead', { senderId: friendId });

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
      const diffMs = now.getTime() - messageTime.getTime();
      const diffMin = diffMs / 60000;
      const diffHours = diffMin / 60;
      const diffDays = diffHours / 24;
      const diffWeeks = diffDays / 7;
      const diffYears = diffDays / 365;

      if (diffMin < 1) timeAgo = 'Vừa xong';
      else if (diffMin < 60) timeAgo = `${Math.floor(diffMin)} phút trước`;
      else if (diffHours < 24) timeAgo = `${Math.floor(diffHours)} giờ trước`;
      else if (diffDays < 2) timeAgo = 'Hôm qua';
      else if (diffDays < 7) timeAgo = `${Math.floor(diffDays)} ngày trước`;
      else if (diffWeeks < 5) timeAgo = `${Math.floor(diffWeeks)} tuần trước`;
      else timeAgo = diffYears < 1 ? format(messageTime, 'dd/MM') : format(messageTime, 'dd/MM/yyyy');
    }

    const isUnread = item.createdAt && item.senderId !== myId && item.status !== 'read';

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
        <View style={[styles.avatarWrapper, isUnread && styles.unreadAvatar]}>
          <Image
            source={
              item.friend.profile.urlPublicAvatar
                ? { uri: item.friend.profile.urlPublicAvatar }
                : require('../../assets/avatar_placeholder.png')
            }
            style={styles.avatar}
          />
        </View>

        <View>
          <Text style={[styles.name, isUnread && styles.unreadName]} numberOfLines={1}>
            {item.friend.profile.name}
            {timeAgo ? <Text style={[styles.timeAgo, isUnread && styles.unreadTimeAgo]}>{`  ·  ${timeAgo}`}</Text> : null}
          </Text>
          <Text style={[styles.lastMessage, isUnread && styles.unreadMessage]} numberOfLines={1}>
            {item.message
              ? `${item.senderId === myId ? 'Bạn: ' : ''}${item.message.length > 20 ? item.message.slice(0, 20) + '...' : item.message}`
              : 'Bắt đầu trò chuyện'}
          </Text>
        </View>
        {isUnread && (
          <Ionicons name="ellipse" style={styles.ellipse}/>
        )}
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
