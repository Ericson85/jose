"use client"

import { useState } from "react"
import { Wine, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (success: boolean) => void
}

export default function AdminLoginModal({ isOpen, onClose, onLogin }: AdminLoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("Tentativa de login:", { username, password })

    // Verificação imediata das credenciais
    if (
      (username === "admin" && password === "tenderes2024") ||
      (username === "Negodramar21@" && password === "Jose2121@")
    ) {
      console.log("Credenciais válidas!")
      localStorage.setItem("tenderes_admin_token", "authenticated")
      onLogin(true)
      setError("")
    } else {
      console.log("Credenciais inválidas!")
      setError("Credenciais inválidas. Tente novamente.")
      onLogin(false)
    }
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <Card className="max-w-md w-full bg-gray-800/95 backdrop-blur-md shadow-2xl border-2 border-purple-500">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Wine className="h-12 w-12 text-purple-400" />
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-white">
            Área Administrativa
          </CardTitle>
          <CardDescription className="text-gray-300">
            Acesso restrito ao proprietário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                Usuário
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite o usuário"
                className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400 placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400 placeholder-gray-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-gray-600/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-900/50 rounded-lg border border-red-700/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-200">{error}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Entrar</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 