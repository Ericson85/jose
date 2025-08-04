"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wine, Plus, Edit, Trash2, Upload, X, Save, Image as ImageIcon, Lock, Eye, EyeOff, AlertCircle, LogOut, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export interface Drink {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  priceType: "per_person" | "per_unit"
  popular?: boolean
  premium?: boolean
}

export default function ProprietarioPage() {
  console.log("Painel do Proprietário renderizado");
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [drinks, setDrinks] = useState<Drink[]>([])
  
  // Panel states
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")
  const [drinkToDelete, setDrinkToDelete] = useState<Drink | null>(null);
  // Adicionar novo estado para controlar o Dialog de confirmação de adição
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  const categories = ["Coquetéis", "Cervejas", "Vinhos", "Não Alcoólicos", "Open Bar"]

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem("tenderes_admin_token")
    if (token !== "authenticated") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  // Load drinks from API (com polling)
  useEffect(() => {
    let isMounted = true;
    async function fetchDrinks() {
      try {
        const response = await fetch("/api/drinks");
        const data = await response.json();
        if (isMounted) setDrinks(data);
      } catch (error) {
        showMessage("Erro ao carregar drinks!", "error");
      }
    }
    fetchDrinks();
    const interval = setInterval(fetchDrinks, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const showMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("tenderes_admin_token")
    router.push("/admin")
    showMessage("Logout realizado com sucesso!", "info")
  }

  const handleAddNew = () => {
    console.log("handleAddNew chamado");
    const newDrink: Omit<Drink, 'id'> = {
      name: "",
      description: "",
      price: 0,
      category: "Coquetéis",
      image: "/placeholder.svg?height=120&width=120",
      priceType: "per_person",
      popular: false,
      premium: false
    };
    setEditingDrink(newDrink as Drink);
    setIsAddingNew(true);
  };

  const handleEdit = (drink: Drink) => {
    setEditingDrink({ ...drink })
    setIsAddingNew(false)
  }

  const handleDelete = async (drinkId: string) => {
    console.log("Tentando remover drink, id recebido:", drinkId);
    try {
      await fetch(`/api/drinks/${drinkId}`, { method: "DELETE" });
      // Recarregar lista de drinks do banco
      const response = await fetch("/api/drinks");
      const data = await response.json();
      setDrinks(data);
      showMessage("Drink removido com sucesso!", "success");
    } catch (error) {
      showMessage("Erro ao remover drink!", "error");
    }
  };

  const handleSave = async () => {
    console.log("handleSave chamado", editingDrink);
    if (!editingDrink) return;

    if (!editingDrink.name.trim() || editingDrink.price <= 0) {
      showMessage("Preencha todos os campos obrigatórios!", "error");
      return;
    }
    if (!editingDrink.priceType) {
      showMessage("Selecione o tipo de preço!", "error");
      return;
    }

    try {
      if (isAddingNew) {
        // Montar payload explicitamente, apenas com campos válidos
        const payload = {
          name: editingDrink.name,
          price: editingDrink.price,
          category: editingDrink.category,
          image: editingDrink.image,
          price_type: editingDrink.priceType, // snake_case
          popular: editingDrink.popular,
          description: editingDrink.description,
          premium: editingDrink.premium,
        };
        console.log("Payload FINAL enviado para API:", JSON.stringify(payload, null, 2));
        await fetch("/api/drinks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        showMessage("Drink adicionado com sucesso!", "success");
      } else {
        await fetch(`/api/drinks/${editingDrink.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingDrink)
        });
        showMessage("Drink atualizado com sucesso!", "success");
      }
      // Recarregar lista de drinks
      const response = await fetch("/api/drinks");
      const data = await response.json();
      setDrinks(data);
      localStorage.setItem("tenderes_drinks", JSON.stringify(data));
      setEditingDrink(null);
      setIsAddingNew(false);
    } catch (error) {
      showMessage("Erro ao salvar drink!", "error");
    }
  };

  const handleCancel = () => {
    setEditingDrink(null)
    setIsAddingNew(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingDrink) {
      // Verificar formato do arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showMessage("Formato não suportado! Use apenas JPG, PNG ou WebP.", "error");
        return;
      }

      // Verificar tamanho do arquivo (máximo 50MB - será redimensionado automaticamente)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        showMessage(`A imagem deve ter no máximo 50MB! Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`, "error");
        return;
      }

      // Fazer upload diretamente - o servidor vai redimensionar automaticamente
      uploadImage(file);
    }
  }

  const uploadImage = async (file: File) => {
    try {
      console.log('Iniciando upload da imagem:', file.name, file.size, file.type);
      
      // Criar FormData para upload
      const formData = new FormData();
      formData.append('image', file);

      // Fazer upload da imagem
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Resposta do upload:', result);

      if (result.success) {
        console.log('Imagem salva com URL:', result.imageUrl);
        setEditingDrink(prev => prev ? { ...prev, image: result.imageUrl } : null);
        showMessage("Imagem enviada com sucesso!", "success");
      } else {
        console.error('Erro no upload:', result.error);
        showMessage(result.error || "Erro ao enviar imagem!", "error");
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      showMessage("Erro ao enviar imagem!", "error");
    }
  }

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Admin Panel
  useEffect(() => {
    if (editingDrink) {
      console.log("Renderizando formulário de edição/adicionar", editingDrink);
    }
  }, [editingDrink]);
  console.log("Renderizando lista de drinks:", drinks);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Wine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Painel do Proprietário</h1>
                <p className="text-gray-300">Gerenciamento Completo de Drinks</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                Ver Site
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-600 text-red-300 hover:bg-red-900/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* Drinks List */}
          <div className="xl:col-span-3 lg:col-span-2">
            <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Drinks Cadastrados</CardTitle>
                    <CardDescription className="text-gray-300">
                      Gerencie todos os drinks do site
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddNew}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Drink
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drinks.map((drink) => (
                    <Card key={drink.id} className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                            <Wine className="h-6 w-6 text-purple-300" />
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
                              onClick={() => setDrinkToDelete(drink)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-300 hover:bg-red-900/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-semibold text-white mb-2">{drink.name}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">
                            {drink.category}
                          </Badge>
                          <Badge className="bg-blue-900/50 text-blue-200 border-blue-700/50 text-xs">
                            R$ {drink.price}
                          </Badge>
                        </div>
                        {drink.popular && (
                          <Badge className="bg-yellow-900/50 text-yellow-200 border-yellow-700/50 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="xl:col-span-1 lg:col-span-1">
            <Card className="sticky top-8 bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {editingDrink ? (isAddingNew ? "Adicionar Drink" : "Editar Drink") : "Formulário"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingDrink ? (
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

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Descrição
                      </Label>
                      <Input
                        value={editingDrink.description}
                        onChange={(e) => setEditingDrink(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Ex: Tradicional caipirinha brasileira"
                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

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
                      <div className="text-xs text-gray-400 mb-2 p-2 bg-gray-800/50 rounded border border-gray-600">
                        <strong>Requisitos da imagem:</strong><br/>
                        • Formatos: JPG, PNG ou WebP<br/>
                        • Tamanho máximo: 50MB (será otimizado automaticamente)<br/>
                        • Dimensões: Qualquer tamanho (será redimensionado para 800x600px)<br/>
                        • Proporção: Qualquer (será ajustada automaticamente)<br/>
                        • <strong>✅ Suporte total a qualquer imagem!</strong>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                          {editingDrink.image && editingDrink.image !== "/placeholder.svg?height=120&width=120" ? (
                            <img 
                              src={editingDrink.image} 
                              alt={editingDrink.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-purple-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="border-gray-600 bg-gray-700 text-white file:bg-purple-600 file:border-0 file:text-white file:rounded file:px-3 file:py-1 text-xs"
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

                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={editingDrink.premium}
                        onCheckedChange={(checked) => setEditingDrink(prev => prev ? { ...prev, premium: checked } : null)}
                      />
                      <Label className="text-sm font-medium text-gray-200">
                        Marcar como Premium
                      </Label>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => { console.log('Botão Salvar clicado'); setShowAddConfirm(true); }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wine className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Selecione um drink para editar ou clique em "Novo Drink"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
          toastType === "success" 
            ? "bg-green-900/90 border-green-600 text-green-200" 
            : toastType === "error"
            ? "bg-red-900/90 border-red-600 text-red-200"
            : "bg-blue-900/90 border-blue-600 text-blue-200"
        }`}>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {drinkToDelete && (
        <Dialog open={!!drinkToDelete} onOpenChange={() => setDrinkToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar remoção</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover o drink <b>{drinkToDelete.name}</b>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDrinkToDelete(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => {
                  handleDelete(drinkToDelete.id);
                  setDrinkToDelete(null);
                }}
              >
                Remover
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAddConfirm && (
        <Dialog open={showAddConfirm} onOpenChange={setShowAddConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar adição</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja adicionar o drink <b>{editingDrink?.name}</b>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddConfirm(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-green-600 text-white"
                onClick={async () => {
                  setShowAddConfirm(false);
                  await handleSave();
                }}
              >
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 