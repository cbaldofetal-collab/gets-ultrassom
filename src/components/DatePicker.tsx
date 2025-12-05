// Componente DatePicker reutilizável

import React, { useState, useRef } from 'react';
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

  // Para web, usar input HTML nativo com wrapper clicável
  if (Platform.OS === 'web') {
    const inputIdRef = useRef(`date-input-${Math.random().toString(36).substr(2, 9)}`);

    const handleWebDateChange = (e: any) => {
      const selectedDate = new Date(e.target.value);
      if (!isNaN(selectedDate.getTime())) {
        onChange(selectedDate);
      }
    };

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

    const handlePress = () => {
      // Criar input temporário e abrir o date picker
      const tempInput = document.createElement('input');
      tempInput.type = 'date';
      tempInput.value = formatDateForInput(value);
      if (minimumDate) tempInput.min = getMinDate();
      if (maximumDate) tempInput.max = getMaxDate();
      tempInput.style.position = 'fixed';
      tempInput.style.top = '50%';
      tempInput.style.left = '50%';
      tempInput.style.transform = 'translate(-50%, -50%)';
      tempInput.style.opacity = '0';
      tempInput.style.pointerEvents = 'none';
      tempInput.style.zIndex = '9999';
      
      document.body.appendChild(tempInput);
      
      // Tentar usar showPicker() se disponível (Chrome/Edge)
      if (typeof tempInput.showPicker === 'function') {
        tempInput.showPicker().catch(() => {
          tempInput.click();
        });
      } else {
        tempInput.click();
      }
      
      tempInput.addEventListener('change', (e: any) => {
        handleWebDateChange(e);
        document.body.removeChild(tempInput);
      });
      
      tempInput.addEventListener('cancel', () => {
        document.body.removeChild(tempInput);
      });
      
      // Remover após um tempo se não houver interação
      setTimeout(() => {
        if (document.body.contains(tempInput)) {
          document.body.removeChild(tempInput);
        }
      }, 10000);
    };

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[styles.input, !value && styles.inputPlaceholder]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Text style={[styles.inputText, !value && styles.inputTextPlaceholder]}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
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

