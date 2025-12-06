// Serviço para gerenciar status do onboarding

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ONBOARDING_KEY = '@gest_ultrassom:onboarding_completed';

// Helper para usar localStorage como fallback no web
const getStorageValue = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    // Fallback para localStorage no web
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (localStorageError) {
        console.warn('⚠️ Erro ao acessar localStorage:', localStorageError);
        return null;
      }
    }
    throw error;
  }
};

const setStorageValue = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Fallback para localStorage no web
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (localStorageError) {
        console.warn('⚠️ Erro ao salvar no localStorage:', localStorageError);
        throw localStorageError;
      }
    }
    throw error;
  }
};

const removeStorageValue = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Fallback para localStorage no web
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (localStorageError) {
        console.warn('⚠️ Erro ao remover do localStorage:', localStorageError);
        // Não relançar erro aqui, apenas logar
      }
    }
    // Não relançar erro aqui para não quebrar o fluxo
  }
};

export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await getStorageValue(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('❌ Erro ao verificar onboarding:', error);
    return false; // Em caso de erro, considerar não completo
  }
}

export async function setOnboardingCompleted(): Promise<void> {
  try {
    console.log('💾 setOnboardingCompleted: salvando no storage...');
    await setStorageValue(ONBOARDING_KEY, 'true');
    console.log('✅ setOnboardingCompleted: salvo com sucesso');
    
    // Verificar se foi salvo corretamente
    const value = await getStorageValue(ONBOARDING_KEY);
    console.log('✅ setOnboardingCompleted: valor verificado:', value);
    
    if (value !== 'true') {
      console.warn('⚠️ Valor não foi salvo corretamente, mas continuando...');
      // Não lançar erro aqui, apenas logar
    }
  } catch (error) {
    console.error('❌ Erro ao salvar onboarding:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    // Não relançar erro aqui para não quebrar o fluxo de onboarding
    // O usuário ainda pode continuar usando o app
  }
}

export async function clearOnboarding(): Promise<void> {
  try {
    await removeStorageValue(ONBOARDING_KEY);
  } catch (error) {
    console.error('❌ Erro ao limpar onboarding:', error);
    // Não relançar erro aqui
  }
}


