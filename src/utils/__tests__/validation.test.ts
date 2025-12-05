// Testes básicos para funções de validação

import {
  validateLMP,
  validateDueDate,
  validateGestationalAge,
  validateFirstUltrasoundDate,
  validateConsistency,
} from '../validation';

describe('Validation Functions', () => {
  describe('validateLMP', () => {
    it('deve validar DUM válida', () => {
      const lmp = new Date();
      lmp.setDate(lmp.getDate() - 14); // 2 semanas atrás
      const result = validateLMP(lmp);
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar DUM muito recente', () => {
      const lmp = new Date();
      lmp.setDate(lmp.getDate() - 3); // 3 dias atrás
      const result = validateLMP(lmp);
      expect(result.valid).toBe(false);
    });

    it('deve rejeitar DUM muito antiga', () => {
      const lmp = new Date();
      lmp.setFullYear(lmp.getFullYear() - 2); // 2 anos atrás
      const result = validateLMP(lmp);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateDueDate', () => {
    it('deve validar DPP válida', () => {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 6); // 6 meses no futuro
      const result = validateDueDate(dueDate);
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar DPP muito próxima', () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // 3 dias no futuro
      const result = validateDueDate(dueDate);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateGestationalAge', () => {
    it('deve validar idade gestacional válida', () => {
      const result = validateGestationalAge(20, 3);
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar semanas inválidas', () => {
      const result = validateGestationalAge(50, 0);
      expect(result.valid).toBe(false);
    });

    it('deve rejeitar dias inválidos', () => {
      const result = validateGestationalAge(20, 8);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateConsistency', () => {
    it('deve validar consistência entre DUM e DPP', () => {
      const lmp = new Date('2024-01-01');
      const dueDate = new Date('2024-10-07'); // ~40 semanas depois
      const result = validateConsistency(lmp, dueDate);
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar DPP muito diferente da calculada', () => {
      const lmp = new Date('2024-01-01');
      const dueDate = new Date('2024-12-01'); // Muito diferente
      const result = validateConsistency(lmp, dueDate);
      expect(result.valid).toBe(false);
    });
  });
});

