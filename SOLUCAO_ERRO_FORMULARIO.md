# 🚨 PROBLEMA: Erro ao Adicionar Estabelecimentos

## ❌ **Erro Identificado:**
- **Status 500** na API `/api/establishments`
- **ECONNREFUSED** - Conexão com banco recusada
- **Formulário não salva** dados no banco

## 🔍 **Causa:**
O arquivo `.env.local` existe mas as variáveis de ambiente não estão sendo carregadas corretamente.

## 🛠️ **SOLUÇÃO:**

### 1. **Verifique o conteúdo do arquivo `.env.local`:**
Abra o arquivo `.env.local` na raiz do projeto e verifique se contém:

```bash
DB_HOST=localhost
DB_USER=u602005227_Tenderes
DB_PASS=sua_senha_real
DB_NAME=u602005227_Tenderes
```

### 2. **Substitua pelos seus dados reais:**
- `DB_HOST`: Geralmente `localhost` ou IP do servidor
- `DB_USER`: Seu usuário do Hostinger
- `DB_PASS`: Sua senha do Hostinger
- `DB_NAME`: Nome da sua base de dados

### 3. **Exemplo com dados reais:**
```bash
DB_HOST=localhost
DB_USER=u602005227_Tenderes
DB_PASS=MinhaSenh@123
DB_NAME=u602005227_Tenderes
```

### 4. **Reinicie o servidor:**
1. Pare o servidor (`Ctrl+C`)
2. Execute `npm run dev` novamente
3. Teste o formulário

## ⚠️ **IMPORTANTE:**
- **NUNCA** commite o arquivo `.env.local`
- Mantenha suas credenciais seguras
- Verifique se as credenciais estão corretas no painel do Hostinger

## 🔄 **Após corrigir:**
1. O formulário deve salvar dados normalmente
2. Os estabelecimentos devem aparecer na lista
3. A API deve retornar status 200 em vez de 500

## 📞 **Se ainda não funcionar:**
Verifique se:
- As credenciais estão corretas
- O banco de dados está ativo no Hostinger
- A conexão está permitida no painel do Hostinger
