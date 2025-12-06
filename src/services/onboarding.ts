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
    console.log('💾 setOnboardingCompleted: salvando no AsyncStorage...');
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    console.log('✅ setOnboardingCompleted: salvo com sucesso');
    
    // Verificar se foi salvo corretamente
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    console.log('✅ setOnboardingCompleted: valor verificado:', value);
    
    if (value !== 'true') {
      throw new Error('Valor não foi salvo corretamente');
    }
  } catch (error) {
    console.error('❌ Erro ao salvar onboarding:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
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


