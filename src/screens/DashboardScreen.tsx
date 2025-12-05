// Tela principal com calendário de exames

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, ExamCard, ExamFilter, Button, AnimatedButton, BabySizeCard } from '../components';
import { useUserStore, usePregnancyStore, useExamsStore, useSettingsStore } from '../store';
import { ScheduledExam, ExamStatus } from '../types';
import { formatGestationalAge } from '../utils/gestational';
import { openWhatsApp } from '../utils/whatsapp';
import { scheduleAllReminders, requestNotificationPermissions } from '../services/notifications';
import { shareScheduleAsPDF, shareScheduleViaWhatsApp } from '../services/shareSchedule';

export function DashboardScreen() {
  const user = useUserStore((state) => state.user);
  const profile = usePregnancyStore((state) => state.profile);
  const loadProfile = usePregnancyStore((state) => state.loadProfile);
  
  const scheduledExams = useExamsStore((state) => state.scheduledExams);
  const generateSchedule = useExamsStore((state) => state.generateSchedule);
  const markAsCompleted = useExamsStore((state) => state.markAsCompleted);
  const markAsScheduled = useExamsStore((state) => state.markAsScheduled);
  const loadExams = useExamsStore((state) => state.loadExams);
  const isLoading = useExamsStore((state) => state.isLoading);
  
  const reminderWeeksBefore = useSettingsStore((state) => state.reminderWeeksBefore);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ExamStatus | 'all'>('all');

  useEffect(() => {
    initializeDashboard();
    
    // Atualizar perfil periodicamente para recalcular idade gestacional
    const interval = setInterval(() => {
      loadProfile();
    }, 24 * 60 * 60 * 1000); // A cada 24 horas
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Agendar lembretes quando o perfil ou exames mudarem
    if (profile && scheduledExams.length > 0 && user) {
      scheduleAllReminders(scheduledExams, profile, user.name, reminderWeeksBefore);
    }
  }, [profile, scheduledExams, user, reminderWeeksBefore]);

  const initializeDashboard = async () => {
    try {
      await loadSettings();
      await loadProfile();
      await loadExams();

      // Solicitar permissões de notificação
      await requestNotificationPermissions();

      // Se não há exames agendados e temos um perfil, gerar cronograma
      if (profile && scheduledExams.length === 0 && user) {
        generateSchedule(profile.gestationalAge, user.id);
      }

      setIsInitializing(false);
    } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
      setIsInitializing(false);
    }
  };

  const handleSchedule = async (exam: ScheduledExam) => {
    if (!user || !profile) {
      Alert.alert('Erro', 'Dados do usuário não encontrados');
      return;
    }

    try {
      await openWhatsApp(user, exam.exam, profile.gestationalAge);
      // Marcar como agendado (a data será confirmada pela clínica)
      Alert.alert(
        'WhatsApp Aberto',
        'Entre em contato com a clínica para confirmar a data do agendamento.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Opcional: marcar como agendado após abrir WhatsApp
              // markAsScheduled(exam.id, new Date());
            },
          },
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível abrir o WhatsApp';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleMarkCompleted = async (exam: ScheduledExam) => {
    Alert.alert(
      'Confirmar',
      `Deseja marcar "${exam.exam.name}" como realizado?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await markAsCompleted(exam.id);
              Alert.alert('Sucesso', 'Exame marcado como realizado!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível atualizar o exame');
            }
          },
        },
      ]
    );
  };

  const handleShareSchedule = () => {
    if (!user || !profile) return;

    Alert.alert(
      'Compartilhar Cronograma',
      'Como deseja compartilhar o cronograma?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: '📱 WhatsApp',
          onPress: async () => {
            try {
              await shareScheduleViaWhatsApp({
                exams: scheduledExams,
                userName: user.name,
                gestationalAge: profile.gestationalAge,
                dueDate: profile.dueDate,
              });
            } catch (error) {
              // Erro já tratado no serviço
            }
          },
        },
        {
          text: '📄 PDF',
          onPress: async () => {
            try {
              await shareScheduleAsPDF({
                exams: scheduledExams,
                userName: user.name,
                gestationalAge: profile.gestationalAge,
                dueDate: profile.dueDate,
              });
            } catch (error) {
              // Erro já tratado no serviço
            }
          },
        },
      ]
    );
  };

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Perfil gestacional não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Filtrar exames por status
  const filteredExams = selectedFilter === 'all' 
    ? scheduledExams 
    : scheduledExams.filter(exam => exam.status === selectedFilter);

  // Ordenar exames: primeiro os que estão na janela ideal, depois por ordem de semana
  const sortedExams = [...filteredExams].sort((a, b) => {
    const aInWindow = profile.gestationalAge >= a.exam.idealWindowStart && 
                      profile.gestationalAge <= a.exam.idealWindowEnd;
    const bInWindow = profile.gestationalAge >= b.exam.idealWindowStart && 
                      profile.gestationalAge <= b.exam.idealWindowEnd;
    
    if (aInWindow && !bInWindow) return -1;
    if (!aInWindow && bInWindow) return 1;
    
    return a.exam.idealWindowStart - b.exam.idealWindowStart;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Minha Jornada</Text>
          {user && (
            <Text style={styles.greeting}>Olá, {user.name}! 👋</Text>
          )}
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileEmoji}>🤰</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Idade Gestacional</Text>
              <Text style={styles.profileValue}>
                {formatGestationalAge(profile.gestationalAge)}
              </Text>
              {profile.firstUltrasoundDate && (
                <Text style={styles.profileSubtext}>
                  📊 Calculado pelo primeiro ultrassom
                </Text>
              )}
              {!profile.firstUltrasoundDate && profile.lastMenstrualPeriod && (
                <Text style={styles.profileSubtext}>
                  📅 Calculado pela DUM
                </Text>
              )}
            </View>
          </View>
          {profile.dueDate && (
            <View style={styles.profileRow}>
              <Text style={styles.profileRowLabel}>Data Prevista do Parto:</Text>
              <Text style={styles.profileRowValue}>
                {profile.dueDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </Card>

        {profile && (
          <BabySizeCard gestationalAgeWeeks={profile.gestationalAge} />
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Cronograma de Exames</Text>
            <Text style={styles.sectionSubtitle}>
              {scheduledExams.filter(e => e.status === 'completed').length} de {scheduledExams.length} realizados
            </Text>
          </View>
          {user && profile && (
            <AnimatedButton
              title="📤 Compartilhar"
              onPress={handleShareSchedule}
              variant="outline"
              style={styles.shareButton}
            />
          )}
        </View>

        <ExamFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {sortedExams.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {selectedFilter === 'all' 
                ? 'Nenhum exame encontrado. Verifique seu perfil gestacional.'
                : `Nenhum exame ${selectedFilter === 'pending' ? 'pendente' : selectedFilter === 'scheduled' ? 'agendado' : selectedFilter === 'completed' ? 'realizado' : 'perdido'} encontrado.`}
            </Text>
          </Card>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Nenhum exame encontrado. Verifique seu perfil gestacional.
            </Text>
          </Card>
        ) : (
          sortedExams.map((exam, index) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              currentGestationalAge={profile.gestationalAge}
              onSchedule={handleSchedule}
              onMarkCompleted={handleMarkCompleted}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  greeting: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  profileCard: {
    backgroundColor: theme.colors.primaryLight,
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  profileEmoji: {
    fontSize: 48,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  profileValue: {
    ...theme.typography.h2,
    color: theme.colors.primaryDark,
  },
  profileSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  profileRowLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  profileRowValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  shareButton: {
    marginLeft: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  emptyCard: {
    backgroundColor: theme.colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

