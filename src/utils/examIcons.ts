// Utilitário para ícones de exames

import { ExamType } from '../types';

/**
 * Retorna o ícone apropriado para cada tipo de exame
 */
export function getExamIcon(type: ExamType): string {
  const iconMap: Record<ExamType, string> = {
    transvaginal: '🔬',
    morfologico_1: '👶',
    morfologico_2: '🫀',
    doppler: '📊',
    biometria: '📏',
    perfil_biofisico: '💚',
    outro: '📋',
  };

  return iconMap[type] || iconMap.outro;
}

/**
 * Retorna o nome do ícone para referência
 */
export function getExamIconName(type: ExamType): string {
  const nameMap: Record<ExamType, string> = {
    transvaginal: 'Transvaginal',
    morfologico_1: 'Morfológico 1º Trimestre',
    morfologico_2: 'Morfológico 2º Trimestre',
    doppler: 'Doppler',
    biometria: 'Biometria',
    perfil_biofisico: 'Perfil Biofísico',
    outro: 'Outro',
  };

  return nameMap[type] || nameMap.outro;
}


