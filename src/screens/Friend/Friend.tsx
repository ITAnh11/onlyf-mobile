import React, { useState } from 'react';
import { View, StyleSheet, SectionList, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import FriendList from './components/friend_list';
import FriendRequestList from './components/friend_requests';
import FriendSearch from './components/search';
import SentFriendRequestList from './components/friend_sent_request';
import styles from './styles';

type Props = {
  navigation: NavigationProp<any>;
};

const Friend: React.FC<Props> = ({ navigation }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const sections = [
    { key: 'friends', title: 'Bạn bè của bạn', data: [{}] },
    { key: 'requests', title: 'Yêu cầu kết bạn', data: [{}] },
    { key: 'sent', title: 'Đã gửi yêu cầu', data: [{}] },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Bạn bè</Text>
      </View>

      <View style={styles.searchContainer}>
        <FriendSearch 
          onUserSelect={(user) => console.log(user)} 
          onRequestSent={triggerRefresh}
          refreshCounter={refreshCounter}
        />
      </View>

      <SectionList
        contentContainerStyle={styles.container}
        sections={sections}
        keyExtractor={(item, index) => String(index)}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ section }) => {
          switch (section.key) {
            case 'friends':
              return <FriendList refreshCounter={refreshCounter} onRefresh={triggerRefresh} />;
            case 'requests':
              return (
                <FriendRequestList
                  refreshCounter={refreshCounter}
                  onRefresh={triggerRefresh}
                />
              );
            case 'sent':
              return <SentFriendRequestList refreshCounter={refreshCounter} onRequestSent={triggerRefresh} />;
            default:
              return null;
          }
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default Friend;
