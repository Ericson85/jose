-- Script para VERIFICAR estrutura da tabela CMV
-- Execute este script no phpMyAdmin para ver quais colunas existem

-- Verificar estrutura da tabela
DESCRIBE cmv_calculations;

-- Verificar se existem dados na tabela
SELECT COUNT(*) as total_registros FROM cmv_calculations;

-- Ver um exemplo de dados (se existir)
SELECT * FROM cmv_calculations LIMIT 1;
