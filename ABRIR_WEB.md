# 🌐 Como Abrir o App no Navegador

## ✅ Solução Rápida

O que você viu (JSON) é normal! O Expo precisa ser iniciado com a flag `--web` para abrir a interface no navegador.

---

## 🚀 Opção 1: Já Iniciado (Recomendado)

O servidor já está rodando com suporte web. Aguarde alguns segundos e acesse:

### **Link Direto:**
```
http://localhost:8082
```

O app deve abrir automaticamente no navegador em alguns segundos!

---

## 🚀 Opção 2: Iniciar Manualmente

Se precisar reiniciar, execute no terminal:

```bash
cd gest-ultrassom
npx expo start --web --port 8082
```

Isso vai:
1. ✅ Iniciar o servidor
2. ✅ Abrir automaticamente no navegador
3. ✅ Mostrar a interface do app (não o JSON)

---

## 📱 Opção 3: Usar no Celular (Melhor Experiência)

Para testar no celular com todas as funcionalidades:

1. **Instale o Expo Go:**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Inicie o servidor SEM a flag --web:**
   ```bash
   cd gest-ultrassom
   npx expo start --port 8082
   ```

3. **Escaneie o QR Code** que aparecerá no terminal

---

## 🔍 Diferença Entre os Modos

### **`expo start` (sem --web):**
- Mostra QR Code no terminal
- Ideal para testar no celular
- Se acessar `localhost:8082` no navegador, mostra JSON (normal)

### **`expo start --web`:**
- Abre automaticamente no navegador
- Mostra a interface do app
- Ideal para desenvolvimento web

---

## ✅ Status Atual

- ✅ Servidor iniciado com `--web`
- ✅ Aguarde 10-30 segundos para compilar
- ✅ Acesse: `http://localhost:8082`

---

## 💡 Dica

Se ainda aparecer JSON após alguns segundos:
1. Recarregue a página (F5 ou Cmd+R)
2. Aguarde mais alguns segundos (primeira compilação demora)
3. Verifique se há erros no terminal

