# Gest Ultrassom

Aplicativo de agendamento inteligente de exames pré-natais para gestantes da Clínica FMFLA.

## 📱 Sobre o Projeto

O **Gest Ultrassom** automatiza e personaliza o agendamento de exames de ultrassonografia, gerando um calendário personalizado baseado na idade gestacional e integrando com WhatsApp para facilitar o agendamento.

## 🚀 Tecnologias

- React Native + Expo
- TypeScript
- React Navigation
- Zustand (State Management)
- AsyncStorage (Persistência Local)
- Expo Notifications (Notificações Push)
- Expo Linking (Integração WhatsApp)

## 📋 Funcionalidades Principais

- ✅ Cadastro e cálculo gestacional automático
- ✅ Calendário personalizado de exames
- ✅ Notificações proativas
- ✅ Integração com WhatsApp para agendamento
- ✅ Acompanhamento da jornada pré-natal

## 🛠️ Como Executar

```bash
# Instalar dependências
npm install

# Executar no iOS
npm run ios

# Executar no Android
npm run android

# Executar no Web
npm run web
```

## 📚 Documentação

Consulte o [PRD.md](./PRD.md) para mais detalhes sobre o produto.

## 📝 Estrutura do Projeto

```
gest-ultrassom/
├── src/
│   ├── screens/       # Telas do aplicativo
│   ├── components/    # Componentes reutilizáveis
│   ├── store/         # Gerenciamento de estado (Zustand)
│   ├── services/      # Serviços (API, storage, etc)
│   ├── utils/         # Funções utilitárias
│   ├── types/         # Definições TypeScript
│   ├── constants/     # Constantes do app
│   ├── theme/         # Tema e estilos
│   └── navigation/    # Configuração de navegação
├── App.tsx            # Componente principal
└── PRD.md             # Documento de requisitos
```

## 🎯 Próximos Passos

1. Implementar tela de onboarding
2. Criar módulo de cálculo gestacional
3. Desenvolver calendário de exames
4. Integrar notificações push
5. Implementar integração com WhatsApp

