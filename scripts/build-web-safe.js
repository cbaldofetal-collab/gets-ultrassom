#!/usr/bin/env node

/**
 * Script de build para web usando Expo
 * Para Expo 54+, usa expo export
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

  // Usar expo export para web
  console.log('📦 Exportando para web com Expo...');
  console.log('⏳ Isso pode levar alguns minutos na primeira vez...\n');
  
  execSync('npx expo export --platform web --output-dir web-build', {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  console.log('\n✅ Build concluído com sucesso!');
  console.log(`📁 Arquivos gerados em: ${outputDir}`);
  process.exit(0);
} catch (error) {
  console.error('\n❌ Erro no build:', error.message);
  console.error('\n💡 Dicas:');
  console.error('   1. Certifique-se de que todas as dependências estão instaladas: npm install');
  console.error('   2. Verifique se react-dom está instalado: npm install react-dom');
  console.error('   3. Tente limpar o cache: npx expo start --clear');
  process.exit(1);
}

