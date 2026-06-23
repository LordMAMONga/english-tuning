import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TestSessionState {
  sessionId: number | null;
  answers: Record<number, number>; // словарь вида { [questionId]: optionId }
  setSessionId: (id: number | null) => void;
  saveAnswer: (questionId: number, optionId: number) => void;
  clearSession: () => void;
}

export const useTestSessionStore = create<TestSessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      answers: {},
      setSessionId: (id) => set({ sessionId: id }),
      saveAnswer: (qId, optId) =>
        set((state) => ({
          answers: { ...state.answers, [qId]: optId },
        })),
      clearSession: () => set({ sessionId: null, answers: {} }),
    }),
    {
      name: "active_test_session",
    },
  ),
);
