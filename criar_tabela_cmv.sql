-- Script SQL para criar tabela CMV (Custo de Mercadoria Vendida)
-- Execute este script no phpMyAdmin do Hostinger

CREATE TABLE IF NOT EXISTS cmv_calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drink_name VARCHAR(255) NOT NULL,
    drink_id VARCHAR(50) NOT NULL,
    ingredientes JSON DEFAULT '[]',
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
    ingredientes,
    custo_total,
    margem_lucro_percentual,
    preco_venda_sugerido,
    observacoes
) VALUES (
    'Caipirinha',
    '1',
    '[
        {
            "nome": "Cachaça",
            "tipo": "destilado",
            "quantidade": 50,
            "unidade": "ml",
            "preco": 0.15,
            "custo_total": 7.50
        },
        {
            "nome": "Limão",
            "tipo": "fruta",
            "quantidade": 1,
            "unidade": "unidades",
            "preco": 0.50,
            "custo_total": 0.50
        },
        {
            "nome": "Açúcar",
            "tipo": "outro",
            "quantidade": 10,
            "unidade": "gramas",
            "preco": 0.02,
            "custo_total": 0.20
        }
    ]',
    8.20,
    100,
    16.40,
    'Cálculo base para caipirinha tradicional'
);

-- Verificar se a tabela foi criada corretamente
DESCRIBE cmv_calculations;

-- Verificar os dados inseridos
SELECT * FROM cmv_calculations;
