-- Script SQL SIMPLES para adicionar colunas faltantes
-- Execute este script no phpMyAdmin do Hostinger

-- Adicionar colunas uma por uma (ignora erro se já existir)

-- Coluna destilado_nome
ALTER TABLE cmv_calculations ADD COLUMN destilado_nome VARCHAR(255) DEFAULT '';

-- Coluna destilado_preco_ml  
ALTER TABLE cmv_calculations ADD COLUMN destilado_preco_ml DECIMAL(10, 4) DEFAULT 0;

-- Coluna destilado_quantidade_ml
ALTER TABLE cmv_calculations ADD COLUMN destilado_quantidade_ml DECIMAL(10, 2) DEFAULT 0;

-- Coluna frutas
ALTER TABLE cmv_calculations ADD COLUMN frutas JSON DEFAULT '[]';

-- Coluna outros_ingredientes
ALTER TABLE cmv_calculations ADD COLUMN outros_ingredientes JSON DEFAULT '[]';

-- Verificar estrutura da tabela
DESCRIBE cmv_calculations;
