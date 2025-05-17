import apiClient from '../../../networking/apiclient';

export const fetchLatestMessage = async (friendId: number): Promise<any | null> => {
  try {
    const response = await apiClient.get('chat/get-messages', {
      params: {
        friendId,
        limit: 1
      }
    });

    const messages = response.data.messages;
    return messages.length > 0 ? messages[0] : null;
  } catch (err) {
    console.error('Lỗi khi fetch latest message:', err);
    return null;
  }
};
