import { useEffect, useState, useCallback } from 'react';
import apiClient from '../../../networking/apiclient';

export type SentFriendRequest = {
  userId: number;
  id: number;
  receiver: {
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

export default function useSentRequests(initialFetch = false) {
  const [sentRequests, setSentRequests] = useState<SentFriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSentRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/friend/get-sent-requests');
      setSentRequests(response.data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải lời mời đã gửi:', err);
      setError('Lỗi khi tải dữ liệu lời mời đã gửi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchSentRequests();
    }
  }, [initialFetch, fetchSentRequests]);

  return { sentRequests, loading, error, fetchSentRequests };
}
