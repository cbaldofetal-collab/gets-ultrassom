// Tela de onboarding - coleta DUM ou DPP

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card } from '../components';
import { useUserStore, usePregnancyStore } from '../store';
import { formatDate, formatDateFull } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type InputMethod = 'lmp' | 'dueDate';

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('lmp');
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tempLmpDate, setTempLmpDate] = useState('');
  const [tempDueDate, setTempDueDate] = useState('');

  const setUser = useUserStore((state) => state.setUser);
  const setProfile = usePregnancyStore((state) => state.setProfile);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        Alert.alert('Atenção', 'Por favor, informe seu nome');
        return;
      }
      setStep(2);
    }
  };

  const handleDateInput = (dateString: string, type: 'lmp' | 'dueDate') => {
    // Formato esperado: DD/MM/YYYY
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexed
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const date = new Date(year, month, day);
        if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
          if (type === 'lmp') {
            setLmpDate(date);
          } else {
            setDueDate(date);
          }
          return;
        }
      }
    }
    // Se não for válido, limpa
    if (type === 'lmp') {
      setLmpDate(null);
    } else {
      setDueDate(null);
    }
  };

  const handleComplete = async () => {
    // Validar dados
    if (inputMethod === 'lmp' && !lmpDate) {
      Alert.alert('Atenção', 'Por favor, informe a data da última menstruação');
      return;
    }

    if (inputMethod === 'dueDate' && !dueDate) {
      Alert.alert('Atenção', 'Por favor, informe a data prevista do parto');
      return;
    }

    try {
      // Criar usuário
      const user = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        createdAt: new Date(),
      };

      await setUser(user);

      // Criar perfil gestacional
      const profileData: any = {
        userId: user.id,
      };

      if (inputMethod === 'lmp' && lmpDate) {
        profileData.lastMenstrualPeriod = lmpDate;
      } else if (inputMethod === 'dueDate' && dueDate) {
        profileData.dueDate = dueDate;
      }

      await setProfile(profileData);

      // Aguardar um pouco para garantir que o estado foi atualizado
      await new Promise((resolve) => setTimeout(resolve, 100));

      onComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar suas informações';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao completar onboarding:', error);
    }
  };

  const progress = (step / 2) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>
                {step === 1 ? '👋' : '📅'}
              </Text>
            </View>
            <Text style={styles.title}>
              {step === 1 ? 'Bem-vinda ao Gest Ultrassom!' : 'Sua Gestação'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Vamos começar coletando algumas informações para personalizar sua experiência'
                : 'Informe a data da última menstruação ou a data prevista do parto'}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Passo {step} de 2
            </Text>
          </View>

          {step === 1 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>👤</Text>
                <Text style={styles.stepTitle}>Informações Pessoais</Text>
              </View>
              <Text style={styles.stepDescription}>
                Queremos conhecer você para oferecer uma experiência personalizada
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Maria Silva"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="words"
                  accessibilityLabel="Nome completo"
                />
              </View>
            </Card>
          )}

          {step === 2 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>🤰</Text>
                <Text style={styles.stepTitle}>Dados da Gestação</Text>
              </View>
              <Text style={styles.stepDescription}>
                Escolha como deseja informar sua gestação
              </Text>

              <View style={styles.methodSelector}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    inputMethod === 'lmp' && styles.methodButtonSelected,
                  ]}
                  onPress={() => {
                    setInputMethod('lmp');
                    setDueDate(null);
                    setTempDueDate('');
                  }}
                >
                  <Text style={styles.methodEmoji}>📆</Text>
                  <Text
                    style={[
                      styles.methodLabel,
                      inputMethod === 'lmp' && styles.methodLabelSelected,
                    ]}
                  >
                    Data da Última Menstruação (DUM)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    inputMethod === 'dueDate' && styles.methodButtonSelected,
                  ]}
                  onPress={() => {
                    setInputMethod('dueDate');
                    setLmpDate(null);
                    setTempLmpDate('');
                  }}
                >
                  <Text style={styles.methodEmoji}>👶</Text>
                  <Text
                    style={[
                      styles.methodLabel,
                      inputMethod === 'dueDate' && styles.methodLabelSelected,
                    ]}
                  >
                    Data Prevista do Parto (DPP)
                  </Text>
                </TouchableOpacity>
              </View>

              {inputMethod === 'lmp' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Data da Última Menstruação *</Text>
                  <TextInput
                    style={styles.input}
                    value={tempLmpDate}
                    onChangeText={(text) => {
                      setTempLmpDate(text);
                      handleDateInput(text, 'lmp');
                    }}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    maxLength={10}
                    accessibilityLabel="Data da última menstruação"
                  />
                  <Text style={styles.hint}>
                    Formato: DD/MM/AAAA (ex: 15/01/2024)
                  </Text>
                  {lmpDate && (
                    <View style={styles.preview}>
                      <Text style={styles.previewLabel}>Data informada:</Text>
                      <Text style={styles.previewValue}>
                        {formatDateFull(lmpDate)}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {inputMethod === 'dueDate' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Data Prevista do Parto *</Text>
                  <TextInput
                    style={styles.input}
                    value={tempDueDate}
                    onChangeText={(text) => {
                      setTempDueDate(text);
                      handleDateInput(text, 'dueDate');
                    }}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    maxLength={10}
                    accessibilityLabel="Data prevista do parto"
                  />
                  <Text style={styles.hint}>
                    Formato: DD/MM/AAAA (ex: 15/10/2024)
                  </Text>
                  {dueDate && (
                    <View style={styles.preview}>
                      <Text style={styles.previewLabel}>Data informada:</Text>
                      <Text style={styles.previewValue}>
                        {formatDateFull(dueDate)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Card>
          )}

          <View style={styles.buttons}>
            {step > 1 && (
              <Button
                title="Voltar"
                onPress={() => setStep(1)}
                variant="outline"
                style={styles.backButton}
              />
            )}
            <Button
              title={step === 2 ? 'Começar' : 'Próximo'}
              onPress={step === 2 ? handleComplete : handleNext}
              style={styles.nextButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  headerEmoji: {
    fontSize: 40,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  stepCard: {
    marginBottom: theme.spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepEmoji: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  stepTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    flex: 1,
  },
  stepDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  methodSelector: {
    marginBottom: theme.spacing.lg,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.divider,
    marginBottom: theme.spacing.sm,
  },
  methodButtonSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  methodEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  methodLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  methodLabelSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  preview: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.md,
  },
  previewLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  previewValue: {
    ...theme.typography.h3,
    color: theme.colors.secondaryDark,
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

