-- Script para adicionar os campos description e premium na tabela drinks
-- Execute este script no seu banco de dados do HostGator

-- Adicionar campo description
ALTER TABLE drinks ADD COLUMN description TEXT;

-- Adicionar campo premium
ALTER TABLE drinks ADD COLUMN premium BOOLEAN DEFAULT FALSE;

-- Verificar se os campos foram adicionados
DESCRIBE drinks; 