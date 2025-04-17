import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserItem from './user_search_item';
import { useSearch, User } from '../hooks/useSearch';
import Colors from '../../../constants/Color';

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
  const [showAll, setShowAll] = React.useState(false);
  const visibleResults = showAll ? results : results.slice(0, 5);

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
        <Ionicons name="search" size={25} color={Colors.secondary_background} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm bạn bè..."
          placeholderTextColor={Colors.secondary_text}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <View>
          <FlatList
            data={visibleResults}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={{maxHeight: 400}}
            contentContainerStyle={styles.resultsContainer}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
      {!showAll && results.length > 5 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.centered}>
          <Text style={styles.buttonText}>
            {showAll ? 'Ẩn bớt' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: Colors.input_background,
    borderRadius: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.secondary_text,
  },
  loader: {
    marginTop: 10,
  },
  resultsContainer: {
    paddingTop: 5,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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

export default FriendSearch;
