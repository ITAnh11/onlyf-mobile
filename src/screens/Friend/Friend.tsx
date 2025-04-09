import React, { useState } from 'react';
import { View, StyleSheet, SectionList, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import FriendSearch from '../../components/search';
import { NavigationProp } from '@react-navigation/native';
import FriendList from '../../components/friend_list';
import FriendRequestList from '../../components/friend_requests';

type Props = {
  navigation: NavigationProp<any>;
};

const Friend: React.FC<Props> = ({ navigation }) => {
  const sections = [
    {
      title: 'Bạn bè của bạn',
      data: [<FriendList />], 
    },
    {
      title: 'Yêu cầu kết bạn',
      data: [<FriendRequestList />],
    },
    {
      title:'Đã gửi yêu cầu',
      data: [],
    }
  ];

  return (
    <SectionList
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View>
          <StatusBar />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
                        <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Bạn bè</Text>
          </View>
          <View style={styles.body}>
            {/* Ô tìm kiếm */}
            <FriendSearch onUserSelect={(user) => console.log(user)} />
          </View>
        </View>
      }
      sections={sections}
      keyExtractor={(item, index) => String(index)}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      renderItem={({ item }) => item} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'relative', 
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    padding: 10,
  },

});

export default Friend;
