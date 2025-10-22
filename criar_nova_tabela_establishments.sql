-- Script SQL para criar nova tabela establishments do zero
-- Execute este script no phpMyAdmin do Hostinger

-- Primeiro, remover a tabela existente (se existir)
DROP TABLE IF EXISTS establishments;

-- Criar nova tabela establishments com estrutura correta
CREATE TABLE establishments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('bar', 'boate', 'restaurante') NOT NULL,
    category VARCHAR(100),
    address TEXT NOT NULL,
    phone VARCHAR(20),
    description TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    hours_monday VARCHAR(50) DEFAULT 'Fechado',
    hours_tuesday VARCHAR(50) DEFAULT 'Fechado',
    hours_wednesday VARCHAR(50) DEFAULT 'Fechado',
    hours_thursday VARCHAR(50) DEFAULT 'Fechado',
    hours_friday VARCHAR(50) DEFAULT 'Fechado',
    hours_saturday VARCHAR(50) DEFAULT 'Fechado',
    hours_sunday VARCHAR(50) DEFAULT 'Fechado',
    specialties JSON,
    price_range ENUM('€', '€€', '€€€') DEFAULT '€',
    menu_link TEXT,
    google_place_id VARCHAR(255),
    google_maps_url TEXT,
    images JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo para teste
INSERT INTO establishments (
    name, type, category, address, phone, description, rating,
    hours_monday, hours_tuesday, hours_wednesday, hours_thursday, 
    hours_friday, hours_saturday, hours_sunday,
    specialties, price_range, menu_link, google_maps_url, is_active
) VALUES (
    'Bar do João',
    'bar',
    'Tradicional',
    'Rua das Flores, 123 - Centro',
    '(85) 99999-9999',
    'Bar tradicional com ambiente descontraído e petiscos deliciosos',
    4.5,
    '18:00 - 02:00',
    '18:00 - 02:00',
    '18:00 - 02:00',
    '18:00 - 02:00',
    '18:00 - 03:00',
    '18:00 - 03:00',
    'Fechado',
    '["Caipirinha", "Petiscos", "Música ao vivo"]',
    '€€',
    'https://exemplo.com/cardapio',
    'https://maps.google.com/?q=Bar+do+João',
    TRUE
);

-- Verificar se a tabela foi criada corretamente
DESCRIBE establishments;

-- Verificar os dados inseridos
SELECT * FROM establishments;
