# 🔗 Links do App Gest Ultrassom

## ✅ Servidor Rodando

O servidor está ativo na **porta 8082**.

---

## 📱 Como Acessar o App

### **Opção 1: No Celular (Recomendado)**

1. **Instale o Expo Go:**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Escaneie o QR Code:**
   - Abra o terminal onde o servidor está rodando
   - Você verá um QR Code
   - **iOS**: Use a câmera nativa
   - **Android**: Abra o Expo Go e escaneie

3. **Ou use o link direto:**
   ```
   exp://127.0.0.1:8082
   ```
   (Funciona apenas na mesma rede Wi-Fi)

---

### **Opção 2: No Navegador (Web)**

1. **No terminal onde o servidor está rodando, pressione:**
   ```
   w
   ```
   (letra 'w' para abrir no web)

2. **Ou acesse diretamente:**
   ```
   http://localhost:8082
   ```

---

## 🌐 Links Disponíveis

### **Desenvolvimento Local:**
- **Metro Bundler**: `http://localhost:8082`
- **Expo DevTools**: `http://localhost:8082/_expo/static/js/web`
- **Link Expo**: `exp://127.0.0.1:8082`

### **Para Compartilhar (mesma rede Wi-Fi):**
- Substitua `127.0.0.1` pelo IP da sua máquina na rede local
- Exemplo: `exp://192.168.1.100:8082`
- Para descobrir seu IP:
  ```bash
  # macOS/Linux:
  ifconfig | grep "inet " | grep -v 127.0.0.1
  
  # Ou:
  ipconfig getifaddr en0
  ```

---

## 🚀 Para Criar Link Permanente (Publicação)

Se quiser um link que funcione de qualquer lugar:

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Fazer login
eas login

# 3. Publicar
eas update --branch preview
```

Isso gerará um link como:
```
https://expo.dev/@seu-usuario/gest-ultrassom
```

---

## 📋 Status Atual

- ✅ Servidor rodando na porta **8082**
- ✅ App configurado e pronto
- ✅ Número WhatsApp configurado: **+5511913561616**

---

## 🔍 Se Não Estiver Funcionando

1. **Verifique se o servidor está rodando:**
   ```bash
   ps aux | grep expo
   ```

2. **Reinicie o servidor:**
   ```bash
   cd gest-ultrassom
   npx expo start --port 8082
   ```

3. **Limpe o cache:**
   ```bash
   npx expo start --port 8082 --clear
   ```

---

## 💡 Dica

Para ver o QR Code e menu completo, abra um novo terminal e execute:
```bash
cd gest-ultrassom
npx expo start --port 8082
```

Você verá:
- QR Code para escanear
- Menu com opções (iOS, Android, Web)
- Links diretos

