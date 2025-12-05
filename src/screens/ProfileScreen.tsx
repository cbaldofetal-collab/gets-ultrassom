// Tela de perfil - editar dados

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, Button, DatePicker } from '../components';
import { useUserStore, usePregnancyStore, useSettingsStore } from '../store';
import { formatDate, formatDateFull } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';
import { ReminderTimeOption } from '../store/useSettingsStore';

export function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const profile = usePregnancyStore((state) => state.profile);
  const setUser = useUserStore((state) => state.setUser);
  const setProfile = usePregnancyStore((state) => state.setProfile);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearProfile = usePregnancyStore((state) => state.clearProfile);
  
  const reminderWeeksBefore = useSettingsStore((state) => state.reminderWeeksBefore);
  const setReminderWeeksBefore = useSettingsStore((state) => state.setReminderWeeksBefore);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
    if (profile?.lastMenstrualPeriod) {
      setLmpDate(profile.lastMenstrualPeriod);
    }
    if (profile?.dueDate) {
      setDueDate(profile.dueDate);
    }
  }, [user, profile]);

  // Calcular datas mínimas e máximas
  const today = new Date();
  const maxLMPDate = new Date(today);
  maxLMPDate.setDate(maxLMPDate.getDate() - 7); // Mínimo 1 semana atrás
  const minLMPDate = new Date(today);
  minLMPDate.setFullYear(minLMPDate.getFullYear() - 1); // Máximo 1 ano atrás
  
  const minDueDate = new Date(today);
  minDueDate.setDate(minDueDate.getDate() + 7); // Mínimo 1 semana no futuro
  const maxDueDate = new Date(today);
  maxDueDate.setMonth(maxDueDate.getMonth() + 10); // Máximo 10 meses no futuro

  const handleSaveName = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome não pode estar vazio');
      return;
    }

    if (!user) return;

    try {
      await setUser({ ...user, name: name.trim() });
      setEditingName(false);
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome');
    }
  };

  const handleSaveLMP = async () => {
    if (!profile || !lmpDate) {
      Alert.alert('Atenção', 'Selecione uma data válida');
      return;
    }

    try {
      await setProfile({ lastMenstrualPeriod: lmpDate });
      Alert.alert('Sucesso', 'Data da última menstruação atualizada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a data');
    }
  };

  const handleSaveDueDate = async () => {
    if (!profile || !dueDate) {
      Alert.alert('Atenção', 'Selecione uma data válida');
      return;
    }

    try {
      await setProfile({ dueDate });
      Alert.alert('Sucesso', 'Data prevista do parto atualizada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a data');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearUser();
            await clearProfile();
            Alert.alert('Sucesso', 'Dados limpos. Você será redirecionado para o onboarding.');
            // O App.tsx vai detectar e mostrar o onboarding novamente
          },
        },
      ]
    );
  };

  if (!user || !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Dados não encontrados</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            {editingName ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setName(user.name);
                      setEditingName(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveName}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{user.name}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingName(true)}
                >
                  <Text style={styles.editButtonText}>✏️ Editar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dados da Gestação</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Idade Gestacional</Text>
            <Text style={styles.value}>
              {formatGestationalAge(profile.gestationalAge)}
            </Text>
          </View>

          <View style={styles.field}>
            <DatePicker
              label="Data da Última Menstruação (DUM)"
              value={lmpDate}
              onChange={setLmpDate}
              placeholder="Selecione a data"
              maximumDate={maxLMPDate}
              minimumDate={minLMPDate}
            />
            {lmpDate && lmpDate.getTime() !== profile.lastMenstrualPeriod?.getTime() && (
              <Button
                title="Salvar Data"
                onPress={handleSaveLMP}
                variant="primary"
                style={styles.saveDateButton}
              />
            )}
          </View>

          <View style={styles.field}>
            <DatePicker
              label="Data Prevista do Parto (DPP)"
              value={dueDate}
              onChange={setDueDate}
              placeholder="Selecione a data"
              minimumDate={minDueDate}
              maximumDate={maxDueDate}
            />
            {dueDate && dueDate.getTime() !== profile.dueDate?.getTime() && (
              <Button
                title="Salvar Data"
                onPress={handleSaveDueDate}
                variant="primary"
                style={styles.saveDateButton}
              />
            )}
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>⚙️ Configurações</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Lembretes de Exames</Text>
            <Text style={styles.hint}>
              Quando deseja receber lembretes antes da janela ideal do exame?
            </Text>
            <View style={styles.reminderOptions}>
              {[
                { value: 1 as ReminderTimeOption, label: '1 semana antes', icon: '📅' },
                { value: 2 as ReminderTimeOption, label: '2 semanas antes', icon: '📆' },
                { value: 4 as ReminderTimeOption, label: '1 mês antes', icon: '🗓️' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.reminderOption,
                    reminderWeeksBefore === option.value && styles.reminderOptionSelected,
                  ]}
                  onPress={async () => {
                    try {
                      await setReminderWeeksBefore(option.value);
                      Alert.alert('Sucesso', 'Preferência de lembrete atualizada!');
                    } catch (error) {
                      Alert.alert('Erro', 'Não foi possível atualizar a preferência');
                    }
                  }}
                >
                  <Text style={styles.reminderIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.reminderOptionText,
                      reminderWeeksBefore === option.value && styles.reminderOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {reminderWeeksBefore === option.value && (
                    <Text style={styles.reminderCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card style={[styles.card, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>⚠️ Área de Risco</Text>
          <Text style={styles.dangerText}>
            Limpar todos os dados do aplicativo. Esta ação não pode ser desfeita.
          </Text>
          <Button
            title="Limpar Todos os Dados"
            onPress={handleClearData}
            variant="outline"
            style={styles.dangerButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editContainer: {
    marginTop: theme.spacing.xs,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  editActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  editButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  saveButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  dangerCard: {
    backgroundColor: theme.colors.errorLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  dangerTitle: {
    ...theme.typography.h3,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  dangerText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dangerButton: {
    borderColor: theme.colors.error,
  },
  saveDateButton: {
    marginTop: theme.spacing.sm,
  },
});

