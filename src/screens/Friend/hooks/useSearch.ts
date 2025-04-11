import { useState, useEffect, useRef, useCallback } from 'react';
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

  const doSearch = useCallback(async (text: string) => {
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
  }, []);  

  const debouncedSearch = useRef(_.debounce((text: string) => {
    doSearch(text);
  }, 500)).current;
  
  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText]);   

  return {
    searchText,
    setSearchText,
    results,
    loading,
    refreshSearch: () => doSearch(searchText),
  };
};
