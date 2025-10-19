"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Image, MapPin, Heart, Camera, X, MessageCircle, Users, Share2, MoreHorizontal, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string
  userId: string
  username: string
  avatar: string
  establishmentId: string | null
  establishmentName: string | null
  type: "text" | "image" | "location"
  content: string
  imageUrl: string | null
  location: { lat: number; lng: number; address: string } | null
  timestamp: string
  likes: number
  likedBy: string[]
  replies: Array<{
    id: string
    userId: string
    username: string
    avatar: string
    content: string
    timestamp: string
  }>
  shares: number
  category: string
}

interface FeedWindowProps {
  isOpen: boolean
  onClose: () => void
  establishmentId?: string | null
  establishmentName?: string | null
  currentUser?: {
    id: string
    username: string
    avatar?: string
  }
}

export default function FeedWindow({ 
  isOpen, 
  onClose, 
  establishmentId = null, 
  establishmentName = null,
  currentUser = { id: "user1", username: "Usuário", avatar: "/placeholder-user.jpg" }
}: FeedWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("todos")
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages()
      // Auto-refresh a cada 10 segundos
      const interval = setInterval(loadMessages, 10000)
      return () => clearInterval(interval)
    }
  }, [isOpen, establishmentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      const url = establishmentId 
        ? `/api/chat/messages?establishmentId=${establishmentId}`
        : '/api/chat/messages?establishmentId=general'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (type: "text" | "image" | "location", content?: string, imageUrl?: string, location?: any) => {
    try {
      const messageData = {
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        establishmentId: establishmentId || 'general',
        establishmentName,
        type,
        content: content || "",
        imageUrl: imageUrl || null,
        location: location || null
      }

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [data.data, ...prev])
        setNewMessage("")
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const handleSendText = () => {
    if (newMessage.trim()) {
      sendMessage("text", newMessage)
    }
  }

  const handleSendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Localização atual"
          }
          sendMessage("location", "📍 Estou aqui!", null, location)
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          alert('Não foi possível obter sua localização')
        }
      )
    } else {
      alert('Geolocalização não é suportada neste navegador')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        sendMessage("image", "📷 Foto enviada!", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLike = async (messageId: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId, 
          userId: currentUser.id,
          action: 'like'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? data.data
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Erro ao curtir mensagem:', error)
    }
  }

  const handleShare = async (messageId: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId, 
          userId: currentUser.id,
          action: 'share'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? data.data
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }

  const handleComment = async (messageId: string) => {
    const comment = newComment[messageId]
    if (!comment?.trim()) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId, 
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          action: 'comment',
          comment
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? data.data
              : msg
          )
        )
        setNewComment(prev => ({ ...prev, [messageId]: "" }))
      }
    } catch (error) {
      console.error('Erro ao comentar:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours}h`
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (activeTab === "todos") return true
    if (activeTab === "fotos") return msg.type === "image"
    if (activeTab === "localizacao") return msg.type === "location"
    if (activeTab === "depoimentos") return msg.category === "depoimento"
    return true
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[90vh] bg-gray-800/95 border-gray-600">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600 bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-6 w-6 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {establishmentName ? `Feed - ${establishmentName}` : 'Feed Geral'}
                </h3>
                <p className="text-xs text-gray-400">
                  {establishmentName ? 'Conversas e momentos do estabelecimento' : 'Feed da comunidade'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">{messages.length} posts</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tabs de Filtro */}
          <div className="border-b border-gray-600 bg-gray-700/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-600">
                <TabsTrigger value="todos" className="text-xs">Todos</TabsTrigger>
                <TabsTrigger value="fotos" className="text-xs">Fotos</TabsTrigger>
                <TabsTrigger value="localizacao" className="text-xs">Localização</TabsTrigger>
                <TabsTrigger value="depoimentos" className="text-xs">Depoimentos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Feed Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                  <p className="text-gray-400">Carregando feed...</p>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum post ainda</p>
                  <p className="text-sm text-gray-500">Seja o primeiro a compartilhar!</p>
                </div>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <Card key={message.id} className="bg-gray-700/50 border-gray-600">
                  <CardContent className="p-4">
                    {/* Header do Post */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>{message.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">{message.username}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                            {message.establishmentName && (
                              <Badge variant="outline" className="text-xs bg-purple-900/30 text-purple-300 border-purple-600">
                                {message.establishmentName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Conteúdo do Post */}
                    <div className="mb-4">
                      {message.type === "text" && (
                        <p className="text-white leading-relaxed">{message.content}</p>
                      )}
                      
                      {message.type === "image" && (
                        <div>
                          <p className="text-white leading-relaxed mb-3">{message.content}</p>
                          {message.imageUrl && (
                            <img 
                              src={message.imageUrl} 
                              alt="Imagem do post"
                              className="w-full h-auto rounded-lg max-h-96 object-cover"
                            />
                          )}
                        </div>
                      )}
                      
                      {message.type === "location" && (
                        <div>
                          <p className="text-white leading-relaxed mb-3">{message.content}</p>
                          {message.location && (
                            <div className="bg-gray-600/50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-red-400" />
                                <span className="text-sm text-gray-300">
                                  {message.location.address}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  const url = `https://www.google.com/maps?q=${message.location.lat},${message.location.lng}`
                                  window.open(url, '_blank')
                                }}
                              >
                                Ver no Mapa
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ações do Post */}
                    <div className="flex items-center justify-between border-t border-gray-600 pt-3">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(message.id)}
                          className={`flex items-center space-x-2 ${
                            message.likedBy.includes(currentUser.id) 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${message.likedBy.includes(currentUser.id) ? 'fill-current' : ''}`} />
                          <span className="text-sm">{message.likes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowComments(prev => ({ ...prev, [message.id]: !prev[message.id] }))}
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{message.replies.length}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(message.id)}
                          className="text-gray-400 hover:text-green-400"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">{message.shares}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Comentários */}
                    {showComments[message.id] && (
                      <div className="mt-4 border-t border-gray-600 pt-4">
                        <div className="space-y-3 mb-4">
                          {message.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={reply.avatar} />
                                <AvatarFallback>{reply.username[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-white text-sm">{reply.username}</span>
                                  <span className="text-xs text-gray-400">{formatTime(reply.timestamp)}</span>
                                </div>
                                <p className="text-gray-300 text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Input de Comentário */}
                        <div className="flex space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.avatar} />
                            <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                          </Avatar>
                          <Input
                            value={newComment[message.id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [message.id]: e.target.value }))}
                            placeholder="Adicionar comentário..."
                            className="flex-1 bg-gray-600 border-gray-500 text-white text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(message.id)}
                          />
                          <Button
                            onClick={() => handleComment(message.id)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-600 p-4 bg-gray-700/50">
            <div className="flex space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Compartilhe algo com a comunidade..."
                  className="flex-1 bg-gray-600 border-gray-500 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-500 text-gray-300 hover:bg-gray-600"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendLocation}
                  className="border-gray-500 text-gray-300 hover:bg-gray-600"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handleSendText}
                  disabled={!newMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
