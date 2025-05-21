import apiClient from '../../../networking/apiclient';

export const fetchLatestMessages = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('chat/get-last-message-of-all-chats');
    return response.data; // Là một mảng các message object
  } catch (err) {
    console.error('Lỗi khi fetch latest messages:', err);
    return [];
  }
};
