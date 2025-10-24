# 🔧 SOLUÇÃO: Erro "Coluna 'ingredientes' desconhecida"

## ❌ **Problema Identificado:**
- Erro: `#1054 - Coluna 'ingredientes' desconhecida em 'INSERT INTO'`
- A tabela `cmv_calculations` ainda tem a estrutura antiga
- Precisa recriar a tabela com a nova estrutura

## ✅ **SOLUÇÃO:**

### 1. **Execute o script SQL completo:**
- Use o arquivo `hostinger_cmv_simples.sql`
- Este script **remove a tabela antiga** e **cria a nova**

### 2. **Passo a passo no Hostinger:**

#### **Acesse o phpMyAdmin:**
1. Faça login no painel do Hostinger
2. Vá para "Bancos de Dados MySQL"
3. Clique em "phpMyAdmin"

#### **Execute o script:**
1. Selecione sua base de dados
2. Clique na aba **"SQL"**
3. Copie e cole o conteúdo de `hostinger_cmv_simples.sql`
4. Clique em **"Executar"**

### 3. **O que o script faz:**
- ✅ **Remove tabela antiga** (`DROP TABLE IF EXISTS`)
- ✅ **Cria nova tabela** com coluna `ingredientes`
- ✅ **Insere dados de exemplo** para teste
- ✅ **Estrutura completa** para múltiplos ingredientes

## 🚀 **Após executar o SQL:**

### 1. **Reinicie o servidor:**
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### 2. **Teste a aba CMV:**
- Faça login no painel administrativo
- Clique na aba "CMV"
- Deve funcionar perfeitamente agora

### 3. **Crie um novo cálculo:**
- Digite nome do drink
- Adicione ingredientes
- Defina margem de lucro
- Salve o cálculo

## 📋 **Estrutura da nova tabela:**
```sql
CREATE TABLE cmv_calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drink_name VARCHAR(255) NOT NULL,
    drink_id VARCHAR(50) NOT NULL,
    ingredientes JSON DEFAULT '[]',  -- ← Nova coluna
    custo_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    margem_lucro_percentual DECIMAL(5, 2) NOT NULL DEFAULT 0,
    preco_venda_sugerido DECIMAL(10, 2) NOT NULL DEFAULT 0,
    observacoes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## ⚠️ **IMPORTANTE:**
- **Execute o script completo** - não apenas partes
- **Confirme que está na base de dados correta**
- **O script remove dados antigos** - faça backup se necessário

## ✅ **Status:**
Após executar o SQL, o sistema CMV funcionará perfeitamente com múltiplos ingredientes!

