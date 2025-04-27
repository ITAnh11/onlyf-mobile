import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import styles from './styles';
import useFriends from '../Friend/hooks/useFriend';
import useLatestMessage from './hooks/useMessage';

type Props = {
  navigation: NavigationProp<any>;
};

const Message: React.FC<Props> = ({ navigation }) => {
  const { friends, loading, error, fetchFriends } = useFriends();
  const [latestMessages, setLatestMessages] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string>(''); 

  useEffect(() => {
    fetchFriends(); 
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const limit = 1; 
      const messages = await Promise.all(
        friends.map(async (friend) => {
          const { messages } = await useLatestMessage(cursor, limit, friend.friend.id);
          const message = messages.length > 0 ? messages[0] : 'Chưa có tin nhắn';
          return { friendId: friend.friend.id, message };
        })
      );
      setLatestMessages(messages); 
    };

    if (friends.length > 0) {
      fetchMessages(); 
    }
  }, [friends, cursor]); 

  const goToChat = (friendId: number, friendName: string, friendUsername: string, avatar: string) => {
    navigation.navigate('Chat', { friendId, friendName, friendUsername, avatar });
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const latestMessage = latestMessages.find(msg => msg.friendId === item.friend.id)?.message || 'Chưa có tin nhắn';

    return (
      <TouchableOpacity
        onPress={() => goToChat(item.friend.id, item.friend.profile.name, item.friend.profile.username, item.friend.profile.urlPublicAvatar || '')}
        style={styles.chatItem}
      >
        <Image
          source={item.friend.profile.urlPublicAvatar
            ? { uri: item.friend.profile.urlPublicAvatar }
            : require('../../assets/avatar_placeholder.png')}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{item.friend.profile.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {latestMessage}
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
          data={friends}
          keyExtractor={(item) => item.friend.id.toString()}
          renderItem={renderChatItem}
        />
      )}
    </View>
  );
};

export default Message;
