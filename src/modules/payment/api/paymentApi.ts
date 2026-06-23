import { apiClient } from "@/shared/api/client";

export interface CreatePaymentResponse {
  id: number;
  amount: number;
  status: string;
  instructions: string;
  phoneNumber?: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  level: string | null;
  activeTariff: string | null;
}

const USE_MOCKS = true;

export const paymentApi = {
  createPayment: async (
    plan: "KIDS" | "ADULT" | "PERSONAL",
  ): Promise<CreatePaymentResponse> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 600));
      const mockPrices = { KIDS: 3500.42, ADULT: 3000.18, PERSONAL: 4500.74 };
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        amount: mockPrices[plan],
        status: "PENDING",
        phoneNumber: "+996 555 123 456",
        instructions: `Пожалуйста, переведите РОВНО ${mockPrices[plan]} сом на MBank по номеру: +996 555 123 456.\nВАЖНО: Сумма должна быть переведена с точностью до тыйынов (копеек)! Именно по этой уникальной сумме система автоматически выдаст вам доступ.`,
      };
    }

    const response = await apiClient.post<CreatePaymentResponse>(
      `/api/payments/create?plan=${plan}`,
    );
    return response.data;
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    if (USE_MOCKS) {
      return {
        id: 101,
        email: "student@gmail.com",
        level: "A2",
        activeTariff: null,
      };
    }

    const response = await apiClient.get<UserProfileResponse>("/api/users/me");
    return response.data;
  },
};
