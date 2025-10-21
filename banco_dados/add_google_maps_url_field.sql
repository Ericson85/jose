-- Adicionar campo google_maps_url à tabela establishments
ALTER TABLE establishments 
ADD COLUMN google_maps_url TEXT AFTER google_place_id;
