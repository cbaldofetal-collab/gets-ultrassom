// Componente para exibir um exame no calendário

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../theme';
import { ScheduledExam } from '../types';
import { formatDate } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';
import { getExamIcon } from '../utils/examIcons';

interface ExamCardProps {
  exam: ScheduledExam;
  currentGestationalAge: number;
  onSchedule: (exam: ScheduledExam) => void;
  onMarkCompleted: (exam: ScheduledExam) => void;
  index?: number;
}

const STATUS_COLORS = {
  pending: theme.colors.examPending,
  scheduled: theme.colors.examScheduled,
  completed: theme.colors.examCompleted,
  missed: theme.colors.examMissed,
};

const STATUS_LABELS = {
  pending: 'Pendente',
  scheduled: 'Agendado',
  completed: 'Realizado',
  missed: 'Perdido',
};

const STATUS_ICONS = {
  pending: '⏳',
  scheduled: '📅',
  completed: '✅',
  missed: '❌',
};

export function ExamCard({ exam, currentGestationalAge, onSchedule, onMarkCompleted, index = 0 }: ExamCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isInWindow = currentGestationalAge >= exam.exam.idealWindowStart && 
                     currentGestationalAge <= exam.exam.idealWindowEnd;
  const isPast = currentGestationalAge > exam.exam.idealWindowEnd;
  const isFuture = currentGestationalAge < exam.exam.idealWindowStart;

  const statusColor = STATUS_COLORS[exam.status];
  const statusLabel = STATUS_LABELS[exam.status];
  const statusIcon = STATUS_ICONS[exam.status];
  const examIcon = getExamIcon(exam.exam.type);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getWindowStatus = () => {
    if (isPast) return 'Janela passou';
    if (isInWindow) return 'Janela ideal';
    if (isFuture) return 'Ainda não chegou';
    return '';
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View style={[styles.card, { borderLeftColor: statusColor }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.examIconContainer}>
              <Text style={styles.examIcon}>{examIcon}</Text>
            </View>
            <View style={styles.examTitleContainer}>
              <Text style={styles.examName}>{exam.exam.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <Text style={styles.statusIcon}>{statusIcon}</Text>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

      <Text style={styles.description}>{exam.exam.description}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Janela ideal:</Text>
        <Text style={styles.infoValue}>
          {exam.exam.idealWindowStart}-{exam.exam.idealWindowEnd} semanas
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Status da janela:</Text>
        <Text style={[styles.infoValue, isInWindow && styles.highlight]}>
          {getWindowStatus()}
        </Text>
      </View>

      {exam.scheduledDate && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data agendada:</Text>
          <Text style={styles.infoValue}>{formatDate(exam.scheduledDate)}</Text>
        </View>
      )}

      {exam.completedDate && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data realizada:</Text>
          <Text style={styles.infoValue}>{formatDate(exam.completedDate)}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {exam.status === 'pending' && isInWindow && (
          <TouchableOpacity
            style={[styles.actionButton, styles.scheduleButton]}
            onPress={() => onSchedule(exam)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>📱 Agendar via WhatsApp</Text>
          </TouchableOpacity>
        )}

        {exam.status === 'scheduled' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => onMarkCompleted(exam)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>✅ Marcar como Realizado</Text>
          </TouchableOpacity>
        )}

        {exam.status === 'pending' && !isInWindow && (
          <Text style={styles.waitingText}>
            {isFuture 
              ? `Aguarde até a ${exam.exam.idealWindowStart}ª semana`
              : 'Janela ideal já passou. Entre em contato com a clínica.'}
          </Text>
        )}
      </View>
    </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  examIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  examIcon: {
    fontSize: 28,
  },
  examTitleContainer: {
    flex: 1,
  },
  examName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  infoLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  highlight: {
    color: theme.colors.primary,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  scheduleButton: {
    backgroundColor: theme.colors.primary,
  },
  completeButton: {
    backgroundColor: theme.colors.success,
  },
  actionButtonText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  waitingText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.sm,
  },
});

