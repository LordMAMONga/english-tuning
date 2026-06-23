import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "./authApi";
import { useAuthStore, type UserProfile } from "../store/useAuthStore";

export function useGoogleAuthMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (idToken: string) => {
      const token = await authApi.loginWithGoogle(idToken);
      return token;
    },
    onSuccess: (token) => {
      const defaultProfile: UserProfile = {
        id: 1001,
        email: "tuning.student@gmail.com",
        level: null,
        isPaid: false,
      };
      setAuth(token, defaultProfile);
      navigate("/test");
    },
  });
}
