# 🚀 Guia de Deploy Web - Gest Ultrassom

## ✅ Status: Pronto para Deploy!

O projeto está configurado e pronto para deploy na **Vercel**.

---

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (para hospedar o código)
2. ✅ Conta no Vercel (https://vercel.com) - pode fazer login com GitHub
3. ✅ Código do projeto pronto

---

## 🚀 Passo 1: Instalar Dependências

Primeiro, instale as novas dependências para build web:

```bash
cd gest-ultrassom
npm install
```

Isso instalará:
- `@expo/webpack-config` - Configuração do webpack
- `react-native-web` - Compatibilidade web
- `webpack` - Build tool

---

## 🧪 Passo 2: Testar Build Local (Opcional mas Recomendado)

Antes de fazer deploy, teste o build localmente:

```bash
npm run web:build
```

Isso vai:
- ✅ Compilar o código para web
- ✅ Gerar arquivos na pasta `web-build`
- ✅ Verificar se há erros

Se funcionar, você pode testar localmente:

```bash
npm run web:serve
```

Isso abrirá o app em `http://localhost:3000`

---

## 📤 Passo 3: Fazer Push para GitHub

Se ainda não fez, crie um repositório no GitHub:

1. Acesse: https://github.com/new
2. Nome: `gest-ultrassom`
3. Crie o repositório (público ou privado)

Depois, faça push do código:

```bash
cd gest-ultrassom
git add -A
git commit -m "Preparar para deploy web"
git remote add origin https://github.com/SEU_USUARIO/gest-ultrassom.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 4: Deploy na Vercel

### 4.1. Criar Projeto na Vercel

1. Acesse: **https://vercel.com**
2. Faça login (pode usar GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Importe seu repositório `gest-ultrassom`

### 4.2. Configurar Build Settings

A Vercel deve detectar automaticamente, mas verifique:

- **Framework Preset**: Outro (ou deixe em branco)
- **Build Command**: `npm run web:build`
- **Output Directory**: `web-build`
- **Install Command**: `npm install`
- **Root Directory**: `.` (raiz do projeto)

### 4.3. Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 2-5 minutos)
3. Pronto! Você terá uma URL como: `https://gest-ultrassom.vercel.app`

---

## ✅ Checklist Final

- [ ] Dependências instaladas (`npm install`)
- [ ] Build local funcionando (`npm run web:build`)
- [ ] Código no GitHub
- [ ] Projeto criado na Vercel
- [ ] Build Command configurado: `npm run web:build`
- [ ] Output Directory configurado: `web-build`
- [ ] Deploy realizado
- [ ] URL de produção funcionando

---

## 🎉 Pronto!

Após o deploy, você terá:
- ✅ **URL pública**: `https://gest-ultrassom.vercel.app` (ou similar)
- ✅ **Deploy automático**: A cada push no GitHub, a Vercel atualiza automaticamente
- ✅ **HTTPS gratuito**: Seguro e confiável
- ✅ **CDN global**: Rápido em qualquer lugar do mundo

**Compartilhe a URL com seus usuários!** 🚀

---

## 🔄 Atualizações Futuras

Para atualizar o app depois do deploy:

```bash
# Fazer mudanças no código
# ...

# Commit e push
git add .
git commit -m "Descrição das mudanças"
git push

# A Vercel atualiza automaticamente! ✨
```

---

## 🐛 Problemas Comuns

### Build falha na Vercel
- Verifique os logs na Vercel Dashboard
- Teste localmente primeiro: `npm run web:build`
- Verifique se todas as dependências estão no `package.json`

### Página em branco
- Verifique se `outputDirectory` está correto: `web-build`
- Limpe o cache: Vercel Dashboard → Settings → Clear Build Cache
- Verifique se o arquivo `index.html` foi gerado em `web-build`

### Assets não carregam
- Verifique se os assets estão na pasta `assets/`
- Verifique se o `assetBundlePatterns` no `app.json` inclui `**/*`

### Erro de módulo não encontrado
- Execute `npm install` localmente primeiro
- Verifique se todas as dependências estão no `package.json`
- Limpe `node_modules` e reinstale: `rm -rf node_modules && npm install`

---

## 📞 Precisa de Ajuda?

Se algo não funcionar, me mostre:
1. Mensagem de erro completa
2. Logs do build (na Vercel Dashboard)
3. O que você tentou fazer

**Vamos fazer o deploy juntos!** 🚀

