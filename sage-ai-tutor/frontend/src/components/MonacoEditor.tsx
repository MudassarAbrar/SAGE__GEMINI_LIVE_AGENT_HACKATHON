import { Editor, useMonaco } from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import { useSessionStore } from '../store/useSessionStore';
import { useWebSocket } from '../hooks/useWebSocket';

export function MonacoEditor() {
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const { language } = useSessionStore();
  const { lastMessage, sendMessage } = useWebSocket();

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  // Effect to listen to specific backend events, like 'highlight_lines' or 'edit_code'
  useEffect(() => {
    if (!lastMessage || !editorRef.current) return;
    
    if (lastMessage.type === 'edit_code') {
      const currentCode = editorRef.current.getValue();
      if (currentCode !== lastMessage.payload.code) {
        editorRef.current.setValue(lastMessage.payload.code);
      }
    } else if (lastMessage.type === 'highlight_lines') {
       // example implementation for decorating lines later
       console.log('Decorating lines:', lastMessage.payload.lines);
    }
  }, [lastMessage]);

  // Handle local changes and optionally sync to backend periodically
  function handleEditorChange(value: string | undefined) {
      // Just a stub for when student types
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700">
      <Editor
        height="100%"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          padding: { top: 16 }
        }}
        language={language}
        defaultValue="// Start coding here..."
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}
