-- SQL para adicionar campos de nomes personalizáveis à tabela event_config existente
-- Execute este script no seu banco de dados HostGator

-- Adicionar colunas para nomes personalizáveis
ALTER TABLE event_config 
ADD COLUMN transportation_fee_name VARCHAR(100) NOT NULL DEFAULT 'Taxa de Locomoção',
ADD COLUMN bartender_base_cost_name VARCHAR(100) NOT NULL DEFAULT 'Custo Base Bartender',
ADD COLUMN extra_hour_cost_name VARCHAR(100) NOT NULL DEFAULT 'Custo Hora Extra',
ADD COLUMN max_hours_before_extra_name VARCHAR(100) NOT NULL DEFAULT 'Horas antes da Hora Extra',
ADD COLUMN bartenders_per_50_people_name VARCHAR(100) NOT NULL DEFAULT 'Bartenders por 50 Convidados';

-- Atualizar registros existentes com nomes padrão
UPDATE event_config SET 
    transportation_fee_name = 'Taxa de Locomoção',
    bartender_base_cost_name = 'Custo Base Bartender',
    extra_hour_cost_name = 'Custo Hora Extra',
    max_hours_before_extra_name = 'Horas antes da Hora Extra',
    bartenders_per_50_people_name = 'Bartenders por 50 Convidados'
WHERE id > 0; 