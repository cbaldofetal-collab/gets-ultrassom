# 📸 Guia: Configurar Upload de Arquivos no Supabase

Este guia vai te ajudar a configurar o **Storage** (armazenamento de arquivos) e o **Banco de Dados** para permitir que as gestantes façam upload de documentos (fotos e PDFs) dos exames.

---

## 🗂️ PARTE 1: Configurar Storage (Armazenamento)

### Passo 1: Criar o Bucket (Pasta)

1. Acesse o seu projeto no **Supabase** (https://supabase.com)
2. No menu lateral esquerdo, clique no ícone **Storage** (parece uma pasta/arquivo)
3. Você verá uma tela com o título "Storage"
4. Clique no botão verde **"New bucket"** (Novo bucket) no canto superior direito
5. Preencha o formulário que aparecer:
   - **Name**: Digite `exams` (letra minúscula, sem espaços)
   - **Public bucket**: Deixe **DESMARCADO** (muito importante para privacidade!)
   - **File size limit**: Pode deixar o padrão ou colocar `5 MB`
6. Clique em **"Create bucket"** (Criar bucket)

✅ **Resultado esperado**: Agora você verá "exams" na lista de buckets.

---

### Passo 2: Configurar Políticas de Segurança (RLS)

Agora vamos definir quem pode fazer upload e visualizar os arquivos.

1. Ainda na tela do **Storage**, clique no bucket **"exams"** que você acabou de criar
2. No topo da tela, clique na aba **"Policies"** (Políticas)
3. Você verá uma mensagem dizendo que não há políticas configuradas
4. Clique no botão **"New policy"** (Nova política)
5. Escolha **"Create a policy from scratch"** (Criar do zero)
6. Preencha o formulário:

**Política 1: Permitir Upload (INSERT)**
```
Policy name: Usuário pode fazer upload de exames
Allowed operation: INSERT
Target roles: authenticated
USING expression: (bucket_id = 'exams'::text AND auth.uid() = owner)
WITH CHECK expression: (bucket_id = 'exams'::text AND auth.uid() = owner)
```

7. Clique em **"Review"** e depois em **"Save policy"**

8. Repita o processo para criar uma segunda política:

**Política 2: Permitir Visualização (SELECT)**
```
Policy name: Usuário pode ver seus exames
Allowed operation: SELECT
Target roles: authenticated
USING expression: (bucket_id = 'exams'::text AND auth.uid() = owner)
```

9. Clique em **"Review"** e depois em **"Save policy"**

✅ **Resultado esperado**: Agora você terá 2 políticas ativas na aba "Policies".

---

## 🗄️ PARTE 2: Atualizar Banco de Dados

Agora vamos adicionar uma coluna na tabela `exam_records` para salvar o caminho do arquivo.

### Passo 1: Abrir SQL Editor

1. No menu lateral esquerdo do Supabase, clique no ícone **SQL Editor** (parece um raio ou terminal)
2. Clique no botão **"New query"** (Nova consulta)

### Passo 2: Executar o SQL

Cole este código SQL completo na caixa de texto:

```sql
-- Adicionar coluna file_path à tabela exam_records
ALTER TABLE exam_records 
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Adicionar coluna updated_at para rastrear atualizações
ALTER TABLE exam_records 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_exam_records_user_id 
ON exam_records(user_id);
```

3. Clique no botão **"Run"** (Executar) no canto inferior direito
4. Você deve ver uma mensagem verde dizendo **"Success. No rows returned"**

✅ **Resultado esperado**: As colunas `file_path` e `updated_at` foram adicionadas à tabela.

---

## 🧪 PARTE 3: Testar a Configuração

### Verificar as colunas criadas

1. No mesmo **SQL Editor**, rode esta query para confirmar:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'exam_records';
```

2. Você deve ver na lista as colunas: `file_path` (TEXT) e `updated_at` (timestamp with time zone)

✅ **Resultado esperado**: As colunas aparecem na lista.

---

## ✅ Configuração Completa!

Se você chegou até aqui e todos os passos deram certo, o upload de arquivos agora está **100% funcional**!

### 🎯 Como testar no app:

1. Acesse o site do **Gest Ultrassom** (Netlify)
2. Faça login com uma conta de teste
3. No Dashboard, em qualquer card de exame, clique no botão azul **"Anexar"**
4. Selecione uma foto do seu celular/computador
5. Aguarde o upload
6. Você deve ver uma mensagem verde: **"Documento anexado"**

---

## 🆘 Problemas Comuns

**Erro: "new row violates row-level security policy"**
- Verifique se você criou as 2 políticas no Storage corretamente
- Confirme que o bucket **NÃO** está marcado como público

**Erro: "column file_path does not exist"**
- Execute novamente o SQL da PARTE 2

**Upload não funciona no celular**
- Confirme que o site está em HTTPS (o Netlify já faz isso automaticamente)

---

**Qualquer dúvida, me chame! Estou aqui para ajudar.** 😊
