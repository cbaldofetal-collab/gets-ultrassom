// Store para gerenciamento do perfil gestacional

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PregnancyProfile } from '../types';
import { updatePregnancyProfile } from '../utils/gestational';

interface PregnancyState {
  profile: PregnancyProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: Partial<PregnancyProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = '@gest_ultrassom:pregnancy_profile';

export const usePregnancyStore = create<PregnancyState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: async (profileData: Partial<PregnancyProfile>) => {
    set({ isLoading: true, error: null });
    try {
      const currentProfile = get().profile;
      const updatedProfile = updatePregnancyProfile({
        ...currentProfile,
        ...profileData,
      } as Partial<PregnancyProfile>);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      set({ profile: updatedProfile, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar perfil gestacional';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const profileData = JSON.parse(stored);
        profileData.lastMenstrualPeriod = profileData.lastMenstrualPeriod ? new Date(profileData.lastMenstrualPeriod) : undefined;
        profileData.dueDate = profileData.dueDate ? new Date(profileData.dueDate) : undefined;
        profileData.firstUltrasoundDate = profileData.firstUltrasoundDate ? new Date(profileData.firstUltrasoundDate) : undefined;
        profileData.createdAt = new Date(profileData.createdAt);
        profileData.updatedAt = new Date(profileData.updatedAt);
        
        // Recalcular idade gestacional automaticamente com base na data atual
        const updatedProfile = updatePregnancyProfile(profileData);
        
        // Salvar apenas se a idade gestacional mudou (para evitar salvamentos desnecessários)
        const currentProfile = get().profile;
        if (!currentProfile || currentProfile.gestationalAge !== updatedProfile.gestationalAge) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
        }
        
        set({ profile: updatedProfile, isLoading: false, error: null });
      } else {
        set({ profile: null, isLoading: false, error: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar perfil gestacional';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearProfile: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ profile: null, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao limpar perfil gestacional';
      set({ error: errorMessage });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

