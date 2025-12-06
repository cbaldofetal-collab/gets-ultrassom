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

  // Sincronizar apenas quando os valores externos mudarem significativamente
  useEffect(() => {
    if (initialWeeks !== parseInt(weeks, 10)) {
      setWeeks(initialWeeks.toString());
    }
    if (initialDays !== parseInt(days, 10)) {
      setDays(initialDays.toString());
    }
  }, [initialWeeks, initialDays]);

  const handleWeeksChange = (text: string) => {
    const value = text.replace(/[^0-9]/g, '');
    setWeeks(value);
    const weeksNum = parseInt(value, 10) || 0;
    const daysNum = parseInt(days, 10) || 0;
    onChange(weeksNum, daysNum);
  };

  const handleDaysChange = (text: string) => {
    console.log('📝 handleDaysChange chamado com:', text, 'tipo:', typeof text);
    
    // Remover caracteres não numéricos
    const value = text.replace(/[^0-9]/g, '');
    console.log('📝 Valor após limpeza:', value);
    
    // Se estiver vazio, permitir mas manter 0
    if (value === '' || value === '0') {
      setDays('0');
      const weeksNum = parseInt(weeks, 10) || 0;
      console.log('📝 Chamando onChange com 0 dias');
      onChange(weeksNum, 0);
      return;
    }
    
    let daysValue = parseInt(value, 10);
    console.log('📝 DiasValue parseado:', daysValue);
    
    // Limitar dias entre 0 e 6
    if (daysValue > 6) {
      daysValue = 6;
      console.log('📝 Limitado a 6 dias');
    }
    
    if (isNaN(daysValue)) {
      daysValue = 0;
    }
    
    console.log('📝 Dias finais:', daysValue);
    const daysString = daysValue.toString();
    setDays(daysString);
    
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
            keyboardType="number-pad"
            maxLength={1}
            autoComplete="off"
            autoCorrect={false}
            accessibilityLabel="Dias da idade gestacional"
            selectTextOnFocus={true}
            clearButtonMode="never"
            onFocus={(e) => {
              console.log('📝 Campo de dias focado');
              e.target.select?.();
            }}
            onBlur={() => {
              console.log('📝 Campo de dias desfocado, valor atual:', days);
            }}
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


