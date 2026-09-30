import { io } from 'socket.io-client';

let socket = null;

const getSocketUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '');
  }
  // If running on Vite dev port 5173, connect directly to backend on 5000
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:5000';
  }
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
};

/**
 * Get or establish authenticated admin Socket.IO connection
 */
export const getAdminSocket = () => {
  const adminToken = localStorage.getItem('colorido_admin_token');
  if (!adminToken) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  if (socket) {
    // If socket already exists and has the same auth token, return it
    if (socket.auth?.token === adminToken) {
      if (!socket.connected) {
        socket.connect();
      }
      return socket;
    }
    // Token changed, recreate
    socket.disconnect();
    socket = null;
  }

  const serverUrl = getSocketUrl();
  socket = io(serverUrl, {
    auth: { token: adminToken },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('⚡ [Real-time] Connected to COLORIDO 2K26 Live Sync Server');
  });

  socket.on('disconnect', (reason) => {
    console.log('⚡ [Real-time] Disconnected from Live Sync Server:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('⚡ [Real-time] Connection notice:', err.message);
  });

  return socket;
};

/**
 * Disconnect socket on logout or view teardown
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
