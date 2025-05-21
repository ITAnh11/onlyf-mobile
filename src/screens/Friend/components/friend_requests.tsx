import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import useRequests from '../hooks/useRequest'; 
import { acceptFriendRequest, rejectFriendRequest } from '../../../networking/friend.api';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Color';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
  refreshCounter: number;
  onRefresh: () => void;
  onRequestCountChange?: (count: number) => void;
};

const FriendRequestList: React.FC<Props> = ({ refreshCounter, onRefresh, onRequestCountChange, navigation }) => {
  const { requests, loading, error, fetchFriendRequests } = useRequests();
  const [showAll, setShowAll] = React.useState(false);
  const visibleRequests = showAll ? requests : requests.slice(0, 5);

  useEffect(() => {
    fetchFriendRequests().then(() => {
      if (onRequestCountChange) {
        onRequestCountChange(requests.length);
      }
    });
  }, [refreshCounter, requests.length]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      console.log('Kết bạn thành công!');
      fetchFriendRequests(); 
      onRefresh(); 
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        Alert.alert('Bạn bè đã đầy', 'Vui lòng nâng cấp tài khoản lên Premium để thêm bạn mới không giới hạn.',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Đồng ý', onPress: () => {
              navigation.navigate('Payment')
            }}
          ]
        );
      }
      else {
        console.error('Error accepting friend request:', err);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chấp nhận lời mời kết bạn. Vui lòng thử lại sau.');
      }
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await rejectFriendRequest(requestId);
      console.log('Từ chối lời mời kết bạn thành công!');
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
              <View style={styles.avatarWrapper}>
                <Image
                  source={
                    item.sender.profile.urlPublicAvatar
                      ? { uri: item.sender.profile.urlPublicAvatar }
                      : require('../../../assets/avatar_placeholder.png')
                  }
                  style={styles.avatar}
                />
              </View>
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
  avatarWrapper: {
    width: 60, 
    height: 60,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: Colors.border_avt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
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

