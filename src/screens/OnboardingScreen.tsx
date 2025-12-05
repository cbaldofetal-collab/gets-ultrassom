// Tela de onboarding - coleta DUM ou DPP

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card, DatePicker, GestationalAgeInput } from '../components';
import { useUserStore, usePregnancyStore } from '../store';
import { formatDate, formatDateFull } from '../utils/date';
import { formatGestationalAge, weeksAndDaysToDecimal } from '../utils/gestational';
import { validateLMP, validateDueDate, validateFirstUltrasoundDate, validateGestationalAge } from '../utils/validation';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type InputMethod = 'lmp' | 'dueDate';

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('lmp');
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [hasUltrasound, setHasUltrasound] = useState<boolean | null>(null);
  const [ultrasoundDate, setUltrasoundDate] = useState<Date | null>(null);
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(0);
  const [ultrasoundDays, setUltrasoundDays] = useState(0);
  
  // Calcular datas mínimas e máximas
  const today = new Date();
  const maxLMPDate = new Date(today);
  maxLMPDate.setDate(maxLMPDate.getDate() - 7); // Mínimo 1 semana atrás
  const minLMPDate = new Date(today);
  minLMPDate.setFullYear(minLMPDate.getFullYear() - 1); // Máximo 1 ano atrás
  
  const minDueDate = new Date(today);
  minDueDate.setDate(minDueDate.getDate() + 7); // Mínimo 1 semana no futuro
  const maxDueDate = new Date(today);
  maxDueDate.setMonth(maxDueDate.getMonth() + 10); // Máximo 10 meses no futuro

  const setUser = useUserStore((state) => state.setUser);
  const setProfile = usePregnancyStore((state) => state.setProfile);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        Alert.alert('Atenção', 'Por favor, informe seu nome');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validar dados gestacionais
      if (inputMethod === 'lmp' && !lmpDate) {
        Alert.alert('Atenção', 'Por favor, informe a data da última menstruação');
        return;
      }
      if (inputMethod === 'dueDate' && !dueDate) {
        Alert.alert('Atenção', 'Por favor, informe a data prevista do parto');
        return;
      }
      // Perguntar sobre ultrassom
      setStep(3);
    }
  };

  const handleSkipUltrasound = () => {
    handleComplete();
  };


  const handleComplete = async () => {
    try {
      // Validar dados antes de salvar
      if (inputMethod === 'lmp' && lmpDate) {
        const validation = validateLMP(lmpDate);
        if (!validation.valid) {
          Alert.alert('Data Inválida', validation.error || 'Data da última menstruação inválida');
          return;
        }
      }

      if (inputMethod === 'dueDate' && dueDate) {
        const validation = validateDueDate(dueDate);
        if (!validation.valid) {
          Alert.alert('Data Inválida', validation.error || 'Data prevista do parto inválida');
          return;
        }
      }

      // Validar ultrassom se informado
      if (hasUltrasound && ultrasoundDate && (ultrasoundWeeks > 0 || ultrasoundDays > 0)) {
        const ageValidation = validateGestationalAge(ultrasoundWeeks, ultrasoundDays);
        if (!ageValidation.valid) {
          Alert.alert('Idade Gestacional Inválida', ageValidation.error || 'Idade gestacional inválida');
          return;
        }

        const dateValidation = validateFirstUltrasoundDate(ultrasoundDate, lmpDate || undefined);
        if (!dateValidation.valid) {
          Alert.alert('Data Inválida', dateValidation.error || 'Data do ultrassom inválida');
          return;
        }
      }

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

      // Adicionar dados do primeiro ultrassom se informados
      if (hasUltrasound && ultrasoundDate && (ultrasoundWeeks > 0 || ultrasoundDays > 0)) {
        profileData.firstUltrasoundDate = ultrasoundDate;
        profileData.firstUltrasoundGestationalAge = weeksAndDaysToDecimal(ultrasoundWeeks, ultrasoundDays);
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

  const totalSteps = hasUltrasound === null ? 2 : 3;
  const progress = (step / totalSteps) * 100;

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
              {step === 1 
                ? 'Bem-vinda ao Gest Ultrassom!' 
                : step === 2 
                ? 'Sua Gestação' 
                : 'Primeiro Ultrassom (Opcional)'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Vamos começar coletando algumas informações para personalizar sua experiência'
                : step === 2
                ? 'Informe a data da última menstruação ou a data prevista do parto'
                : 'Se você já fez o primeiro ultrassom, informe os dados para um cálculo mais preciso'}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Passo {step} de {hasUltrasound === null ? 2 : 3}
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
                  <DatePicker
                    label="Data da Última Menstruação *"
                    value={lmpDate}
                    onChange={(date) => setLmpDate(date)}
                    placeholder="Selecione a data da última menstruação"
                    maximumDate={maxLMPDate}
                    minimumDate={minLMPDate}
                  />
                  {lmpDate && (
                    <View style={styles.preview}>
                      <Text style={styles.previewLabel}>Data selecionada:</Text>
                      <Text style={styles.previewValue}>
                        {formatDateFull(lmpDate)}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {inputMethod === 'dueDate' && (
                <View style={styles.inputGroup}>
                  <DatePicker
                    label="Data Prevista do Parto *"
                    value={dueDate}
                    onChange={(date) => setDueDate(date)}
                    placeholder="Selecione a data prevista do parto"
                    minimumDate={minDueDate}
                    maximumDate={maxDueDate}
                  />
                  {dueDate && (
                    <View style={styles.preview}>
                      <Text style={styles.previewLabel}>Data selecionada:</Text>
                      <Text style={styles.previewValue}>
                        {formatDateFull(dueDate)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Card>
          )}

          {step === 3 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Primeiro Ultrassom (Opcional)</Text>
                <Text style={styles.stepDescription}>
                  Se você já fez o primeiro ultrassom, informe os dados abaixo para um cálculo mais preciso da idade gestacional.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.questionText}>Você já fez o primeiro ultrassom?</Text>
                <View style={styles.yesNoButtons}>
                  <TouchableOpacity
                    style={[
                      styles.yesNoButton,
                      hasUltrasound === true && styles.yesNoButtonSelected,
                    ]}
                    onPress={() => setHasUltrasound(true)}
                  >
                    <Text style={[
                      styles.yesNoButtonText,
                      hasUltrasound === true && styles.yesNoButtonTextSelected,
                    ]}>
                      Sim
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.yesNoButton,
                      hasUltrasound === false && styles.yesNoButtonSelected,
                    ]}
                    onPress={() => {
                      setHasUltrasound(false);
                      setUltrasoundDate(null);
                      setUltrasoundWeeks(0);
                      setUltrasoundDays(0);
                    }}
                  >
                    <Text style={[
                      styles.yesNoButtonText,
                      hasUltrasound === false && styles.yesNoButtonTextSelected,
                    ]}>
                      Não
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {hasUltrasound === true && (
                <>
                  <View style={styles.inputGroup}>
                    <DatePicker
                      label="Data do Primeiro Ultrassom"
                      value={ultrasoundDate}
                      onChange={setUltrasoundDate}
                      placeholder="Selecione a data"
                      maximumDate={today}
                      minimumDate={minLMPDate}
                    />
                  </View>

                  {ultrasoundDate && (
                    <View style={styles.inputGroup}>
                      <GestationalAgeInput
                        label="Idade Gestacional no Primeiro Ultrassom"
                        weeks={ultrasoundWeeks}
                        days={ultrasoundDays}
                        onChange={(weeks, days) => {
                          setUltrasoundWeeks(weeks);
                          setUltrasoundDays(days);
                        }}
                      />
                    </View>
                  )}
                </>
              )}
            </Card>
          )}

          <View style={styles.buttons}>
            {step > 1 && (
              <Button
                title="Voltar"
                onPress={() => {
                  if (step === 3) {
                    setStep(2);
                  } else {
                    setStep(1);
                  }
                }}
                variant="outline"
                style={styles.backButton}
              />
            )}
            {step === 3 ? (
              <>
                <Button
                  title="Pular"
                  onPress={handleSkipUltrasound}
                  variant="outline"
                  style={styles.skipButton}
                />
                <Button
                  title="Começar"
                  onPress={handleComplete}
                  style={styles.nextButton}
                />
              </>
            ) : (
              <Button
                title={step === 2 ? 'Próximo' : 'Próximo'}
                onPress={handleNext}
                style={styles.nextButton}
              />
            )}
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

