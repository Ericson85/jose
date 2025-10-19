"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, MapPin, Headphones, Settings, ExternalLink, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
  onProfileClick?: () => void
  onCaipirinhaRouteClick?: () => void
  onPodcastClick?: () => void
  onChatClick?: () => void
}

export function UserMenu({ 
  onProfileClick, 
  onCaipirinhaRouteClick, 
  onPodcastClick,
  onChatClick
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleProfileClick = () => {
    onProfileClick?.()
    setIsOpen(false)
  }

  const handleCaipirinhaRouteClick = () => {
    router.push('/rota-caipirinha')
    setIsOpen(false)
  }

  const handlePodcastClick = () => {
    onPodcastClick?.()
    setIsOpen(false)
  }

  const handleChatClick = () => {
    onChatClick?.()
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500 text-purple-300 hover:bg-purple-900/50 text-xs lg:text-base px-2 py-1 lg:px-4 lg:py-2"
        >
          <Menu className="h-3 w-3 lg:h-5 lg:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-gray-800/95 backdrop-blur-md border-gray-600 text-white"
      >
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50"
        >
          <User className="h-4 w-4 text-purple-400" />
          <span>Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleCaipirinhaRouteClick}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-green-400" />
            <span>Rota da Caipirinha</span>
          </div>
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handlePodcastClick}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <Headphones className="h-4 w-4 text-blue-400" />
            <span>Podcast</span>
          </div>
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleChatClick}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-4 w-4 text-green-400" />
            <span>Dbobeira</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-600" />
        
        <DropdownMenuItem 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50"
        >
          <Settings className="h-4 w-4 text-gray-400" />
          <span>Configurações</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
