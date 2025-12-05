// Utilitário para comparar tamanho do bebê com frutas

interface BabySize {
  fruit: string;
  fruitEmoji: string;
  size: string;
  description: string;
}

/**
 * Retorna o tamanho do bebê comparado a uma fruta baseado na idade gestacional
 */
export function getBabySize(gestationalAgeWeeks: number): BabySize {
  const weeks = Math.floor(gestationalAgeWeeks);

  // Mapeamento de semanas para tamanhos de frutas
  const sizeMap: Array<{ min: number; max: number; data: BabySize }> = [
    { min: 0, max: 3, data: { fruit: 'Semente de papoula', fruitEmoji: '🌱', size: '0.1-0.2 cm', description: 'Apenas uma célula fertilizada' } },
    { min: 4, max: 4, data: { fruit: 'Semente de gergelim', fruitEmoji: '🌱', size: '0.2 cm', description: 'Embrião começando a se formar' } },
    { min: 5, max: 5, data: { fruit: 'Semente de maçã', fruitEmoji: '🍎', size: '0.3 cm', description: 'Coração começando a bater' } },
    { min: 6, max: 6, data: { fruit: 'Ervilha', fruitEmoji: '🫛', size: '0.6 cm', description: 'Formato de C, coração batendo' } },
    { min: 7, max: 7, data: { fruit: 'Mirtilo', fruitEmoji: '🫐', size: '1 cm', description: 'Cabeça e corpo se desenvolvendo' } },
    { min: 8, max: 8, data: { fruit: 'Feijão', fruitEmoji: '🫘', size: '1.6 cm', description: 'Braços e pernas aparecendo' } },
    { min: 9, max: 9, data: { fruit: 'Uva', fruitEmoji: '🍇', size: '2.3 cm', description: 'Dedos começando a se formar' } },
    { min: 10, max: 10, data: { fruit: 'Azeitona', fruitEmoji: '🫒', size: '3.1 cm', description: 'Órgãos vitais funcionando' } },
    { min: 11, max: 11, data: { fruit: 'Figo', fruitEmoji: '🫒', size: '4.1 cm', description: 'Movimentos começando' } },
    { min: 12, max: 12, data: { fruit: 'Lima', fruitEmoji: '🍋', size: '5.4 cm', description: 'Reflexos desenvolvendo' } },
    { min: 13, max: 13, data: { fruit: 'Ervilha', fruitEmoji: '🫛', size: '7.4 cm', description: 'Sistema digestivo funcionando' } },
    { min: 14, max: 14, data: { fruit: 'Limão', fruitEmoji: '🍋', size: '8.7 cm', description: 'Chupando o dedo' } },
    { min: 15, max: 15, data: { fruit: 'Maçã', fruitEmoji: '🍎', size: '10 cm', description: 'Movimentos mais coordenados' } },
    { min: 16, max: 16, data: { fruit: 'Abacate', fruitEmoji: '🥑', size: '11.6 cm', description: 'Ouvindo sua voz' } },
    { min: 17, max: 17, data: { fruit: 'Rabanete', fruitEmoji: '🥕', size: '13 cm', description: 'Gordura começando a se formar' } },
    { min: 18, max: 18, data: { fruit: 'Pimentão', fruitEmoji: '🫑', size: '14.2 cm', description: 'Movimentos mais fortes' } },
    { min: 19, max: 19, data: { fruit: 'Tomate', fruitEmoji: '🍅', size: '15.3 cm', description: 'Vernix cobrindo a pele' } },
    { min: 20, max: 20, data: { fruit: 'Banana', fruitEmoji: '🍌', size: '16.4 cm', description: 'Meio caminho andado!' } },
    { min: 21, max: 21, data: { fruit: 'Cenoura', fruitEmoji: '🥕', size: '26.7 cm', description: 'Sobrancelhas aparecendo' } },
    { min: 22, max: 22, data: { fruit: 'Espaguete', fruitEmoji: '🍝', size: '27.8 cm', description: 'Sentidos se desenvolvendo' } },
    { min: 23, max: 23, data: { fruit: 'Manga', fruitEmoji: '🥭', size: '28.9 cm', description: 'Movimentos mais perceptíveis' } },
    { min: 24, max: 24, data: { fruit: 'Milho', fruitEmoji: '🌽', size: '30 cm', description: 'Pele ainda transparente' } },
    { min: 25, max: 25, data: { fruit: 'Nabo', fruitEmoji: '🥕', size: '34.6 cm', description: 'Padrões de sono estabelecidos' } },
    { min: 26, max: 26, data: { fruit: 'Cebola', fruitEmoji: '🧅', size: '35.6 cm', description: 'Olhos abrindo e fechando' } },
    { min: 27, max: 27, data: { fruit: 'Couve-flor', fruitEmoji: '🥦', size: '36.6 cm', description: 'Respiração rítmica' } },
    { min: 28, max: 28, data: { fruit: 'Beringela', fruitEmoji: '🍆', size: '37.6 cm', description: 'Cílios aparecendo' } },
    { min: 29, max: 29, data: { fruit: 'Abóbora pequena', fruitEmoji: '🎃', size: '38.6 cm', description: 'Músculos e pulmões amadurecendo' } },
    { min: 30, max: 30, data: { fruit: 'Repolho', fruitEmoji: '🥬', size: '39.9 cm', description: 'Ganho de peso acelerado' } },
    { min: 31, max: 31, data: { fruit: 'Coco', fruitEmoji: '🥥', size: '41.1 cm', description: 'Todos os cinco sentidos funcionando' } },
    { min: 32, max: 32, data: { fruit: 'Jicama', fruitEmoji: '🥔', size: '42.4 cm', description: 'Pele menos enrugada' } },
    { min: 33, max: 33, data: { fruit: 'Abacaxi', fruitEmoji: '🍍', size: '43.7 cm', description: 'Sistema imunológico desenvolvendo' } },
    { min: 34, max: 34, data: { fruit: 'Melão', fruitEmoji: '🍈', size: '45 cm', description: 'Sistema nervoso amadurecendo' } },
    { min: 35, max: 35, data: { fruit: 'Melão cantaloupe', fruitEmoji: '🍈', size: '46.2 cm', description: 'Reflexos mais rápidos' } },
    { min: 36, max: 36, data: { fruit: 'Alface romana', fruitEmoji: '🥬', size: '47.4 cm', description: 'Ganho de peso rápido' } },
    { min: 37, max: 37, data: { fruit: 'Acelga', fruitEmoji: '🥬', size: '48.6 cm', description: 'Praticamente pronto!' } },
    { min: 38, max: 38, data: { fruit: 'Alho-poró', fruitEmoji: '🧄', size: '49.8 cm', description: 'Órgãos totalmente desenvolvidos' } },
    { min: 39, max: 39, data: { fruit: 'Mini melancia', fruitEmoji: '🍉', size: '50.7 cm', description: 'Pronto para nascer!' } },
    { min: 40, max: 40, data: { fruit: 'Melancia pequena', fruitEmoji: '🍉', size: '51.2 cm', description: 'Chegou a hora!' } },
    { min: 41, max: 42, data: { fruit: 'Melancia', fruitEmoji: '🍉', size: '51.5+ cm', description: 'Bebê a termo completo' } },
  ];

  // Encontrar o tamanho correspondente
  for (const item of sizeMap) {
    if (weeks >= item.min && weeks <= item.max) {
      return item.data;
    }
  }

  // Fallback para semanas fora do range
  if (weeks < 0) {
    return { fruit: 'Semente', fruitEmoji: '🌱', size: '0.1 cm', description: 'Ainda não detectado' };
  }
  
  return { fruit: 'Melancia', fruitEmoji: '🍉', size: '51+ cm', description: 'Bebê a termo completo' };
}

