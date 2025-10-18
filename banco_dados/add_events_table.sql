-- Adicionar tabela de eventos para o sistema TENDERES
-- Execute este script no banco de dados para criar a tabela de eventos

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    max_guests INT DEFAULT 0,
    status ENUM('active', 'inactive', 'completed', 'pre_scheduled') DEFAULT 'pre_scheduled',
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    customer_address TEXT,
    customer_city VARCHAR(100),
    customer_state VARCHAR(50),
    customer_age INT,
    event_type ENUM('planos', 'detalhado', 'drinkeira') NOT NULL,
    selected_plan_id VARCHAR(50),
    selected_drinks JSON,
    people_count INT,
    hours_count INT,
    total_budget DECIMAL(10,2),
    whatsapp_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_customer_phone ON events(customer_phone);
