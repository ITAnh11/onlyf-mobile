import { useEffect, useState } from "react";
import useFriends from "./useFriend";
import useRequests from "./useRequest";
import useSentRequests from "./useSentRequest";
import ProfileService from "../../../services/profile.service";

export type FriendStatus = 'me' | 'friend' | 'pending_sent' | 'pending_received' | 'none';

export default function useFriendStatus(userId: number, overrideStatus?: FriendStatus) {
  const { friends, fetchFriends } = useFriends(true); 
  const { requests, fetchFriendRequests } = useRequests(true);
  const { sentRequests, fetchSentRequests } = useSentRequests(true);

  const [status, setStatus] = useState<FriendStatus>('none');
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    ProfileService.getId().then(setMyId);
  }, []);

  useEffect(() => {
    if (!myId) return;

    if (overrideStatus) {
      setStatus(overrideStatus);
    } else if (myId === userId) {
      setStatus('me');
    } else if (friends.some(friend => friend.friend.id === userId)) {
      setStatus('friend');
    } else if (sentRequests.some(request => request.receiver.id === userId)) {
      setStatus('pending_sent');
    } else if (requests.some(request => request.sender.id === userId)) {
      setStatus('pending_received');
    } else {
      setStatus('none');
    }
  }, [myId, userId, friends, requests, sentRequests, overrideStatus]);

  const refetchStatus = async () => {
    await Promise.all([
      fetchFriends(),
      fetchFriendRequests(),
      fetchSentRequests(),
    ]);
  };

  return { status: overrideStatus ?? status, refetchStatus };
}
