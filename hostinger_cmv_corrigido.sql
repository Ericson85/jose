-- Script SQL CORRIGIDO para Hostinger - CMV
-- Execute este script no phpMyAdmin para corrigir o erro 500

-- Primeiro, remover a tabela existente (se existir)
DROP TABLE IF EXISTS cmv_calculations;

-- Criar nova tabela com estrutura compatível com o código atual
CREATE TABLE cmv_calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drink_name VARCHAR(255) NOT NULL,
    drink_id VARCHAR(50) NOT NULL,
    destilado_nome VARCHAR(255) DEFAULT '',
    destilado_preco_ml DECIMAL(10, 4) DEFAULT 0,
    destilado_quantidade_ml DECIMAL(10, 2) DEFAULT 0,
    frutas JSON DEFAULT '[]',
    outros_ingredientes JSON DEFAULT '[]',
    ingredientes JSON DEFAULT '[]',
    custo_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    margem_lucro_percentual DECIMAL(5, 2) NOT NULL DEFAULT 0,
    preco_venda_sugerido DECIMAL(10, 2) NOT NULL DEFAULT 0,
    observacoes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO cmv_calculations (
    drink_name,
    drink_id,
    destilado_nome,
    destilado_preco_ml,
    destilado_quantidade_ml,
    frutas,
    outros_ingredientes,
    ingredientes,
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
    '[
        {
            "nome": "Limão",
            "tipo": "fruta",
            "quantidade": 1,
            "unidade": "unidades",
            "preco": 0.50,
            "custo_total": 0.50
        }
    ]',
    '[
        {
            "nome": "Açúcar",
            "tipo": "outro",
            "quantidade": 10,
            "unidade": "gramas",
            "preco": 0.02,
            "custo_total": 0.20
        }
    ]',
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
