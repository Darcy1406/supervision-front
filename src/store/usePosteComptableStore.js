import { create } from "zustand";

export const usePosteComptableStore = create((set) => ({
    poste_comptable: null,
    setPosteComptable: (data) => set({poste_comptable: data}),
    clearPosteComptable: () => set({poste_comptable: null})
}));