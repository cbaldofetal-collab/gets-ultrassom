// Componente para mostrar progresso da gestação e semanas restantes

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { PregnancyProfile } from '../types';
import { GESTATION_DURATION_WEEKS } from '../constants';

interface PregnancyProgressProps {
  profile: PregnancyProfile;
}

export function PregnancyProgress({ profile }: PregnancyProgressProps) {
  const currentWeeks = Math.floor(profile.gestationalAge);
  const currentDays = Math.floor((profile.gestationalAge - currentWeeks) * 7);
  const totalWeeks = GESTATION_DURATION_WEEKS;
  const weeksRemaining = Math.max(0, totalWeeks - currentWeeks);
  const daysRemaining = Math.max(0, 7 - currentDays);
  
  const progressPercentage = Math.min(100, (profile.gestationalAge / totalWeeks) * 100);
  
  // Calcular dias até o parto se tiver DPP
  let daysUntilDue = null;
  if (profile.dueDate) {
    const today = new Date();
    const diffTime = profile.dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysUntilDue = diffDays;
  }

  const getProgressColor = () => {
    if (progressPercentage < 33) return theme.colors.primary; // 1º trimestre
    if (progressPercentage < 66) return theme.colors.success; // 2º trimestre
    return theme.colors.warning; // 3º trimestre
  };

  const getTrimester = () => {
    if (currentWeeks < 14) return '1º Trimestre';
    if (currentWeeks < 28) return '2º Trimestre';
    return '3º Trimestre';
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Progresso da Gestação</Text>
        <Text style={styles.trimester}>{getTrimester()}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progressPercentage}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(1)}% completo
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentWeeks}</Text>
          <Text style={styles.statLabel}>Semanas</Text>
          <Text style={styles.statSubLabel}>de gestação</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weeksRemaining}</Text>
          <Text style={styles.statLabel}>Semanas</Text>
          <Text style={styles.statSubLabel}>restantes</Text>
        </View>
        
        {daysUntilDue !== null && (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{daysUntilDue > 0 ? daysUntilDue : 0}</Text>
              <Text style={styles.statLabel}>Dias</Text>
              <Text style={styles.statSubLabel}>até o parto</Text>
            </View>
          </>
        )}
      </View>

      {profile.dueDate && daysUntilDue !== null && daysUntilDue > 0 && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            {daysUntilDue === 1 
              ? 'Falta apenas 1 dia! 🎉'
              : `Faltam ${daysUntilDue} dias para o parto! 👶`
            }
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  trimester: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  statSubLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.divider,
  },
  countdownContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  countdownText: {
    ...theme.typography.body,
    color: theme.colors.primaryDark,
    fontWeight: '600',
    textAlign: 'center',
  },
});

