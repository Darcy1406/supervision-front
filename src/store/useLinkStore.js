import { create } from "zustand";

export const useLinkStore = create((set) => ({
    link: null,
    setLink: (linkData) => set({link: linkData}),
    clearLink: () => set({link: null})
}));