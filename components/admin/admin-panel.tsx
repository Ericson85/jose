"use client"

import { useState, useEffect } from "react"
import { Wine, Plus, Edit, Trash2, Upload, X, Save, Image as ImageIcon, DollarSign, Tag, Star, MapPin, Clock, Phone, Utensils, Music, Coffee, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export interface Drink {
  id: string
  name: string
  price: number
  category: string
  image: string
  priceType: "per_person" | "per_unit"
  popular?: boolean
}

export interface Establishment {
  id: string
  name: string
  type: "bar" | "boate" | "restaurante"
  category: string
  address: string
  phone: string
  description: string
  lat: number
  lng: number
  rating: number
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  specialties: string[]
  priceRange: "€" | "€€" | "€€€"
  menu: Array<{
    id: string
    name: string
    price: number
    description: string
    category: string
  }>
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  onDrinksUpdate: (drinks: Drink[]) => void
  currentDrinks: Drink[]
}

export default function AdminPanel({ isOpen, onClose, onDrinksUpdate, currentDrinks }: AdminPanelProps) {
  const [drinks, setDrinks] = useState<Drink[]>(currentDrinks)
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("success")
  
  // Estados para Rota da Caipirinha
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null)
  const [isAddingNewEstablishment, setIsAddingNewEstablishment] = useState(false)
  const [activeTab, setActiveTab] = useState<"drinks" | "rota-caipirinha">("drinks")

  const categories = ["Coquetéis", "Cervejas", "Vinhos", "Não Alcoólicos", "Open Bar"]
  const establishmentTypes = ["bar", "boate", "restaurante"]
  const priceRanges = ["€", "€€", "€€€"]

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 3000)
  }

  const handleAddNew = () => {
    const newDrink: Drink = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      category: "Coquetéis",
      image: "/placeholder.svg?height=120&width=120",
      priceType: "per_person",
      popular: false
    }
    setEditingDrink(newDrink)
    setIsAddingNew(true)
  }

  const handleEdit = (drink: Drink) => {
    setEditingDrink({ ...drink })
    setIsAddingNew(false)
  }

  const handleDelete = (drinkId: string) => {
    const updatedDrinks = drinks.filter(drink => drink.id !== drinkId)
    setDrinks(updatedDrinks)
    saveDrinks(updatedDrinks)
    showToast("Drink removido com sucesso!", "success")
  }

  const handleSave = () => {
    if (!editingDrink) return

    if (!editingDrink.name.trim() || editingDrink.price <= 0) {
      showToast("Preencha todos os campos obrigatórios!", "error")
      return
    }

    let updatedDrinks: Drink[]

    if (isAddingNew) {
      updatedDrinks = [...drinks, editingDrink]
    } else {
      updatedDrinks = drinks.map(drink => 
        drink.id === editingDrink.id ? editingDrink : drink
      )
    }

    setDrinks(updatedDrinks)
    saveDrinks(updatedDrinks)
    setEditingDrink(null)
    setIsAddingNew(false)
    showToast(
      isAddingNew ? "Drink adicionado com sucesso!" : "Drink atualizado com sucesso!", 
      "success"
    )
  }

  const handleCancel = () => {
    setEditingDrink(null)
    setIsAddingNew(false)
  }

  // Funções para gerenciar estabelecimentos
  const loadEstablishments = async () => {
    try {
      const response = await fetch('/api/establishments')
      const data = await response.json()
      if (data.success) {
        setEstablishments(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error)
    }
  }

  const handleAddNewEstablishment = () => {
    const newEstablishment: Establishment = {
      id: Date.now().toString(),
      name: "",
      type: "bar",
      category: "",
      address: "",
      phone: "",
      description: "",
      lat: -3.7319,
      lng: -38.5267,
      rating: 0,
      hours: {
        monday: "Fechado",
        tuesday: "Fechado", 
        wednesday: "Fechado",
        thursday: "Fechado",
        friday: "Fechado",
        saturday: "Fechado",
        sunday: "Fechado"
      },
      specialties: [],
      priceRange: "€",
      menu: [],
      images: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingEstablishment(newEstablishment)
    setIsAddingNewEstablishment(true)
  }

  const handleEditEstablishment = (establishment: Establishment) => {
    setEditingEstablishment(establishment)
    setIsAddingNewEstablishment(false)
  }

  const handleSaveEstablishment = async () => {
    if (!editingEstablishment) return

    try {
      const url = isAddingNewEstablishment ? '/api/establishments' : `/api/establishments/${editingEstablishment.id}`
      const method = isAddingNewEstablishment ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEstablishment)
      })

      const data = await response.json()

      if (data.success) {
        if (isAddingNewEstablishment) {
          setEstablishments(prev => [data.data, ...prev])
        } else {
          setEstablishments(prev => 
            prev.map(est => est.id === editingEstablishment.id ? data.data : est)
          )
        }
        setEditingEstablishment(null)
        setIsAddingNewEstablishment(false)
        showToast("Estabelecimento salvo com sucesso!")
      } else {
        showToast("Erro ao salvar estabelecimento", "error")
      }
    } catch (error) {
      console.error('Erro ao salvar estabelecimento:', error)
      showToast("Erro ao salvar estabelecimento", "error")
    }
  }

  const handleDeleteEstablishment = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este estabelecimento?")) return

    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setEstablishments(prev => prev.filter(est => est.id !== id))
        showToast("Estabelecimento excluído com sucesso!")
      } else {
        showToast("Erro ao excluir estabelecimento", "error")
      }
    } catch (error) {
      console.error('Erro ao excluir estabelecimento:', error)
      showToast("Erro ao excluir estabelecimento", "error")
    }
  }

  const handleCancelEstablishment = () => {
    setEditingEstablishment(null)
    setIsAddingNewEstablishment(false)
  }

  useEffect(() => {
    if (activeTab === "rota-caipirinha") {
      loadEstablishments()
    }
  }, [activeTab])

  const saveDrinks = (drinksToSave: Drink[]) => {
    // Salvar no localStorage
    localStorage.setItem("tenderes_drinks", JSON.stringify(drinksToSave))
    // Atualizar o componente pai
    onDrinksUpdate(drinksToSave)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingDrink) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setEditingDrink(prev => prev ? { ...prev, image: imageUrl } : null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("tenderes_admin_token")
    onClose()
    showToast("Logout realizado com sucesso!", "info")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-gray-800/95 backdrop-blur-md shadow-2xl border-0 rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
              <Wine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
              <p className="text-gray-300">Gerenciamento Completo - TENDERES v2.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-300 hover:bg-red-900/50"
            >
              Sair
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-0">
            <button
              onClick={() => setActiveTab("drinks")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "drinks"
                  ? "text-white border-b-2 border-red-500 bg-gray-700/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wine className="h-4 w-4" />
                <span>Drinks</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("rota-caipirinha")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "rota-caipirinha"
                  ? "text-white border-b-2 border-red-500 bg-gray-700/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Rota da Caipirinha</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-160px)]">
          {activeTab === "drinks" && (
            <>
              {/* Lista de Drinks */}
              <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Drinks Cadastrados</h3>
              <Button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Drink
              </Button>
            </div>

            <div className="space-y-4">
              {drinks.map((drink) => (
                <Card key={drink.id} className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                          <Wine className="h-6 w-6 text-purple-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{drink.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">
                              {drink.category}
                            </Badge>
                            <Badge className="bg-blue-900/50 text-blue-200 border-blue-700/50 text-xs">
                              R$ {drink.price}
                            </Badge>
                            {drink.popular && (
                              <Badge className="bg-yellow-900/50 text-yellow-200 border-yellow-700/50 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleEdit(drink)}
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(drink.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-300 hover:bg-red-900/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulário de Edição */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {editingDrink ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {isAddingNew ? "Adicionar Novo Drink" : "Editar Drink"}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-200">
                      Nome do Drink
                    </Label>
                    <Input
                      value={editingDrink.name}
                      onChange={(e) => setEditingDrink(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="Ex: Caipirinha Premium"
                      className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Categoria
                      </Label>
                      <Select
                        value={editingDrink.category}
                        onValueChange={(value) => setEditingDrink(prev => prev ? { ...prev, category: value } : null)}
                      >
                        <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-white">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Preço (R$)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingDrink.price}
                        onChange={(e) => setEditingDrink(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                        placeholder="0.00"
                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-200">
                      Tipo de Preço
                    </Label>
                    <Select
                      value={editingDrink.priceType}
                      onValueChange={(value: "per_person" | "per_unit") => setEditingDrink(prev => prev ? { ...prev, priceType: value } : null)}
                    >
                      <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="per_person" className="text-white">
                          Por pessoa
                        </SelectItem>
                        <SelectItem value="per_unit" className="text-white">
                          Por unidade
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-200">
                      Imagem do Drink
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {editingDrink.image && editingDrink.image !== "/placeholder.svg?height=120&width=120" ? (
                          <img 
                            src={editingDrink.image} 
                            alt={editingDrink.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-purple-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="border-gray-600 bg-gray-700 text-white file:bg-purple-600 file:border-0 file:text-white file:rounded file:px-3 file:py-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={editingDrink.popular}
                      onCheckedChange={(checked) => setEditingDrink(prev => prev ? { ...prev, popular: checked } : null)}
                    />
                    <Label className="text-sm font-medium text-gray-200">
                      Marcar como Popular
                    </Label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Wine className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Selecione um drink para editar
                  </h3>
                  <p className="text-gray-500">
                    Ou clique em "Novo Drink" para adicionar um novo item
                  </p>
                </div>
              </div>
            )}
              </div>
            </>
          )}

          {activeTab === "rota-caipirinha" && (
            <>
              {/* Lista de Estabelecimentos */}
              <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Estabelecimentos</h3>
                  <Button
                    onClick={handleAddNewEstablishment}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Estabelecimento
                  </Button>
                </div>

                <div className="space-y-4">
                  {establishments.map((establishment) => (
                    <Card key={establishment.id} className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                              {establishment.type === "bar" && <Utensils className="h-6 w-6 text-purple-400" />}
                              {establishment.type === "boate" && <Music className="h-6 w-6 text-pink-400" />}
                              {establishment.type === "restaurante" && <Coffee className="h-6 w-6 text-orange-400" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{establishment.name}</h4>
                              <p className="text-sm text-gray-400">{establishment.address}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {establishment.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {establishment.priceRange}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEditEstablishment(establishment)}
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-300 hover:bg-blue-900/50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteEstablishment(establishment.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-300 hover:bg-red-900/50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Formulário de Edição de Estabelecimentos */}
              <div className="w-1/2 p-6 overflow-y-auto">
                {editingEstablishment ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        {isAddingNewEstablishment ? "Adicionar Estabelecimento" : "Editar Estabelecimento"}
                      </h3>
                      <Button
                        onClick={handleCancelEstablishment}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-200">Nome</Label>
                          <Input
                            value={editingEstablishment.name}
                            onChange={(e) => setEditingEstablishment(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="border-gray-600 bg-gray-700 text-white"
                            placeholder="Nome do estabelecimento"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-200">Tipo</Label>
                          <Select
                            value={editingEstablishment.type}
                            onValueChange={(value: "bar" | "boate" | "restaurante") => 
                              setEditingEstablishment(prev => prev ? { ...prev, type: value } : null)
                            }
                          >
                            <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="bar" className="text-white">Bar</SelectItem>
                              <SelectItem value="boate" className="text-white">Boate</SelectItem>
                              <SelectItem value="restaurante" className="text-white">Restaurante</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-200">Endereço</Label>
                        <Input
                          value={editingEstablishment.address}
                          onChange={(e) => setEditingEstablishment(prev => prev ? { ...prev, address: e.target.value } : null)}
                          className="border-gray-600 bg-gray-700 text-white"
                          placeholder="Endereço completo"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-200">Telefone</Label>
                          <Input
                            value={editingEstablishment.phone}
                            onChange={(e) => setEditingEstablishment(prev => prev ? { ...prev, phone: e.target.value } : null)}
                            className="border-gray-600 bg-gray-700 text-white"
                            placeholder="(85) 99999-9999"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-200">Faixa de Preço</Label>
                          <Select
                            value={editingEstablishment.priceRange}
                            onValueChange={(value: "€" | "€€" | "€€€") => 
                              setEditingEstablishment(prev => prev ? { ...prev, priceRange: value } : null)
                            }
                          >
                            <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="€" className="text-white">€ - Econômico</SelectItem>
                              <SelectItem value="€€" className="text-white">€€ - Médio</SelectItem>
                              <SelectItem value="€€€" className="text-white">€€€ - Alto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-200">Descrição</Label>
                        <textarea
                          value={editingEstablishment.description}
                          onChange={(e) => setEditingEstablishment(prev => prev ? { ...prev, description: e.target.value } : null)}
                          className="w-full h-24 border border-gray-600 bg-gray-700 text-white rounded-md px-3 py-2"
                          placeholder="Descrição do estabelecimento"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-200">Latitude</Label>
                          <Input
                            type="number"
                            step="any"
                            value={editingEstablishment.lat}
                            onChange={(e) => setEditingEstablishment(prev => prev ? { ...prev, lat: parseFloat(e.target.value) || 0 } : null)}
                            className="border-gray-600 bg-gray-700 text-white"
                            placeholder="-3.7319"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-200">Longitude</Label>
                          <Input
                            type="number"
                            step="any"
                            value={editingEstablishment.lng}
                            onChange={(e) => setEditingEstablishment(prev => prev ? { ...prev, lng: parseFloat(e.target.value) || 0 } : null)}
                            className="border-gray-600 bg-gray-700 text-white"
                            placeholder="-38.5267"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-200 mb-3 block">Horários de Funcionamento</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-400">Segunda-feira</Label>
                            <Input
                              value={editingEstablishment.hours.monday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, monday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="18:00 - 02:00"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Terça-feira</Label>
                            <Input
                              value={editingEstablishment.hours.tuesday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, tuesday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="18:00 - 02:00"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Quarta-feira</Label>
                            <Input
                              value={editingEstablishment.hours.wednesday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, wednesday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="18:00 - 02:00"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Quinta-feira</Label>
                            <Input
                              value={editingEstablishment.hours.thursday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, thursday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="18:00 - 02:00"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Sexta-feira</Label>
                            <Input
                              value={editingEstablishment.hours.friday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, friday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="18:00 - 03:00"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Sábado</Label>
                            <Input
                              value={editingEstablishment.hours.saturday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, saturday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="18:00 - 03:00"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Domingo</Label>
                            <Input
                              value={editingEstablishment.hours.sunday}
                              onChange={(e) => setEditingEstablishment(prev => prev ? { 
                                ...prev, 
                                hours: { ...prev.hours, sunday: e.target.value }
                              } : null)}
                              className="border-gray-600 bg-gray-700 text-white text-sm"
                              placeholder="Fechado"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={editingEstablishment.isActive}
                          onCheckedChange={(checked) => setEditingEstablishment(prev => prev ? { ...prev, isActive: checked } : null)}
                        />
                        <Label className="text-sm font-medium text-gray-200">
                          Estabelecimento Ativo
                        </Label>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={handleSaveEstablishment}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isAddingNewEstablishment ? "Adicionar" : "Salvar"}
                        </Button>
                        <Button
                          onClick={handleCancelEstablishment}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        Selecione um estabelecimento para editar
                      </h3>
                      <p className="text-gray-500">
                        Ou clique em "Novo Estabelecimento" para adicionar um novo item
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {showFeedback && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
          feedbackType === "success" 
            ? "bg-green-900/90 border-green-600 text-green-200" 
            : feedbackType === "error"
            ? "bg-red-900/90 border-red-600 text-red-200"
            : "bg-blue-900/90 border-blue-600 text-blue-200"
        }`}>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{feedbackMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
} 