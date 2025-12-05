#!/usr/bin/env node

/**
 * Script de build para web usando Expo
 * Compatível com Expo 54+ e Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para web...');

try {
  // Criar diretório de output se não existir
  const outputDir = path.join(process.cwd(), 'web-build');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Método 1: Tentar expo export sem flag --platform (funciona melhor na Vercel)
  console.log('📦 Exportando para web com Expo...');
  console.log('⏳ Isso pode levar alguns minutos...\n');
  
  try {
    // Primeiro, tentar sem --platform (mais compatível)
    execSync('npx expo export --output-dir web-build', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        EXPO_PUBLIC_PLATFORM: 'web',
      },
    });
  } catch (firstError) {
    console.log('⚠️  Primeiro método falhou, tentando alternativa...\n');
    
    // Método alternativo: usar expo export com plataforma web explicitamente
    execSync('npx expo export --platform web --output-dir web-build', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
    });
  }

  // Verificar se os arquivos foram gerados
  const indexPath = path.join(outputDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html não foi gerado. Build pode ter falhado.');
  }

  console.log('\n✅ Build concluído com sucesso!');
  console.log(`📁 Arquivos gerados em: ${outputDir}`);
  process.exit(0);
} catch (error) {
  console.error('\n❌ Erro no build:', error.message);
  console.error('\n💡 Dicas:');
  console.error('   1. Verifique os logs completos acima');
  console.error('   2. Certifique-se de que todas as dependências estão instaladas');
  console.error('   3. Verifique se react-dom está instalado: npm install react-dom');
  process.exit(1);
}

