export interface WeeklyTip {
    week: number
    babySize: string // ex: "Semente de Papoula"
    babyWeight: string // ex: "1g"
    babyLength: string // ex: "2mm"
    description: string
    tip: string
}

export const WEEKLY_TIPS: Record<number, WeeklyTip> = {
    4: {
        week: 4,
        babySize: "Semente de Papoula",
        babyWeight: "< 1g",
        babyLength: "2mm",
        description: "O embrião está começando a se formar. O tubo neural (que será o cérebro e a coluna) está se fechando.",
        tip: "Comece a tomar ácido fólico se ainda não começou. É vital para a formação do bebê!"
    },
    5: {
        week: 5,
        babySize: "Semente de Gergelim",
        babyWeight: "1g",
        babyLength: "3mm",
        description: "O coraçãozinho está começando a bater! Os principais órgãos (rins, fígado) começam a se desenvolver.",
        tip: "Evite alimentos crus e lave bem as verduras para prevenir toxoplasmose."
    },
    6: {
        week: 6,
        babySize: "Ervilha",
        babyWeight: "1g",
        babyLength: "5mm",
        description: "O nariz, a boca e as orelhas estão começando a tomar forma.",
        tip: "O enjoo matinal pode começar. Tente comer pequenas porções várias vezes ao dia."
    },
    7: {
        week: 7,
        babySize: "Mirtilo",
        babyWeight: "1g",
        babyLength: "1cm",
        description: "As mãos e os pés estão surgindo, parecendo pequenas nadadeiras.",
        tip: "Beba muita água! A hidratação é fundamental para o aumento do volume sanguíneo."
    },
    8: {
        week: 8,
        babySize: "Framboesa",
        babyWeight: "1g",
        babyLength: "1.6cm",
        description: "O bebê já se mexe, mas você ainda não sente. Os dedos começam a se separar.",
        tip: "Hora de marcar sua primeira consulta de pré-natal se ainda não foi!"
    },
    9: {
        week: 9,
        babySize: "Azeitona",
        babyWeight: "2g",
        babyLength: "2.3cm",
        description: "O coração já está totalmente dividido em quatro câmaras. Os dentes estão se formando.",
        tip: "Use sutiãs confortáveis, seus seios podem estar mais sensíveis e inchados."
    },
    10: {
        week: 10,
        babySize: "Ameixa Seca",
        babyWeight: "4g",
        babyLength: "3.1cm",
        description: "Agora ele é oficialmente um feto! A cauda embrionária desapareceu.",
        tip: "Evite roupas apertadas na cintura para melhorar a circulação."
    },
    11: {
        week: 11,
        babySize: "Limão",
        babyWeight: "7g",
        babyLength: "4.1cm",
        description: "A pele é transparente. O bebê já consegue abrir e fechar as mãos.",
        tip: "Ótima semana para agendar o Ultrassom Morfológico do 1º Trimestre!"
    },
    12: {
        week: 12,
        babySize: "Maracujá",
        babyWeight: "14g",
        babyLength: "5.4cm",
        description: "Os reflexos estão se desenvolvendo. Ele pode chupar o dedo!",
        tip: "Conte a novidade para a família se sentir confortável. O risco de aborto diminui muito agora."
    },
    13: {
        week: 13,
        babySize: "Pêssego",
        babyWeight: "23g",
        babyLength: "7.4cm",
        description: "As impressões digitais estão se formando. Fim do primeiro trimestre!",
        tip: "Sua energia deve começar a voltar. Aproveite para fazer caminhadas leves."
    },
    14: {
        week: 14,
        babySize: "Limão Siciliano",
        babyWeight: "43g",
        babyLength: "8.7cm",
        description: "O bebê consegue fazer caretas e talvez até sorrir!",
        tip: "Tire fotos da barriga para acompanhar o crescimento semana a semana."
    },
    15: {
        week: 15,
        babySize: "Maçã",
        babyWeight: "70g",
        babyLength: "10.1cm",
        description: "Ele percebe luz, mesmo com os olhos fechados. As pernas estão crescendo mais que os braços.",
        tip: "Cuide da postura! O centro de gravidade está mudando e pode causar dores nas costas."
    },
    16: {
        week: 16,
        babySize: "Abacate",
        babyWeight: "100g",
        babyLength: "11.6cm",
        description: "O sistema circulatório está funcionando a todo vapor. O coração bombeia 25 litros de sangue por dia.",
        tip: "Talvez você comece a sentir os primeiros movimentos (como borboletas na barriga)!"
    },
    17: {
        week: 17,
        babySize: "Pera",
        babyWeight: "140g",
        babyLength: "13cm",
        description: "O esqueleto está mudando de cartilagem para osso endurecido.",
        tip: "Use protetor solar. Sua pele está mais propensa a manchas (melasma)."
    },
    18: {
        week: 18,
        babySize: "Batata Doce",
        babyWeight: "190g",
        babyLength: "14.2cm",
        description: "As orelhas estão na posição final. Ele pode ouvir seus batimentos cardíacos.",
        tip: "Converse com o bebê! Ele já começa a reconhecer sua voz."
    },
    19: {
        week: 19,
        babySize: "Manga",
        babyWeight: "240g",
        babyLength: "15.3cm",
        description: "Uma camada protetora (vérnix) começa a cobrir a pele do bebê.",
        tip: "Se tiver cãibras nas pernas, alongue-se antes de dormir e coma bananas (potássio)."
    },
    20: {
        week: 20,
        babySize: "Banana",
        babyWeight: "300g",
        babyLength: "16.4cm",
        description: "Metade do caminho! O sexo do bebê geralmente já pode ser visto no ultrassom.",
        tip: "Semana ideal para o Morfológico do 2º Trimestre. Agende logo!"
    },
    21: {
        week: 21,
        babySize: "Cenoura",
        babyWeight: "360g",
        babyLength: "26.7cm",
        description: "O sistema digestivo está amadurecendo. Ele engole líquido amniótico.",
        tip: "Varizes podem aparecer. Tente não ficar muito tempo em pé ou sentada na mesma posição."
    },
    22: {
        week: 22,
        babySize: "Mamão Papaya",
        babyWeight: "430g",
        babyLength: "27.8cm",
        description: "Os olhos estão formados, mas a íris (cor) ainda não tem pigmento.",
        tip: "Mantenha uma dieta rica em ferro para evitar anemia."
    },
    23: {
        week: 23,
        babySize: "Toranja",
        babyWeight: "500g",
        babyLength: "28.9cm",
        description: "O bebê começa a ganhar peso mais rápido. A audição está bem aguçada.",
        tip: "Coloque músicas calmas para o bebê ouvir."
    },
    24: {
        week: 24,
        babySize: "Espiga de Milho",
        babyWeight: "600g",
        babyLength: "30cm",
        description: "Os pulmões estão desenvolvendo os 'ramos' respiratórios e produzindo surfactante.",
        tip: "Fique atenta aos sinais de parto prematuro. Qualquer dor diferente, avise o médico."
    },
    25: {
        week: 25,
        babySize: "Couve-flor",
        babyWeight: "660g",
        babyLength: "34.6cm",
        description: "Ele já tem cílios! E o cabelo também está crescendo.",
        tip: "Descanse sempre que possível. O cansaço pode voltar agora."
    },
    26: {
        week: 26,
        babySize: "Alface",
        babyWeight: "760g",
        babyLength: "35.6cm",
        description: "Ele abre os olhos! E começa a piscar.",
        tip: "Comece a pensar no enxoval e no quarto do bebê."
    },
    27: {
        week: 27,
        babySize: "Couve",
        babyWeight: "875g",
        babyLength: "36.6cm",
        description: "O cérebro está muito ativo. Ele pode sonhar!",
        tip: "Hidrate bem a barriga para evitar estrias."
    },
    28: {
        week: 28,
        babySize: "Berinjela",
        babyWeight: "1kg",
        babyLength: "37.6cm",
        description: "Terceiro trimestre! O bebê já consegue regular a própria temperatura.",
        tip: "Hora de agendar o Ultrassom Obstétrico com Doppler."
    },
    29: {
        week: 29,
        babySize: "Abóbora Menina",
        babyWeight: "1.1kg",
        babyLength: "38.6cm",
        description: "Os ossos estão ficando mais fortes. Ele precisa de muito cálcio.",
        tip: "Coma iogurtes, queijos e folhas verdes escuras."
    },
    30: {
        week: 30,
        babySize: "Repolho",
        babyWeight: "1.3kg",
        babyLength: "39.9cm",
        description: "A pele está ficando mais lisa e menos enrugada.",
        tip: "Já pensou no plano de parto? Converse com seu obstetra."
    },
    31: {
        week: 31,
        babySize: "Coco",
        babyWeight: "1.5kg",
        babyLength: "41.1cm",
        description: "Ele gira a cabeça de um lado para o outro. Está ficando apertado aí dentro!",
        tip: "As idas ao banheiro serão mais frequentes. O útero pressiona a bexiga."
    },
    32: {
        week: 32,
        babySize: "Jicama",
        babyWeight: "1.7kg",
        babyLength: "42.4cm",
        description: "As unhas dos pés já estão formadas. Ele treina a respiração.",
        tip: "Comece a lavar as roupinhas do bebê com sabão neutro."
    },
    33: {
        week: 33,
        babySize: "Abacaxi",
        babyWeight: "1.9kg",
        babyLength: "43.7cm",
        description: "O sistema imunológico está sendo passado de você para ele.",
        tip: "Deixe a mala da maternidade pré-organizada."
    },
    34: {
        week: 34,
        babySize: "Melão Cantaloupe",
        babyWeight: "2.1kg",
        babyLength: "45cm",
        description: "Se for menino, os testículos estão descendo.",
        tip: "Descanse bastante. O inchaço nos pés pode aumentar."
    },
    35: {
        week: 35,
        babySize: "Melão Honeydew",
        babyWeight: "2.4kg",
        babyLength: "46.2cm",
        description: "Os rins estão totalmente desenvolvidos. O fígado já funciona.",
        tip: "Saiba como cronometrar as contrações. Esteja preparada."
    },
    36: {
        week: 36,
        babySize: "Alface Romana",
        babyWeight: "2.6kg",
        babyLength: "47.4cm",
        description: "Ele está perdendo a lanugem (pelinhos). Está quase pronto!",
        tip: "Agende o Ultrassom Final para ver a posição do bebê."
    },
    37: {
        week: 37,
        babySize: "Acelga",
        babyWeight: "2.9kg",
        babyLength: "48.6cm",
        description: "Considerado 'a termo' (pronto para nascer) a partir de agora!",
        tip: "Revise o caminho para a maternidade e tenha os documentos à mão."
    },
    38: {
        week: 38,
        babySize: "Alho Poró",
        babyWeight: "3kg",
        babyLength: "49.8cm",
        description: "Os órgãos estão todos funcionando. Ele está ganhando gordura.",
        tip: "Relaxe e curta os últimos dias do barrigão."
    },
    39: {
        week: 39,
        babySize: "Melancia Pequena",
        babyWeight: "3.3kg",
        babyLength: "50.7cm",
        description: "A pele nova está se formando. Ele está pronto para conhecer o mundo.",
        tip: "Fique atenta ao rompimento da bolsa ou contrações ritmadas."
    },
    40: {
        week: 40,
        babySize: "Abóbora",
        babyWeight: "3.5kg",
        babyLength: "51.2cm",
        description: "Chegou a data prevista! Mas ele pode demorar mais um pouquinho.",
        tip: "Parabéns! Você está prestes a conhecer o amor da sua vida."
    }
}
