import { apiClient } from "@/shared/api/client";

export interface AuthResponse {
  token: string;
}

export const authApi = {
  loginWithGoogle: async (rawToken: string): Promise<string> => {
    const response = await apiClient.post<AuthResponse>("/oauth2/android", {
      idToken: rawToken,
    });
    return response.data.token;
  },
};
