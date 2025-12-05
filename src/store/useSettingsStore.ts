// Store para configurações e preferências do usuário

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ReminderTimeOption = 1 | 2 | 4; // 1 semana, 2 semanas, 1 mês (4 semanas)

interface SettingsState {
  reminderWeeksBefore: ReminderTimeOption;
  isLoading: boolean;
  error: string | null;
  setReminderWeeksBefore: (weeks: ReminderTimeOption) => Promise<void>;
  loadSettings: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = '@gest_ultrassom:settings';
const DEFAULT_REMINDER_WEEKS = 2; // Padrão: 2 semanas antes

export const useSettingsStore = create<SettingsState>((set, get) => ({
  reminderWeeksBefore: DEFAULT_REMINDER_WEEKS,
  isLoading: false,
  error: null,

  setReminderWeeksBefore: async (weeks: ReminderTimeOption) => {
    set({ isLoading: true, error: null });
    try {
      const settings = {
        reminderWeeksBefore: weeks,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      set({ reminderWeeksBefore: weeks, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        set({
          reminderWeeksBefore: settings.reminderWeeksBefore || DEFAULT_REMINDER_WEEKS,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          reminderWeeksBefore: DEFAULT_REMINDER_WEEKS,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar configurações';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
});

