import { NextResponse } from 'next/server'

// Simulação de banco de dados em memória para feed estilo Instagram
let messages = [
  {
    id: "1",
    userId: "user1",
    username: "João Silva",
    avatar: "/placeholder-user.jpg",
    establishmentId: null, // null = feed geral
    establishmentName: null,
    type: "text", // text, image, location
    content: "Olá pessoal! Alguém conhece um bom bar por aqui? Quero fazer uma festa incrível! 🎉",
    imageUrl: null,
    location: null,
    timestamp: new Date().toISOString(),
    likes: 5,
    likedBy: ["user2", "user3"],
    replies: [
      {
        id: "reply1",
        userId: "user2",
        username: "Maria",
        avatar: "/placeholder-user.jpg",
        content: "Recomendo o Bar da Caipirinha! Ambiente top!",
        timestamp: new Date(Date.now() - 100000).toISOString()
      }
    ],
    shares: 2,
    category: "geral",
    savedBy: ["user3"],
    views: 45
  },
  {
    id: "2",
    userId: "user2", 
    username: "Maria Santos",
    avatar: "/placeholder-user.jpg",
    establishmentId: "1",
    establishmentName: "Bar da Caipirinha",
    type: "image",
    content: "Momento incrível no Bar da Caipirinha! 🍹✨",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500",
    location: null,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    likes: 12,
    likedBy: ["user1", "user3", "user4"],
    replies: [],
    shares: 1,
    category: "foto",
    savedBy: ["user1", "user4"],
    views: 128
  },
  {
    id: "3",
    userId: "user3",
    username: "Carlos",
    avatar: "/placeholder-user.jpg",
    establishmentId: "2",
    establishmentName: "Boate Sunset",
    type: "location",
    content: "📍 Na Boate Sunset! Música eletrônica incrível! Quem vem? 🎵",
    imageUrl: null,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: "Boate Sunset, Vila Madalena"
    },
    timestamp: new Date(Date.now() - 900000).toISOString(),
    likes: 8,
    likedBy: ["user1", "user2"],
    replies: [
      {
        id: "reply2",
        userId: "user1",
        username: "João Silva",
        avatar: "/placeholder-user.jpg",
        content: "Estou indo! Nos vemos lá! 🚀",
        timestamp: new Date(Date.now() - 800000).toISOString()
      }
    ],
    shares: 3,
    category: "localizacao",
    savedBy: ["user2"],
    views: 67
  },
  {
    id: "4",
    userId: "user4",
    username: "Ana Costa",
    avatar: "/placeholder-user.jpg",
    establishmentId: null,
    establishmentName: null,
    type: "text",
    content: "Acabei de contratar a Tenderes para minha festa de aniversário! O atendimento foi excepcional! 👏✨",
    imageUrl: null,
    location: null,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    likes: 15,
    likedBy: ["user1", "user2", "user3", "user5"],
    replies: [
      {
        id: "reply3",
        userId: "user2",
        username: "Maria Santos",
        avatar: "/placeholder-user.jpg",
        content: "Também usei o serviço! Recomendo demais! 🎉",
        timestamp: new Date(Date.now() - 1100000).toISOString()
      }
    ],
    shares: 5,
    category: "depoimento",
    savedBy: ["user1", "user3"],
    views: 234
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
      likedBy: [],
      replies: [],
      shares: 0,
      savedBy: [],
      views: 0,
      category: type === 'image' ? 'foto' : type === 'location' ? 'localizacao' : 'geral'
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

// PUT - Curtir/descurtir mensagem ou adicionar comentário
export async function PUT(request) {
  try {
    const body = await request.json()
    const { messageId, userId, action, comment } = body
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Mensagem não encontrada"
      }, { status: 404 })
    }
    
    if (action === 'like') {
      const isLiked = messages[messageIndex].likedBy.includes(userId)
      
      if (isLiked) {
        // Descurtir
        messages[messageIndex].likedBy = messages[messageIndex].likedBy.filter(id => id !== userId)
        messages[messageIndex].likes -= 1
      } else {
        // Curtir
        messages[messageIndex].likedBy.push(userId)
        messages[messageIndex].likes += 1
      }
    } else if (action === 'comment' && comment) {
      const newReply = {
        id: Date.now().toString(),
        userId,
        username: body.username || "Usuário",
        avatar: body.avatar || "/placeholder-user.jpg",
        content: comment,
        timestamp: new Date().toISOString()
      }
      messages[messageIndex].replies.push(newReply)
    } else if (action === 'share') {
      messages[messageIndex].shares += 1
    } else if (action === 'save') {
      const isSaved = messages[messageIndex].savedBy.includes(userId)
      
      if (isSaved) {
        // Remover dos salvos
        messages[messageIndex].savedBy = messages[messageIndex].savedBy.filter(id => id !== userId)
      } else {
        // Adicionar aos salvos
        messages[messageIndex].savedBy.push(userId)
      }
    } else if (action === 'view') {
      messages[messageIndex].views += 1
    }
    
    return NextResponse.json({
      success: true,
      data: messages[messageIndex],
      message: action === 'like' ? 
        (messages[messageIndex].likedBy.includes(userId) ? "Mensagem curtida" : "Curtida removida") :
        action === 'comment' ? "Comentário adicionado" : "Compartilhado"
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Erro ao processar ação"
    }, { status: 500 })
  }
}
