import { create } from "zustand";

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const useAuth = create((set) => ({
  token: getInitialToken(),
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
    set({ token });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    set({ token: null });
  },
}));
