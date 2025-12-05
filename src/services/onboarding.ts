// Serviço para gerenciar status do onboarding

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@gest_ultrassom:onboarding_completed';

export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Erro ao verificar onboarding:', error);
    return false;
  }
}

export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
    throw error;
  }
}

export async function clearOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Erro ao limpar onboarding:', error);
  }
}

