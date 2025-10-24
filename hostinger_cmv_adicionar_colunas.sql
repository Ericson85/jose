-- Script SQL para ADICIONAR colunas faltantes na tabela CMV existente
-- Execute este script no phpMyAdmin do Hostinger

-- Verificar se as colunas já existem antes de adicionar
-- Adicionar coluna destilado_nome se não existir
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'cmv_calculations' 
     AND COLUMN_NAME = 'destilado_nome' 
     AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE cmv_calculations ADD COLUMN destilado_nome VARCHAR(255) DEFAULT ""',
    'SELECT "Coluna destilado_nome já existe"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna destilado_preco_ml se não existir
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'cmv_calculations' 
     AND COLUMN_NAME = 'destilado_preco_ml' 
     AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE cmv_calculations ADD COLUMN destilado_preco_ml DECIMAL(10, 4) DEFAULT 0',
    'SELECT "Coluna destilado_preco_ml já existe"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna destilado_quantidade_ml se não existir
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'cmv_calculations' 
     AND COLUMN_NAME = 'destilado_quantidade_ml' 
     AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE cmv_calculations ADD COLUMN destilado_quantidade_ml DECIMAL(10, 2) DEFAULT 0',
    'SELECT "Coluna destilado_quantidade_ml já existe"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna frutas se não existir
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'cmv_calculations' 
     AND COLUMN_NAME = 'frutas' 
     AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE cmv_calculations ADD COLUMN frutas JSON DEFAULT "[]"',
    'SELECT "Coluna frutas já existe"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna outros_ingredientes se não existir
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'cmv_calculations' 
     AND COLUMN_NAME = 'outros_ingredientes' 
     AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE cmv_calculations ADD COLUMN outros_ingredientes JSON DEFAULT "[]"',
    'SELECT "Coluna outros_ingredientes já existe"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar estrutura final da tabela
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'cmv_calculations' 
AND TABLE_SCHEMA = DATABASE()
ORDER BY ORDINAL_POSITION;
