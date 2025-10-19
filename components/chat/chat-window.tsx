"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Image, MapPin, Heart, Camera, X, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  replies: any[]
}

interface ChatWindowProps {
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

export default function ChatWindow({ 
  isOpen, 
  onClose, 
  establishmentId = null, 
  establishmentName = null,
  currentUser = { id: "user1", username: "Usuário", avatar: "/placeholder-user.jpg" }
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages()
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

  const likeMessage = async (messageId: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, likes: data.data.likes }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Erro ao curtir mensagem:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m atrás`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] bg-gray-800/95 border-gray-600">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600 bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">
                  {establishmentName ? `Chat - ${establishmentName}` : 'Chat Geral'}
                </h3>
                <p className="text-xs text-gray-400">
                  {establishmentName ? 'Conversas do estabelecimento' : 'Conversas de todos os usuários'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">{messages.length} mensagens</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                  <p className="text-gray-400">Carregando mensagens...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma mensagem ainda</p>
                  <p className="text-sm text-gray-500">Seja o primeiro a conversar!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>{message.username[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white text-sm">{message.username}</span>
                      {message.establishmentName && (
                        <Badge variant="outline" className="text-xs">
                          {message.establishmentName}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      {message.type === "text" && (
                        <p className="text-white text-sm">{message.content}</p>
                      )}
                      
                      {message.type === "image" && (
                        <div>
                          <p className="text-white text-sm mb-2">{message.content}</p>
                          {message.imageUrl && (
                            <img 
                              src={message.imageUrl} 
                              alt="Imagem enviada"
                              className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                            />
                          )}
                        </div>
                      )}
                      
                      {message.type === "location" && (
                        <div>
                          <p className="text-white text-sm mb-2">{message.content}</p>
                          {message.location && (
                            <div className="bg-gray-600/50 rounded p-2">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-red-400" />
                                <span className="text-sm text-gray-300">
                                  {message.location.address}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs"
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
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeMessage(message.id)}
                        className="text-gray-400 hover:text-red-400 p-1 h-auto"
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        <span className="text-xs">{message.likes}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-600 p-4 bg-gray-700/50">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
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
