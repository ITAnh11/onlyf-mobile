import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import useRequests from '../hooks/useRequest'; 
import { acceptFriendRequest, rejectFriendRequest } from '../../../networking/friend.api';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Color';

type Props = {
  refreshCounter: number;
  onRefresh: () => void;
};

const FriendRequestList: React.FC<Props> = ({ refreshCounter, onRefresh }) => {
  const { requests, loading, error, fetchFriendRequests } = useRequests();
  const [showAll, setShowAll] = React.useState(false);
  const visibleRequests = showAll ? requests : requests.slice(0, 5);

  useEffect(() => {
    fetchFriendRequests();
  }, [refreshCounter]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      console.log('Friend request accepted!');
      fetchFriendRequests(); 
      onRefresh(); 
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await rejectFriendRequest(requestId);
      console.log('Friend request rejected!');
      fetchFriendRequests();
      onRefresh();
    } catch (err) {
      console.error('Error rejecting friend request:', err);
    }
  };

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

  return (
    <View style={styles.sectionContainer}>
      {requests.length === 0 ? (
        <Text style={styles.noFriendsText}>Không có lời mời kết bạn</Text>
      ) : (
        <FlatList
          data={visibleRequests}
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
              <TouchableOpacity onPress={() => handleAcceptRequest(item.id)} style={styles.button}>
                <Ionicons name="checkmark" size={24} color={Colors.primary_text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectRequest(item.id)} style={styles.button}>
                <Ionicons name="close" size={24} color={Colors.primary_text} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {!showAll && requests.length > 5 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.centered}>
          <Text style={styles.buttonText}>{showAll ? 'Ẩn bớt' : 'Xem thêm'}</Text>
        </TouchableOpacity>
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
    color: Colors.secondary_text,
    margin: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.error_text,
    margin: 10,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border_avt,
    marginRight: 20,
  },
  infoContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary_text,
  },
  username: {
    fontSize: 12,
    color: Colors.secondary_text,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 'auto',
    marginRight: 5,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: Colors.gray_button,
    color: Colors.secondary_text,
  },
});

export default React.memo(FriendRequestList);

