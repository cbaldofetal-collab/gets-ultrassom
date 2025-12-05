// Utilitários para cálculo gestacional

import { GESTATION_DURATION_WEEKS, DAYS_PER_WEEK } from '../constants';
import { PregnancyProfile } from '../types';

/**
 * Calcula a idade gestacional (em semanas com decimais para dias) a partir da DUM
 */
export function calculateGestationalAgeFromLMP(lastMenstrualPeriod: Date, referenceDate?: Date): number {
  const today = referenceDate || new Date();
  const diffTime = today.getTime() - lastMenstrualPeriod.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const weeks = diffDays / DAYS_PER_WEEK;
  
  // Limitar entre 0 e 42 semanas
  return Math.max(0, Math.min(42, weeks));
}

/**
 * Calcula a idade gestacional a partir do primeiro ultrassom
 * Se o ultrassom foi feito em uma data específica com uma idade gestacional conhecida,
 * calculamos a idade atual baseada na diferença de tempo
 */
export function calculateGestationalAgeFromFirstUltrasound(
  ultrasoundDate: Date,
  ultrasoundGestationalAge: number,
  referenceDate?: Date
): number {
  const today = referenceDate || new Date();
  const diffTime = today.getTime() - ultrasoundDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const weeksToAdd = diffDays / DAYS_PER_WEEK;
  const currentAge = ultrasoundGestationalAge + weeksToAdd;
  
  // Limitar entre 0 e 42 semanas
  return Math.max(0, Math.min(42, currentAge));
}

/**
 * Calcula a DPP a partir da DUM
 */
export function calculateDueDateFromLMP(lastMenstrualPeriod: Date): Date {
  const dueDate = new Date(lastMenstrualPeriod);
  dueDate.setDate(dueDate.getDate() + (GESTATION_DURATION_WEEKS * DAYS_PER_WEEK));
  return dueDate;
}

/**
 * Calcula a idade gestacional a partir da DPP
 */
export function calculateGestationalAgeFromDueDate(dueDate: Date): number {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = GESTATION_DURATION_WEEKS - Math.ceil(diffDays / DAYS_PER_WEEK);
  
  // Limitar entre 0 e 42 semanas
  return Math.max(0, Math.min(42, weeks));
}

/**
 * Calcula a DUM a partir da DPP
 */
export function calculateLMPFromDueDate(dueDate: Date): Date {
  const lmp = new Date(dueDate);
  lmp.setDate(lmp.getDate() - (GESTATION_DURATION_WEEKS * DAYS_PER_WEEK));
  return lmp;
}

/**
 * Atualiza o perfil gestacional com cálculos automáticos
 * Prioriza o cálculo pelo primeiro ultrassom se disponível (mais preciso)
 */
export function updatePregnancyProfile(profile: Partial<PregnancyProfile>): PregnancyProfile {
  let gestationalAge = 0;
  let dueDate: Date | undefined;
  let lastMenstrualPeriod: Date | undefined;
  const today = new Date();

  // Prioridade 1: Primeiro ultrassom (mais preciso)
  if (profile.firstUltrasoundDate && profile.firstUltrasoundGestationalAge !== undefined) {
    gestationalAge = calculateGestationalAgeFromFirstUltrasound(
      profile.firstUltrasoundDate,
      profile.firstUltrasoundGestationalAge,
      today
    );
    
    // Calcular DUM e DPP baseado na idade gestacional atual
    if (profile.lastMenstrualPeriod) {
      lastMenstrualPeriod = profile.lastMenstrualPeriod;
      dueDate = calculateDueDateFromLMP(lastMenstrualPeriod);
    } else {
      // Estimar DUM baseado na idade gestacional atual
      lastMenstrualPeriod = new Date(today);
      lastMenstrualPeriod.setDate(lastMenstrualPeriod.getDate() - Math.floor(gestationalAge * DAYS_PER_WEEK));
      dueDate = calculateDueDateFromLMP(lastMenstrualPeriod);
    }
  }
  // Prioridade 2: DUM
  else if (profile.lastMenstrualPeriod) {
    lastMenstrualPeriod = profile.lastMenstrualPeriod;
    gestationalAge = calculateGestationalAgeFromLMP(lastMenstrualPeriod, today);
    dueDate = calculateDueDateFromLMP(lastMenstrualPeriod);
  }
  // Prioridade 3: DPP
  else if (profile.dueDate) {
    dueDate = profile.dueDate;
    gestationalAge = calculateGestationalAgeFromDueDate(dueDate);
    lastMenstrualPeriod = calculateLMPFromDueDate(dueDate);
  }
  // Prioridade 4: Idade gestacional direta
  else if (profile.gestationalAge !== undefined) {
    gestationalAge = profile.gestationalAge;
    lastMenstrualPeriod = new Date(today);
    lastMenstrualPeriod.setDate(lastMenstrualPeriod.getDate() - Math.floor(gestationalAge * DAYS_PER_WEEK));
    dueDate = calculateDueDateFromLMP(lastMenstrualPeriod);
  }

  return {
    id: profile.id || `profile_${Date.now()}`,
    userId: profile.userId || '',
    lastMenstrualPeriod,
    dueDate,
    gestationalAge,
    firstUltrasoundDate: profile.firstUltrasoundDate,
    firstUltrasoundGestationalAge: profile.firstUltrasoundGestationalAge,
    createdAt: profile.createdAt || new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Formata a idade gestacional para exibição (semanas e dias)
 */
export function formatGestationalAge(weeks: number): string {
  const fullWeeks = Math.floor(weeks);
  const days = Math.floor((weeks - fullWeeks) * DAYS_PER_WEEK);
  
  if (days === 0) {
    return `${fullWeeks} semanas`;
  }
  return `${fullWeeks} semanas e ${days} dias`;
}

/**
 * Converte semanas e dias para semanas decimais
 */
export function weeksAndDaysToDecimal(weeks: number, days: number): number {
  return weeks + (days / DAYS_PER_WEEK);
}

/**
 * Converte semanas decimais para semanas e dias
 */
export function decimalToWeeksAndDays(weeksDecimal: number): { weeks: number; days: number } {
  const weeks = Math.floor(weeksDecimal);
  const days = Math.floor((weeksDecimal - weeks) * DAYS_PER_WEEK);
  return { weeks, days };
}

