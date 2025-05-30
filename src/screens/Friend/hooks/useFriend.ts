import { useState, useCallback, useEffect } from 'react';
import apiClient from '../../../networking/apiclient';

export type Friend = {
  id: number;
  friend: {
    id: number;
    profile: {
      name: string;
      username: string;
      urlPublicAvatar: string | null;
    };
  };
};

export default function useFriends(initialFetch = false) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/friend/get-friends');
      setFriends(response.data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bạn bè:', err);
      setError('Lỗi khi tải danh sách bạn bè');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchFriends();
    }
  }, [initialFetch, fetchFriends]);

  return { friends, loading, error, fetchFriends };
}
