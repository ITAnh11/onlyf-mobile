import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import useSentRequests from '../hooks/useSentRequest';
import { Ionicons } from '@expo/vector-icons';
import { revokeFriendRequest } from '../../../networking/friend.api';
import Colors from '../../../constants/Color';

type Props = {
  refreshCounter: number;
  onRequestSent?: () => void;
  onSentRequestCountChange?: (count: number) => void;
};

const SentFriendRequestList: React.FC<Props> = ({ refreshCounter, onRequestSent, onSentRequestCountChange }) => {
  const { sentRequests, loading, error, fetchSentRequests } = useSentRequests();
  const [showAll, setShowAll] = React.useState(false);
  const visibleSendRequests = showAll ? sentRequests : sentRequests.slice(0, 5);

  useEffect(() => {
    fetchSentRequests().then(() => {
      if (onSentRequestCountChange) {
        onSentRequestCountChange(sentRequests.length);
      }
    });
  }, [refreshCounter, sentRequests.length]);

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
        console.log('Yêu cầu kết bạn đã hủy thành công!');
        fetchSentRequests(); 
        onRequestSent?.();
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
          data={visibleSendRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={
                    item.receiver.profile.urlPublicAvatar
                      ? { uri: item.receiver.profile.urlPublicAvatar }
                      : require('../../../assets/avatar_placeholder.png')
                  }
                  style={styles.avatar}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.receiver.profile.name}</Text>
                <Text style={styles.username}>@{item.receiver.profile.username}</Text>
              </View>

              <TouchableOpacity onPress={() => { handleRevokeRequest(item.id) }} style={styles.button}>
                <Ionicons name='close' size={24} color={Colors.primary_text} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {!showAll && sentRequests.length > 5 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.centered}>
          <Text style={styles.buttonText}>
            {showAll ? 'Ẩn bớt' : 'Xem thêm'}
          </Text>
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

export default React.memo(SentFriendRequestList);
