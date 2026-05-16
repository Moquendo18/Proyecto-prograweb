import { useSocket } from '../context/SocketContext';
import { useState, useEffect, useCallback } from 'react';

export function useGiftEvents(transmisionId) {
  const { socket } = useSocket();
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleGift = (data) => {
      setCurrentAlert(data);
      setTimeout(() => setCurrentAlert(null), 4000);
    };

    const handleBalance = (data) => {
      // manejar actualización de balance
    };

    socket.on('gift-received', handleGift);
    socket.on('balance-update', handleBalance);

    return () => {
      socket.off('gift-received', handleGift);
      socket.off('balance-update', handleBalance);
    };
  }, [socket]);

  const sendGift = useCallback(
    (regaloId) => {
      if (!socket || !regaloId) return;
      socket.emit('send-gift', { regaloId });
    },
    [socket]
  );

  return { currentAlert, sendGift };
}
