import { useState } from 'react';
import { useSessionStore } from '../store/useSessionStore';
import { useWebSocket } from '../hooks/useWebSocket';

export function SessionControls() {
  const { status, language, topic, setLanguage, setTopic, startSession, endSession } = useSessionStore();
  const { isConnected, sendMessage } = useWebSocket();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    // Ping backend to start via HTTP
    try {
      const response = await fetch('http://localhost:8000/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language, topic })
      });
      const data = await response.json();
      startSession(data.session_id);
    } catch (error) {
      console.error('Failed to start session', error);
      // For fallback or dev testing
      startSession('test-session-123');
    } finally {
        setLoading(false);
    }
  };

  const handleEnd = () => {
    endSession();
    sendMessage('session_end', {});
  };

  const handlePing = () => {
      sendMessage('ping', { timestamp: Date.now() });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex gap-4 items-center justify-between border border-gray-700">
      <div className="flex gap-4">
        <select 
          className="bg-gray-700 text-white rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={status !== 'idle'}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Topic (optional)"
          className="bg-gray-700 text-white rounded px-2 py-1 w-48"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={status !== 'idle'}
        />
      </div>

      <div className="flex gap-4 items-center">
        {status === 'active' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
             {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        )}

        {status === 'idle' && (
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-semibold transition-colors"
            onClick={handleStart}
            disabled={loading}
          >
           {loading ? 'Starting...' : 'Start Session'}
          </button>
        )}

        {status === 'active' && (
           <>
              <button 
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition-colors"
                onClick={handlePing}
              >
              Ping Server
              </button>
              <button 
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-semibold transition-colors"
                onClick={handleEnd}
              >
              Stop Session
              </button>
           </>
        )}
      </div>
    </div>
  );
}
