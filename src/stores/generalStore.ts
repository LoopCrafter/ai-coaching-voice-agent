import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  name: string;
  email: string;
  _id?: string;
  credit: number;
  subscriptionId?: string;
};
type GeneralStore = {
  user?: User;
  setUser: (user: User | undefined) => void;
  clearUser: () => void;
};
export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: undefined }),
    }),
    { name: "general-store" }
  )
);
