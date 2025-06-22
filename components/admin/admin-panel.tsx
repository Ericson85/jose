"use client"

import { useState, useEffect } from "react"
import { Wine, Plus, Edit, Trash2, Upload, X, Save, Image as ImageIcon, DollarSign, Tag, Star } from "lucide-react"
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

  const categories = ["Coquetéis", "Cervejas", "Vinhos", "Não Alcoólicos", "Open Bar"]

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
              <p className="text-gray-300">Gerenciamento de Drinks</p>
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

        <div className="flex h-[calc(90vh-120px)]">
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