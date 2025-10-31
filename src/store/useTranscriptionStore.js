import { create } from "zustand";

export const useBtdSore = create((set) => ({
    totalData: null,
    setTotalData: (totalData) => set({total: totalData}),
    clearUser: () => set({user: null})
}));