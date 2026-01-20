import { useRef, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import server from '../environment';

const useSocket = (roomId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    socketRef.current = io.connect(server, { secure: false });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setSocketId(socketRef.current.id);
      socketRef.current.emit('join-call', roomId);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      setSocketId(null);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  const emit = useCallback((event, ...args) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, ...args);
    }
  }, [isConnected]);

  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    socketId,
    emit,
    on,
    off,
  };
};

export default useSocket;
