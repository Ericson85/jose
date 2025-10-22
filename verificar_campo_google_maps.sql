-- Script para verificar se o campo google_maps_url existe na tabela establishments
-- Execute este script no phpMyAdmin do Hostinger

-- Verificar a estrutura da tabela
DESCRIBE establishments;

-- Verificar se o campo google_maps_url existe
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'establishments' 
AND COLUMN_NAME = 'google_maps_url';

-- Se o campo não existir, adicionar ele
ALTER TABLE establishments 
ADD COLUMN google_maps_url TEXT AFTER google_place_id;

-- Verificar novamente a estrutura
DESCRIBE establishments;
