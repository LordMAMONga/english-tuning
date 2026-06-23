export type PlanType = 'BASIC' | 'PREMIUM';

export interface CreatePaymentResponse {
  paymentId: number;
  amount: number;
  accountNumber: string;
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'PAID';
}

let pollAttempts = 0;

export const paymentApi = {
  createPayment: async (plan: PlanType): Promise<CreatePaymentResponse> => {
    pollAttempts = 0;
    await new Promise((r) => setTimeout(r, 600));
    return {
      paymentId: Math.floor(100000 + Math.random() * 900000),
      amount: plan === 'BASIC' ? 1000 : 2500,
      accountNumber: '+996 555 123 456',
    };
  },

  checkPaymentStatus: async (paymentId: number): Promise<PaymentStatusResponse> => {
    console.log("Тихий опрос БД для платежа №:", paymentId);
    pollAttempts++;
    await new Promise((r) => setTimeout(r, 300));
    if (pollAttempts >= 3) {
      return { status: 'PAID' };
    }
    return { status: 'PENDING' };
  },
};