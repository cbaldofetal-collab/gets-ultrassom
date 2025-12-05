// Tela de histórico de exames realizados

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, AnimatedCard } from '../components';
import { useExamsStore, usePregnancyStore } from '../store';
import { ScheduledExam } from '../types';
import { formatDate, formatDateFull } from '../utils/date';
import { formatGestationalAge, calculateGestationalAgeFromLMP } from '../utils/gestational';
import { getExamIcon } from '../utils/examIcons';

export function HistoryScreen() {
  const scheduledExams = useExamsStore((state) => state.scheduledExams);
  const loadExams = useExamsStore((state) => state.loadExams);
  const isLoading = useExamsStore((state) => state.isLoading);
  const profile = usePregnancyStore((state) => state.profile);

  const [completedExams, setCompletedExams] = useState<ScheduledExam[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    scheduled: 0,
    missed: 0,
  });

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    // Filtrar apenas exames realizados e ordenar por data
    const completed = scheduledExams
      .filter((exam) => exam.status === 'completed')
      .sort((a, b) => {
        const dateA = a.completedDate || a.createdAt;
        const dateB = b.completedDate || b.createdAt;
        return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
      });

    setCompletedExams(completed);

    // Calcular estatísticas
    setStats({
      total: scheduledExams.length,
      completed: scheduledExams.filter((e) => e.status === 'completed').length,
      pending: scheduledExams.filter((e) => e.status === 'pending').length,
      scheduled: scheduledExams.filter((e) => e.status === 'scheduled').length,
      missed: scheduledExams.filter((e) => e.status === 'missed').length,
    });
  }, [scheduledExams]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico de Exames</Text>
          <Text style={styles.subtitle}>
            Acompanhe seus exames realizados
          </Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Realizados</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.scheduled}</Text>
            <Text style={styles.statLabel}>Agendados</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.missed}</Text>
            <Text style={styles.statLabel}>Perdidos</Text>
          </Card>
        </View>

        {/* Progresso geral */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progresso Geral</Text>
            <Text style={styles.progressPercentage}>
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {stats.completed} de {stats.total} exames realizados
          </Text>
        </Card>

        {/* Lista de exames realizados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exames Realizados</Text>
          <Text style={styles.sectionSubtitle}>
            {completedExams.length} exame{completedExams.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {completedExams.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>
              Nenhum exame realizado ainda
            </Text>
            <Text style={styles.emptySubtext}>
              Os exames que você marcar como realizados aparecerão aqui
            </Text>
          </Card>
        ) : (
          completedExams.map((exam, index) => (
            <AnimatedCard key={exam.id} delay={index * 100}>
              <Card style={styles.examCard}>
                <View style={styles.examHeader}>
                  <View style={styles.examIconContainer}>
                    <Text style={styles.examIcon}>{getExamIcon(exam.exam.type)}</Text>
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={styles.examName}>{exam.exam.name}</Text>
                    <Text style={styles.examDescription}>
                      {exam.exam.description}
                    </Text>
                  </View>
                </View>

              <View style={styles.examDetails}>
                {exam.completedDate && (
                  <View style={styles.examDetailRow}>
                    <Text style={styles.examDetailLabel}>Data de Realização:</Text>
                    <Text style={styles.examDetailValue}>
                      {formatDateFull(exam.completedDate)}
                    </Text>
                  </View>
                )}
                {exam.scheduledDate && (
                  <View style={styles.examDetailRow}>
                    <Text style={styles.examDetailLabel}>Data Agendada:</Text>
                    <Text style={styles.examDetailValue}>
                      {formatDateFull(exam.scheduledDate)}
                    </Text>
                  </View>
                )}
                {profile && exam.completedDate && profile.lastMenstrualPeriod && (
                  <View style={styles.examDetailRow}>
                    <Text style={styles.examDetailLabel}>Idade Gestacional:</Text>
                    <Text style={styles.examDetailValue}>
                      {formatGestationalAge(
                        calculateGestationalAgeAtDate(
                          profile.lastMenstrualPeriod,
                          exam.completedDate
                        )
                      )}
                    </Text>
                  </View>
                )}
              </View>
              </Card>
            </AnimatedCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Função auxiliar para calcular idade gestacional em uma data específica
function calculateGestationalAgeAtDate(
  lmpDate: Date,
  targetDate: Date
): number {
  const diffTime = targetDate.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  return Math.max(0, Math.min(42, weeks));
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
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  progressPercentage: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  sectionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  examCard: {
    marginBottom: theme.spacing.md,
  },
  examHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  examIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  examIcon: {
    fontSize: 24,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  examDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  examDetails: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    paddingTop: theme.spacing.md,
  },
  examDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  examDetailLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  examDetailValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
});

