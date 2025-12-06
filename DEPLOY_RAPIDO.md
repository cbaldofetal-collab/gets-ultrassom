# 🚀 Deploy Rápido - Gest Ultrassom Web

## ✅ Status: Configurado e Pronto!

O projeto está configurado para deploy na Vercel. Siga os passos abaixo:

---

## 📋 Passo 1: Instalar Dependências

```bash
cd gest-ultrassom
npm install
```

Isso instalará todas as dependências necessárias, incluindo:
- `react-dom` (necessário para web)
- `react-native-web` (compatibilidade web)
- Outras dependências do projeto

---

## 📤 Passo 2: Fazer Push para GitHub

Se ainda não fez:

```bash
# Criar repositório no GitHub primeiro em: https://github.com/new
# Nome: gest-ultrassom

git add -A
git commit -m "Preparar para deploy web"
git remote add origin https://github.com/SEU_USUARIO/gest-ultrassom.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 3: Deploy na Vercel

### Opção A: Via Interface Web (Recomendado)

1. Acesse: **https://vercel.com**
2. Faça login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Importe o repositório `gest-ultrassom`
5. Configure:
   - **Framework Preset**: Outro
   - **Build Command**: `npm run web:build`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
6. Clique em **"Deploy"**

### Opção B: Via CLI (Alternativa)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
cd gest-ultrassom
vercel
```

---

## ✅ O Que Acontece

1. A Vercel detecta o projeto Expo
2. Executa `npm install`
3. Executa `npm run web:build` (que usa `expo export`)
4. Faz deploy dos arquivos em `web-build`
5. Gera uma URL pública como: `https://gest-ultrassom.vercel.app`

---

## 🎉 Pronto!

Após o deploy (2-5 minutos), você terá:
- ✅ URL pública funcionando
- ✅ HTTPS automático
- ✅ Deploy automático a cada push no GitHub
- ✅ CDN global

---

## 🔄 Atualizar o App

Para atualizar, basta fazer push:

```bash
git add .
git commit -m "Sua mensagem"
git push
```

A Vercel atualiza automaticamente! ✨

---

## 🐛 Problemas?

### Build falha na Vercel
- Verifique os logs na Vercel Dashboard
- Certifique-se de que `react-dom` está no `package.json`
- Verifique se todas as dependências estão instaladas

### Página em branco
- Verifique se `outputDirectory` está como `web-build`
- Limpe o cache na Vercel: Settings → Clear Build Cache

### Erro de módulo não encontrado
- Execute `npm install` localmente primeiro
- Verifique se todas as dependências estão no `package.json`

---

## 📞 Precisa de Ajuda?

Se algo não funcionar, me mostre:
1. Mensagem de erro completa
2. Logs do build (na Vercel Dashboard)
3. O que você tentou fazer

**Vamos fazer o deploy juntos!** 🚀


