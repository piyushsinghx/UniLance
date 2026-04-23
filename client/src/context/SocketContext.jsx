import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = io(
        import.meta.env.VITE_API_URL || 'http://localhost:5000',
        {
          transports: ['websocket'],
        }
      );

      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        socketInstance.emit('addUser', user._id);
      });

      socketInstance.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
