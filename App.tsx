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
  const [forceUpdate, setForceUpdate] = useState(0);
  const loadUser = useUserStore((state) => state.loadUser);
  const loadProfile = usePregnancyStore((state) => state.loadProfile);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Capturar erros globais não tratados
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleError = (event: ErrorEvent) => {
        console.error('❌ Erro global capturado:', event.error);
        console.error('❌ Mensagem:', event.message);
        console.error('❌ Arquivo:', event.filename);
        console.error('❌ Linha:', event.lineno);
        console.error('❌ Coluna:', event.colno);
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        // Ignorar erros 403 que podem ser de extensões do Chrome
        if (event.reason?.code === 403 || event.reason?.httpStatus === 403) {
          console.warn('⚠️ Erro 403 ignorado (provavelmente de extensão do Chrome):', event.reason);
          event.preventDefault(); // Prevenir que apareça no console
          return;
        }
        
        console.error('❌ Promise rejeitada não tratada:', event.reason);
        console.error('❌ Stack:', event.reason?.stack);
        // Não prevenir o erro padrão para outros casos, para que possamos ver no console
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      await Promise.all([
        loadUser().catch((err) => {
          console.error('❌ Erro ao carregar usuário:', err);
          return null; // Continuar mesmo com erro
        }),
        loadProfile().catch((err) => {
          console.error('❌ Erro ao carregar perfil:', err);
          return null; // Continuar mesmo com erro
        }),
      ]);
      const completed = await isOnboardingCompleted().catch((err) => {
        console.error('❌ Erro ao verificar onboarding:', err);
        return false; // Em caso de erro, considerar não completo
      });
      setShowOnboarding(!completed);
    } catch (error) {
      console.error('❌ Erro ao verificar status do onboarding:', error);
      // Em caso de erro, mostrar onboarding para permitir que o usuário configure
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async () => {
    console.log('🎉 handleOnboardingComplete chamado no App.tsx');
    try {
      console.log('💾 Salvando status do onboarding...');
      await setOnboardingCompleted().catch((err) => {
        console.error('❌ Erro ao salvar onboarding (catch):', err);
        // Continuar mesmo com erro
      });
      console.log('✅ Onboarding marcado como completo');
      console.log('🔄 Atualizando showOnboarding para false...');
      console.log('📊 showOnboarding antes:', showOnboarding);
      
      // Forçar atualização do estado
      setShowOnboarding(false);
      setForceUpdate(prev => prev + 1);
      console.log('✅ setShowOnboarding(false) chamado');
      
      // Forçar múltiplas atualizações para garantir
      setTimeout(() => {
        console.log('🔄 Forçando atualização 1...');
        setShowOnboarding(false);
        setForceUpdate(prev => prev + 1);
      }, 50);
      
      setTimeout(() => {
        console.log('🔄 Forçando atualização 2...');
        setShowOnboarding(false);
        setForceUpdate(prev => prev + 1);
      }, 100);
      
      setTimeout(() => {
        console.log('🔄 Forçando atualização 3...');
        setShowOnboarding(false);
        setForceUpdate(prev => prev + 1);
        console.log('📊 showOnboarding após timeouts:', showOnboarding);
      }, 200);
    } catch (error) {
      console.error('❌ Erro ao completar onboarding:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
      // Mesmo com erro, tentar navegar
      setShowOnboarding(false);
      setForceUpdate(prev => prev + 1);
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

  // Log do estado atual para debug
  useEffect(() => {
    console.log('📊 App renderizado - showOnboarding:', showOnboarding, 'forceUpdate:', forceUpdate);
  }, [showOnboarding, forceUpdate]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          {showOnboarding ? (
            <OnboardingScreen onComplete={handleOnboardingComplete} key={`onboarding-${forceUpdate}`} />
          ) : (
            <NavigationContainer key={`nav-${forceUpdate}`}>
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
