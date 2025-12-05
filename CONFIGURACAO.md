# ⚙️ Configuração do Gest Ultrassom

## 📱 Número do WhatsApp da Clínica

Para configurar o número real do WhatsApp da Clínica FMFLA:

1. Abra o arquivo: `src/constants/index.ts`
2. Localize a constante `CLINIC_WHATSAPP_NUMBER`
3. Substitua `'+5511999999999'` pelo número real da clínica

**Formato:** O número deve estar no formato internacional com código do país
- Exemplo para Brasil: `+5511999999999` (código do país + DDD + número)
- Remova espaços, parênteses e hífens

**Exemplo:**
```typescript
export const CLINIC_WHATSAPP_NUMBER = '+5511123456789'; // Número real da Clínica FMFLA
```

## 🔒 Variáveis de Ambiente (Opcional)

Se preferir usar variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do projeto:
```
WHATSAPP_NUMBER=+5511123456789
```

2. Instale o pacote:
```bash
npm install react-native-dotenv
```

3. Configure no `babel.config.js` e atualize `src/constants/index.ts` para ler da variável de ambiente.

## ✅ Verificação

Após configurar, teste:
1. Abra o app
2. Vá em um exame pendente
3. Clique em "Agendar via WhatsApp"
4. Verifique se abre o WhatsApp com o número correto

---

## 📝 Outras Configurações

### Protocolo de Exames

O protocolo de exames está definido em `src/constants/index.ts` no array `EXAMS_PROTOCOL`.

Para modificar:
- Adicionar novos exames
- Alterar janelas ideais
- Modificar descrições

Basta editar o array `EXAMS_PROTOCOL`.

