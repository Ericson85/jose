-- Script SQL para criar as tabelas para o site
-- Use o banco de dados desejado antes de rodar este script no HostGator

-- Tabela de drinks
CREATE TABLE drinks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    price_type ENUM('per_person', 'per_unit') NOT NULL,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações de eventos
CREATE TABLE event_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transportation_fee DECIMAL(10,2) NOT NULL DEFAULT 150.00,
    bartender_base_cost DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    extra_hour_cost DECIMAL(10,2) NOT NULL DEFAULT 15.00,
    max_hours_before_extra INT NOT NULL DEFAULT 4,
    bartenders_per_50_people INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de custos extras
CREATE TABLE extra_costs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir configuração padrão
INSERT INTO event_config (transportation_fee, bartender_base_cost, extra_hour_cost, max_hours_before_extra, bartenders_per_50_people) 
VALUES (150.00, 100.00, 15.00, 4, 1); 