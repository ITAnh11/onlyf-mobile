import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import useFriendStatus from '../hooks/useFriendStatus';
import type { FriendStatus } from '../hooks/useFriendStatus';
import { sendFriendRequest } from '../../../networking/friend.api';
import Colors from '../../../constants/Color';
import { NavigationProp } from '@react-navigation/native';

type User = {
  name: string;
  username: string;
  urlPublicAvatar?: string | null;
  user: {
    id: string;
  };
};

type Props = {
  navigation: NavigationProp<any>;
  user: User;
  onRequestSent?: () => void;
  refreshCounter?: number;
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
      return 'Đang nhận lời mời';
    case 'none':
    default:
      return '+ Kết bạn';
  }
};

const UserItem: React.FC<Props> = ({ user, refreshCounter, onRequestSent, navigation }) => {
  const { name, username, urlPublicAvatar, user: userInfo } = user;
  const { status, refetchStatus } = useFriendStatus(Number(userInfo?.id));
  const [isSending, setIsSending] = useState(false);

  const prevCounter = useRef(refreshCounter);
  useEffect(() => {
    if (refreshCounter !== prevCounter.current) {
      prevCounter.current = refreshCounter;
      refetchStatus();
    }
  }, [refreshCounter]);

  const handlePress = () => {
    if (status === 'none' && !isSending) {
      setIsSending(true);
      sendFriendRequest(Number(userInfo?.id))
        .then(() => {
          console.log('Friend request sent!');
          refetchStatus(); 
          onRequestSent?.();
        })
        .catch((error: any) => {
          if (error?.response?.status === 400) {
            Alert.alert('Danh sách bạn bè đã đầy', 'Bạn đã đạt đến giới hạn thêm bạn bè. Vui lòng nâng cấp tài khoản lên Premium để thêm bạn mới không giới hạn.',
              [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đồng ý', onPress: () => {
                  navigation.navigate('Payment')
                }}
              ]
            );
          }
          else {
            console.error('Error sending friend request:', error);
            Alert.alert('Không thể gửi lời mời', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
          }
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image
          source={
            urlPublicAvatar
              ? { uri: urlPublicAvatar }
              : require('../../../assets/avatar_placeholder.png')
          }
          style={styles.avatar}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>

      <TouchableOpacity
        onPress={handlePress}
        disabled={
          status === 'friend' ||
          status === 'pending_sent' ||
          status === 'pending_received' ||
          isSending
        }
      >
        <Text
          style={[
            styles.button,
            getButtonStyle(status),
            (status === 'me' || status === 'friend' || status === 'pending_sent' || status === 'pending_received' || isSending) && {
              opacity: 0.5,
            },
          ]}
        >
          {getButtonLabel(status)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getButtonStyle = (status: FriendStatus) => {
  switch (status) {
    case 'me':
      return { backgroundColor: Colors.background_for_button, color: Colors.primary_text };
    case 'friend':
      return { backgroundColor: Colors.background_for_button, color: Colors.primary_text };
    case 'pending_sent':
      return { backgroundColor: Colors.background_for_button, color: Colors.primary_text };
    case 'pending_received':
      return { backgroundColor: Colors.background_for_button, color: Colors.primary_text };
    case 'none':
    default:
      return { backgroundColor: Colors.yellow_button, color: Colors.tertiary_text };
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  info: {
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
    borderRadius: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserItem;
