# 🔧 Configuração das Variáveis de Ambiente

## 📁 Criar arquivo `.env.local`

Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui

# Banco de Dados Hostinger
DB_HOST=seu_host_hostinger
DB_USER=seu_usuario_hostinger
DB_PASS=sua_senha_hostinger
DB_NAME=seu_nome_banco_hostinger
```

## 🗺️ Como Obter a Chave do Google Maps

### 1. Acesse Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Criar/Selecionar Projeto
- Crie um novo projeto ou selecione um existente
- Anote o ID do projeto

### 3. Ativar APIs
Vá para "APIs e Serviços" > "Biblioteca" e ative:
- ✅ Maps JavaScript API
- ✅ Places API  
- ✅ Geocoding API

### 4. Criar Chave de API
- Vá para "APIs e Serviços" > "Credenciais"
- Clique em "Criar Credenciais" > "Chave de API"
- Copie a chave gerada

### 5. Configurar Restrições (Opcional)
- Clique na chave criada
- Em "Restrições de aplicativo", selecione "HTTP referrers"
- Adicione seu domínio: `https://seudominio.com/*`

## 🗄️ Configuração do Banco Hostinger

### 1. Acesse o Painel Hostinger
- Faça login no painel do Hostinger
- Vá para "Bancos de Dados MySQL"

### 2. Obter Dados de Conexão
- **DB_HOST**: geralmente `localhost` ou `mysql.hostinger.com`
- **DB_USER**: seu usuário do banco
- **DB_PASS**: sua senha do banco
- **DB_NAME**: nome do seu banco de dados

### 3. Executar SQL
Execute o arquivo `banco_dados/create_establishments_table.sql` no phpMyAdmin

## ✅ Verificar Configuração

Após configurar, reinicie o servidor:
```bash
npm run dev
```

O erro "Google Maps API Key não configurada" deve desaparecer!

