
import { create } from 'zustand';

interface UserState {
    username: string | null;
    setUsername: (username: string | null) => void;
}

export const useStore = create<UserState>((set) => ({
    username: null,
    setUsername: (username) => set({ username }),
}));
