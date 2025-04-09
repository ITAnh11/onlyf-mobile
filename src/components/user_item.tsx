import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

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

const UserItem: React.FC<Props> = ({ user}) => {
  const { name, username, urlPublicAvatar } = user;

  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={
          urlPublicAvatar
            ? { uri: urlPublicAvatar }
            : require('../assets/avatar_placeholder.png') 
        }
        style={styles.avatar}
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.button}>+ Thêm</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
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
    backgroundColor: 'yellow',
    color: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 16,
    textAlign: 'center',
    width: 100,
    height: 40,
    borderColor: 'black',
    borderWidth: 2,
  }
});

export default UserItem;
