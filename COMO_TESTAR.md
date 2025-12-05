# 📱 Como Testar o Gest Ultrassom

## 🚀 Opções de Teste

### **Opção 1: Expo Go (Recomendado para testes rápidos)**

1. **Instalar Expo Go no seu celular:**
   - iOS: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   cd gest-ultrassom
   npm start
   ```

3. **Escanear o QR Code:**
   - O terminal mostrará um QR Code
   - **iOS**: Abra a câmera e escaneie o QR Code
   - **Android**: Abra o Expo Go e escaneie o QR Code

4. **Ou usar o link direto:**
   - O terminal mostrará algo como: `exp://192.168.x.x:8081`
   - Você pode compartilhar esse link ou usar o QR Code

---

### **Opção 2: Testar no Navegador (Web)**

1. **Iniciar o servidor:**
   ```bash
   npm start
   ```

2. **Pressionar `w` no terminal** para abrir no navegador

3. **Ou acessar diretamente:**
   - O terminal mostrará: `http://localhost:8081` ou similar
   - Abra no navegador

**⚠️ Nota:** Algumas funcionalidades podem não funcionar no web (como notificações push e WhatsApp)

---

### **Opção 3: Build Local (iOS/Android)**

#### **Para Android:**

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Gerar APK:**
   ```bash
   npx expo build:android
   ```
   Ou usar EAS Build:
   ```bash
   npm install -g eas-cli
   eas build --platform android
   ```

#### **Para iOS:**

1. **Gerar build:**
   ```bash
   npx expo build:ios
   ```
   Ou usar EAS Build:
   ```bash
   eas build --platform ios
   ```

**⚠️ Nota:** Builds nativos requerem conta Expo/EAS e podem levar alguns minutos

---

## 🔗 Links Úteis

- **Expo Dashboard:** https://expo.dev
- **Documentação Expo:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/

---

## 📋 Checklist de Teste

### Funcionalidades para Testar:

- [ ] Onboarding completo
- [ ] Cálculo de idade gestacional (DUM e primeiro ultrassom)
- [ ] Visualização do cronograma de exames
- [ ] Filtros de exames
- [ ] Agendamento via WhatsApp
- [ ] Marcar exame como realizado
- [ ] Histórico de exames
- [ ] Compartilhamento do cronograma
- [ ] Configurações de lembretes
- [ ] Edição de perfil
- [ ] Barra de progresso da gestação
- [ ] Card do tamanho do bebê

---

## 🐛 Problemas Comuns

### QR Code não funciona:
- Certifique-se de que o celular e computador estão na mesma rede Wi-Fi
- Tente usar o modo "Tunnel" no Expo: pressione `s` no terminal e escolha "Tunnel"

### App não carrega:
- Verifique se todas as dependências estão instaladas: `npm install`
- Limpe o cache: `npx expo start -c`

### Erros de build:
- Verifique se tem Node.js instalado: `node --version`
- Verifique se tem Expo CLI: `npx expo --version`

---

## 💡 Dica

Para desenvolvimento rápido, use **Expo Go** no seu celular. É a forma mais rápida de testar mudanças em tempo real!

