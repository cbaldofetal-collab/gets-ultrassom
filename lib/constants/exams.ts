import { ExamDefinition } from '@/lib/types'

export const PRENATAL_EXAMS: ExamDefinition[] = [
    {
        id: 'us_transvaginal',
        title: 'Ultrassom Transvaginal Inicial',
        description: 'Confirmação da gravidez, localização do saco gestacional e vitalidade embrionária.',
        start_week: 6,
        end_week: 10,
        preparation: 'Bexiga vazia. Trazer exames anteriores se houver.',
        order: 1
    },
    {
        id: 'us_morfo_1',
        title: 'Morfológico do 1º Trimestre',
        description: 'Avaliação de risco para síndromes genét icas (translucência nucal) e anatomia inicial.',
        start_week: 11,
        end_week: 14,
        preparation: 'Alimentação leve antes do exame. Não é necessário bexiga cheia.',
        order: 2
    },
    {
        id: 'us_morfo_2',
        title: 'Morfológico do 2º Trimestre',
        description: 'Análise detalhada da anatomia fetal, formação dos órgãos e crescimento.',
        start_week: 20,
        end_week: 24,
        preparation: 'Nenhum preparo específico. Evitar cremes hidratantes na barriga no dia.',
        order: 3
    },
    {
        id: 'us_obstetrico_3',
        title: 'Ultrassom Obstétrico + Doppler',
        description: 'Avaliação do crescimento, peso fetal e bem-estar (fluxo sanguíneo).',
        start_week: 28,
        end_week: 32,
        preparation: 'Comer algo doce (ex: chocolate) 20 minutos antes pode ajudar o bebê a se mexer.',
        order: 4
    },
    {
        id: 'us_final',
        title: 'Ultrassom Final (Termo)',
        description: 'Verificação da posição do bebê e condições para o parto.',
        start_week: 36,
        end_week: 39,
        preparation: 'Nenhum preparo específico.',
        order: 5
    }
]

export const CLINIC_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511913561616'
export const CLINIC_NAME = process.env.NEXT_PUBLIC_CLINIC_NAME || 'Clínica FMFLA'
