"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Mail } from "lucide-react"
import type { User as UserType } from "../../types/auth"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: UserType) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simular autenticação
    let user: UserType

    if (loginData.email === "dev@tenderes.com" && loginData.password === "dev123") {
      user = {
        id: "dev-1",
        email: loginData.email,
        name: "Desenvolvedor",
        role: "developer",
        createdAt: new Date().toISOString(),
      }
    } else if (loginData.email === "owner@tenderes.com" && loginData.password === "owner123") {
      user = {
        id: "owner-1",
        email: loginData.email,
        name: "Proprietário",
        role: "owner",
        createdAt: new Date().toISOString(),
      }
    } else {
      // Cliente genérico
      user = {
        id: `client-${Date.now()}`,
        email: loginData.email,
        name: "Cliente",
        role: "client",
        createdAt: new Date().toISOString(),
      }
    }

    onLogin(user)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full bg-white/95 backdrop-blur-md shadow-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <User className="h-6 w-6 text-purple-600" />
            <span>Acesso TENDERES</span>
          </CardTitle>
          <CardDescription>Entre para solicitar orçamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <strong>Desenvolvedor:</strong> dev@tenderes.com / dev123
              </p>
              <p>
                <strong>Proprietário:</strong> owner@tenderes.com / owner123
              </p>
              <p>
                <strong>Cliente:</strong> qualquer email
              </p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 text-center">
                <strong>Importante:</strong> Apenas usuários autorizados podem solicitar orçamentos.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                Entrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
