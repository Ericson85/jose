-- Tabela para estabelecimentos da Rota da Caipirinha
CREATE TABLE IF NOT EXISTS establishments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('bar', 'boate', 'restaurante') NOT NULL,
    category VARCHAR(100),
    address TEXT NOT NULL,
    phone VARCHAR(20),
    description TEXT,
    lat DECIMAL(10, 8) NOT NULL DEFAULT -3.7319,
    lng DECIMAL(11, 8) NOT NULL DEFAULT -38.5267,
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
    images JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO establishments (
    name, type, category, address, phone, description, lat, lng, rating,
    hours_monday, hours_tuesday, hours_wednesday, hours_thursday, hours_friday, hours_saturday, hours_sunday,
    specialties, price_range, menu_link, google_place_id, is_active
) VALUES (
    'Bar do João',
    'bar',
    'Tradicional',
    'Rua das Flores, 123 - Centro',
    '(85) 99999-9999',
    'Bar tradicional com ambiente descontraído e petiscos deliciosos',
    -3.7319,
    -38.5267,
    4.5,
    '18:00 - 02:00',
    '18:00 - 02:00',
    '18:00 - 02:00',
    '18:00 - 02:00',
    '18:00 - 03:00',
    '18:00 - 03:00',
    'Fechado',
    JSON_ARRAY('Caipirinha', 'Petiscos', 'Música ao vivo'),
    '€€',
    'https://exemplo.com/cardapio-bar-do-joao',
    'ChIJExamplePlaceId123456789',
    TRUE
);
