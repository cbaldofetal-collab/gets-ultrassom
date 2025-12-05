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
import { Card, Button } from '../components';
import { useUserStore, usePregnancyStore } from '../store';
import { formatDate, formatDateFull } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';

export function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const profile = usePregnancyStore((state) => state.profile);
  const setUser = useUserStore((state) => state.setUser);
  const setProfile = usePregnancyStore((state) => state.setProfile);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearProfile = usePregnancyStore((state) => state.clearProfile);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [editingLMP, setEditingLMP] = useState(false);
  const [tempLMP, setTempLMP] = useState('');
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [tempDueDate, setTempDueDate] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
    if (profile?.lastMenstrualPeriod) {
      setTempLMP(formatDate(profile.lastMenstrualPeriod));
    }
    if (profile?.dueDate) {
      setTempDueDate(formatDate(profile.dueDate));
    }
  }, [user, profile]);

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
    if (!profile) return;

    const parts = tempLMP.split('/');
    if (parts.length !== 3) {
      Alert.alert('Atenção', 'Formato inválido. Use DD/MM/AAAA');
      return;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      Alert.alert('Atenção', 'Data inválida');
      return;
    }

    try {
      await setProfile({ lastMenstrualPeriod: date });
      setEditingLMP(false);
      Alert.alert('Sucesso', 'Data da última menstruação atualizada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a data');
    }
  };

  const handleSaveDueDate = async () => {
    if (!profile) return;

    const parts = tempDueDate.split('/');
    if (parts.length !== 3) {
      Alert.alert('Atenção', 'Formato inválido. Use DD/MM/AAAA');
      return;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      Alert.alert('Atenção', 'Data inválida');
      return;
    }

    try {
      await setProfile({ dueDate: date });
      setEditingDueDate(false);
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
            <Text style={styles.label}>Data da Última Menstruação (DUM)</Text>
            {editingLMP ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={tempLMP}
                  onChangeText={setTempLMP}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                  autoFocus
                />
                <Text style={styles.hint}>Formato: DD/MM/AAAA</Text>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      if (profile.lastMenstrualPeriod) {
                        setTempLMP(formatDate(profile.lastMenstrualPeriod));
                      }
                      setEditingLMP(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveLMP}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.value}>
                  {profile.lastMenstrualPeriod
                    ? formatDateFull(profile.lastMenstrualPeriod)
                    : 'Não informado'}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    if (profile.lastMenstrualPeriod) {
                      setTempLMP(formatDate(profile.lastMenstrualPeriod));
                    }
                    setEditingLMP(true);
                  }}
                >
                  <Text style={styles.editButtonText}>✏️ Editar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Data Prevista do Parto (DPP)</Text>
            {editingDueDate ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={tempDueDate}
                  onChangeText={setTempDueDate}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                  autoFocus
                />
                <Text style={styles.hint}>Formato: DD/MM/AAAA</Text>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      if (profile.dueDate) {
                        setTempDueDate(formatDate(profile.dueDate));
                      }
                      setEditingDueDate(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveDueDate}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.value}>
                  {profile.dueDate
                    ? formatDateFull(profile.dueDate)
                    : 'Não informado'}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    if (profile.dueDate) {
                      setTempDueDate(formatDate(profile.dueDate));
                    }
                    setEditingDueDate(true);
                  }}
                >
                  <Text style={styles.editButtonText}>✏️ Editar</Text>
                </TouchableOpacity>
              </View>
            )}
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
});

