// Componente para input de idade gestacional (semanas e dias)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '../theme';

interface GestationalAgeInputProps {
  label: string;
  weeks: number;
  days: number;
  onChange: (weeks: number, days: number) => void;
  placeholder?: string;
}

export function GestationalAgeInput({
  label,
  weeks: initialWeeks,
  days: initialDays,
  onChange,
  placeholder = '0 semanas e 0 dias',
}: GestationalAgeInputProps) {
  const [weeks, setWeeks] = useState<string>(initialWeeks.toString());
  const [days, setDays] = useState<string>(initialDays.toString());

  useEffect(() => {
    setWeeks(initialWeeks.toString());
    setDays(initialDays.toString());
  }, [initialWeeks, initialDays]);

  const handleWeeksChange = (text: string) => {
    const value = text.replace(/[^0-9]/g, '');
    setWeeks(value);
    const weeksNum = parseInt(value, 10) || 0;
    const daysNum = parseInt(days, 10) || 0;
    onChange(weeksNum, daysNum);
  };

  const handleDaysChange = (text: string) => {
    console.log('📝 handleDaysChange chamado com:', text);
    const value = text.replace(/[^0-9]/g, '');
    let daysValue = parseInt(value, 10) || 0;
    // Limitar dias entre 0 e 6
    if (daysValue > 6) {
      daysValue = 6;
    }
    console.log('📝 Dias processados:', daysValue);
    setDays(daysValue.toString());
    const weeksNum = parseInt(weeks, 10) || 0;
    console.log('📝 Chamando onChange com:', weeksNum, 'semanas e', daysValue, 'dias');
    onChange(weeksNum, daysValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={weeks}
            onChangeText={handleWeeksChange}
            placeholder="0"
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.inputLabel}>semanas</Text>
        </View>
        <Text style={styles.separator}>e</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={days}
            onChangeText={handleDaysChange}
            placeholder="0"
            keyboardType="numeric"
            maxLength={1}
            autoComplete="off"
            autoCorrect={false}
            accessibilityLabel="Dias da idade gestacional"
          />
          <Text style={styles.inputLabel}>dias</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    minWidth: 60,
  },
  inputLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  separator: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.xs,
  },
});


