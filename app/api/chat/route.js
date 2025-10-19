import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
    }

    // Prompt especializado em bebidas, drinks e bares
    const systemPrompt = `Você é um especialista em bebidas, drinks e bares com conhecimento profundo sobre:

- Receitas de drinks clássicos e modernos
- Ingredientes e suas combinações
- Técnicas de preparo de bebidas
- História de drinks famosos
- Dicas para bartenders
- Harmonização de bebidas com comida
- Tipos de cachaça, vodca, rum, gin, tequila, etc.
- Coquetéis sem álcool
- Bebidas brasileiras e internacionais
- Equipamentos de bar
- Técnicas de decoração de drinks

Responda sempre de forma educativa, profissional e útil. Se a pergunta não for sobre bebidas, drinks ou bares, explique educadamente que você é especializado apenas nesse assunto.

Mantenha as respostas concisas mas informativas, e sempre ofereça dicas práticas quando possível.`;

    // Simulação de resposta da IA (você pode integrar com OpenAI, Claude, etc.)
    const aiResponse = await generateDrinkAIResponse(message, systemPrompt);
    
    return NextResponse.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function generateDrinkAIResponse(message, systemPrompt) {
  // Simulação de resposta baseada em conhecimento sobre drinks
  const responses = {
    'caipirinha': 'A caipirinha é o drink mais famoso do Brasil! Ingredientes: cachaça, limão, açúcar e gelo. Dica: use limão tahiti, corte em pedaços pequenos, macere bem com açúcar antes de adicionar a cachaça e gelo.',
    'mojito': 'O mojito é um clássico cubano refrescante! Ingredientes: rum branco, hortelã, limão, açúcar, água com gás e gelo. Dica: macere a hortelã suavemente para liberar o aroma sem amargar.',
    'gin tonic': 'Gin Tonic é elegante e versátil! Ingredientes: gin, água tônica e gelo. Dica: use uma proporção de 1:3 (gin:tônica) e adicione uma fatia de limão ou pepino.',
    'martini': 'Martini é sofisticado! Ingredientes: gin ou vodca, vermute seco e azeitona. Dica: mexa suavemente com gelo e coe em copo gelado.',
    'receita': 'Posso ajudar com receitas de drinks! Me diga qual drink você quer aprender a fazer.',
    'ingredientes': 'Posso explicar sobre ingredientes! Cada bebida tem suas características únicas. Me pergunte sobre algum específico.',
    'bartender': 'Dicas para bartenders: sempre mantenha os equipamentos limpos, meça os ingredientes, teste os drinks antes de servir e seja criativo!',
    'harmonização': 'Harmonização de bebidas: vinhos brancos com peixes, tintos com carnes, cervejas com petiscos, e drinks doces com sobremesas!'
  };

  const lowerMessage = message.toLowerCase();
  
  // Busca por palavras-chave
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  // Resposta padrão educativa
  return `Olá! Sou especialista em bebidas, drinks e bares. Posso ajudar você com:

🍹 Receitas de drinks clássicos e modernos
🥃 Informações sobre ingredientes e bebidas
🍸 Técnicas de preparo e dicas para bartenders
🍷 Harmonização de bebidas com comida
🍺 História e curiosidades sobre drinks

Me faça uma pergunta específica sobre bebidas e eu te ajudo!`;
}

