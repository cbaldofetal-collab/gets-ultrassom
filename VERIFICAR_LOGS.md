# 🔍 Como Verificar os Logs de Erro na Vercel

## 📋 Passo a Passo

1. **Na página de Deployments da Vercel:**
   - Clique no deploy que falhou (o mais recente com status "Error")
   - Ou clique no ID do deploy (ex: `GLVR4Cszz`)

2. **Você verá os Build Logs:**
   - Role para baixo até ver os logs completos
   - Procure por mensagens de erro em vermelho
   - Copie a mensagem de erro completa

3. **Envie para mim:**
   - Cole aqui a mensagem de erro completa
   - Ou tire um print dos logs

---

## 🔍 O Que Procurar

Procure por erros como:
- `Error: Command "npm run web:build" exited with 1`
- `expo export` errors
- Module not found errors
- Build timeout errors

---

## 💡 Solução Temporária

Enquanto isso, tente esta configuração alternativa na Vercel:

1. Vá em **Settings** → **General**
2. Em **Build & Development Settings**, configure:
   - **Build Command**: `npx expo export --output-dir web-build`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install --legacy-peer-deps`

Ou use esta configuração no `vercel.json`:

```json
{
  "buildCommand": "npx expo export --output-dir web-build",
  "outputDirectory": "web-build",
  "installCommand": "npm install --legacy-peer-deps"
}
```

---

## 🚀 Próximo Passo

Depois de ver os logs, me envie o erro completo para eu corrigir!

