import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import useSentRequests from '../hooks/useSentRequest';
import { Ionicons } from '@expo/vector-icons';
import { revokeFriendRequest } from '../../../networking/friend.api';

type Props = {
  refreshFlag: boolean;
  onRefresh: () => void;
};

const SentFriendRequestList: React.FC<Props> = ({ refreshFlag }) => {
  const { sentRequests, loading, error, fetchSentRequests } = useSentRequests();

  useEffect(() => {
    fetchSentRequests();
  }, [refreshFlag]); // gọi lại khi refreshFlag thay đổi

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải yêu cầu đã gửi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleRevokeRequest = (requestId: number) => {
    revokeFriendRequest(requestId)
      .then(() => {
        console.log('Friend request revoked!');
        fetchSentRequests(); // cập nhật danh sách yêu cầu đã gửi sau khi thu hồi
      })
      .catch((error: any) => {
        console.error('Error revoking friend request:', error);
      });
  };

  return (
    <View style={styles.sectionContainer}>
      {sentRequests.length === 0 ? (
        <Text style={styles.noFriendsText}>Không có lời mời đã gửi</Text>
      ) : (
        <FlatList
          data={sentRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Image
                source={
                  item.receiver.profile.urlPublicAvatar
                    ? { uri: item.receiver.profile.urlPublicAvatar }
                    : require('../../../assets/avatar_placeholder.png')
                }
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.receiver.profile.name}</Text>
                <Text style={styles.username}>@{item.receiver.profile.username}</Text>
              </View>

              <TouchableOpacity onPress={() => {handleRevokeRequest(item.id)}} style={styles.button}>
                <Ionicons name='close' size={21} color='#000' />
              </TouchableOpacity>
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
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
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
  username: {
    fontSize: 12,
    color: '#555',
  },
  button: {
    marginLeft: 'auto',
    marginRight: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default SentFriendRequestList;
