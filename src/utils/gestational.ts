// Utilitários para cálculo gestacional

import { GESTATION_DURATION_WEEKS, DAYS_PER_WEEK } from '../constants';
import { PregnancyProfile } from '../types';

/**
 * Calcula a idade gestacional (em semanas) a partir da DUM
 */
export function calculateGestationalAgeFromLMP(lastMenstrualPeriod: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - lastMenstrualPeriod.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / DAYS_PER_WEEK);
  
  // Limitar entre 0 e 42 semanas
  return Math.max(0, Math.min(42, weeks));
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
 */
export function updatePregnancyProfile(profile: Partial<PregnancyProfile>): PregnancyProfile {
  let gestationalAge = 0;
  let dueDate: Date | undefined;
  let lastMenstrualPeriod: Date | undefined;

  if (profile.lastMenstrualPeriod) {
    lastMenstrualPeriod = profile.lastMenstrualPeriod;
    gestationalAge = calculateGestationalAgeFromLMP(lastMenstrualPeriod);
    dueDate = calculateDueDateFromLMP(lastMenstrualPeriod);
  } else if (profile.dueDate) {
    dueDate = profile.dueDate;
    gestationalAge = calculateGestationalAgeFromDueDate(dueDate);
    lastMenstrualPeriod = calculateLMPFromDueDate(dueDate);
  } else if (profile.gestationalAge !== undefined) {
    gestationalAge = profile.gestationalAge;
    // Se só temos a idade gestacional, precisamos de uma data de referência
    const today = new Date();
    lastMenstrualPeriod = new Date(today);
    lastMenstrualPeriod.setDate(lastMenstrualPeriod.getDate() - (gestationalAge * DAYS_PER_WEEK));
    dueDate = calculateDueDateFromLMP(lastMenstrualPeriod);
  }

  return {
    id: profile.id || `profile_${Date.now()}`,
    userId: profile.userId || '',
    lastMenstrualPeriod,
    dueDate,
    gestationalAge,
    createdAt: profile.createdAt || new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Formata a idade gestacional para exibição
 */
export function formatGestationalAge(weeks: number): string {
  const fullWeeks = Math.floor(weeks);
  const days = Math.floor((weeks - fullWeeks) * DAYS_PER_WEEK);
  
  if (days === 0) {
    return `${fullWeeks} semanas`;
  }
  return `${fullWeeks} semanas e ${days} dias`;
}

