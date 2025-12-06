// Componente de filtros para exames

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme';
import { ExamStatus } from '../types';

interface ExamFilterProps {
  selectedFilter: ExamStatus | 'all';
  onFilterChange: (filter: ExamStatus | 'all') => void;
}

const FILTERS: Array<{ value: ExamStatus | 'all'; label: string; icon: string }> = [
  { value: 'all', label: 'Todos', icon: '📋' },
  { value: 'pending', label: 'Pendentes', icon: '⏳' },
  { value: 'scheduled', label: 'Agendados', icon: '📅' },
  { value: 'completed', label: 'Realizados', icon: '✅' },
  { value: 'missed', label: 'Perdidos', icon: '❌' },
];

export function ExamFilter({ selectedFilter, onFilterChange }: ExamFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
              onPress={() => onFilterChange(filter.value)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    gap: theme.spacing.xs,
  },
  filterButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});


