import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserItem from './user_search_item';
import { useSearch, User } from '../hooks/useSearch';

type FriendSearchProps = {
  onUserSelect: (user: User) => void;
  onRequestSent?: () => void;
  refreshCounter: number;
};

const FriendSearch: React.FC<FriendSearchProps> = ({
  onUserSelect,
  onRequestSent,
  refreshCounter,
}) => {
  const { searchText, setSearchText, results, loading } = useSearch();

  const renderItem = useCallback(
    ({ item }: { item: User }) => {
      if (!item?.user?.id) return null;

      return (
        <UserItem
          user={item}
          onRequestSent={onRequestSent}
          refreshCounter={refreshCounter}
        />
      );
    },
    [onUserSelect, onRequestSent, refreshCounter]
  );

  const keyExtractor = useCallback(
    (item: User) => String(item.user.id),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={25} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm bạn bè..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsContainer}
          keyboardShouldPersistTaps="handled"
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loader: {
    marginTop: 10,
  },
  resultsContainer: {
    paddingTop: 5,
  },
});

export default FriendSearch;
