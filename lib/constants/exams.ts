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
        id: 'us_eco_fetal',
        title: 'Ecocardiografia Fetal com Doppler Colorido',
        description: 'Avaliação detalhada do coração do bebê e seu funcionamento.',
        start_week: 28,
        end_week: 29,
        preparation: 'Nenhum preparo específico.',
        order: 4
    },
    {
        id: 'us_obs_28_3d',
        title: 'Obstétrico com Doppler, 3D/4D e 8K',
        description: 'Avaliação do crescimento com tecnologia de alta definição (3D/4D/8K) para ver o rostinho.',
        start_week: 28,
        end_week: 29,
        preparation: 'Comer algo doce 20 minutos antes ajuda o bebê a se mexer para as imagens.',
        order: 5
    },
    {
        id: 'us_obs_32',
        title: 'Ultrassom Obstétrico com Doppler Colorido',
        description: 'Avaliação do crescimento, peso e vitalidade fetal (fluxos sanguíneos).',
        start_week: 32,
        end_week: 33,
        preparation: 'Nenhum preparo específico.',
        order: 6
    },
    {
        id: 'us_obs_36',
        title: 'Ultrassom Obstétrico com Doppler Colorido',
        description: 'Avaliação final do crescimento, líquido amniótico e posição para o parto.',
        start_week: 36,
        end_week: 39,
        preparation: 'Nenhum preparo específico.',
        order: 7
    }
]

export const CLINIC_WHATSAPP = '5511913561616'
export const CLINIC_NAME = process.env.NEXT_PUBLIC_CLINIC_NAME || 'Clínica FMFLA'

// Force update check
