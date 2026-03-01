import { useState } from 'react';
import { useSessionStore } from './store/useSessionStore';
import { MonacoEditor } from './components/MonacoEditor';
import { SessionControls } from './components/SessionControls';
import { Code2 } from 'lucide-react';

function App() {
  const { status } = useSessionStore();

  return (
    <div className="h-screen w-full flex flex-col pt-6 pb-6 px-4 gap-4">
      {/* Header */}
      <header className="flex items-center gap-3 px-2">
        <Code2 className="text-blue-500 w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-tight">
          SAGE <span className="text-gray-400 font-normal">| Empathetic AI Tutor</span>
        </h1>
      </header>

      {/* Controls */}
      <SessionControls />

      {/* Main Content */}
      <main className="flex-1 flex gap-4 min-h-0">
        {/* Tutor Avatar/Status Area (Placeholder) */}
        <div className="w-80 bg-gray-800 rounded-lg border border-gray-700 p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">SAGE Monitor</h2>
          
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
               {status === 'idle' && (
                  <p className="text-gray-400 text-center">Start a session to begin.</p>
               )}
               {status === 'active' && (
                   <>
                   <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-blue-500/50">
                       <span className="text-4xl text-blue-500">🤖</span>
                   </div>
                   <p className="text-white font-medium mt-4">SAGE is listening & watching...</p>
                   <p className="text-gray-400 text-sm">Frustration: Detecting...</p>
                   </>
               )}
               {status === 'completed' && (
                   <div className="text-center">
                      <p className="text-green-400 font-medium mb-2">Session Completed!</p>
                      <button className="bg-green-600/20 text-green-400 border border-green-600/50 px-4 py-2 rounded w-full">
                          View Learning Card
                      </button>
                   </div>
               )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <MonacoEditor />
        </div>
      </main>
    </div>
  )
}

export default App
