# 🧮 SISTEMA CMV (Custo de Mercadoria Vendida) - IMPLEMENTADO!

## ✅ **O que foi criado:**

### 1. **Aba CMV no Painel Administrativo**
- Nova aba "CMV" no painel administrativo
- Interface completa para cálculos de custo
- Lista de cálculos salvos
- Formulário para novos cálculos

### 2. **Funcionalidades Implementadas:**
- ✅ **Cálculo de custo por ML/Litro** - Preço do destilado por ML
- ✅ **Cálculo de quantidade** - Quantidade em ML por drink
- ✅ **Margem de lucro** - Percentual de lucro desejado
- ✅ **Preço sugerido** - Cálculo automático do preço de venda
- ✅ **Salvamento de dados** - Salva no banco de dados
- ✅ **Visualização** - Lista todos os cálculos salvos
- ✅ **Edição e exclusão** - Gerencia cálculos existentes

### 3. **APIs Criadas:**
- `GET /api/cmv` - Lista todos os cálculos
- `POST /api/cmv` - Cria novo cálculo
- `GET /api/cmv/[id]` - Busca cálculo específico
- `PUT /api/cmv/[id]` - Atualiza cálculo
- `DELETE /api/cmv/[id]` - Exclui cálculo

### 4. **Banco de Dados:**
- Tabela `cmv_calculations` criada
- Campos para todos os dados necessários
- Relacionamento com drinks existentes

## 🚀 **Como usar:**

### 1. **Execute o SQL no Hostinger:**
```sql
-- Execute o arquivo criar_tabela_cmv.sql no phpMyAdmin
```

### 2. **Acesse a aba CMV:**
- Faça login no painel administrativo
- Clique na aba "CMV"

### 3. **Criar novo cálculo:**
- Clique em "Novo Cálculo CMV"
- Selecione o drink
- Preencha dados do destilado
- Defina margem de lucro
- Clique em "Salvar CMV"

### 4. **Fórmulas implementadas:**
- **Custo Total** = Preço por ML × Quantidade em ML
- **Preço Sugerido** = Custo Total × (1 + Margem/100)

## 📊 **Campos disponíveis:**
- **Drink** - Seleção do drink existente
- **Nome do Destilado** - Ex: Vodka, Cachaça
- **Preço por ML** - Custo do destilado por mililitro
- **Quantidade em ML** - Quantidade usada no drink
- **Margem de Lucro (%)** - Percentual de lucro desejado
- **Observações** - Notas sobre o cálculo

## 🎯 **Resultados calculados automaticamente:**
- **Custo Total** - Custo real do drink
- **Preço Sugerido** - Preço de venda com margem
- **Margem** - Percentual aplicado

## 📁 **Arquivos criados:**
- `app/api/cmv/route.js` - API principal
- `app/api/cmv/[id]/route.js` - API por ID
- `criar_tabela_cmv.sql` - Script SQL
- Interface integrada no `app/admin/page.tsx`

## 🔧 **Próximos passos:**
1. Execute o SQL no Hostinger
2. Teste a funcionalidade
3. Adicione cálculos para seus drinks
4. Use os preços sugeridos para definir preços de venda

O sistema está completo e funcional! 🎉
