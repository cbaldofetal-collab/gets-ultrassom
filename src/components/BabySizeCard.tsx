// Componente para exibir o tamanho do bebê comparado a uma fruta

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { getBabySize } from '../utils/babySize';

interface BabySizeCardProps {
  gestationalAgeWeeks: number;
}

export function BabySizeCard({ gestationalAgeWeeks }: BabySizeCardProps) {
  const babySize = getBabySize(gestationalAgeWeeks);

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.fruitEmoji}>{babySize.fruitEmoji}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Tamanho do seu bebê</Text>
          <Text style={styles.fruitName}>
            {babySize.fruitEmoji} {babySize.fruit}
          </Text>
          <Text style={styles.size}>{babySize.size}</Text>
          <Text style={styles.description}>{babySize.description}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primaryLight,
    marginBottom: theme.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  fruitEmoji: {
    fontSize: 48,
  },
  content: {
    flex: 1,
  },
  title: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  fruitName: {
    ...theme.typography.h3,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.xs,
    fontWeight: 'bold',
  },
  size: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});


