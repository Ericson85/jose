# Configuração do Sistema no Hostinger

## Passo a Passo para Configurar o Upload de Imagens

### 1. Configuração do Banco de Dados

1. **Acesse o painel do Hostinger**
   - Faça login no painel de controle
   - Vá para "Bancos de Dados" > "MySQL"

2. **Criar/Configurar Banco de Dados**
   - Crie um novo banco de dados ou use um existente
   - Anote: host, usuário, senha e nome do banco

3. **Executar Scripts SQL**
   - Acesse o phpMyAdmin
   - Selecione seu banco de dados
   - Execute o script `banco_dados/site_drinks.sql`
   - Se a tabela já existe, execute `banco_dados/update_drinks_table.sql`

### 2. Configuração das Variáveis de Ambiente

1. **Criar arquivo .env.local**
   - Na raiz do projeto, crie o arquivo `.env.local`
   - Adicione as configurações do banco:

```env
# Configurações do Banco de Dados Hostinger
DB_HOST=seu_host_hostinger.com
DB_USER=seu_usuario_hostinger
DB_PASS=sua_senha_hostinger
DB_NAME=seu_banco_hostinger
```

2. **Exemplo de configuração real**:
```env
DB_HOST=localhost
DB_USER=u123456789_admin
DB_PASS=MinhaSenha123!
DB_NAME=u123456789_tenderes
```

### 3. Deploy no Hostinger

1. **Upload dos arquivos**
   - Faça upload de todos os arquivos para o servidor
   - Certifique-se de que a pasta `public/uploads/` existe e tem permissões de escrita

2. **Instalar dependências**
   - Execute `npm install` no servidor
   - Ou configure o build automático

3. **Configurar permissões**
   - Pasta `public/uploads/`: 755 ou 775
   - Arquivos: 644

### 4. Testando o Sistema

1. **Acessar área administrativa**
   - Vá para `seudominio.com/admin`
   - Use a senha configurada

2. **Testar upload de imagem**
   - Vá para aba "Drinks"
   - Clique em "Adicionar Novo"
   - Faça upload de uma imagem
   - Verifique se aparece na página principal

3. **Verificar na página principal**
   - Acesse a página principal
   - Vá para aba "Orçamento Detalhado"
   - Confirme se as imagens aparecem

### 5. Troubleshooting

#### Problemas Comuns

1. **Erro de conexão com banco**
   - Verifique as credenciais no `.env.local`
   - Confirme se o host está correto
   - Teste a conexão via phpMyAdmin

2. **Imagem não aparece**
   - Verifique se a pasta `public/uploads/` existe
   - Confirme as permissões (755)
   - Verifique os logs do servidor

3. **Erro 500 no upload**
   - Verifique se o Sharp está instalado
   - Confirme as permissões de escrita
   - Verifique o espaço em disco

#### Logs Úteis

- **Logs do Next.js**: Console do servidor
- **Logs do Hostinger**: Painel de controle > Logs
- **Logs do banco**: phpMyAdmin > Status

### 6. Otimizações para Hostinger

1. **Configurar cache**
   - Ative o cache do Next.js
   - Configure cache de imagens

2. **Otimizar imagens**
   - As imagens já são otimizadas automaticamente
   - Tamanho máximo: 800x600px
   - Qualidade: 80%

3. **Backup automático**
   - Configure backup do banco de dados
   - Faça backup da pasta `public/uploads/`

### 7. Segurança

1. **Proteger área admin**
   - Use senha forte
   - Considere autenticação adicional

2. **Validar uploads**
   - Apenas imagens são aceitas
   - Tamanho máximo controlado
   - Nomes únicos gerados

3. **Backup regular**
   - Banco de dados
   - Imagens enviadas
   - Código fonte

### 8. Monitoramento

1. **Verificar logs regularmente**
   - Erros de upload
   - Problemas de banco
   - Performance

2. **Monitorar espaço em disco**
   - Imagens podem ocupar espaço
   - Limpe imagens antigas se necessário

3. **Verificar performance**
   - Tempo de carregamento
   - Uso de memória
   - Consultas ao banco

## Suporte

Se encontrar problemas:
1. Verifique os logs
2. Teste em ambiente local
3. Consulte a documentação
4. Entre em contato com suporte 