// Utilitário para validação de senha alfanumérica

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida se a senha é alfanumérica:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra (maiúscula ou minúscula)
 * - Pelo menos 1 número
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  // Verificar se contém apenas letras e números (alfanumérica)
  if (!/^[a-zA-Z0-9]+$/.test(password)) {
    errors.push('A senha deve conter apenas letras e números (alfanumérica)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gera uma mensagem de erro amigável para validação de senha
 */
export function getPasswordErrorMessage(errors: string[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return `A senha não atende aos requisitos:\n${errors.map(e => `• ${e}`).join('\n')}`;
}

/**
 * Verifica a força da senha (fraca, média, forte)
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (password.length >= 16) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  return 'strong';
}


