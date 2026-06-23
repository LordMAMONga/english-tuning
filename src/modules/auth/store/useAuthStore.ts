import { create } from "zustand";

export interface UserProfile {
  id: number;
  email: string;
  level: string | null;
  isPaid: boolean;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: () => boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("et_token"),
  user: JSON.parse(localStorage.getItem("et_user") || "null"),

  isAuthenticated: () => {
    return !!get().token;
  },

  setAuth: (token, user) => {
    localStorage.setItem("et_token", token);
    localStorage.setItem("et_user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("et_token");
    localStorage.removeItem("et_user");
    set({ token: null, user: null });
  },
}));
