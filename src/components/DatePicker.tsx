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
    const containerRef = useRef<any>(null);
    const inputIdRef = useRef(`date-input-${Math.random().toString(36).substr(2, 9)}`);

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
      if (!containerRef.current) return;

      // Obter o elemento DOM nativo
      const containerElement = containerRef.current;
      let inputElement = document.getElementById(inputIdRef.current) as HTMLInputElement;

      if (!inputElement) {
        // Criar input se não existir
        inputElement = document.createElement('input');
        inputElement.type = 'date';
        inputElement.id = inputIdRef.current;
        inputElement.style.width = '100%';
        inputElement.style.padding = '12px 16px';
        inputElement.style.borderRadius = '8px';
        inputElement.style.border = `1px solid ${theme.colors.divider}`;
        inputElement.style.fontSize = '16px';
        inputElement.style.fontFamily = 'inherit';
        inputElement.style.backgroundColor = theme.colors.surface;
        inputElement.style.color = theme.colors.text;
        inputElement.style.outline = 'none';
        inputElement.style.cursor = 'pointer';
        inputElement.style.boxSizing = 'border-box';

        // Event listeners
        inputElement.addEventListener('change', (e: any) => {
          const selectedDate = new Date(e.target.value);
          if (!isNaN(selectedDate.getTime())) {
            onChange(selectedDate);
          }
        });

        inputElement.addEventListener('focus', () => {
          inputElement.style.borderColor = theme.colors.primary;
        });

        inputElement.addEventListener('blur', () => {
          inputElement.style.borderColor = theme.colors.divider;
        });

        // Tentar adicionar ao container React Native
        try {
          const nativeNode = (containerElement as any)._nativeNode || (containerElement as any).nativeNode;
          if (nativeNode && nativeNode.appendChild) {
            nativeNode.appendChild(inputElement);
          } else {
            // Fallback: usar findNodeHandle ou adicionar diretamente
            const reactInstance = (containerElement as any)._reactInternalInstance || (containerElement as any)._reactInternalFiber;
            if (reactInstance) {
              const domNode = reactInstance.stateNode;
              if (domNode && domNode.appendChild) {
                domNode.appendChild(inputElement);
              }
            }
          }
        } catch (e) {
          console.warn('Não foi possível adicionar input ao container:', e);
        }
      }

      // Atualizar valores
      inputElement.value = formatDateForInput(value);
      inputElement.min = getMinDate();
      inputElement.max = getMaxDate();

      return () => {
        // Não remover o input para evitar problemas de re-renderização
      };
    }, [value, minimumDate, maximumDate]);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View
          ref={containerRef}
          style={{
            width: '100%',
            minHeight: 48,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.divider,
            padding: theme.spacing.md,
            justifyContent: 'center',
          }}
        />
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

