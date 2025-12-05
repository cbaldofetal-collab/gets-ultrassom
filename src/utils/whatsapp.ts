// Utilitários para integração com WhatsApp

import { Linking, Platform } from 'react-native';
import { CLINIC_WHATSAPP_NUMBER } from '../constants';
import { Exam, User } from '../types';

/**
 * Gera mensagem pré-formatada para agendamento via WhatsApp
 */
export function generateWhatsAppMessage(user: User, exam: Exam, gestationalAge: number): string {
  const message = `Olá, sou a ${user.name}${user.phone ? ` (${user.phone})` : ''}. Gostaria de agendar o *${exam.name}*, previsto para a minha ${gestationalAge}ª semana de gestação.`;
  return encodeURIComponent(message);
}

/**
 * Abre WhatsApp com mensagem pré-formatada
 */
export async function openWhatsApp(user: User, exam: Exam, gestationalAge: number): Promise<void> {
  const message = generateWhatsAppMessage(user, exam, gestationalAge);
  const phoneNumber = CLINIC_WHATSAPP_NUMBER.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  try {
    // No web, abrir diretamente em nova aba
    if (Platform.OS === 'web') {
      window.open(whatsappUrl, '_blank');
      return;
    }

    // Em plataformas nativas, usar Linking
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      // Fallback: tentar abrir WhatsApp Web
      const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
      await Linking.openURL(whatsappWebUrl);
    }
  } catch (error) {
    console.error('Erro ao abrir WhatsApp:', error);
    // No web, tentar abrir mesmo se houver erro
    if (Platform.OS === 'web') {
      window.open(whatsappUrl, '_blank');
    } else {
      throw new Error('Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.');
    }
  }
}

