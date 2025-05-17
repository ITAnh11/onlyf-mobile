import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../../../networking/apiclient';

const useChat = (cursor: string, limit: number, friendId: number) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);  
  const [nextCursor, setNextCursor] = useState<string | null>(null); 
  const loadingRef = useRef(false);

  const fetchMessages = useCallback(async (cursor: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('chat/get-messages', {
        params: {
          cursor,
          limit,
          friendId,
        },
      });
      const data = response.data;
      
      setMessages(prevMessages => [...prevMessages, ...data.messages]);
      setHasMore(data.hasMore);  
      setNextCursor(data.nextCursor);  
    } catch (err) {
      setError('Không thể tải tin nhắn');
      console.error('Lỗi khi tải tin nhắn:', err);
    } finally {
      setLoading(false);
    }
  }, [friendId, limit]);

  useEffect(() => {
    fetchMessages(cursor); 
  }, [cursor, fetchMessages]);

  const loadMoreMessages = () => {
    if (loadingRef.current || !hasMore || !nextCursor) return;
  
    loadingRef.current = true;
  
    // Gọi API để tải thêm tin nhắn
    fetchMessages(nextCursor)
      .finally(() => {
        loadingRef.current = false;
      });
  };
  

  return { messages, loading, error, loadMoreMessages, hasMore };
};

export default useChat;
