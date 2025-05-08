import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../networking/apiclient';

const useMessage = (cursor: string, limit: number, friendId: number) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);  
  const [nextCursor, setNextCursor] = useState<string | null>(null); 

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
      setMessages(prevMessages => (cursor === messages[0]?.createdAt ? prevMessages : [...data.messages, ...prevMessages]));  
      setHasMore(data.hasMore);  
      setNextCursor(data.nextCursor);  
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [friendId, limit, messages]);

  useEffect(() => {
    if (cursor) {
      fetchMessages(cursor); 
    }
  }, [cursor, fetchMessages]);

  const loadMoreMessages = () => {
    if (!loading && hasMore && nextCursor) {
      fetchMessages(nextCursor);  
    }
  };

  return { messages, loading, error, loadMoreMessages, hasMore };
};

export default useMessage;
