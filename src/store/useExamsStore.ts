// Store para gerenciamento de exames agendados

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScheduledExam, Exam } from '../types';
import { EXAMS_PROTOCOL } from '../constants';

interface ExamsState {
  scheduledExams: ScheduledExam[];
  isLoading: boolean;
  error: string | null;
  generateSchedule: (gestationalAge: number, userId: string) => ScheduledExam[];
  markAsCompleted: (examId: string) => Promise<void>;
  markAsScheduled: (examId: string, scheduledDate: Date) => Promise<void>;
  loadExams: () => Promise<void>;
  clearExams: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = '@gest_ultrassom:scheduled_exams';

export const useExamsStore = create<ExamsState>((set, get) => ({
  scheduledExams: [],
  isLoading: false,
  error: null,

  generateSchedule: (gestationalAge: number, userId: string) => {
    const schedule: ScheduledExam[] = [];

    EXAMS_PROTOCOL.forEach((exam) => {
      // Verificar se o exame está dentro da janela ideal ou já passou
      const isInWindow = gestationalAge >= exam.idealWindowStart && gestationalAge <= exam.idealWindowEnd;
      const isPast = gestationalAge > exam.idealWindowEnd;
      const isFuture = gestationalAge < exam.idealWindowStart;

      // Determinar status
      let status: ScheduledExam['status'] = 'pending';
      if (isPast) {
        status = 'missed';
      } else if (isInWindow) {
        status = 'pending';
      } else if (isFuture) {
        status = 'pending';
      }

      const scheduledExam: ScheduledExam = {
        id: `scheduled_${exam.id}_${userId}`,
        userId,
        examId: exam.id,
        exam,
        status,
        reminderSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      schedule.push(scheduledExam);
    });

    // Salvar no store e storage
    set({ scheduledExams: schedule });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedule)).catch(console.error);

    return schedule;
  },

  markAsCompleted: async (examId: string) => {
    set({ isLoading: true, error: null });
    try {
      const exams = get().scheduledExams.map((exam) =>
        exam.id === examId
          ? { ...exam, status: 'completed' as const, completedDate: new Date(), updatedAt: new Date() }
          : exam
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
      set({ scheduledExams: exams, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao marcar exame como concluído';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  markAsScheduled: async (examId: string, scheduledDate: Date) => {
    set({ isLoading: true, error: null });
    try {
      const exams = get().scheduledExams.map((exam) =>
        exam.id === examId
          ? { ...exam, status: 'scheduled' as const, scheduledDate, updatedAt: new Date() }
          : exam
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
      set({ scheduledExams: exams, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao agendar exame';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  loadExams: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const exams = JSON.parse(stored);
        exams.forEach((exam: ScheduledExam) => {
          exam.createdAt = new Date(exam.createdAt);
          exam.updatedAt = new Date(exam.updatedAt);
          if (exam.scheduledDate) {
            exam.scheduledDate = new Date(exam.scheduledDate);
          }
          if (exam.completedDate) {
            exam.completedDate = new Date(exam.completedDate);
          }
          if (exam.reminderSentAt) {
            exam.reminderSentAt = new Date(exam.reminderSentAt);
          }
        });
        set({ scheduledExams: exams, isLoading: false, error: null });
      } else {
        set({ scheduledExams: [], isLoading: false, error: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar exames';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearExams: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ scheduledExams: [], error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao limpar exames';
      set({ error: errorMessage });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

