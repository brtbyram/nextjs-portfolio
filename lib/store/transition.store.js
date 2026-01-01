import { create } from "zustand";

export const useTransitionStore = create((set) => ({
  isSpaNavigation: false,
  setSpaNavigation: (v) => set({ isSpaNavigation: v }),
}));
