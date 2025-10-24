-- Script SQL ULTRA SIMPLES para Hostinger
-- Execute este script no phpMyAdmin (ignora erros se coluna já existir)

-- Adicionar colunas necessárias (pode dar erro se já existir, mas não importa)

ALTER TABLE cmv_calculations ADD COLUMN destilado_nome VARCHAR(255) DEFAULT '';
ALTER TABLE cmv_calculations ADD COLUMN destilado_preco_ml DECIMAL(10, 4) DEFAULT 0;
ALTER TABLE cmv_calculations ADD COLUMN destilado_quantidade_ml DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE cmv_calculations ADD COLUMN frutas JSON DEFAULT '[]';
ALTER TABLE cmv_calculations ADD COLUMN outros_ingredientes JSON DEFAULT '[]';

-- Verificar se funcionou
SELECT * FROM cmv_calculations LIMIT 1;
