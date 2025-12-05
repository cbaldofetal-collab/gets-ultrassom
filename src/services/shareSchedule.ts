// Serviço para compartilhar cronograma de exames

import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Platform, Alert, Linking } from 'react-native';
import { ScheduledExam } from '../types';
import { formatDateFull } from '../utils/date';
import { formatGestationalAge } from '../utils/gestational';
import { CLINIC_WHATSAPP_NUMBER } from '../constants';

interface ShareScheduleOptions {
  exams: ScheduledExam[];
  userName: string;
  gestationalAge: number;
  dueDate?: Date;
}

/**
 * Gera HTML do cronograma para PDF
 */
function generateScheduleHTML(options: ShareScheduleOptions): string {
  const { exams, userName, gestationalAge, dueDate } = options;

  const completedCount = exams.filter((e) => e.status === 'completed').length;
  const pendingCount = exams.filter((e) => e.status === 'pending').length;
  const scheduledCount = exams.filter((e) => e.status === 'scheduled').length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #64B5F6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #64B5F6;
            margin: 0;
            font-size: 24px;
          }
          .info {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .stats {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-card {
            flex: 1;
            background: #64B5F6;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .stat-label {
            font-size: 12px;
            opacity: 0.9;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #64B5F6;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-completed {
            background: #4CAF50;
            color: white;
          }
          .status-pending {
            background: #FF9800;
            color: white;
          }
          .status-scheduled {
            background: #2196F3;
            color: white;
          }
          .status-missed {
            background: #F44336;
            color: white;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📅 Cronograma de Exames</h1>
          <p>Gest Ultrassom - Clínica FMFLA</p>
        </div>

        <div class="info">
          <div class="info-row">
            <strong>Paciente:</strong>
            <span>${userName}</span>
          </div>
          <div class="info-row">
            <strong>Idade Gestacional:</strong>
            <span>${formatGestationalAge(gestationalAge)}</span>
          </div>
          ${dueDate ? `
          <div class="info-row">
            <strong>Data Prevista do Parto:</strong>
            <span>${formatDateFull(dueDate)}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <strong>Data do Relatório:</strong>
            <span>${formatDateFull(new Date())}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${completedCount}</div>
            <div class="stat-label">Realizados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${pendingCount}</div>
            <div class="stat-label">Pendentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${scheduledCount}</div>
            <div class="stat-label">Agendados</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Exame</th>
              <th>Janela Ideal</th>
              <th>Status</th>
              <th>Data Agendada</th>
            </tr>
          </thead>
          <tbody>
            ${exams
              .map(
                (exam) => `
              <tr>
                <td>
                  <strong>${exam.exam.name}</strong><br>
                  <small>${exam.exam.description}</small>
                </td>
                <td>${exam.exam.idealWindowStart} - ${exam.exam.idealWindowEnd} semanas</td>
                <td>
                  <span class="status-badge status-${exam.status}">
                    ${exam.status === 'completed' ? '✅ Realizado' : 
                      exam.status === 'scheduled' ? '📅 Agendado' : 
                      exam.status === 'missed' ? '❌ Perdido' : 
                      '⏳ Pendente'}
                  </span>
                </td>
                <td>${exam.scheduledDate ? formatDateFull(exam.scheduledDate) : '-'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Gerado pelo aplicativo Gest Ultrassom</p>
          <p>Clínica FMFLA - São Paulo</p>
        </div>
      </body>
    </html>
  `;

  return html;
}

/**
 * Compartilha o cronograma como PDF
 */
export async function shareScheduleAsPDF(options: ShareScheduleOptions): Promise<void> {
  try {
    const html = generateScheduleHTML(options);
    
    const { uri } = await Print.printToFileAsync({ html });
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar Cronograma de Exames',
      });
    } else {
      Alert.alert(
        'Compartilhamento não disponível',
        'O compartilhamento não está disponível neste dispositivo.'
      );
    }
  } catch (error) {
    console.error('Erro ao compartilhar cronograma:', error);
    Alert.alert('Erro', 'Não foi possível compartilhar o cronograma.');
    throw error;
  }
}

/**
 * Compartilha o cronograma via WhatsApp
 */
export async function shareScheduleViaWhatsApp(options: ShareScheduleOptions): Promise<void> {
  try {
    const { exams, userName, gestationalAge, dueDate } = options;
    
    const completedCount = exams.filter((e) => e.status === 'completed').length;
    const pendingCount = exams.filter((e) => e.status === 'pending').length;
    
    let message = `📅 *Cronograma de Exames - Gest Ultrassom*\n\n`;
    message += `👤 *Paciente:* ${userName}\n`;
    message += `🤰 *Idade Gestacional:* ${formatGestationalAge(gestationalAge)}\n`;
    if (dueDate) {
      message += `📆 *DPP:* ${formatDateFull(dueDate)}\n`;
    }
    message += `\n📊 *Resumo:*\n`;
    message += `✅ Realizados: ${completedCount}\n`;
    message += `⏳ Pendentes: ${pendingCount}\n`;
    message += `\n📋 *Exames:*\n\n`;
    
    exams.forEach((exam) => {
      const statusIcon = 
        exam.status === 'completed' ? '✅' :
        exam.status === 'scheduled' ? '📅' :
        exam.status === 'missed' ? '❌' : '⏳';
      
      message += `${statusIcon} *${exam.exam.name}*\n`;
      message += `   Janela: ${exam.exam.idealWindowStart}-${exam.exam.idealWindowEnd} semanas\n`;
      if (exam.scheduledDate) {
        message += `   Agendado: ${formatDateFull(exam.scheduledDate)}\n`;
      }
      message += `\n`;
    });
    
    message += `\n_Clínica FMFLA - São Paulo_`;
    
    const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        throw new Error('WhatsApp não está disponível');
      }
    } catch (error) {
      throw new Error('Não foi possível abrir o WhatsApp');
    }
  } catch (error) {
    console.error('Erro ao compartilhar via WhatsApp:', error);
    Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    throw error;
  }
}

