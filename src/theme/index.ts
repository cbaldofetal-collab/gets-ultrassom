// Tema do Gest Ultrassom
// Cores suaves e calmantes conforme PRD

export const theme = {
  colors: {
    // Cores principais (tons suaves e calmantes)
    primary: '#6B9BD1', // Azul claro
    primaryDark: '#4A7BA7',
    primaryLight: '#A8C5E3',
    
    secondary: '#7BC4A4', // Verde água
    secondaryDark: '#5A9B7F',
    secondaryLight: '#B8E4D1',
    
    accent: '#B8A4D9', // Lilás
    accentDark: '#8B7AA8',
    accentLight: '#D9CEE8',
    
    // Cores neutras
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    
    // Cores de status
    success: '#27AE60',
    successLight: '#D5F4E6',
    warning: '#F39C12',
    warningLight: '#FDEBD0',
    error: '#E74C3C',
    errorLight: '#FADBD8',
    info: '#3498DB',
    infoLight: '#D6EAF8',
    
    // Cores de exames
    examPending: '#F39C12',
    examScheduled: '#3498DB',
    examCompleted: '#27AE60',
    examMissed: '#E74C3C',
    
    // Outros
    divider: '#E0E0E0',
    border: '#D5D5D5',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};


