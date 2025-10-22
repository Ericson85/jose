-- Script SQL SIMPLES para Hostinger
-- Execute apenas este comando no phpMyAdmin:

DROP TABLE IF EXISTS establishments;

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
