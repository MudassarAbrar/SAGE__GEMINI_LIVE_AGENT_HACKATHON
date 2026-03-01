import { create } from 'zustand'

interface SessionState {
  sessionId: string | null;
  status: 'idle' | 'active' | 'completed';
  language: string;
  topic: string;
  setLanguage: (lang: string) => void;
  setTopic: (topic: string) => void;
  startSession: (id: string) => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  status: 'idle',
  language: 'python',
  topic: '',
  setLanguage: (lang) => set({ language: lang }),
  setTopic: (topic) => set({ topic }),
  startSession: (id) => set({ sessionId: id, status: 'active' }),
  endSession: () => set({ status: 'completed' }),
}))
