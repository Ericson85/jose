"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Camera, 
  MapPin, 
  Send,
  Home,
  Search,
  Plus,
  User,
  X,
  Eye,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Post {
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
  savedBy: string[]
  views: number
  category: string
}

interface Story {
  id: string
  userId: string
  username: string
  avatar: string
  imageUrl: string
  timestamp: string
  viewedBy: string[]
}

interface InstagramFeedProps {
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

export default function InstagramFeed({ 
  isOpen, 
  onClose, 
  establishmentId = null, 
  establishmentName = null,
  currentUser = { id: "user1", username: "Usuário", avatar: "/placeholder-user.jpg" }
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [newPost, setNewPost] = useState("")
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
  const [showCreatePost, setShowCreatePost] = useState(false)
  const postsEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      loadPosts()
      loadStories()
      // Auto-refresh a cada 15 segundos
      const interval = setInterval(() => {
        loadPosts()
        loadStories()
      }, 15000)
      return () => clearInterval(interval)
    }
  }, [isOpen, establishmentId])

  useEffect(() => {
    scrollToBottom()
  }, [posts])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const url = establishmentId 
        ? `/api/chat/messages?establishmentId=${establishmentId}`
        : '/api/chat/messages?establishmentId=general'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
        // Incrementar visualizações
        data.data.forEach((post: Post) => {
          trackView(post.id)
        })
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStories = async () => {
    // Stories mockados - em produção viria da API
    const mockStories = [
      {
        id: "story1",
        userId: "user1",
        username: "João Silva",
        avatar: "/placeholder-user.jpg",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        viewedBy: ["user2"]
      },
      {
        id: "story2",
        userId: "user2",
        username: "Maria Santos",
        avatar: "/placeholder-user.jpg",
        imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        viewedBy: ["user1", "user3"]
      },
      {
        id: "story3",
        userId: "user3",
        username: "Carlos",
        avatar: "/placeholder-user.jpg",
        imageUrl: "https://images.unsplash.com/photo-1571266028243-ece68ff4e8ef?w=200",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        viewedBy: []
      }
    ]
    setStories(mockStories)
  }

  const trackView = async (postId: string) => {
    try {
      await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId: postId, 
          userId: currentUser.id,
          action: 'view'
        })
      })
    } catch (error) {
      console.error('Erro ao rastrear visualização:', error)
    }
  }

  const sendPost = async (type: "text" | "image" | "location", content?: string, imageUrl?: string, location?: any) => {
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
        setPosts(prev => [data.data, ...prev])
        setNewPost("")
        setShowCreatePost(false)
      }
    } catch (error) {
      console.error('Erro ao enviar post:', error)
    }
  }

  const handleSendText = () => {
    if (newPost.trim()) {
      sendPost("text", newPost)
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
          sendPost("location", "📍 Estou aqui!", null, location)
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          alert('Não foi possível obter sua localização')
        }
      )
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        sendPost("image", "📷 Nova foto!", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId: postId, 
          userId: currentUser.id,
          action: 'like'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? data.data
              : post
          )
        )
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error)
    }
  }

  const handleSave = async (postId: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId: postId, 
          userId: currentUser.id,
          action: 'save'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? data.data
              : post
          )
        )
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error)
    }
  }

  const handleComment = async (postId: string) => {
    const comment = newComment[postId]
    if (!comment?.trim()) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId: postId, 
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          action: 'comment',
          comment
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? data.data
              : post
          )
        )
        setNewComment(prev => ({ ...prev, [postId]: "" }))
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Sidebar Esquerda */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Tenderes</h2>
          <p className="text-xs text-gray-400">Feed Social</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "home" ? "bg-purple-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-4 w-4 mr-3" />
            Início
          </Button>
          
          <Button
            variant={activeTab === "search" ? "default" : "ghost"}
            className={`w-full justify-start ${activeTab === "search" ? "bg-purple-600" : "text-gray-300 hover:text-white"}`}
            onClick={() => setActiveTab("search")}
          >
            <Search className="h-4 w-4 mr-3" />
            Explorar
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setShowCreatePost(true)}
          >
            <Plus className="h-4 w-4 mr-3" />
            Criar
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white"
          >
            <User className="h-4 w-4 mr-3" />
            Perfil
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-sm font-medium">{currentUser.username}</p>
              <p className="text-gray-400 text-xs">Usuário</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-800">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            {establishmentName ? establishmentName : "Feed"}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Stories */}
        <div className="bg-gray-900 border-b border-gray-700 p-4">
          <div className="flex space-x-4 overflow-x-auto">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full border-2 ${
                    story.viewedBy.includes(currentUser.id) 
                      ? 'border-gray-500' 
                      : 'border-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    <Avatar className="w-full h-full">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs text-gray-300 truncate w-16 text-center">
                  {story.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum post ainda</p>
                <p className="text-sm text-gray-500">Seja o primeiro a compartilhar!</p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-gray-700/50 border-gray-600">
                <CardContent className="p-0">
                  {/* Header do Post */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{post.username}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{formatTime(post.timestamp)}</span>
                          {post.establishmentName && (
                            <Badge variant="outline" className="text-xs bg-purple-900/30 text-purple-300 border-purple-600">
                              {post.establishmentName}
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
                  <div className="px-4 pb-3">
                    {post.type === "text" && (
                      <p className="text-white leading-relaxed">{post.content}</p>
                    )}
                    
                    {post.type === "image" && (
                      <div>
                        <p className="text-white leading-relaxed mb-3">{post.content}</p>
                        {post.imageUrl && (
                          <img 
                            src={post.imageUrl} 
                            alt="Imagem do post"
                            className="w-full h-auto rounded-lg max-h-96 object-cover"
                          />
                        )}
                      </div>
                    )}
                    
                    {post.type === "location" && (
                      <div>
                        <p className="text-white leading-relaxed mb-3">{post.content}</p>
                        {post.location && (
                          <div className="bg-gray-600/50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-4 w-4 text-red-400" />
                              <span className="text-sm text-gray-300">
                                {post.location.address}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                const url = `https://www.google.com/maps?q=${post.location.lat},${post.location.lng}`
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
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 ${
                            post.likedBy.includes(currentUser.id) 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${post.likedBy.includes(currentUser.id) ? 'fill-current' : ''}`} />
                          <span className="text-sm">{post.likes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm ml-1">{post.replies.length}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-green-400"
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(post.id)}
                        className={`${
                          post.savedBy.includes(currentUser.id) 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Bookmark className={`h-5 w-5 ${post.savedBy.includes(currentUser.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Views */}
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{post.views} visualizações</span>
                    </div>

                    {/* Comentários */}
                    {showComments[post.id] && (
                      <div className="border-t border-gray-600 pt-3">
                        <div className="space-y-3 mb-3">
                          {post.replies.map((reply) => (
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
                            value={newComment[post.id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Adicionar comentário..."
                            className="flex-1 bg-gray-600 border-gray-500 text-white text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <Button
                            onClick={() => handleComment(post.id)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <div ref={postsEndRef} />
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <Card className="w-full max-w-md bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Criar Post</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{currentUser.username}</p>
                      <p className="text-gray-400 text-sm">Compartilhando com a comunidade</p>
                    </div>
                  </div>

                  <Input
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="O que você está pensando?"
                    className="bg-gray-600 border-gray-500 text-white"
                  />

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-600"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Foto
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendLocation}
                      className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-600"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Localização
                    </Button>
                  </div>

                  <Button
                    onClick={handleSendText}
                    disabled={!newPost.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Compartilhar
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
