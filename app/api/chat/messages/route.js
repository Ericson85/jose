import { NextResponse } from 'next/server'

// Simulação de banco de dados em memória para mensagens
let messages = [
  {
    id: "1",
    userId: "user1",
    username: "João",
    avatar: "/placeholder-user.jpg",
    establishmentId: null, // null = chat geral
    establishmentName: null,
    type: "text", // text, image, location
    content: "Olá pessoal! Alguém conhece um bom bar por aqui?",
    imageUrl: null,
    location: null,
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: []
  },
  {
    id: "2",
    userId: "user2", 
    username: "Maria",
    avatar: "/placeholder-user.jpg",
    establishmentId: "1",
    establishmentName: "Bar da Caipirinha",
    type: "text",
    content: "Estou no Bar da Caipirinha, ambiente incrível! 🍹",
    imageUrl: null,
    location: null,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    likes: 3,
    replies: []
  }
]

// GET - Buscar mensagens
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get('establishmentId')
    
    let filteredMessages = messages
    
    if (establishmentId === 'general') {
      // Chat geral - apenas mensagens sem establishmentId
      filteredMessages = messages.filter(msg => msg.establishmentId === null)
    } else if (establishmentId) {
      // Chat específico do estabelecimento
      filteredMessages = messages.filter(msg => msg.establishmentId === establishmentId)
    }
    
    // Ordenar por timestamp (mais recentes primeiro)
    filteredMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    return NextResponse.json({
      success: true,
      data: filteredMessages,
      total: filteredMessages.length
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Erro ao buscar mensagens"
    }, { status: 500 })
  }
}

// POST - Enviar nova mensagem
export async function POST(request) {
  try {
    const body = await request.json()
    
    const {
      userId,
      username,
      avatar,
      establishmentId,
      establishmentName,
      type,
      content,
      imageUrl,
      location
    } = body
    
    // Validações básicas
    if (!userId || !username || !type) {
      return NextResponse.json({
        success: false,
        error: "Dados obrigatórios não fornecidos"
      }, { status: 400 })
    }
    
    if (type === "text" && !content) {
      return NextResponse.json({
        success: false,
        error: "Conteúdo da mensagem é obrigatório"
      }, { status: 400 })
    }
    
    const newMessage = {
      id: Date.now().toString(),
      userId,
      username,
      avatar: avatar || "/placeholder-user.jpg",
      establishmentId: establishmentId === 'general' ? null : establishmentId,
      establishmentName: establishmentName || null,
      type,
      content: content || "",
      imageUrl: imageUrl || null,
      location: location || null,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    }
    
    messages.push(newMessage)
    
    return NextResponse.json({
      success: true,
      data: newMessage,
      message: "Mensagem enviada com sucesso"
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Erro ao enviar mensagem"
    }, { status: 500 })
  }
}

// PUT - Curtir mensagem
export async function PUT(request) {
  try {
    const body = await request.json()
    const { messageId } = body
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Mensagem não encontrada"
      }, { status: 404 })
    }
    
    messages[messageIndex].likes += 1
    
    return NextResponse.json({
      success: true,
      data: messages[messageIndex],
      message: "Mensagem curtida com sucesso"
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Erro ao curtir mensagem"
    }, { status: 500 })
  }
}
