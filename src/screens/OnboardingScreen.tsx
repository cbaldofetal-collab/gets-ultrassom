// Tela de onboarding - coleta DUM ou DPP

import React, { useState, useEffect } from 'react';
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
import { validatePassword, getPasswordStrength, PasswordValidationResult } from '../utils/passwordValidation';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type InputMethod = 'lmp' | 'dueDate';

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({ isValid: false, errors: [] });
  const [inputMethod, setInputMethod] = useState<InputMethod>('lmp');
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [hasUltrasound, setHasUltrasound] = useState<boolean | null>(null);
  const [ultrasoundDate, setUltrasoundDate] = useState<Date | null>(null);
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(0);
  const [ultrasoundDays, setUltrasoundDays] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  
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

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar senha quando mudar
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: false, errors: [] });
    }
  }, [password]);

  const handleNext = () => {
    console.log('🔵 handleNext chamado, step atual:', step);
    if (step === 1) {
      console.log('📝 Validando dados do step 1:', { name, email, password: password ? '***' : '' });
      const newErrors: { name?: string; email?: string; password?: string } = {};
      
      // Validar nome
      if (!name.trim()) {
        newErrors.name = 'Por favor, informe seu nome';
      }
      
      // Validar email
      if (!email.trim()) {
        newErrors.email = 'Por favor, informe seu email';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Por favor, informe um email válido';
      }
      
      // Validar senha
      if (!password) {
        newErrors.password = 'Por favor, informe uma senha';
      } else {
        const passwordCheck = validatePassword(password);
        if (!passwordCheck.isValid) {
          newErrors.password = passwordCheck.errors[0] || 'A senha não atende aos requisitos';
        }
      }
      
      // Se há erros, mostrar e não avançar
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        // Mostrar alert para garantir feedback (apenas em mobile)
        const errorMessages = Object.values(newErrors).filter(Boolean);
        if (errorMessages.length > 0) {
          if (Platform.OS !== 'web') {
            Alert.alert('Atenção', errorMessages.join('\n'));
          } else {
            // No web, apenas log no console
            console.error('❌ Erros de validação:', errorMessages);
          }
        }
        return;
      }
      
      // Limpar erros e avançar
      setErrors({});
      console.log('✅ Validações passadas, avançando para step 2');
      console.log('Dados:', { name, email, password: '***' });
      
      // Usar setTimeout para garantir que o estado seja atualizado
      setTimeout(() => {
        setStep(2);
        console.log('Step atualizado para 2');
      }, 0);
    } else if (step === 2) {
      // Validar dados gestacionais
      if (inputMethod === 'lmp' && !lmpDate) {
        if (Platform.OS !== 'web') {
          Alert.alert('Atenção', 'Por favor, informe a data da última menstruação');
        } else {
          console.error('❌ Erro: Por favor, informe a data da última menstruação');
        }
        return;
      }
      if (inputMethod === 'dueDate' && !dueDate) {
        if (Platform.OS !== 'web') {
          Alert.alert('Atenção', 'Por favor, informe a data prevista do parto');
        } else {
          console.error('❌ Erro: Por favor, informe a data prevista do parto');
        }
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
    console.log('🚀 handleComplete chamado');
    try {
      // Validar dados antes de salvar
      if (inputMethod === 'lmp' && lmpDate) {
        const validation = validateLMP(lmpDate);
        if (!validation.valid) {
          const errorMsg = validation.error || 'Data da última menstruação inválida';
          if (Platform.OS !== 'web') {
            Alert.alert('Data Inválida', errorMsg);
          } else {
            console.error('❌ Erro de validação:', errorMsg);
          }
          return;
        }
      }

      if (inputMethod === 'dueDate' && dueDate) {
        const validation = validateDueDate(dueDate);
        if (!validation.valid) {
          const errorMsg = validation.error || 'Data prevista do parto inválida';
          if (Platform.OS !== 'web') {
            Alert.alert('Data Inválida', errorMsg);
          } else {
            console.error('❌ Erro de validação:', errorMsg);
          }
          return;
        }
      }

      // Validar ultrassom se informado
      if (hasUltrasound === true) {
        // Se selecionou "Sim", deve preencher os dados
        if (!ultrasoundDate) {
          const errorMsg = 'Por favor, informe a data do primeiro ultrassom';
          console.error('❌ Erro de validação:', errorMsg);
          if (Platform.OS !== 'web') {
            Alert.alert('Atenção', errorMsg);
          }
          return;
        }

        if (ultrasoundWeeks === 0 && ultrasoundDays === 0) {
          const errorMsg = 'Por favor, informe a idade gestacional no primeiro ultrassom';
          console.error('❌ Erro de validação:', errorMsg);
          if (Platform.OS !== 'web') {
            Alert.alert('Atenção', errorMsg);
          }
          return;
        }

        // Validar idade gestacional
        const ageValidation = validateGestationalAge(ultrasoundWeeks, ultrasoundDays);
        if (!ageValidation.valid) {
          const errorMsg = ageValidation.error || 'Idade gestacional inválida';
          console.error('❌ Erro de validação:', errorMsg);
          if (Platform.OS !== 'web') {
            Alert.alert('Idade Gestacional Inválida', errorMsg);
          }
          return;
        }

        // Validar data do ultrassom
        const dateValidation = validateFirstUltrasoundDate(ultrasoundDate, lmpDate || undefined);
        if (!dateValidation.valid) {
          const errorMsg = dateValidation.error || 'Data do ultrassom inválida';
          console.error('❌ Erro de validação:', errorMsg);
          if (Platform.OS !== 'web') {
            Alert.alert('Data Inválida', errorMsg);
          }
          return;
        }
      }

      console.log('✅ Validações passadas, criando usuário...');

      // Criar usuário (senha será armazenada como hash em produção)
      const user = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password, // Em produção, usar hash (bcrypt, etc)
        createdAt: new Date(),
      };

      console.log('👤 Salvando usuário:', { ...user, password: '***' });
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
      if (hasUltrasound === true && ultrasoundDate && (ultrasoundWeeks > 0 || ultrasoundDays > 0)) {
        profileData.firstUltrasoundDate = ultrasoundDate;
        profileData.firstUltrasoundGestationalAge = weeksAndDaysToDecimal(ultrasoundWeeks, ultrasoundDays);
        console.log('🔬 Dados do ultrassom adicionados:', {
          date: ultrasoundDate,
          age: `${ultrasoundWeeks} semanas e ${ultrasoundDays} dias`,
        });
      } else {
        console.log('ℹ️ Nenhum dado de ultrassom para salvar');
      }

      console.log('📋 Salvando perfil gestacional:', profileData);
      await setProfile(profileData);

      // Aguardar um pouco para garantir que o estado foi atualizado
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log('✅ Dados salvos, chamando onComplete...');
      onComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar suas informações';
      console.error('❌ Erro ao completar onboarding:', error);
      if (Platform.OS !== 'web') {
        Alert.alert('Erro', errorMessage);
      } else {
        console.error('Erro:', errorMessage);
      }
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
                  style={[styles.input, inputFocused && styles.inputFocused]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Maria Silva"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="words"
                  accessibilityLabel="Nome completo"
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={[styles.input, emailFocused && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Ex: maria.silva@email.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Email"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha Alfanumérica *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, passwordFocused && styles.inputFocused, errors.password && styles.inputError]}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Mínimo 8 caracteres (letras e números)"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Senha"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {password && (
                  <View style={styles.passwordInfo}>
                    <View style={styles.strengthContainer}>
                      <View
                        style={[
                          styles.strengthBar,
                          {
                            width: `${
                              passwordValidation.isValid
                                ? password.length >= 12
                                  ? 100
                                  : 66
                                : password.length >= 8
                                ? 33
                                : 0
                            }%`,
                            backgroundColor: passwordValidation.isValid
                              ? password.length >= 12
                                ? '#10B981'
                                : '#3B82F6'
                              : '#EF4444',
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.strengthText,
                        {
                          color: passwordValidation.isValid
                            ? password.length >= 12
                              ? '#10B981'
                              : '#3B82F6'
                            : '#EF4444',
                        },
                      ]}
                    >
                      {passwordValidation.isValid
                        ? password.length >= 12
                          ? 'Senha forte'
                          : 'Senha média'
                        : 'Senha fraca'}
                    </Text>
                  </View>
                )}
                {!passwordValidation.isValid && password && (
                  <View style={styles.validationErrors}>
                    {passwordValidation.errors.map((err, index) => (
                      <Text key={index} style={styles.validationError}>
                        • {err}
                      </Text>
                    ))}
                  </View>
                )}
                {errors.password && !passwordValidation.isValid && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <Text style={styles.hint}>
                  A senha deve conter: mínimo 8 caracteres, pelo menos 1 letra e 1 número (apenas letras e números)
                </Text>
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
                <Text style={styles.stepEmoji}>🔬</Text>
                <Text style={styles.stepTitle}>Primeiro Ultrassom (Opcional)</Text>
              </View>
              <Text style={styles.stepDescription}>
                Se você já fez o primeiro ultrassom, informe os dados abaixo para um cálculo mais preciso da idade gestacional.
              </Text>

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
                          console.log('🔄 GestationalAgeInput onChange:', weeks, 'semanas e', days, 'dias');
                          setUltrasoundWeeks(weeks);
                          setUltrasoundDays(days);
                          console.log('✅ Estados atualizados:', { weeks, days });
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
    backgroundColor: '#F0F4F8',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  headerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
    borderWidth: 3,
    borderColor: theme.colors.primaryLight,
  },
  headerEmoji: {
    fontSize: 50,
  },
  title: {
    ...theme.typography.h1,
    color: '#1A365D',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    ...theme.typography.body,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    maxWidth: 300,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    ...theme.typography.caption,
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 13,
  },
  stepCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stepEmoji: {
    fontSize: 36,
    marginRight: theme.spacing.md,
  },
  stepTitle: {
    ...theme.typography.h2,
    color: '#1E293B',
    flex: 1,
    fontWeight: '700',
  },
  stepDescription: {
    ...theme.typography.body,
    color: '#64748B',
    marginBottom: theme.spacing.lg,
    fontSize: 15,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    color: '#334155',
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
    fontSize: 15,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md + 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    color: '#1E293B',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFFFFF',
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: theme.spacing.xs,
  },
  eyeIcon: {
    fontSize: 20,
  },
  passwordInfo: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  strengthContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  strengthBar: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
    transition: 'all 0.3s',
  },
  strengthText: {
    ...theme.typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  validationErrors: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  validationError: {
    ...theme.typography.caption,
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: theme.spacing.xs / 2,
  },
  hint: {
    ...theme.typography.caption,
    color: '#64748B',
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  methodSelector: {
    marginBottom: theme.spacing.lg,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
    transition: 'all 0.2s',
  },
  methodButtonSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: theme.colors.primary,
    ...theme.shadows.md,
    transform: [{ scale: 1.02 }],
  },
  methodEmoji: {
    fontSize: 28,
    marginRight: theme.spacing.md,
  },
  methodLabel: {
    ...theme.typography.body,
    color: '#475569',
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  methodLabelSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  preview: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: '#F0FDF4',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  previewLabel: {
    ...theme.typography.bodySmall,
    color: '#64748B',
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  previewValue: {
    ...theme.typography.h3,
    color: '#059669',
    fontWeight: '700',
  },
  questionText: {
    ...theme.typography.body,
    color: '#334155',
    marginBottom: theme.spacing.md,
    fontWeight: '600',
    fontSize: 16,
  },
  yesNoButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  yesNoButton: {
    flex: 1,
    padding: theme.spacing.md + 4,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesNoButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  yesNoButtonText: {
    ...theme.typography.body,
    color: '#64748B',
    fontWeight: '600',
  },
  yesNoButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  skipButton: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  nextButton: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.md,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
  },
});

