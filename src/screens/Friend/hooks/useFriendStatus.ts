import { useEffect, useState } from 'react';
import useFriends from './useFriend';
import useRequests from './useRequest';
import useSentRequests from './useSentRequest';
import ProfileService from '../../../services/profile.service';

export type FriendStatus = 'me' | 'friend' | 'pending_sent' | 'pending_received' | 'none';

export default function useFriendStatus(userId: number, overrideStatus?: FriendStatus): FriendStatus {
  const { friends, fetchFriends } = useFriends();
  const { requests, fetchFriendRequests } = useRequests();
  const { sentRequests, fetchSentRequests } = useSentRequests();
  const [status, setStatus] = useState<FriendStatus>('none');

  useEffect(() => {
    let isMounted = true; 

    const fetchStatus = async () => {
      const currentUserId = await ProfileService.getId();

      await Promise.all([
        fetchFriends(),
        fetchFriendRequests(),
        fetchSentRequests(),
      ]);

      if (!isMounted) return;

      if (overrideStatus) {
        setStatus(overrideStatus);
      } else if (currentUserId === userId) {
        setStatus('me');
      } else if (friends.some(friend => friend.id === userId)) {
        setStatus('friend');
      } else if (sentRequests.some(request => request.receiver.id === userId)) {
        setStatus('pending_sent');
      } else if (requests.some(request => request.sender.id === userId)) {
        setStatus('pending_received');
      } else {
        setStatus('none');
      }
    };

    fetchStatus();

    return () => {
      isMounted = false; 
    };
  }, [userId, overrideStatus]); 

  return overrideStatus ?? status;
}
