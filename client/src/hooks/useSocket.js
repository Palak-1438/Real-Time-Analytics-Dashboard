import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants/config';

export const useSocket = (url = SOCKET_URL) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(url);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return socket;
};
