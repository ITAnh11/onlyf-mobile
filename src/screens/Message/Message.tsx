import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import styles from './styles';
import useFriends from '../Friend/hooks/useFriend';

type Props = {
  navigation: NavigationProp<any>;
};

const Message: React.FC<Props> = ({ navigation }) => {
  const { friends, loading, error, fetchFriends } = useFriends();
  const mockFriendsWithMessages = friends.map((item, index) => ({
    ...item,
    lastMessage: {
      content: `Tin nhắn gần nhất với ${item.friend.profile.name}`,
      timestamp: new Date().toISOString(),
    }
  }));
  

  useEffect(() => {
    fetchFriends();
  }, []);

  const goToChat = (friendId: number, friendName: string, friendUsername: string, avatar: string) => {
    navigation.navigate('Chat', { friendId, friendName, friendUsername, avatar });
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
          data={mockFriendsWithMessages}
          keyExtractor={(item) => item.friend.id.toString()}
          renderItem={({ item }) => (
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
                  {item.lastMessage.content}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Message;
