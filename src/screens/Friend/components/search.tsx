import React from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserItem from './user_search_item'; 
import { useSearch, User } from '../hooks/useSearch';

type FriendSearchProps = {
  onUserSelect?: (user: User) => void;
};

const FriendSearch: React.FC<FriendSearchProps> = ({ onUserSelect }) => {
  const { searchText, setSearchText, results, loading } = useSearch();

  const renderItem = ({ item }: { item: User }) => {
    if (!item?.user?.id) return null;

    return (
      <UserItem
        user={item}
        onPress={() => onUserSelect?.(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={25} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm bạn bè..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 10 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item?.user.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  resultsContainer: {
    paddingTop: 10,
  },
});

export default FriendSearch;
