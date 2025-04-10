import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import useRequests from '../hooks/useRequest'; 
import { acceptFriendRequest, rejectFriendRequest } from '../../../networking/friend.api';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  refreshFlag: boolean;
  onRefresh: () => void;
};

const FriendRequestList: React.FC<Props> = ({ refreshFlag }) => {
  const { requests, loading, error, fetchFriendRequests } = useRequests();

  useEffect(() => {
    fetchFriendRequests();
  }, [refreshFlag]); // gọi lại khi refreshFlag thay đổi

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải lời mời kết bạn...</Text>
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

  const handleAcceptRequest = (requestId: number) => {
    acceptFriendRequest(requestId)
      .then(() => {
        console.log('Friend request accepted!');
        fetchFriendRequests(); // cập nhật danh sách yêu cầu kết bạn sau khi chấp nhận
      })
      .catch((error: any) => {
        console.error('Error accepting friend request:', error);
      }
    );
  }

  const handleRejectRequest = (requestId: number) => {
    rejectFriendRequest(requestId)
      .then(() => {
        console.log('Friend request rejected!');
        fetchFriendRequests(); // cập nhật danh sách yêu cầu kết bạn sau khi từ chối
      })
      .catch((error: any) => {
        console.error('Error rejecting friend request:', error);
      }
    );  
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
                source={
                  item.sender.profile.urlPublicAvatar
                    ? { uri: item.sender.profile.urlPublicAvatar }
                    : require('../../../assets/avatar_placeholder.png')
                }
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.sender.profile.name}</Text>
                <Text style={styles.username}>@{item.sender.profile.username}</Text>
              </View>
              <TouchableOpacity onPress={() => {handleAcceptRequest(item.id)}} style={styles.button} >
                <Ionicons name="checkmark" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {handleRejectRequest(item.id)}} style={styles.button} >
                <Ionicons name="close" size={24} color="#000" />
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
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    color: '#888',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 'auto',
    borderWidth: 1,
    marginRight: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default FriendRequestList;
