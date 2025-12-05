// Componente para exibir um exame no calendário

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { ScheduledExam } from '../types';
import { formatDate } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';

interface ExamCardProps {
  exam: ScheduledExam;
  currentGestationalAge: number;
  onSchedule: (exam: ScheduledExam) => void;
  onMarkCompleted: (exam: ScheduledExam) => void;
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

export function ExamCard({ exam, currentGestationalAge, onSchedule, onMarkCompleted }: ExamCardProps) {
  const isInWindow = currentGestationalAge >= exam.exam.idealWindowStart && 
                     currentGestationalAge <= exam.exam.idealWindowEnd;
  const isPast = currentGestationalAge > exam.exam.idealWindowEnd;
  const isFuture = currentGestationalAge < exam.exam.idealWindowStart;

  const statusColor = STATUS_COLORS[exam.status];
  const statusLabel = STATUS_LABELS[exam.status];
  const statusIcon = STATUS_ICONS[exam.status];

  const getWindowStatus = () => {
    if (isPast) return 'Janela passou';
    if (isInWindow) return 'Janela ideal';
    if (isFuture) return 'Ainda não chegou';
    return '';
  };

  return (
    <View style={[styles.card, { borderLeftColor: statusColor }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.examName}>{exam.exam.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
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
          >
            <Text style={styles.actionButtonText}>📱 Agendar via WhatsApp</Text>
          </TouchableOpacity>
        )}

        {exam.status === 'scheduled' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => onMarkCompleted(exam)}
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

