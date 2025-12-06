# 📤 Criar Repositório no GitHub - Passo a Passo

## 🔍 Problema

A Vercel não encontrou o repositório "gest-ultrassom" porque ele ainda não existe no GitHub.

---

## ✅ Solução: Criar e Fazer Push

### **Passo 1: Criar Repositório no GitHub**

1. Acesse: **https://github.com/new**
2. Preencha:
   - **Repository name**: `gest-ultrassom`
   - **Description**: `App para agendamento de ultrassons durante a gestação`
   - **Visibility**: Escolha **Public** ou **Private**
   - **NÃO marque** "Add a README file" (já temos um)
   - **NÃO marque** "Add .gitignore" (já temos um)
   - **NÃO marque** "Choose a license"
3. Clique em **"Create repository"**

---

### **Passo 2: Conectar e Fazer Push**

Depois de criar o repositório, o GitHub mostrará instruções. Execute estes comandos no terminal:

```bash
cd gest-ultrassom

# Verificar se já tem commits
git status

# Se houver mudanças não commitadas:
git add -A
git commit -m "Preparar para deploy web"

# Conectar ao GitHub (substitua SEU_USUARIO pelo seu usuário)
git remote add origin https://github.com/SEU_USUARIO/gest-ultrassom.git

# Ou se já tiver um remote, atualize:
git remote set-url origin https://github.com/SEU_USUARIO/gest-ultrassom.git

# Fazer push
git branch -M main
git push -u origin main
```

---

### **Passo 3: Voltar para Vercel**

1. Volte para a página da Vercel
2. **Atualize a página** (F5 ou Cmd+R)
3. Ou clique em **"Import Git Repository"** novamente
4. Agora você deve ver `gest-ultrassom` na lista
5. Clique nele e continue com o deploy

---

## 🔍 Verificar Conta GitHub na Vercel

Se ainda não aparecer:

1. Na Vercel, verifique qual conta GitHub está selecionada
2. No dropdown do topo (onde aparece "cbaldofetal-collab"), certifique-se de que está selecionada a conta correta
3. Se necessário, clique em "Add GitHub Account" para conectar outra conta

---

## ✅ Checklist

- [ ] Repositório criado no GitHub: `gest-ultrassom`
- [ ] Código commitado localmente
- [ ] Remote configurado: `git remote add origin ...`
- [ ] Push realizado: `git push -u origin main`
- [ ] Repositório visível no GitHub
- [ ] Conta GitHub correta selecionada na Vercel
- [ ] Repositório aparece na lista da Vercel

---

## 💡 Dica

Se você já tem o código no GitHub mas em outra conta/organização:
1. Na Vercel, clique no dropdown do topo
2. Selecione a conta/organização correta
3. Ou adicione uma nova conta GitHub nas configurações

---

## 🚀 Depois do Push

Quando o repositório aparecer na Vercel:
1. Clique em `gest-ultrassom`
2. Configure:
   - **Build Command**: `npm run web:build`
   - **Output Directory**: `web-build`
3. Clique em **"Deploy"**

**Pronto!** 🎉


