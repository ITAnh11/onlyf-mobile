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
import Colors from '../../constants/Color';

type Props = {
  navigation: NavigationProp<any>;
};

const Friend: React.FC<Props> = ({ navigation }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [sentRequestCount, setSentRequestCount] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const sections = [
    { key: 'friends', title: `Bạn bè của bạn (${friendCount})`, data: [{}] },
    { key: 'requests', title: `Yêu cầu kết bạn (${requestCount})`, data: [{}] },
    { key: 'sent', title: `Đã gửi yêu cầu (${sentRequestCount})`, data: [{}] },
  ];

  return (
    <View style={{ flex: 1 , backgroundColor: Colors.primary_background }}>
      <StatusBar style='light' />
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
          navigation={navigation}
        />
      </View>

      <View style={styles.sectionContainer}>
        <SectionList
          contentContainerStyle={styles.container}
          sections={sections}
          keyExtractor={(item, index) => String(index)}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          renderItem={({ section }) => {
            switch (section.key) {
              case 'friends':
                return <FriendList refreshCounter={refreshCounter} onRefresh={triggerRefresh} onFriendCountChange={setFriendCount} />;
              case 'requests':
                return (
                  <FriendRequestList
                    refreshCounter={refreshCounter}
                    onRefresh={triggerRefresh}
                    onRequestCountChange={setRequestCount}
                    navigation={navigation}
                  />
                );
              case 'sent':
                return <SentFriendRequestList refreshCounter={refreshCounter} onRequestSent={triggerRefresh} onSentRequestCountChange={setSentRequestCount} />;
              default:
                return null;
            }
          }}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
  );
};

export default Friend;
