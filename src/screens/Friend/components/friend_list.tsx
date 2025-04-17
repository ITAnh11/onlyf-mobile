import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import useFriends from '../hooks/useFriend';
import { unfriend } from '../../../networking/friend.api';
import Colors from '../../../constants/Color';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  refreshCounter: number;
  onRefresh: () => void;
};

const FriendList: React.FC<Props> = ({ refreshCounter, onRefresh }) => {
  const { friends,loading, error, fetchFriends } = useFriends(); 
  const [showAll, setShowAll] = React.useState(false);
  const visibleFriends = showAll ? friends : friends.slice(0, 5);

  useEffect(() => {
    fetchFriends(); 
  }, [refreshCounter]);

  const handleUnfriend = (friendId: number) => {
    Alert.alert(
      'Hủy kết bạn',
      'Bạn có chắc chắn muốn hủy kết bạn với người này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: () => {
          unfriend(friendId)
            .then(() => {
              console.log('Unfriend successful!');
              fetchFriends(); 
              onRefresh(); 
            })
            .catch((error) => {
              console.error('Error unfriending:', error);
            });
        }}
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Đang tải danh sách bạn bè...</Text>
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
      {friends.length === 0 ? (
        <Text style={styles.noFriendsText}>Chưa có bạn bè</Text>
      ) : (
        <FlatList
          data={visibleFriends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Image
                source={item.friend.profile.urlPublicAvatar
                  ? { uri: item.friend.profile.urlPublicAvatar }
                  : require('../../../assets/avatar_placeholder.png')}
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.friend.profile.name}</Text>
                <Text style={styles.username}>@{item.friend.profile.username}</Text>
              </View>
              <TouchableOpacity
                  onPress={() => {handleUnfriend(item.friend.id)}}
                  style={styles.unfriendButton}
                >
                  <Ionicons name="close" size={24} color={Colors.primary_text} />
                </TouchableOpacity>
            </View>
          )}
        />
      )}
      {!showAll && friends.length > 5 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.centered}>
          <Text style={styles.buttonText}>
            {showAll ? 'Ẩn bớt bạn bè' : 'Xem tất cả bạn bè'}
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border_avt,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.primary_text,
  },
  username: {
    fontSize: 12,
    color: Colors.secondary_text,
  },
  unfriendButton: {
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


export default React.memo(FriendList);

