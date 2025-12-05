import { addDays, addWeeks, differenceInWeeks, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Calcula a Data Provável do Parto (DPP) a partir da DUM
 * Regra de Naegele: DUM + 280 dias (40 semanas)
 */
export function calculateDPP(lmp: Date | string): Date {
    const lmpDate = typeof lmp === 'string' ? parseISO(lmp) : lmp
    return addDays(lmpDate, 280)
}

/**
 * Calcula quantas semanas de gestação
 */
export function calculateWeeksPregnant(lmp: Date | string): number {
    const lmpDate = typeof lmp === 'string' ? parseISO(lmp) : lmp
    const weeks = differenceInWeeks(new Date(), lmpDate)
    return Math.max(0, Math.min(weeks, 42)) // Max 42 weeks
}

/**
 * Calcula a data de início da janela de um exame
 */
export function calculateExamWindowStart(lmp: Date | string, startWeek: number): Date {
    const lmpDate = typeof lmp === 'string' ? parseISO(lmp) : lmp
    return addWeeks(lmpDate, startWeek)
}

/**
 * Calcula a data de fim da janela de um exame
 */
export function calculateExamWindowEnd(lmp: Date | string, endWeek: number): Date {
    const lmpDate = typeof lmp === 'string' ? parseISO(lmp) : lmp
    return addWeeks(lmpDate, endWeek)
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

/**
 * Formata data curta
 */
export function formatDateShort(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'dd/MM/yyyy')
}

/**
 * Verifica se está na janela ideal do exame
 */
export function isInIdealWindow(currentWeek: number, startWeek: number, endWeek: number): boolean {
    return currentWeek >= startWeek && currentWeek <= endWeek
}

/**
 * Verifica se a janela já passou
 */
export function isWindowPassed(currentWeek: number, endWeek: number): boolean {
    return currentWeek > endWeek
}
