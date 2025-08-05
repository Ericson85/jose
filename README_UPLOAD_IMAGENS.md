# Sistema de Upload de Imagens para Drinks

## Funcionalidade Implementada

O sistema permite que o administrador faça upload de imagens personalizadas para os drinks através da área administrativa, especificamente na aba "Drinks". As imagens são exibidas na aba "Orçamento Detalhado" da página principal.

## Como Funciona

### 1. Upload de Imagens
- Acesse a área administrativa (`/admin`)
- Vá para a aba "Drinks"
- Clique em "Adicionar Novo" ou edite um drink existente
- Use o campo "Imagem do Drink" para fazer upload
- Formatos aceitos: JPG, PNG, GIF
- Tamanho máximo: 50MB (será otimizado automaticamente)

### 2. Processamento de Imagens
- As imagens são automaticamente redimensionadas para 800x600px
- Otimizadas para melhor performance (qualidade 80%)
- Salvas na pasta `/public/uploads/`
- Nomes únicos gerados automaticamente

### 3. Exibição na Página Principal
- As imagens personalizadas aparecem na aba "Orçamento Detalhado"
- Se uma imagem falhar ao carregar, o sistema usa uma imagem padrão da categoria
- Fallback automático para imagens de categoria

## Configuração do Banco de Dados

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Configurações do Banco de Dados Hostinger
DB_HOST=seu_host_hostinger.com
DB_USER=seu_usuario_hostinger
DB_PASS=sua_senha_hostinger
DB_NAME=seu_banco_hostinger
```

### Estrutura da Tabela Drinks
A tabela `drinks` deve ter a seguinte estrutura:

```sql
CREATE TABLE drinks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    price_type ENUM('per_person', 'per_unit') NOT NULL,
    popular BOOLEAN DEFAULT FALSE,
    description TEXT,
    premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## APIs Utilizadas

### 1. Upload de Imagem
- **Endpoint**: `/api/upload-image`
- **Método**: POST
- **Formato**: FormData
- **Retorno**: URL da imagem salva

### 2. Gerenciamento de Drinks
- **GET** `/api/drinks` - Listar todos os drinks
- **POST** `/api/drinks` - Criar novo drink
- **PUT** `/api/drinks/[id]` - Atualizar drink
- **DELETE** `/api/drinks/[id]` - Remover drink

## Estrutura de Arquivos

```
public/
├── uploads/          # Pasta onde as imagens são salvas
├── caipirinha.jpg    # Imagens padrão por categoria
├── caipiroska.jpg
├── gin-tonica.jpg
└── ...

app/
├── api/
│   ├── upload-image/
│   │   └── route.js  # API de upload
│   └── drinks/
│       ├── route.js  # CRUD de drinks
│       └── [id]/
│           └── route.js
└── admin/
    └── page.tsx      # Interface administrativa
```

## Funcionalidades Especiais

### 1. Preview de Imagem
- Visualização em tempo real da imagem selecionada
- Botão para remover imagem
- Indicador de status do upload

### 2. Tratamento de Erros
- Validação de formato de arquivo
- Verificação de tamanho
- Fallback para imagens padrão
- Logs detalhados para debug

### 3. Otimização Automática
- Redimensionamento automático
- Compressão inteligente
- Carregamento progressivo

## Como Testar

1. **Configurar banco de dados**:
   - Execute o script SQL para criar a tabela
   - Configure as variáveis de ambiente

2. **Testar upload**:
   - Acesse `/admin`
   - Vá para aba "Drinks"
   - Adicione um novo drink com imagem
   - Verifique se aparece na página principal

3. **Verificar exibição**:
   - Acesse a página principal
   - Vá para aba "Orçamento Detalhado"
   - Confirme se as imagens personalizadas aparecem

## Troubleshooting

### Problemas Comuns

1. **Imagem não aparece**:
   - Verifique se a pasta `/public/uploads/` existe
   - Confirme as permissões de escrita
   - Verifique os logs do console

2. **Erro de upload**:
   - Verifique o tamanho do arquivo
   - Confirme o formato (JPG, PNG, GIF)
   - Verifique a conexão com o banco de dados

3. **Imagem não salva no banco**:
   - Verifique as variáveis de ambiente
   - Confirme a estrutura da tabela
   - Verifique os logs da API

### Logs Úteis

Os logs são exibidos no console do servidor e incluem:
- Informações do arquivo recebido
- Processo de otimização
- Status do salvamento
- Erros detalhados

## Próximos Passos

- [ ] Implementar cache de imagens
- [ ] Adicionar suporte a mais formatos
- [ ] Implementar CDN para imagens
- [ ] Adicionar compressão adicional
- [ ] Implementar backup automático 