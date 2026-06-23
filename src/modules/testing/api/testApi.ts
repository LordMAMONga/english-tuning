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
  status?: string;
  createdAt?: string;
}

export interface BatchAnswerRequest {
  selectedOptionIds: number[];
}

export interface TestResultResponse {
  completed?: boolean;
  isCompleted?: boolean;
  status?: string;
  finalLevel?: string | null;
  assignedLevel?: string | null;
  level?: string | null;
  nextLevel?: string;
}

const USE_MOCKS = false;

export const testApi = {
  startTest: async (userId: number): Promise<StartTestResponse> => {
    if (USE_MOCKS) {
      return { id: 1001, userId, status: "IN_PROGRESS" };
    }
    const response = await apiClient.post<StartTestResponse>(
      `/api/test/start?userId=${userId}`,
    );
    return response.data;
  },

  getNextBatch: async (sessionId: number): Promise<Question[]> => {
    if (USE_MOCKS) {
      return [
        {
          id: 99,
          text: "Choose the correct option: 'I ___ a software engineer.'",
          options: [
            { id: 1, text: "am" },
            { id: 2, text: "is" },
          ],
        },
      ];
    }
    const response = await apiClient.get<Question[]>(
      `/api/test/${sessionId}/next-batch`,
    );
    return response.data;
  },

  submitBatch: async (
    sessionId: number,
    request: BatchAnswerRequest,
  ): Promise<TestResultResponse> => {
    if (USE_MOCKS) {
      return { completed: false };
    }
    const response = await apiClient.post<TestResultResponse>(
      `/api/test/${sessionId}/submit-batch`,
      request,
    );
    return response.data;
  },
};
