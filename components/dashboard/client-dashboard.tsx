"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Phone, Mail, CreditCard, Lock, Save, History } from "lucide-react"
import type { User as UserType, ClientProfile } from "../../types/auth"

interface ClientDashboardProps {
  user: UserType
  onClose: () => void
}

export function ClientDashboard({ user, onClose }: ClientDashboardProps) {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [orderHistory, setOrderHistory] = useState<any[]>([])

  useEffect(() => {
    // Carregar perfil do cliente
    const profiles = JSON.parse(localStorage.getItem("clientProfiles") || "[]")
    const userProfile = profiles.find((p: ClientProfile) => p.id === user.id)
    if (userProfile) {
      setProfile(userProfile)
    }

    // Carregar histórico de pedidos (simulado)
    const history = JSON.parse(localStorage.getItem(`orders_${user.id}`) || "[]")
    setOrderHistory(history)
  }, [user.id])

  const handleUpdateProfile = () => {
    if (!profile) return

    const profiles = JSON.parse(localStorage.getItem("clientProfiles") || "[]")
    const updatedProfiles = profiles.map((p: ClientProfile) => (p.id === profile.id ? profile : p))
    localStorage.setItem("clientProfiles", JSON.stringify(updatedProfiles))
    alert("Perfil atualizado com sucesso!")
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p>Carregando perfil...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-purple-600" />
              <span>Meu Perfil</span>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </CardTitle>
          <CardDescription>Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="protected">Dados Protegidos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Idade</Label>
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile((prev) => (prev ? { ...prev, age: Number.parseInt(e.target.value) } : null))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={profile.phone}
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={profile.address.street}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: { ...prev.address, street: e.target.value },
                            }
                          : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={profile.address.city}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: { ...prev.address, city: e.target.value },
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    value={profile.address.state}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: { ...prev.address, state: e.target.value },
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>CEP</Label>
                  <Input
                    value={profile.address.zipCode}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: { ...prev.address, zipCode: e.target.value },
                            }
                          : null,
                      )
                    }
                  />
                </div>
              </div>

              <Button onClick={handleUpdateProfile} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </TabsContent>

            <TabsContent value="protected" className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Dados Protegidos</h3>
                </div>
                <p className="text-sm text-yellow-700">
                  Estas informações são confidenciais e não são compartilhadas com o proprietário.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>CPF</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="000.000.000-00"
                      value={profile.protectedData.cpf || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                protectedData: { ...prev.protectedData, cpf: e.target.value },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Conta Bancária</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="Banco - Agência - Conta"
                      value={profile.protectedData.bankAccount || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                protectedData: { ...prev.protectedData, bankAccount: e.target.value },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Cartão de Crédito</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="**** **** **** ****"
                      value={profile.protectedData.creditCard || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                protectedData: { ...prev.protectedData, creditCard: e.target.value },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateProfile} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar Dados Protegidos
              </Button>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <History className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Histórico de Orçamentos</h3>
              </div>

              {orderHistory.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">Nenhum orçamento solicitado ainda.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((order, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Orçamento #{order.id.split("-")[1]}</h4>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">R$ {order.total}</p>
                          <Badge variant={order.status === "Pendente" ? "outline" : "secondary"}>{order.status}</Badge>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between">
                          <span>Modo:</span>
                          <span className="font-medium">
                            {order.details?.mode === "drinkeira" ? "Drinkeira" : "Pré-compra"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pessoas:</span>
                          <span className="font-medium">{order.details?.people}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duração:</span>
                          <span className="font-medium">{order.details?.hours} horas</span>
                        </div>
                        {order.details?.mode === "drinkeira" && (
                          <div className="flex justify-between">
                            <span>Bartenders:</span>
                            <span className="font-medium">{order.details?.bartenders}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
