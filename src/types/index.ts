// Tipos TypeScript para o Gest Ultrassom

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  password?: string; // Hash da senha (não armazenar em texto plano)
  createdAt: Date;
}

export interface PregnancyProfile {
  id: string;
  userId: string;
  lastMenstrualPeriod?: Date; // DUM
  dueDate?: Date; // DPP
  gestationalAge: number; // Idade gestacional em semanas (com decimais para dias)
  firstUltrasoundDate?: Date; // Data do primeiro ultrassom
  firstUltrasoundGestationalAge?: number; // Idade gestacional no primeiro ultrassom (em semanas com decimais)
  createdAt: Date;
  updatedAt: Date;
}

export type ExamType = 
  | 'transvaginal'
  | 'morfologico_1'
  | 'morfologico_2'
  | 'doppler'
  | 'biometria'
  | 'perfil_biofisico'
  | 'outro';

export interface Exam {
  id: string;
  type: ExamType;
  name: string;
  description: string;
  idealWindowStart: number; // Semana gestacional inicial
  idealWindowEnd: number; // Semana gestacional final
  reminderWeeksBefore: number; // Quantas semanas antes enviar lembrete
}

export interface ScheduledExam {
  id: string;
  userId: string;
  examId: string;
  exam: Exam;
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'missed';
  reminderSent: boolean;
  reminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  scheduledExamId: string;
  title: string;
  message: string;
  sentAt?: Date;
  readAt?: Date;
  type: 'reminder' | 'update' | 'info';
}

