import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/theme';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { isOnboardingCompleted, setOnboardingCompleted } from './src/services/onboarding';
import { useUserStore, usePregnancyStore } from './src/store';
import { ErrorBoundary } from './src/components';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const loadUser = useUserStore((state) => state.loadUser);
  const loadProfile = usePregnancyStore((state) => state.loadProfile);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      await Promise.all([loadUser(), loadProfile()]);
      const completed = await isOnboardingCompleted();
      setShowOnboarding(!completed);
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      // Em caso de erro, mostrar onboarding para permitir que o usuário configure
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async () => {
    console.log('🎉 handleOnboardingComplete chamado no App.tsx');
    try {
      console.log('💾 Salvando status do onboarding...');
      await setOnboardingCompleted();
      console.log('✅ Onboarding marcado como completo');
      console.log('🔄 Atualizando showOnboarding para false...');
      console.log('📊 showOnboarding antes:', showOnboarding);
      setShowOnboarding(false);
      console.log('✅ setShowOnboarding(false) chamado');
      
      // Forçar re-render se necessário
      setTimeout(() => {
        console.log('📊 showOnboarding após timeout:', showOnboarding);
        if (showOnboarding !== false) {
          console.warn('⚠️ showOnboarding ainda não é false, forçando atualização...');
          setShowOnboarding(false);
        }
      }, 100);
    } catch (error) {
      console.error('❌ Erro ao completar onboarding:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    }
  };

  // Mostrar loading enquanto verifica
  if (showOnboarding === null) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          {showOnboarding ? (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          ) : (
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          )}
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
