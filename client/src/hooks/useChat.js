import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export function useChat(transmisionId) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket || !transmisionId) return;

    socket.emit('join-room', { transmisionId });

    fetch(`/api/lives/${transmisionId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('new-message', handleMessage);

    return () => {
      socket.off('new-message', handleMessage);
    };
  }, [socket, transmisionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    (mensaje) => {
      if (!socket || !mensaje?.trim()) return;
      socket.emit('send-message', { mensaje: mensaje.trim() });
    },
    [socket]
  );

  return { messages, sendMessage, loading, error, bottomRef };
}
