import { create } from "zustand";

export const useDataUserStore = create((set) => ({
    data_user: null,
    setDataUser: (data) => set({data_user: data}),
    clearDataUser: () => set({data_user: null})
}));