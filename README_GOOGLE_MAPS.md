# Configuração do Google Maps para Rota da Caipirinha

## 📍 Como configurar o mapa personalizado

### 1. Obter a API Key do Google Maps

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps JavaScript API
   - Places API (opcional, para busca de lugares)
4. Vá para "Credenciais" e crie uma nova "Chave de API"
5. Configure as restrições conforme necessário

### 2. Configurar a variável de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

### 3. Funcionalidades do Mapa

✅ **Marcadores personalizados** com ícones de caipirinha
✅ **InfoWindows** com detalhes dos bares
✅ **Interação** - clique nos marcadores para ver detalhes
✅ **Navegação** - botões de zoom in/out
✅ **Responsivo** - funciona em mobile e desktop

### 4. Personalização dos Bares

Para adicionar novos bares, edite o array `bars` em `app/rota-caipirinha/page.tsx`:

```typescript
{
  id: "novo-id",
  name: "Nome do Bar",
  address: "Endereço completo",
  phone: "(11) 99999-9999",
  hours: "18:00 - 02:00",
  rating: 4.5,
  lat: -23.5505, // Latitude
  lng: -46.6333, // Longitude
  description: "Descrição do bar",
  specialties: ["Caipirinha Tradicional", "Cachaça Premium"],
  priceRange: "€€"
}
```

### 5. Estilos do Mapa

O mapa usa um tema personalizado que:
- Remove labels de POI desnecessários
- Remove controles de trânsito
- Mantém apenas o controle de zoom
- Usa cores que combinam com o tema do site

### 6. Funcionalidades Implementadas

- **Lista de bares** com informações detalhadas
- **Mapa interativo** com marcadores customizados
- **Detalhes do bar** quando selecionado
- **Links para Google Maps** para navegação
- **Botões de contato** (telefone)
- **Sistema de avaliações** com estrelas
- **Filtros por preço** (€, €€, €€€)

### 7. Próximos Passos

- [ ] Integrar com API de busca de bares
- [ ] Adicionar filtros por categoria
- [ ] Implementar roteamento entre bares
- [ ] Adicionar fotos dos bares
- [ ] Sistema de avaliações dos usuários
