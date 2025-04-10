import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import useFriends from '../hooks/useFriend';
import { unfriend } from '../../../networking/friend.api';

type Props = {
  refreshFlag: boolean;
  onRefresh: () => void;
};

const FriendList: React.FC<Props> = ({ refreshFlag, onRefresh }) => {
  const { friends, fetchFriends } = useFriends(); 

  useEffect(() => {
    fetchFriends();
  }, [refreshFlag]);

  const handleUnfriend = (friendId: number) => {
    unfriend(friendId)
      .then(() => {
        console.log('Unfriend successful!');
        onRefresh(); // gọi lại hàm refresh từ component cha
      })
      .catch((error) => {
        console.error('Error unfriending:', error);
      }
    );
  }

  return (
    <View style={styles.sectionContainer}>
      {friends.length === 0 ? (
        <Text style={styles.noFriendsText}>Chưa có bạn bè</Text>
      ) : (
        <FlatList
          data={friends}
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
                  <Text style={styles.unfriendButtonText}>Hủy kết bạn</Text>
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
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    color: '#888',
  },
  unfriendButton: {
    marginTop: 5,
    backgroundColor: '#a3a',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  unfriendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FriendList;
