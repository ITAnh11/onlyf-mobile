import apiClient from '../networking/apiclient';

/**
 * Gửi lời mời kết bạn
 * @param receiverId - ID của người nhận lời mời
 */
export const sendFriendRequest = async (receiverId: number) => {
  const res = await apiClient.post(`/friend/send-request?receiverId=${receiverId}`);
  return res.data;
};

/**
 * Chấp nhận lời mời kết bạn
 * @param requestId - ID của lời mời cần chấp nhận
 */
export const acceptFriendRequest = async (requestId: number) => {
  const res = await apiClient.post(`/friend/accept-request?requestId=${requestId}`);
  return res.data;
};

/**
 * Từ chối lời mời kết bạn
 * @param requestId - ID của lời mời cần từ chối
 */
export const rejectFriendRequest = async (requestId: number) => {
  const res = await apiClient.post(`/friend/reject-request?requestId=${requestId}`);
  return res.data;
};

/**
 * Thu hồi lời mời đã gửi
 * @param requestId - ID của lời mời đã gửi
 */
export const revokeFriendRequest = async (requestId: number) => {
  const res = await apiClient.delete(`/friend/revoke-request?requestId=${requestId}`);
  return res.data;
};

/**
 * Huỷ kết bạn
 * @param friendId - ID của người bạn cần huỷ kết bạn
 */
export const unfriend = async (friendId: number) => {
  const res = await apiClient.delete(`/friend/unfriend?friendId=${friendId}`);
  return res.data;
}