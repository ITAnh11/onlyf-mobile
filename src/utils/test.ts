import io, { Socket } from 'socket.io-client';
import TokenService from '../services/token.service';

let socket: typeof Socket | null = null;

export const connectSocket = () => {
  socket = io('http://192.168.0.45:3000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 5000,
    auth: async (cb: any) => {
      try {
        const token = await TokenService.getAccessToken();
        cb({ token: `Bearer ${token}` });
      } catch (error) {
        console.error('❌ Failed to get token:', error);
      }
    },
  });

  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason: any) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error: any) => {
    console.log('❌ Socket connection error:', error.message);
  });

  socket.io.on('reconnect_attempt', async () => {
    // gọi lại getToken mỗi lần reconnect
    const token = await TokenService.getAccessToken();
    (socket! as any).auth = { token: `Bearer ${token}` };
    console.log('🔄 Reconnect attempt với token mới:', token);
  });
};

export const getSocket = (): typeof Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('🔴 Socket manually disconnected');
  }
};
