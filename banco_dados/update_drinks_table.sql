-- Script para atualizar tabela drinks existente
-- Execute este script se sua tabela drinks já existe mas não tem os campos description e premium

-- Adicionar campo description se não existir
ALTER TABLE drinks ADD COLUMN IF NOT EXISTS description TEXT;

-- Adicionar campo premium se não existir
ALTER TABLE drinks ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE;

-- Verificar se os campos foram adicionados
DESCRIBE drinks; 