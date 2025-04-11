import { useEffect, useState, useCallback } from 'react';
import apiClient from '../../../networking/apiclient';

export type FriendRequest = {
  id: number;
  sender: {
    id: number;
    profile: {
      name: string;
      username: string;
      urlPublicAvatar: string | null;
    };
  };
  status: string;
  createdAt: string;
};

export default function useRequests(initialFetch = false) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/friend/get-requests');
      setRequests(response.data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải lời mời:', err);
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchFriendRequests();
    }
  }, [initialFetch, fetchFriendRequests]);

  return { requests, loading, error, fetchFriendRequests };
}
