#!/bin/bash

# Script para criar e fazer push do repositório gest-ultrassom no GitHub
# Execute este script após criar o repositório no GitHub

echo "🚀 Preparando para fazer push no GitHub..."
echo ""

# Substitua SEU_USUARIO pelo seu usuário do GitHub
GITHUB_USER="SEU_USUARIO"
REPO_NAME="gest-ultrassom"

echo "📝 Verificando status do git..."
git status

echo ""
echo "📦 Adicionando todos os arquivos..."
git add -A

echo ""
echo "💾 Fazendo commit..."
git commit -m "Preparar projeto para deploy web na Vercel"

echo ""
echo "🔗 Configurando remote (substitua SEU_USUARIO pelo seu usuário)..."
echo "Execute manualmente:"
echo "  git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo ""
echo "Ou se já existir, atualize:"
echo "  git remote set-url origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo ""
echo "📤 Fazendo push..."
echo "Execute manualmente:"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "✅ Depois disso, volte para a Vercel e atualize a página!"


