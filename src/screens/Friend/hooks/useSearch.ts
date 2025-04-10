import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import apiClient from '../../../networking/apiclient';

export type User = {
  name: string;
  username: string;
  urlPublicAvatar?: string | null;
  user: {
    id: string;
  };
  status: string;
};

export const useSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm tìm kiếm người dùng
  const doSearch = async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.get(`/friend/search-user?username=${text}`);
      const users = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];

      const filteredUsers = users.filter((user: any) => user?.user?.id);
      setResults(filteredUsers);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce để tránh gọi API liên tục
  const searchUsers = useCallback(
    _.debounce((text: string) => {
      doSearch(text);
    }, 500),
    []
  );

  useEffect(() => {
    searchUsers(searchText);
    return () => {
      searchUsers.cancel(); // cleanup debounce khi unmount
    };
  }, [searchText, searchUsers]);

  return {
    searchText,
    setSearchText,
    results,
    loading,
    refreshSearch: () => doSearch(searchText), // có thể gọi lại nếu cần
  };
};
