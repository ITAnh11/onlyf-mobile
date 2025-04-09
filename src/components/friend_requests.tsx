import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import apiClient from '../networking/apiclient';

type FriendRequest = {
  id: number;
  sender: {
    id: number;
    profile: {
      name: string;
      urlPublicAvatar: string | null;
    };
  };
  status: string;
  createdAt: string;
};

const FriendRequestList: React.FC = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await apiClient.get('/friend/get-requests');
        console.log('Danh sách lời mời kết bạn:', response.data);
        setRequests(response.data);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.sectionContainer}>
      {requests.length === 0 ? (
        <Text style={styles.noFriendsText}>Không có lời mời kết bạn</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Image
                source={item.sender.profile.urlPublicAvatar
                  ? { uri: item.sender.profile.urlPublicAvatar }
                  : require('../assets/avatar_placeholder.png')}
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.sender.profile.name}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
  },
  noFriendsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    margin: 10,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: 'red',
    marginRight: 20,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FriendRequestList;
