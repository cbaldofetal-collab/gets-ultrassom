// Componente DatePicker reutilizável

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { theme } from '../theme';
import { formatDate } from '../utils/date';

// Importar DateTimePicker apenas em plataformas nativas
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  try {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  } catch (e) {
    console.warn('DateTimePicker não disponível');
  }
}

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Selecione uma data',
  maximumDate,
  minimumDate,
  mode = 'date',
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Para web, usar input HTML nativo diretamente
  if (Platform.OS === 'web') {
    const inputId = `date-input-${Math.random().toString(36).substr(2, 9)}`;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const formatDateForInput = (date: Date | null): string => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const getMinDate = (): string => {
      if (minimumDate) return formatDateForInput(minimumDate);
      return '';
    };

    const getMaxDate = (): string => {
      if (maximumDate) return formatDateForInput(maximumDate);
      return '';
    };

    useEffect(() => {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        input.value = formatDateForInput(value);
        input.min = getMinDate();
        input.max = getMaxDate();
        inputRef.current = input;
      }
    }, [value, minimumDate, maximumDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDate = new Date(e.target.value);
      if (!isNaN(selectedDate.getTime())) {
        console.log('📅 Data selecionada:', selectedDate);
        onChange(selectedDate);
      }
    };

    // Usar dangerouslySetInnerHTML para renderizar o input HTML nativo
    const inputHTML = `
      <input
        id="${inputId}"
        type="date"
        value="${formatDateForInput(value)}"
        min="${getMinDate()}"
        max="${getMaxDate()}"
        placeholder="${placeholder}"
        style="
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid ${theme.colors.divider};
          font-size: 16px;
          font-family: inherit;
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
        "
      />
    `;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View
          dangerouslySetInnerHTML={{ __html: inputHTML }}
          style={{ width: '100%' }}
        />
        {useEffect(() => {
          const input = document.getElementById(inputId) as HTMLInputElement;
          if (input) {
            input.addEventListener('change', (e: any) => handleChange(e));
            input.addEventListener('focus', (e: any) => {
              e.target.style.borderColor = theme.colors.primary;
            });
            input.addEventListener('blur', (e: any) => {
              e.target.style.borderColor = theme.colors.divider;
            });
            return () => {
              input.removeEventListener('change', () => {});
              input.removeEventListener('focus', () => {});
              input.removeEventListener('blur', () => {});
            };
          }
        }, [])}
      </View>
    );
  }

  // Para plataformas nativas, usar DateTimePicker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  const displayValue = value ? formatDate(value) : placeholder;

  if (!DateTimePicker) {
    // Fallback se DateTimePicker não estiver disponível
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.input, !value && styles.inputPlaceholder]}>
          <Text style={[styles.inputText, !value && styles.inputTextPlaceholder]}>
            {displayValue}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, !value && styles.inputPlaceholder]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.inputText, !value && styles.inputTextPlaceholder]}>
          {displayValue}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {showPicker && DateTimePicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          locale="pt-BR"
        />
      )}
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
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    minHeight: 48,
  },
  inputPlaceholder: {
    borderColor: theme.colors.divider,
  },
  inputText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  inputTextPlaceholder: {
    color: theme.colors.textSecondary,
  },
  calendarIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.sm,
  },
});
