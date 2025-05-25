import { create } from "zustand";
import { persist } from "zustand/middleware";
export type User = {
  name: string;
  email: string;
  _id?: string;
  credit: number;
  subscriptionId?: string;
};
type GeneralStore = {
  user?: User;
  theme: "dark" | "light";
  setUser: (user: User | undefined) => void;
  clearUser: () => void;
  toggleTheme: () => void;
};
export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      user: undefined,
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: undefined }),
    }),
    { name: "general-store" }
  )
);
