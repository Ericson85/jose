# 🗄️ SOLUÇÃO: Nova Tabela Establishments

## 🎯 **Objetivo:**
Criar uma nova tabela `establishments` do zero para resolver os problemas de conexão e fazer o formulário funcionar perfeitamente.

## 📋 **Passo a Passo no Hostinger:**

### 1. **Acesse o phpMyAdmin**
- Faça login no painel do Hostinger
- Vá para "Bancos de Dados MySQL"
- Clique em "phpMyAdmin"

### 2. **Selecione sua Base de Dados**
- No lado esquerdo, clique no nome da sua base de dados
- Certifique-se de que está na base correta

### 3. **Execute o Script SQL**
- Clique na aba **"SQL"** no topo
- Copie e cole o conteúdo do arquivo `criar_nova_tabela_establishments.sql`
- Clique em **"Executar"**

### 4. **Verificação**
Após executar, você deve ver:
- ✅ Mensagem de sucesso
- ✅ Nova tabela `establishments` criada
- ✅ Um registro de exemplo inserido
- ✅ Estrutura da tabela sem campos `lat` e `lng`

## 🔧 **O que o script faz:**

1. **Remove a tabela antiga** (se existir)
2. **Cria nova tabela** com estrutura correta
3. **Inclui todos os campos necessários:**
   - ✅ `google_maps_url` (para links do Google Maps)
   - ❌ Sem campos `lat` e `lng` (removidos)
   - ✅ Todos os outros campos funcionais
4. **Insere dados de exemplo** para teste
5. **Verifica se tudo está correto**

## ⚠️ **IMPORTANTE:**
- **Faça backup** antes de executar (recomendado)
- **Execute apenas uma vez**
- **Verifique se está na base de dados correta**

## 🎉 **Após executar:**
1. **Reinicie o servidor** (`Ctrl+C` e `npm run dev`)
2. **Teste o formulário** - deve funcionar perfeitamente
3. **Verifique a aba principal** - deve mostrar os dados
4. **Adicione novos estabelecimentos** com links do Google Maps

## 📞 **Se der erro:**
- Verifique se está na base de dados correta
- Confirme se tem permissões para criar tabelas
- Entre em contato se precisar de ajuda
