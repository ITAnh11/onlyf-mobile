// 
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import useFriendStatus, { FriendStatus } from '../hooks/useFriendStatus';
import { sendFriendRequest } from '../../../networking/friend.api';

type User = {
  name: string;
  username: string;
  urlPublicAvatar?: string | null;
  user: {
    id: string;
  };
};

type Props = {
  user: User;
  onPress?: () => void;
};

const getButtonLabel = (status: FriendStatus) => {
  switch (status) {
    case 'me':
      return 'Tôi';
    case 'friend':
      return 'Bạn bè';
    case 'pending_sent':
      return 'Đã gửi lời mời';
    case 'pending_received':
      return 'Bạn đang nhận lời mời';
    case 'none':
    default:
      return '+ Kết bạn';
  }
};

const UserItem: React.FC<Props> = ({ user }) => {
  const { name, username, urlPublicAvatar, user: userInfo } = user;
  const [localStatus, setLocalStatus] = useState<FriendStatus | null>(null);

  const status = useFriendStatus(Number(userInfo?.id), localStatus ?? undefined);
  const label = getButtonLabel(status);
  
  const handlePress = () => {
    if (status === 'none') {
      sendFriendRequest(Number(userInfo?.id))
        .then(() => {
          console.log('Friend request sent!');
          setLocalStatus('pending_sent');
          fetchSentRequests();
        })
        .catch((error: any) => {
          console.error('Error sending friend request:', error);
        });
    }
  };  

  return (
    <View style={styles.container}>
      <Image
        source={
          urlPublicAvatar
            ? { uri: urlPublicAvatar }
            : require('../../../assets/avatar_placeholder.png')
        }
        style={styles.avatar}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>

      <TouchableOpacity onPress={handlePress} disabled={status === 'friend' || status === 'pending_sent' || status == 'pending_received'}>
        <Text style={[styles.button, getButtonStyle(status),
          (status === 'friend' || status === 'pending_sent' || status === 'pending_received') && { opacity: 0.5 }
          ]}>  
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getButtonStyle = (status: FriendStatus) => {
  switch (status) {
    case 'friend':
      return { backgroundColor: '#aaa', color: '#fff' };
    case 'pending_sent':
      return { backgroundColor: '#aaa', color: '#fff' };
    case 'pending_received':
      return { backgroundColor: '#2196F3', color: '#000' };
    case 'none':
    default:
      return { backgroundColor: '#e4c2a5', color: '#000' };
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 16,
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
});

export default UserItem;
function fetchSentRequests() {
  throw new Error('Function not implemented.');
}

