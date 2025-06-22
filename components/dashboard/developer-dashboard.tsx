"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Calendar, Plus, Edit, Trash2, Save } from "lucide-react"
import type { Drink } from "../../app/page"
import type { EventTemplate } from "../../types/auth"

interface DeveloperDashboardProps {
  drinks: Drink[]
  onUpdateDrinks: (drinks: Drink[]) => void
  onClose: () => void
}

export function DeveloperDashboard({ drinks, onUpdateDrinks, onClose }: DeveloperDashboardProps) {
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null)
  const [eventTemplates, setEventTemplates] = useState<EventTemplate[]>([])
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "",
    estimatedPeople: 50,
    estimatedHours: 4,
    suggestedDrinks: [] as string[],
  })

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem("eventTemplates") || "[]")
    setEventTemplates(savedTemplates)
  }, [])

  const handleUpdateDrink = (updatedDrink: Drink) => {
    const updatedDrinks = drinks.map((drink) => (drink.id === updatedDrink.id ? updatedDrink : drink))
    onUpdateDrinks(updatedDrinks)
    setEditingDrink(null)
  }

  const handleDeleteDrink = (drinkId: string) => {
    const updatedDrinks = drinks.filter((drink) => drink.id !== drinkId)
    onUpdateDrinks(updatedDrinks)
  }

  const handleAddTemplate = () => {
    const template: EventTemplate = {
      id: `template-${Date.now()}`,
      ...newTemplate,
      createdBy: "developer",
      createdAt: new Date().toISOString(),
    }

    const updatedTemplates = [...eventTemplates, template]
    setEventTemplates(updatedTemplates)
    localStorage.setItem("eventTemplates", JSON.stringify(updatedTemplates))

    setNewTemplate({
      name: "",
      description: "",
      category: "",
      estimatedPeople: 50,
      estimatedHours: 4,
      suggestedDrinks: [],
    })
  }

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = eventTemplates.filter((t) => t.id !== templateId)
    setEventTemplates(updatedTemplates)
    localStorage.setItem("eventTemplates", JSON.stringify(updatedTemplates))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-purple-600" />
              <span>Dashboard Desenvolvedor</span>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </CardTitle>
          <CardDescription>Gerencie drinks e modelos de eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="drinks" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="drinks">Gerenciar Drinks</TabsTrigger>
              <TabsTrigger value="templates">Modelos de Eventos</TabsTrigger>
            </TabsList>

            <TabsContent value="drinks" className="space-y-6">
              <div className="grid gap-4">
                {drinks.map((drink) => (
                  <Card key={drink.id} className="p-4">
                    {editingDrink?.id === drink.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={editingDrink.name}
                              onChange={(e) =>
                                setEditingDrink((prev) => (prev ? { ...prev, name: e.target.value } : null))
                              }
                            />
                          </div>
                          <div>
                            <Label>Preço (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingDrink.price}
                              onChange={(e) =>
                                setEditingDrink((prev) =>
                                  prev ? { ...prev, price: Number.parseFloat(e.target.value) } : null,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Categoria</Label>
                            <Input
                              value={editingDrink.category}
                              onChange={(e) =>
                                setEditingDrink((prev) => (prev ? { ...prev, category: e.target.value } : null))
                              }
                            />
                          </div>
                          <div>
                            <Label>Tipo de Preço</Label>
                            <select
                              className="w-full p-2 border rounded"
                              value={editingDrink.priceType}
                              onChange={(e) =>
                                setEditingDrink((prev) =>
                                  prev ? { ...prev, priceType: e.target.value as "per_person" | "per_unit" } : null,
                                )
                              }
                            >
                              <option value="per_person">Por Pessoa</option>
                              <option value="per_unit">Por Unidade</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleUpdateDrink(editingDrink)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button variant="outline" onClick={() => setEditingDrink(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{drink.name}</h4>
                            <p className="text-sm text-gray-600">
                              R$ {drink.price.toFixed(2)} • {drink.category} •{" "}
                              {drink.priceType === "per_person" ? "Por pessoa" : "Por unidade"}
                            </p>
                          </div>
                          {drink.popular && <Badge className="bg-yellow-500">Popular</Badge>}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingDrink(drink)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDrink(drink.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Novo Modelo de Evento
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Nome do Evento</Label>
                    <Input
                      placeholder="Ex: Casamento Clássico"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      placeholder="Ex: Casamentos"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Descrição do evento..."
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Pessoas Estimadas</Label>
                    <Input
                      type="number"
                      value={newTemplate.estimatedPeople}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, estimatedPeople: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Horas Estimadas</Label>
                    <Input
                      type="number"
                      value={newTemplate.estimatedHours}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, estimatedHours: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddTemplate} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Modelo
                </Button>
              </Card>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Modelos Existentes
                </h3>
                {eventTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>👥 {template.estimatedPeople} pessoas</span>
                          <span>⏰ {template.estimatedHours}h</span>
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
