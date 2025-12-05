// Testes básicos para funções de cálculo gestacional

import {
  calculateGestationalAgeFromLMP,
  calculateDueDateFromLMP,
  calculateGestationalAgeFromDueDate,
  formatGestationalAge,
  weeksAndDaysToDecimal,
  decimalToWeeksAndDays,
} from '../gestational';

describe('Gestational Calculations', () => {
  describe('calculateGestationalAgeFromLMP', () => {
    it('deve calcular idade gestacional corretamente', () => {
      const lmp = new Date('2024-01-01');
      const referenceDate = new Date('2024-02-01'); // 4 semanas depois
      const age = calculateGestationalAgeFromLMP(lmp, referenceDate);
      expect(age).toBeCloseTo(4, 1);
    });

    it('deve limitar entre 0 e 42 semanas', () => {
      const lmp = new Date('2020-01-01'); // Muito antiga
      const age = calculateGestationalAgeFromLMP(lmp);
      expect(age).toBeLessThanOrEqual(42);
    });
  });

  describe('calculateDueDateFromLMP', () => {
    it('deve calcular DPP corretamente (40 semanas após DUM)', () => {
      const lmp = new Date('2024-01-01');
      const dueDate = calculateDueDateFromLMP(lmp);
      const expectedDate = new Date('2024-10-07'); // 280 dias depois
      expect(dueDate.getTime()).toBeCloseTo(expectedDate.getTime(), -86400000); // Tolerância de 1 dia
    });
  });

  describe('formatGestationalAge', () => {
    it('deve formatar semanas completas corretamente', () => {
      expect(formatGestationalAge(12)).toBe('12 semanas');
    });

    it('deve formatar semanas e dias corretamente', () => {
      expect(formatGestationalAge(12.5)).toBe('12 semanas e 3 dias');
    });
  });

  describe('weeksAndDaysToDecimal', () => {
    it('deve converter semanas e dias para decimal', () => {
      expect(weeksAndDaysToDecimal(12, 3)).toBeCloseTo(12.43, 2);
    });
  });

  describe('decimalToWeeksAndDays', () => {
    it('deve converter decimal para semanas e dias', () => {
      const result = decimalToWeeksAndDays(12.43);
      expect(result.weeks).toBe(12);
      expect(result.days).toBe(3);
    });
  });
});

