"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Phone, Mail, Calendar, Shield } from "lucide-react"
import type { ClientProfile } from "../../types/auth"

interface OwnerDashboardProps {
  onClose: () => void
}

export function OwnerDashboard({ onClose }: OwnerDashboardProps) {
  const [clients, setClients] = useState<ClientProfile[]>([])

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("clientProfiles") || "[]")
    setClients(profiles)
  }, [])

  // Função para obter apenas dados não protegidos
  const getPublicData = (client: ClientProfile) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    age: client.age,
    address: client.address,
    preferences: client.preferences,
    createdAt: client.createdAt,
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span>Dashboard Proprietário</span>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </CardTitle>
          <CardDescription>Visualize dados dos clientes (dados protegidos não são exibidos)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Proteção de Dados</h3>
            </div>
            <p className="text-sm text-green-700">
              Por segurança, dados bancários, CPF e cartões de crédito não são exibidos nesta interface.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Clientes Cadastrados</h3>
              <Badge variant="secondary">{clients.length} clientes</Badge>
            </div>

            {clients.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {clients.map((client) => {
                  const publicData = getPublicData(client)
                  return (
                    <Card key={client.id} className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg flex items-center space-x-2">
                              <Users className="h-5 w-5 text-purple-600" />
                              <span>{publicData.name}</span>
                            </h4>
                            <p className="text-sm text-gray-600">
                              Cadastrado em {new Date(publicData.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{publicData.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{publicData.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{publicData.age} anos</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium flex items-center space-x-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>Endereço</span>
                            </h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{publicData.address.street}</p>
                              <p>
                                {publicData.address.city}, {publicData.address.state}
                              </p>
                              <p>CEP: {publicData.address.zipCode}</p>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Preferências</h5>
                            <div className="text-sm text-gray-600">
                              {publicData.preferences.favoriteEvents.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {publicData.preferences.favoriteEvents.map((event, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {event}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400">Nenhuma preferência definida</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Shield className="h-3 w-3" />
                          <span>Dados protegidos (CPF, conta bancária, cartão) não são exibidos</span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
