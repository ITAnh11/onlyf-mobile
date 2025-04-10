// Gọi API để lấy danh sách lời mời kết bạn
import { useEffect, useState, useCallback } from 'react';
import apiClient from '../../../networking/apiclient';
import TokenService from '../../../services/token.service';

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

export default function useRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/friend/get-requests');
      setRequests(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  return { requests, loading, error, fetchFriendRequests };
}
