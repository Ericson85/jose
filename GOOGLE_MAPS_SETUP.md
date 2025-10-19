# 🗺️ Configuração do Google Maps API para Rota da Caipirinha

## 📋 Pré-requisitos
- Conta no Google Cloud Platform
- Projeto criado no Google Cloud Console
- APIs do Google Maps ativadas

## 🚀 Passo a Passo

### 1. Ativar APIs Necessárias
No [Google Cloud Console](https://console.cloud.google.com/):

1. **Vá para "APIs e Serviços" > "Biblioteca"**
2. **Ative as seguintes APIs:**
   - ✅ **Maps JavaScript API** (para o mapa interativo)
   - ✅ **Places API** (para buscar dados dos estabelecimentos)
   - ✅ **Geocoding API** (para converter endereços em coordenadas)

### 2. Criar Chave de API
1. **Vá para "APIs e Serviços" > "Credenciais"**
2. **Clique em "Criar Credenciais" > "Chave de API"**
3. **Copie a chave gerada**
4. **Configure restrições (opcional mas recomendado):**
   - **Restrição de aplicativo:** HTTP referrers
   - **Referrers permitidos:** `https://seudominio.com/*`

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui

# Banco de Dados Hostinger
DB_HOST=seu_host_hostinger
DB_USER=seu_usuario_hostinger
DB_PASS=sua_senha_hostinger
DB_NAME=seu_nome_banco_hostinger
```

### 4. Executar SQL no Hostinger
Execute o arquivo `banco_dados/create_establishments_table.sql` no seu banco de dados Hostinger.

## 🎯 Como Obter Place ID do Google Maps

### Método 1: Via Google Maps (Mais Fácil)
1. **Abra [Google Maps](https://maps.google.com)**
2. **Procure pelo estabelecimento**
3. **Clique no estabelecimento**
4. **Clique em "Compartilhar"**
5. **Copie o link**
6. **Extraia o Place ID do link**

### Método 2: Via Places API
1. **Use a API de busca do Places**
2. **Procure pelo nome do estabelecimento**
3. **Obtenha o Place ID da resposta**

## 🔧 Funcionalidades Implementadas

### ✅ Sincronização Automática
- **Nome do estabelecimento**
- **Endereço completo**
- **Telefone**
- **Horários de funcionamento**
- **Avaliação (rating)**
- **Website (se disponível)**

### ✅ Formatação de Horários
- **Conversão automática** do formato Google para nosso formato
- **Suporte a horários 24h**
- **Detecção de dias fechados**

### ✅ Validação de Dados
- **Verificação de Place ID válido**
- **Tratamento de erros da API**
- **Mensagens de feedback para o usuário**

## 🚨 Troubleshooting

### Erro: "Google Maps API Key não configurada"
- Verifique se a variável `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está definida
- Certifique-se de que o arquivo `.env.local` está na raiz do projeto

### Erro: "API não autorizada"
- Verifique se as APIs estão ativadas no Google Cloud Console
- Confirme se a chave de API está correta
- Verifique as restrições da chave de API

### Erro: "Place ID inválido"
- Confirme se o Place ID está correto
- Teste o Place ID diretamente no Google Maps

## 💡 Dicas de Uso

1. **Sempre teste** com um Place ID conhecido primeiro
2. **Configure restrições** na chave de API para segurança
3. **Monitore o uso** da API para evitar cobranças excessivas
4. **Use o botão "Sincronizar"** para atualizar dados automaticamente

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Confirme se todas as APIs estão ativadas
3. Teste a chave de API diretamente no Google Cloud Console
