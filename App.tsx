import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/theme';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { isOnboardingCompleted, setOnboardingCompleted } from './src/services/onboarding';
import { useUserStore, usePregnancyStore } from './src/store';

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
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await setOnboardingCompleted();
      setShowOnboarding(false);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
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
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        {showOnboarding ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <View style={styles.content}>
            {/* TODO: Adicionar navegação principal aqui */}
            <View style={styles.placeholder}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          </View>
        )}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
