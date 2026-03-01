import { useCallback, useEffect, useRef, useState } from 'react';
import { useSessionStore } from '../store/useSessionStore';

export function useWebSocket() {
  const { sessionId } = useSessionStore();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!sessionId) return;
    
    // In dev, assuming backend runs on port 8000
    const wsUrl = `ws://localhost:8000/ws/${sessionId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WS Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WS Message:', data);
        setLastMessage(data);
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    ws.onclose = () => {
      console.log('WS Disconnected');
      setIsConnected(false);
      // Optional: Add reconnect logic here
    };

    wsRef.current = ws;
  }, [sessionId]);

  const sendMessage = useCallback((type: string, payload: any = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('Cannot send message, WS not open.');
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      connect();
    }
    return () => {
      wsRef.current?.close();
    };
  }, [sessionId, connect]);

  return { isConnected, sendMessage, lastMessage };
}
