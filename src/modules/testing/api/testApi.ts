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
  completed: boolean;
  currentBatch: number;
  finalResultLevel: string | null;
  totalCorrectAnswers?: number;
}

export const testApi = {
  startTest: async (userId: number): Promise<StartTestResponse> => {
    const response = await apiClient.post<StartTestResponse>(
      `/api/test/start?userId=${userId}`,
    );
    return response.data;
  },

  getNextBatch: async (sessionId: number): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>(
      `/api/test/${sessionId}/next-batch`,
    );
    return response.data;
  },

  submitBatch: async (
    sessionId: number,
    request: BatchAnswerRequest,
  ): Promise<TestResultResponse> => {
    const response = await apiClient.post<TestResultResponse>(
      `/api/test/${sessionId}/submit-batch`,
      request,
    );
    return response.data;
  },
};
