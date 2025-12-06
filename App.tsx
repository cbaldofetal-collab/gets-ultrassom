import React, { useState, useEffect, useCallback } from 'react';
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

  // Capturar erros globais não tratados (apenas uma vez)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleError = (event: ErrorEvent) => {
        // Ignorar erros do React 310 que são comuns em produção
        if (event.error?.message?.includes('Minified React error #310')) {
          console.warn('⚠️ Erro React 310 ignorado (comum em builds de produção)');
          event.preventDefault();
          return;
        }
        
        console.error('❌ Erro global capturado:', event.error);
        console.error('❌ Mensagem:', event.message);
        console.error('❌ Arquivo:', event.filename);
        console.error('❌ Linha:', event.lineno);
        console.error('❌ Coluna:', event.colno);
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        // Ignorar erros 403 que podem ser de extensões do Chrome
        if (event.reason?.code === 403 || event.reason?.httpStatus === 403) {
          event.preventDefault();
          return;
        }
        
        // Ignorar erros do React 310
        if (event.reason?.message?.includes('Minified React error #310')) {
          event.preventDefault();
          return;
        }
        
        // Verificar se o erro vem de extensões do Chrome
        const stack = String(event.reason?.stack || '');
        const reasonString = String(event.reason || '');
        
        // Ignorar erros de extensões do Chrome (content.js, background.js, etc.)
        if (
          stack.includes('content.js') ||
          stack.includes('background.js') ||
          stack.includes('extension://') ||
          stack.includes('chrome-extension://') ||
          reasonString.includes('chrome-extension://')
        ) {
          event.preventDefault();
          return;
        }
        
        // Ignorar objetos vazios ou sem propriedades úteis (geralmente de extensões)
        if (
          typeof event.reason === 'object' &&
          event.reason !== null &&
          !event.reason.message &&
          !event.reason.stack &&
          !event.reason.toString &&
          Object.keys(event.reason).length === 0
        ) {
          event.preventDefault();
          return;
        }
        
        // Ignorar erros que não têm stack trace e não são do nosso código
        if (!stack || (!stack.includes('AppEntry') && !stack.includes('gest-ultrassom') && !stack.includes('webpack'))) {
          // Se não tem stack trace útil e não é do nosso código, provavelmente é de extensão
          if (!event.reason?.message || event.reason.message === '[object Object]') {
            event.preventDefault();
            return;
          }
        }
        
        // Logar apenas erros relevantes do nosso código
        if (stack.includes('AppEntry') || stack.includes('gest-ultrassom') || stack.includes('webpack')) {
          console.error('❌ Promise rejeitada não tratada:', event.reason);
          console.error('❌ Stack:', stack);
        } else {
          // Ignorar outros erros que não são do nosso código
          event.preventDefault();
        }
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  // Verificar status do onboarding (apenas uma vez na montagem)
  useEffect(() => {
    checkOnboardingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleOnboardingComplete = useCallback(async () => {
    if (__DEV__) {
      console.log('🎉 handleOnboardingComplete chamado no App.tsx');
    }
    
    try {
      if (__DEV__) {
        console.log('💾 Salvando status do onboarding...');
      }
      
      await setOnboardingCompleted().catch((err) => {
        console.error('❌ Erro ao salvar onboarding (catch):', err);
        // Continuar mesmo com erro
      });
      
      if (__DEV__) {
        console.log('✅ Onboarding marcado como completo');
      }
      
      // Atualizar estado de forma síncrona
      setShowOnboarding(false);
      setForceUpdate(prev => prev + 1);
      
      // Aguardar um pouco e forçar atualização novamente para garantir
      setTimeout(() => {
        setShowOnboarding(false);
        setForceUpdate(prev => prev + 1);
      }, 100);
    } catch (error) {
      console.error('❌ Erro ao completar onboarding:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
      // Mesmo com erro, tentar navegar
      setShowOnboarding(false);
      setForceUpdate(prev => prev + 1);
    }
  }, []);

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

  // Log do estado atual para debug (apenas em desenvolvimento)
  useEffect(() => {
    if (__DEV__) {
      console.log('📊 App renderizado - showOnboarding:', showOnboarding, 'forceUpdate:', forceUpdate);
    }
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
