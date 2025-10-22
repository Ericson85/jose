-- Script SQL para criar tabela CMV (Custo de Mercadoria Vendida)
-- Execute este script no phpMyAdmin do Hostinger

CREATE TABLE IF NOT EXISTS cmv_calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drink_name VARCHAR(255) NOT NULL,
    drink_id VARCHAR(50) NOT NULL,
    destilado_nome VARCHAR(255) NOT NULL,
    destilado_preco_ml DECIMAL(10, 4) NOT NULL DEFAULT 0,
    destilado_quantidade_ml INT NOT NULL DEFAULT 0,
    frutas JSON DEFAULT '[]',
    outros_ingredientes JSON DEFAULT '[]',
    custo_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    margem_lucro_percentual DECIMAL(5, 2) NOT NULL DEFAULT 0,
    preco_venda_sugerido DECIMAL(10, 2) NOT NULL DEFAULT 0,
    observacoes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo para teste
INSERT INTO cmv_calculations (
    drink_name,
    drink_id,
    destilado_nome,
    destilado_preco_ml,
    destilado_quantidade_ml,
    custo_total,
    margem_lucro_percentual,
    preco_venda_sugerido,
    observacoes
) VALUES (
    'Caipirinha',
    '1',
    'Cachaça',
    0.15,
    50,
    7.50,
    100,
    15.00,
    'Cálculo base para caipirinha tradicional'
);

-- Verificar se a tabela foi criada corretamente
DESCRIBE cmv_calculations;

-- Verificar os dados inseridos
SELECT * FROM cmv_calculations;
