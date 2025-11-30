import { CLINIC_WHATSAPP_NUMBER } from '@/lib/constants/exams'

/**
 * Gera link do WhatsApp com mensagem pré-formatada
 */
export function generateWhatsAppLink(userName: string, examTitle: string): string {
    const message = `Olá! Sou ${userName}. Gostaria de agendar o exame: *${examTitle}*.`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodedMessage}`
}

/**
 * Abre WhatsApp em nova aba
 */
export function openWhatsApp(userName: string, examTitle: string) {
    const link = generateWhatsAppLink(userName, examTitle)
    window.open(link, '_blank')
}
