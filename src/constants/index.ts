// Constantes do Gest Ultrassom

import { Exam } from '../types';

// Número do WhatsApp da Clínica FMFLA
export const CLINIC_WHATSAPP_NUMBER = '+5511913561616';

// Protocolo de exames da clínica
export const EXAMS_PROTOCOL: Exam[] = [
  {
    id: 'exam_1',
    type: 'transvaginal',
    name: 'Ultrassom Transvaginal',
    description: 'Avaliação inicial da gestação, saco gestacional e embrião',
    idealWindowStart: 6,
    idealWindowEnd: 8,
    reminderWeeksBefore: 2,
  },
  {
    id: 'exam_2',
    type: 'morfologico_1',
    name: 'Ultrassom Morfológico do 1º Trimestre',
    description: 'Avaliação da translucência nucal e marcadores de cromossomopatias',
    idealWindowStart: 11,
    idealWindowEnd: 13,
    reminderWeeksBefore: 2,
  },
  {
    id: 'exam_3',
    type: 'morfologico_2',
    name: 'Ultrassom Morfológico do 2º Trimestre',
    description: 'Avaliação detalhada da anatomia fetal',
    idealWindowStart: 20,
    idealWindowEnd: 24,
    reminderWeeksBefore: 2,
  },
  {
    id: 'exam_4',
    type: 'doppler',
    name: 'Doppler Obstétrico',
    description: 'Avaliação do fluxo sanguíneo e bem-estar fetal',
    idealWindowStart: 28,
    idealWindowEnd: 32,
    reminderWeeksBefore: 2,
  },
  {
    id: 'exam_5',
    type: 'biometria',
    name: 'Ultrassom com Biometria Fetal',
    description: 'Avaliação do crescimento e desenvolvimento fetal',
    idealWindowStart: 32,
    idealWindowEnd: 34,
    reminderWeeksBefore: 2,
  },
  {
    id: 'exam_6',
    type: 'perfil_biofisico',
    name: 'Perfil Biofísico Fetal',
    description: 'Avaliação final do bem-estar fetal antes do parto',
    idealWindowStart: 36,
    idealWindowEnd: 38,
    reminderWeeksBefore: 2,
  },
];

// Duração média da gestação (em semanas)
export const GESTATION_DURATION_WEEKS = 40;

// Dias por semana
export const DAYS_PER_WEEK = 7;

