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
    const inputIdRef = useRef(`date-input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const containerRef = useRef<View>(null);

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
      // Aguardar um pouco para garantir que o DOM esteja pronto
      const timeoutId = setTimeout(() => {
        let input = document.getElementById(inputIdRef.current) as HTMLInputElement;
        
        if (!input) {
          // Criar input se não existir
          input = document.createElement('input');
          input.id = inputIdRef.current;
          input.type = 'date';
          
          // Estilos
          Object.assign(input.style, {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${theme.colors.divider}`,
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          });

          // Tentar encontrar o container e adicionar o input
          const container = containerRef.current;
          if (container) {
            // Tentar diferentes formas de acessar o DOM
            const findDOMNode = (node: any): HTMLElement | null => {
              if (node && node.nodeType === 1) return node;
              if (node?._nativeNode) return node._nativeNode;
              if (node?.nativeNode) return node.nativeNode;
              if (node?._reactInternalInstance?.stateNode) return node._reactInternalInstance.stateNode;
              if (node?._reactInternalFiber?.stateNode) return node._reactInternalFiber.stateNode;
              return null;
            };

            const containerElement = findDOMNode(container);
            if (containerElement) {
              containerElement.appendChild(input);
            } else {
              // Fallback: adicionar ao body
              document.body.appendChild(input);
              input.style.position = 'absolute';
              input.style.opacity = '0';
              input.style.pointerEvents = 'none';
            }
          }
        }

        // Atualizar valores
        if (input) {
          input.value = formatDateForInput(value);
          input.min = getMinDate();
          input.max = getMaxDate();

          // Event listeners
          const handleChange = (e: any) => {
            const selectedDate = new Date(e.target.value);
            if (!isNaN(selectedDate.getTime())) {
              console.log('📅 Data selecionada:', selectedDate);
              onChange(selectedDate);
            }
          };

          const handleFocus = (e: any) => {
            e.target.style.borderColor = theme.colors.primary;
          };

          const handleBlur = (e: any) => {
            e.target.style.borderColor = theme.colors.divider;
          };

          // Remover listeners antigos antes de adicionar novos
          input.removeEventListener('change', handleChange);
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);

          input.addEventListener('change', handleChange);
          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
        }
      }, 50);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [value, minimumDate, maximumDate, onChange]);

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
            overflow: 'hidden',
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
