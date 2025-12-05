-- Adicionar coluna file_path à tabela exam_records
ALTER TABLE exam_records ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Adicionar coluna updated_at se ainda não existir
ALTER TABLE exam_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Criar índice para buscar exames por usuário mais rapidamente
CREATE INDEX IF NOT EXISTS idx_exam_records_user_id ON exam_records(user_id);
