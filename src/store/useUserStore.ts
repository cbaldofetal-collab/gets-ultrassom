// Store para gerenciamento de usuário

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => Promise<void>;
  loadUser: () => Promise<void>;
  clearUser: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = '@gest_ultrassom:user';

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: async (user: User) => {
    set({ isLoading: true, error: null });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar usuário';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        user.createdAt = new Date(user.createdAt);
        set({ user, isLoading: false, error: null });
      } else {
        set({ user: null, isLoading: false, error: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar usuário';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearUser: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ user: null, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao limpar usuário';
      set({ error: errorMessage });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));


