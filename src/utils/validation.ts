// Utilitários de validação de dados

import { PregnancyProfile } from '../types';
import { GESTATION_DURATION_WEEKS } from '../constants';

/**
 * Valida se uma data é válida e está em um range razoável
 */
export function validateDate(date: Date, minDate?: Date, maxDate?: Date): { valid: boolean; error?: string } {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return { valid: false, error: 'Data inválida' };
  }

  if (minDate && date < minDate) {
    return { valid: false, error: `Data deve ser posterior a ${minDate.toLocaleDateString('pt-BR')}` };
  }

  if (maxDate && date > maxDate) {
    return { valid: false, error: `Data deve ser anterior a ${maxDate.toLocaleDateString('pt-BR')}` };
  }

  return { valid: true };
}

/**
 * Valida DUM (Data da Última Menstruação)
 */
export function validateLMP(lmpDate: Date): { valid: boolean; error?: string } {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // DUM deve estar entre 1 ano atrás e 1 semana atrás
  if (lmpDate > oneWeekAgo) {
    return { valid: false, error: 'A data da última menstruação deve ser de pelo menos 1 semana atrás' };
  }

  if (lmpDate < oneYearAgo) {
    return { valid: false, error: 'A data da última menstruação não pode ser há mais de 1 ano' };
  }

  return { valid: true };
}

/**
 * Valida DPP (Data Prevista do Parto)
 */
export function validateDueDate(dueDate: Date): { valid: boolean; error?: string } {
  const today = new Date();
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  const tenMonthsFromNow = new Date(today);
  tenMonthsFromNow.setMonth(tenMonthsFromNow.getMonth() + 10);

  // DPP deve estar entre 1 semana e 10 meses no futuro
  if (dueDate < oneWeekFromNow) {
    return { valid: false, error: 'A data prevista do parto deve ser de pelo menos 1 semana no futuro' };
  }

  if (dueDate > tenMonthsFromNow) {
    return { valid: false, error: 'A data prevista do parto não pode ser há mais de 10 meses' };
  }

  return { valid: true };
}

/**
 * Valida idade gestacional (semanas e dias)
 */
export function validateGestationalAge(weeks: number, days: number): { valid: boolean; error?: string } {
  if (weeks < 0 || weeks > GESTATION_DURATION_WEEKS) {
    return { 
      valid: false, 
      error: `Idade gestacional deve estar entre 0 e ${GESTATION_DURATION_WEEKS} semanas` 
    };
  }

  if (days < 0 || days > 6) {
    return { valid: false, error: 'Dias devem estar entre 0 e 6' };
  }

  return { valid: true };
}

/**
 * Valida data do primeiro ultrassom
 */
export function validateFirstUltrasoundDate(ultrasoundDate: Date, lmpDate?: Date): { valid: boolean; error?: string } {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Ultrassom não pode ser no futuro
  if (ultrasoundDate > today) {
    return { valid: false, error: 'A data do ultrassom não pode ser no futuro' };
  }

  // Ultrassom não pode ser há mais de 1 ano
  if (ultrasoundDate < oneYearAgo) {
    return { valid: false, error: 'A data do ultrassom não pode ser há mais de 1 ano' };
  }

  // Se temos DUM, ultrassom deve ser depois da DUM
  if (lmpDate && ultrasoundDate < lmpDate) {
    return { valid: false, error: 'A data do ultrassom deve ser posterior à data da última menstruação' };
  }

  return { valid: true };
}

/**
 * Valida consistência entre DUM e primeiro ultrassom
 */
export function validateConsistency(
  lmpDate?: Date,
  dueDate?: Date,
  ultrasoundDate?: Date,
  ultrasoundGestationalAge?: number
): { valid: boolean; error?: string } {
  // Se temos DUM e DPP, verificar consistência
  if (lmpDate && dueDate) {
    const expectedDueDate = new Date(lmpDate);
    expectedDueDate.setDate(expectedDueDate.getDate() + (GESTATION_DURATION_WEEKS * 7));
    
    const diffDays = Math.abs((dueDate.getTime() - expectedDueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Permitir diferença de até 14 dias (2 semanas)
    if (diffDays > 14) {
      return { 
        valid: false, 
        error: 'A data prevista do parto está muito diferente da calculada pela DUM. Verifique os dados.' 
      };
    }
  }

  // Se temos ultrassom e DUM, verificar consistência
  if (ultrasoundDate && lmpDate && ultrasoundGestationalAge !== undefined) {
    const diffDays = (ultrasoundDate.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24);
    const expectedWeeks = diffDays / 7;
    const diffWeeks = Math.abs(ultrasoundGestationalAge - expectedWeeks);
    
    // Permitir diferença de até 2 semanas
    if (diffWeeks > 2) {
      return { 
        valid: false, 
        error: 'A idade gestacional do ultrassom está muito diferente da calculada pela DUM. Verifique os dados.' 
      };
    }
  }

  return { valid: true };
}

/**
 * Valida perfil gestacional completo
 */
export function validatePregnancyProfile(profile: Partial<PregnancyProfile>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar DUM se presente
  if (profile.lastMenstrualPeriod) {
    const lmpValidation = validateLMP(profile.lastMenstrualPeriod);
    if (!lmpValidation.valid) {
      errors.push(lmpValidation.error || 'DUM inválida');
    }
  }

  // Validar DPP se presente
  if (profile.dueDate) {
    const dueDateValidation = validateDueDate(profile.dueDate);
    if (!dueDateValidation.valid) {
      errors.push(dueDateValidation.error || 'DPP inválida');
    }
  }

  // Validar primeiro ultrassom se presente
  if (profile.firstUltrasoundDate) {
    const ultrasoundValidation = validateFirstUltrasoundDate(
      profile.firstUltrasoundDate,
      profile.lastMenstrualPeriod
    );
    if (!ultrasoundValidation.valid) {
      errors.push(ultrasoundValidation.error || 'Data do ultrassom inválida');
    }

    if (profile.firstUltrasoundGestationalAge !== undefined) {
      const { weeks, days } = decimalToWeeksAndDays(profile.firstUltrasoundGestationalAge);
      const ageValidation = validateGestationalAge(weeks, days);
      if (!ageValidation.valid) {
        errors.push(ageValidation.error || 'Idade gestacional do ultrassom inválida');
      }
    }
  }

  // Validar consistência
  const consistencyValidation = validateConsistency(
    profile.lastMenstrualPeriod,
    profile.dueDate,
    profile.firstUltrasoundDate,
    profile.firstUltrasoundGestationalAge
  );
  if (!consistencyValidation.valid) {
    errors.push(consistencyValidation.error || 'Dados inconsistentes');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Função auxiliar para converter semanas decimais em semanas e dias
function decimalToWeeksAndDays(weeksDecimal: number): { weeks: number; days: number } {
  const weeks = Math.floor(weeksDecimal);
  const days = Math.floor((weeksDecimal - weeks) * 7);
  return { weeks, days };
}

