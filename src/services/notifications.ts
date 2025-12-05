// Serviço de notificações push

import { Platform } from 'react-native';
import { ScheduledExam, PregnancyProfile } from '../types';
import { formatDate } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';
import { ReminderTimeOption } from '../store/useSettingsStore';

// Importar Notifications apenas em plataformas nativas
let Notifications: any = null;
if (Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications');
    // Configurar como as notificações devem ser tratadas quando o app está em foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  } catch (e) {
    console.warn('expo-notifications não disponível');
  }
}

/**
 * Solicita permissões para notificações
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // No web, notificações não são suportadas
  if (Platform.OS === 'web' || !Notifications) {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permissão de notificações negada');
      return false;
    }

    // Configurar canal de notificação para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Lembretes de Exames',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao solicitar permissões de notificação:', error);
    return false;
  }
}

/**
 * Agenda uma notificação de lembrete para um exame
 */
export async function scheduleExamReminder(
  exam: ScheduledExam,
  profile: PregnancyProfile,
  userName: string,
  reminderWeeksBefore: ReminderTimeOption = 2
): Promise<string | null> {
  // No web, notificações não são suportadas
  if (Platform.OS === 'web' || !Notifications) {
    return null;
  }

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Calcular quando enviar o lembrete usando a preferência do usuário
    const reminderWeek = exam.exam.idealWindowStart - reminderWeeksBefore;
    const currentWeek = profile.gestationalAge;

    // Se já passou da semana do lembrete, não agendar
    if (currentWeek >= reminderWeek) {
      return null;
    }

    // Calcular a data do lembrete
    const reminderDate = calculateReminderDate(profile, reminderWeek);

    // Se a data já passou, não agendar
    if (reminderDate < new Date()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 Lembrete de Exame',
        body: `Olá, ${userName}! Está se aproximando a hora do seu ${exam.exam.name} (ideal entre ${exam.exam.idealWindowStart}-${exam.exam.idealWindowEnd} semanas). Clique para agendar!`,
        data: {
          examId: exam.id,
          type: 'exam_reminder',
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: reminderDate,
    });

    return notificationId;
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
}

/**
 * Calcula a data do lembrete baseado na semana gestacional
 */
function calculateReminderDate(profile: PregnancyProfile, targetWeek: number): Date {
  const currentWeek = profile.gestationalAge;
  const weeksToAdd = targetWeek - currentWeek;

  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + weeksToAdd * 7);

  // Ajustar para 9h da manhã
  reminderDate.setHours(9, 0, 0, 0);

  return reminderDate;
}

/**
 * Agenda lembretes para todos os exames pendentes
 */
export async function scheduleAllReminders(
  exams: ScheduledExam[],
  profile: PregnancyProfile,
  userName: string,
  reminderWeeksBefore: ReminderTimeOption = 2
): Promise<void> {
  try {
    // Cancelar notificações antigas primeiro
    await cancelAllNotifications();

    // Agendar novos lembretes
    for (const exam of exams) {
      if (exam.status === 'pending' && !exam.reminderSent) {
        const notificationId = await scheduleExamReminder(exam, profile, userName, reminderWeeksBefore);
        if (notificationId) {
          console.log(`Notificação agendada para ${exam.exam.name}: ${notificationId}`);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao agendar lembretes:', error);
  }
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
  }
}

/**
 * Cancela uma notificação específica
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
  }
}

/**
 * Obtém todas as notificações agendadas
 */
export async function getScheduledNotifications(): Promise<any[]> {
  if (Platform.OS === 'web' || !Notifications) {
    return [];
  }

  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Erro ao obter notificações agendadas:', error);
    return [];
  }
}

/**
 * Configura listener para quando uma notificação é recebida
 */
export function addNotificationReceivedListener(
  listener: (notification: any) => void
): any {
  if (Platform.OS === 'web' || !Notifications) {
    return { remove: () => {} };
  }
  return Notifications.addNotificationReceivedListener(listener);
}

/**
 * Configura listener para quando o usuário toca em uma notificação
 */
export function addNotificationResponseReceivedListener(
  listener: (response: any) => void
): any {
  if (Platform.OS === 'web' || !Notifications) {
    return { remove: () => {} };
  }
  return Notifications.addNotificationResponseReceivedListener(listener);
}

