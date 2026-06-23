import { apiClient } from "@/shared/api/client";

export interface QuestionOption {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

export interface StartTestResponse {
  id: number;
  userId: number;
  status: "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
}

const USE_MOCKS = true;

export const testApi = {
  startTest: async (userId: number): Promise<StartTestResponse> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 400));
      return {
        id: 888,
        userId,
        status: "IN_PROGRESS",
        createdAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<StartTestResponse>(
      `/api/test/start?userId=${userId}`,
    );
    return response.data;
  },

  getNextBatch: async (
    _sessionId: number,
    level: string = "A1",
  ): Promise<Question[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 500));
      const p = Math.floor(Math.random() * 800) + 10;
      return [
        {
          id: p + 1,
          text: `[Уровень ${level}] Выберите правильную форму: "Yesterday the developers ___ the core module."`,
          options: [
            { id: 1, text: "rewrote" },
            { id: 2, text: "rewrite" },
            { id: 3, text: "rewritten" },
          ],
        },
        {
          id: p + 2,
          text: `[Уровень ${level}] Заполните пропуск: "Our system is fully secured ___ unauthorized access."`,
          options: [
            { id: 1, text: "against" },
            { id: 2, text: "from" },
            { id: 3, text: "for" },
          ],
        },
        {
          id: p + 3,
          text: `[Уровень ${level}] Укажите наиболее точный синоним к слову "Mandatory":`,
          options: [
            { id: 1, text: "Required" },
            { id: 2, text: "Optional" },
            { id: 3, text: "Secondary" },
          ],
        },
      ];
    }
    const response = await apiClient.get<Question[]>(
      `/api/test/${_sessionId}/next-batch?level=${level}`,
    );
    return response.data;
  },
};
