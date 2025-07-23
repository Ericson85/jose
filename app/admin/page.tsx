"use client"

import { useState, useEffect } from "react"
import { Wine, Plus, Edit, Trash2, Upload, X, Save, Image as ImageIcon, Lock, Eye, EyeOff, AlertCircle, LogOut, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
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

export interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  maxGuests: number
  drinks: string[]
  status: "active" | "inactive" | "completed"
  createdAt: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<'drinks' | 'events' | 'dashboard' | 'plans' | 'drinkeira'>('dashboard')
  
  // Login states
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  
  // Panel states
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")
  const [drinkToDelete, setDrinkToDelete] = useState<Drink | null>(null);

  // Estados para Planos
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', description: '', id: null });
  const [editingPlan, setEditingPlan] = useState(null);

  // Estados para Drinkeira
  const [drinkeiraConfig, setDrinkeiraConfig] = useState({ ativo: false, valor: '', descricao: '', drinks: [] });
  const [loadingDrinkeira, setLoadingDrinkeira] = useState(false);

  // Novo estado para drinks do modo drinkeira
  const [drinkeiraDrinks, setDrinkeiraDrinks] = useState<Drink[]>([]);
  const [loadingDrinkeiraDrinks, setLoadingDrinkeiraDrinks] = useState(false);
  const [editingDrinkeiraDrink, setEditingDrinkeiraDrink] = useState<Drink | null>(null);
  const [isAddingNewDrinkeira, setIsAddingNewDrinkeira] = useState(false);
  const [drinkeiraDrinkToDelete, setDrinkeiraDrinkToDelete] = useState<Drink | null>(null);

  const categories = ["Coquetéis", "Cervejas", "Vinhos", "Não Alcoólicos", "Open Bar", "Caipirinha", "Caipiroska", "Clássico"]
  const eventStatuses = ["active", "inactive", "completed"]

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem("tenderes_admin_token")
    if (token === "authenticated") {
      setIsLoggedIn(true)
    }
  }, [])

  // Load drinks and events
  useEffect(() => {
    async function fetchDrinks() {
      try {
        const response = await fetch("/api/drinks");
        const data = await response.json();
        setDrinks(data);
      } catch (error) {
        showMessage("Erro ao carregar drinks!", "error");
      }
    }
    fetchDrinks();

    // Eventos continuam no localStorage
    const savedEvents = localStorage.getItem("tenderes_events");
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error("Error loading events:", error);
      }
    }
  }, []);

  // Buscar planos ao abrir aba
  useEffect(() => {
    if (activeTab === 'plans') fetchPlans();
  }, [activeTab]);

  async function fetchPlans() {
    setLoadingPlans(true);
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      setPlans(data);
    } finally {
      setLoadingPlans(false);
    }
  }

  async function handleCreatePlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: planForm.name, description: planForm.description }),
    });
    setPlanForm({ name: '', description: '', id: null });
    fetchPlans();
  }

  async function handleEditPlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch(`/api/plans/${planForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: planForm.name, description: planForm.description }),
    });
    setPlanForm({ name: '', description: '', id: null });
    setEditingPlan(null);
    fetchPlans();
  }

  function startEditPlan(plan: any) {
    setPlanForm({ name: plan.name, description: plan.description, id: plan.id });
    setEditingPlan(plan.id);
  }

  async function handleDeletePlan(id: number) {
    await fetch(`/api/plans/${id}`, { method: 'DELETE' });
    fetchPlans();
  }

  // Buscar config drinkeira ao abrir aba
  useEffect(() => {
    if (activeTab === 'drinkeira') fetchDrinkeiraConfig();
  }, [activeTab]);

  async function fetchDrinkeiraConfig() {
    setLoadingDrinkeira(true);
    try {
      const res = await fetch('/api/drinkeira');
      const data = await res.json();
      setDrinkeiraConfig({
        ativo: !!data.ativo,
        valor: data.valor || '',
        descricao: data.descricao || '',
        drinks: data.drinks ? data.drinks.split(',').map(Number).filter(Boolean) : [],
      });
    } finally {
      setLoadingDrinkeira(false);
    }
  }

  async function handleSaveDrinkeira(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch('/api/drinkeira', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drinkeiraConfig),
    });
    fetchDrinkeiraConfig();
  }

  // Buscar drinks do modo drinkeira ao abrir aba
  useEffect(() => {
    if (activeTab === 'drinkeira') fetchDrinkeiraDrinks();
  }, [activeTab]);

  async function fetchDrinkeiraDrinks() {
    setLoadingDrinkeiraDrinks(true);
    try {
      const res = await fetch('/api/drinkeira/drinks');
      const data = await res.json();
      setDrinkeiraDrinks(data);
    } finally {
      setLoadingDrinkeiraDrinks(false);
    }
  }

  async function handleSaveDrinkeiraDrink() {
    if (!editingDrinkeiraDrink) return;
    if (!editingDrinkeiraDrink.name.trim() || editingDrinkeiraDrink.price <= 0) {
      showMessage('Preencha todos os campos obrigatórios!', 'error');
      return;
    }
    try {
      if (isAddingNewDrinkeira) {
        const { id, ...payload } = editingDrinkeiraDrink;
        await fetch('/api/drinkeira/drinks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showMessage('Drink adicionado com sucesso!', 'success');
      } else {
        await fetch(`/api/drinkeira/drinks/${editingDrinkeiraDrink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingDrinkeiraDrink)
        });
        showMessage('Drink atualizado com sucesso!', 'success');
      }
      fetchDrinkeiraDrinks();
      setEditingDrinkeiraDrink(null);
      setIsAddingNewDrinkeira(false);
    } catch (error) {
      showMessage('Erro ao salvar drink!', 'error');
    }
  }

  async function handleDeleteDrinkeiraDrink(id: string) {
    try {
      await fetch(`/api/drinkeira/drinks/${id}`, { method: 'DELETE' });
      fetchDrinkeiraDrinks();
      showMessage('Drink removido com sucesso!', 'success');
    } catch (error) {
      showMessage('Erro ao remover drink!', 'error');
    }
  }

  function handleAddNewDrinkeiraDrink() {
    setEditingDrinkeiraDrink({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      category: 'Caipirinha',
      image: '/placeholder.svg?height=120&width=120',
      priceType: 'per_unit',
      popular: false,
      premium: false
    });
    setIsAddingNewDrinkeira(true);
  }

  function handleEditDrinkeiraDrink(drink: Drink) {
    setEditingDrinkeiraDrink({ ...drink });
    setIsAddingNewDrinkeira(false);
  }

  function handleCancelDrinkeiraDrink() {
    setEditingDrinkeiraDrink(null);
    setIsAddingNewDrinkeira(false);
  }

  const showMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    console.log("Login attempt:", { password })

    if (password === "18521852") {
      console.log("Login successful!")
      localStorage.setItem("tenderes_admin_token", "authenticated")
      setIsLoggedIn(true)
      showMessage("Login realizado com sucesso!", "success")
    } else {
      console.log("Login failed!")
      setLoginError("Palavra-chave incorreta. Tente novamente.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("tenderes_admin_token")
    setIsLoggedIn(false)
    setPassword("")
    showMessage("Logout realizado com sucesso!", "info")
  }

  const handleAddNew = () => {
    if (activeTab === 'drinks') {
    const newDrink: Drink = {
      id: Date.now().toString(),
      name: "",
        description: "",
      price: 0,
      category: "Coquetéis",
      image: "/placeholder.svg?height=120&width=120",
      priceType: "per_person",
        popular: false,
        premium: false
    }
    setEditingDrink(newDrink)
      setEditingEvent(null)
    } else if (activeTab === 'events') {
      const newEvent: Event = {
        id: Date.now().toString(),
        name: "",
        description: "",
        date: "",
        location: "",
        maxGuests: 0,
        drinks: [],
        status: "active",
        createdAt: new Date().toISOString()
      }
      setEditingEvent(newEvent)
      setEditingDrink(null)
    }
    setIsAddingNew(true)
  }

  const handleEdit = (item: Drink | Event) => {
    if (activeTab === 'drinks') {
      setEditingDrink({ ...item as Drink })
      setEditingEvent(null)
    } else if (activeTab === 'events') {
      setEditingEvent({ ...item as Event })
      setEditingDrink(null)
    }
    setIsAddingNew(false)
  }

  const handleDelete = async (id: string) => {
    if (activeTab === 'drinks') {
      try {
        await fetch(`/api/drinks/${id}`, { method: "DELETE" });
        // Recarregar lista de drinks
        const response = await fetch("/api/drinks");
        const data = await response.json();
        setDrinks(data);
        showMessage("Drink removido com sucesso!", "success");
      } catch (error) {
        showMessage("Erro ao remover drink!", "error");
      }
    } else if (activeTab === 'events') {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem("tenderes_events", JSON.stringify(updatedEvents));
      showMessage("Evento removido com sucesso!", "success");
    }
  };

  const handleSave = async () => {
    if (activeTab === 'drinks' && editingDrink) {
    if (!editingDrink.name.trim() || editingDrink.price <= 0) {
      showMessage("Preencha todos os campos obrigatórios!", "error");
      return;
    }
    try {
      if (isAddingNew) {
        // Não envie o campo id ao adicionar
        const { id, ...payload } = editingDrink;
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
      setEditingDrink(null);
      setIsAddingNew(false);
    } catch (error) {
      showMessage("Erro ao salvar drink!", "error");
    }
  } else if (activeTab === 'events' && editingEvent) {
    if (!editingEvent.name.trim() || !editingEvent.date || !editingEvent.location) {
      showMessage("Preencha todos os campos obrigatórios!", "error");
      return;
    }
    let updatedEvents: Event[];
    if (isAddingNew) {
      updatedEvents = [...events, editingEvent];
    } else {
      updatedEvents = events.map(event => event.id === editingEvent.id ? editingEvent : event);
    }
    setEvents(updatedEvents);
    localStorage.setItem("tenderes_events", JSON.stringify(updatedEvents));
    setEditingEvent(null);
    setIsAddingNew(false);
    showMessage(
      isAddingNew ? "Evento adicionado com sucesso!" : "Evento atualizado com sucesso!",
      "success"
    );
  }
};

  const handleCancel = () => {
    setEditingDrink(null)
    setEditingEvent(null)
    setIsAddingNew(false)
  }

  const handleResetDrinks = () => {
    const defaultDrinks: Drink[] = [
      { id: "1", name: "Caipirinha Premium", description: "Cachaça premium, limão tahiti, açúcar demerara", price: 12, category: "Coquetéis", image: "/caipirinha-premium.jpg", priceType: "per_person", popular: true, premium: true },
      { id: "caipirinha", name: "Caipirinha", description: "Cachaça, limão, açúcar e gelo", price: 12, category: "Coquetéis", image: "/caipirinha.jpg", priceType: "per_unit" },
      { id: "caipiroska", name: "Caipiroska", description: "Vodka, limão, açúcar e gelo", price: 12, category: "Coquetéis", image: "/caipiroska.jpg", priceType: "per_unit" },
      { id: "1a", name: "Open Bar Caipirinha", description: "Open bar completo com caipirinhas ilimitadas", price: 60, category: "Open Bar", image: "/open-bar-caipirinha.jpg", priceType: "per_person", popular: true },
      { id: "1b", name: "Open Bar Caipirinha + Caipiroska", description: "Open bar com caipirinhas e caipiroskas ilimitadas", price: 95, category: "Open Bar", image: "/open-bar-caipirinha-caipiroska.jpg", priceType: "per_person", popular: true },
      { id: "2", name: "Mojito", description: "Rum, hortelã, limão, açúcar e água com gás", price: 12, category: "Coquetéis", image: "/mojito.jpg", priceType: "per_person" },
      { id: "3", name: "Cuba Libre", description: "Rum, cola, limão e gelo", price: 12, category: "Coquetéis", image: "/cupa-livre.jpg", priceType: "per_person" },
      { id: "aperol-spritz", name: "Aperol Spritz", description: "Aperol, prosecco, água com gás e laranja", price: 12, category: "Coquetéis", image: "/aperol-spritz.jpg", priceType: "per_person" },
      { id: "4", name: "Gin Tônica", description: "Gin, água tônica, limão e especiarias", price: 12, category: "Coquetéis", image: "/gin-tonica.jpg", priceType: "per_person" },
      { id: "5", name: "Cerveja Artesanal", description: "Cerveja artesanal premium", price: 12, category: "Cervejas", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      { id: "6", name: "Cerveja Premium", description: "Cerveja premium importada", price: 12, category: "Cervejas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      { id: "7", name: "Vinho Tinto", description: "Vinho tinto seco premium", price: 12, category: "Vinhos", image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad04?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      { id: "8", name: "Vinho Branco", description: "Vinho branco seco premium", price: 12, category: "Vinhos", image: "https://images.unsplash.com/photo-1514361892635-cebb9b6c7ca7?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      { id: "9", name: "Espumante", description: "Espumante premium", price: 12, category: "Vinhos", image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=200&h=200&fit=crop&crop=center", priceType: "per_person", popular: true },
      { id: "10", name: "Água", description: "Água mineral", price: 12, category: "Não Alcoólicos", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      { id: "11", name: "Refrigerante", description: "Refrigerante variados", price: 12, category: "Não Alcoólicos", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      { id: "12", name: "Suco Natural", description: "Suco natural de frutas", price: 12, category: "Não Alcoólicos", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&crop=center", priceType: "per_person" },
      // Drinks da drinkeira
      { id: "caip-1", name: "Caipirinha Tradicional", description: "Cachaça, limão, açúcar e gelo", price: 12, category: "Caipirinha", image: "/caipirinha.jpg", priceType: "per_unit", popular: true },
      { id: "caip-2", name: "Caipirinha de Morango", description: "Cachaça, morango fresco, açúcar e gelo", price: 14, category: "Caipirinha", image: "/caipirinha.jpg", priceType: "per_unit", popular: true },
      { id: "caip-3", name: "Caipirinha de Kiwi", description: "Cachaça, kiwi, açúcar e gelo", price: 15, category: "Caipirinha", image: "/caipirinha.jpg", priceType: "per_unit" },
      { id: "caip-4", name: "Caipirinha de Maracujá", description: "Cachaça, polpa de maracujá, açúcar e gelo", price: 14, category: "Caipirinha", image: "/caipirinha.jpg", priceType: "per_unit" },
      { id: "caip-5", name: "Caipirinha de Abacaxi", description: "Cachaça, abacaxi fresco, açúcar e gelo", price: 13, category: "Caipirinha", image: "/caipirinha.jpg", priceType: "per_unit" },
      { id: "caip-6", name: "Caipirinha Premium", description: "Cachaça premium, limão tahiti, açúcar demerara", price: 18, category: "Caipirinha", image: "/caipirinha-premium.jpg", priceType: "per_unit", premium: true },
      { id: "caipiroska-1", name: "Caipiroska Tradicional", description: "Vodka, limão, açúcar e gelo", price: 13, category: "Caipiroska", image: "/caipiroska.jpg", priceType: "per_unit", popular: true },
      { id: "caipiroska-2", name: "Caipiroska de Morango", description: "Vodka, morango fresco, açúcar e gelo", price: 15, category: "Caipiroska", image: "/caipiroska.jpg", priceType: "per_unit", popular: true },
      { id: "caipiroska-3", name: "Caipiroska de Frutas Vermelhas", description: "Vodka, mix de frutas vermelhas, açúcar e gelo", price: 16, category: "Caipiroska", image: "/caipiroska.jpg", priceType: "per_unit", premium: true },
      { id: "caipiroska-4", name: "Caipiroska de Maracujá", description: "Vodka, polpa de maracujá, açúcar e gelo", price: 15, category: "Caipiroska", image: "/caipiroska.jpg", priceType: "per_unit" },
      { id: "caipiroska-5", name: "Caipiroska de Pêssego", description: "Vodka, pêssego em calda, açúcar e gelo", price: 15, category: "Caipiroska", image: "/caipiroska.jpg", priceType: "per_unit" },
      { id: "caipiroska-6", name: "Caipiroska Premium", description: "Vodka premium, limão siciliano, açúcar cristal", price: 20, category: "Caipiroska", image: "/caipiroska.jpg", priceType: "per_unit", premium: true },
      { id: "classic-1", name: "Gin Tônica", description: "Gin, água tônica, limão e especiarias", price: 20, category: "Clássico", image: "/gin-tonica.jpg", priceType: "per_unit" },
      { id: "classic-2", name: "Mojito", description: "Rum, hortelã, limão, açúcar e água com gás", price: 18, category: "Clássico", image: "/mojito.jpg", priceType: "per_unit" },
      { id: "classic-3", name: "Daiquiri", description: "Rum, suco de limão e açúcar", price: 22, category: "Clássico", image: "/mojito.jpg", priceType: "per_unit" },
    ]
    
    // saveDrinks(defaultDrinks) // This line is removed as per the edit hint
    showMessage("Drinks resetados para os padrões originais!", "success")
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

  // Remover saveDrinks e uso de localStorage para drinks

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Palavra-chave
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a palavra-chave"
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

              {loginError && (
                <div className="flex items-center space-x-2 p-3 bg-red-900/50 rounded-lg border border-red-700/50">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-200">{loginError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
              >
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Entrar</span>
                </div>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Panel
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
                <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-gray-300">Gerenciamento Completo - TENDERES</p>
              </div>
            </div>
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
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/60 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Button
              onClick={() => setActiveTab('dashboard')}
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'dashboard' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setActiveTab('drinks')}
              variant={activeTab === 'drinks' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'drinks' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Drinks
            </Button>
            <Button
              onClick={() => setActiveTab('events')}
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'events' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Eventos
            </Button>
            <Button
              onClick={() => setActiveTab('plans')}
              variant={activeTab === 'plans' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'plans' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Planos
            </Button>
            <Button
              onClick={() => setActiveTab('drinkeira')}
              variant={activeTab === 'drinkeira' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'drinkeira' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Drinkeira
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-800/80 backdrop-blur-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total de Drinks</p>
                      <p className="text-3xl font-bold text-white">{drinks.length}</p>
                    </div>
                    <Wine className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/80 backdrop-blur-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Eventos Ativos</p>
                      <p className="text-3xl font-bold text-white">
                        {events.filter(e => e.status === 'active').length}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/80 backdrop-blur-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Drinks Populares</p>
                      <p className="text-3xl font-bold text-white">
                        {drinks.filter(d => d.popular).length}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/80 backdrop-blur-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Drinks Premium</p>
                      <p className="text-3xl font-bold text-white">
                        {drinks.filter(d => d.premium).length}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">★</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gray-800/80 backdrop-blur-md border-0">
              <CardHeader>
                <CardTitle className="text-xl text-white">Bem-vindo ao Painel Administrativo</CardTitle>
                <CardDescription className="text-gray-300">
                  Sistema completo de gerenciamento do TENDERES
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Drinks Carregados</h3>
                    <p className="text-gray-300">
                      O sistema já carregou automaticamente todos os drinks do menu principal, incluindo:
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• {drinks.filter(d => d.category === "Coquetéis").length} Coquetéis</li>
                      <li>• {drinks.filter(d => d.category === "Cervejas").length} Cervejas</li>
                      <li>• {drinks.filter(d => d.category === "Vinhos").length} Vinhos</li>
                      <li>• {drinks.filter(d => d.category === "Não Alcoólicos").length} Não Alcoólicos</li>
                      <li>• {drinks.filter(d => d.category === "Open Bar").length} Open Bar</li>
                      <li>• {drinks.filter(d => d.category === "Caipirinha").length} Caipirinhas</li>
                      <li>• {drinks.filter(d => d.category === "Caipiroska").length} Caipiroskas</li>
                      <li>• {drinks.filter(d => d.category === "Clássico").length} Clássicos</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Funcionalidades</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• ✏️ Editar drinks existentes</li>
                      <li>• ➕ Adicionar novos drinks</li>
                      <li>• 🗑️ Remover drinks</li>
                      <li>• 📅 Gerenciar eventos</li>
                      <li>• 🖼️ Upload de imagens</li>
                      <li>• ⭐ Marcar como popular/premium</li>
                      <li>• 🔄 Resetar para padrões originais</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'plans' && (
          <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0 mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Gerenciamento de Planos</CardTitle>
              <CardDescription className="text-gray-300">CRUD de planos e seleção de drinks por plano</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mock de listagem de planos */}
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-200 font-semibold">Planos cadastrados:</span>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">Novo Plano</Button>
              </div>
              <div className="space-y-4">
                <Card className="bg-gray-700/50 border-gray-600">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">Plano Open Bar</p>
                      <p className="text-gray-300 text-sm">Inclui todos os drinks do menu</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-300 hover:bg-blue-900/50">Editar</Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-300 hover:bg-red-900/50">Remover</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700/50 border-gray-600">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">Plano Premium</p>
                      <p className="text-gray-300 text-sm">Inclui drinks premium e clássicos</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-300 hover:bg-blue-900/50">Editar</Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-300 hover:bg-red-900/50">Remover</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Mock de formulário de plano */}
              <div className="mt-8 p-4 bg-gray-900/60 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Formulário de Plano (mock)</h3>
                <div className="space-y-2">
                  <Input placeholder="Nome do Plano" className="border-gray-600 bg-gray-700 text-white" />
                  <textarea placeholder="Descrição do Plano" className="w-full h-16 border-gray-600 bg-gray-700 text-white rounded-md p-2 resize-none" />
                  <Label className="text-gray-200">Drinks inclusos (mock)</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">Caipirinha</Badge>
                    <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">Mojito</Badge>
                    <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">Gin Tônica</Badge>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</Button>
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">Salvar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'drinkeira' && (
          <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0 mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Modo Drinkeira</CardTitle>
              <CardDescription className="text-gray-300">Gerencie os drinks exclusivos do modo drinkeira</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddNewDrinkeiraDrink} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus className="h-4 w-4 mr-2" /> Novo Drink
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drinkeiraDrinks.length === 0 && !loadingDrinkeiraDrinks && (
                  <div className="col-span-full text-center text-gray-400">Nenhum drink cadastrado no modo drinkeira.</div>
                )}
                {drinkeiraDrinks.map(drink => (
                  <Card key={drink.id} className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                          <Wine className="h-6 w-6 text-purple-300" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button onClick={() => handleEditDrinkeiraDrink(drink)} variant="outline" size="sm" className="border-blue-600 text-blue-300 hover:bg-blue-900/50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => setDrinkeiraDrinkToDelete(drink)} variant="outline" size="sm" className="border-red-600 text-red-300 hover:bg-red-900/50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-semibold text-white mb-2">{drink.name}</h4>
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">{drink.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">{drink.category}</Badge>
                        <Badge className="bg-blue-900/50 text-blue-200 border-blue-700/50 text-xs">R$ {drink.price}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {drink.popular && (
                          <Badge className="bg-yellow-900/50 text-yellow-200 border-yellow-700/50 text-xs">
                            <Star className="h-3 w-3 mr-1" /> Popular
                          </Badge>
                        )}
                        {drink.premium && (
                          <Badge className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-200 border-purple-700/50 text-xs">Premium</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {editingDrinkeiraDrink && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md mx-auto bg-gray-800 border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{isAddingNewDrinkeira ? 'Adicionar Drink' : 'Editar Drink'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Input value={editingDrinkeiraDrink.name} onChange={e => setEditingDrinkeiraDrink(prev => prev ? { ...prev, name: e.target.value } : null)} placeholder="Nome do Drink" className="border-gray-600 bg-gray-700 text-white" />
                        <Input type="number" min="0" step="0.01" value={editingDrinkeiraDrink.price} onChange={e => setEditingDrinkeiraDrink(prev => prev ? { ...prev, price: Number(e.target.value) } : null)} placeholder="Preço (R$)" className="border-gray-600 bg-gray-700 text-white" />
                        <Select
                          value={editingDrinkeiraDrink.category}
                          onValueChange={(value) => setEditingDrinkeiraDrink(prev => prev ? { ...prev, category: value } : null)}
                        >
                          <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="Caipirinha" className="text-white">
                              Caipirinha
                            </SelectItem>
                            <SelectItem value="Caipiroska" className="text-white">
                              Caipiroska
                            </SelectItem>
                            <SelectItem value="Clássico" className="text-white">
                              Clássico
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input value={editingDrinkeiraDrink.image} onChange={e => setEditingDrinkeiraDrink(prev => prev ? { ...prev, image: e.target.value } : null)} placeholder="URL da Imagem" className="border-gray-600 bg-gray-700 text-white" />
                        <Select
                          value={editingDrinkeiraDrink.priceType}
                          onValueChange={(value: "per_person" | "per_unit") => setEditingDrinkeiraDrink(prev => prev ? { ...prev, priceType: value } : null)}
                        >
                          <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                            <SelectValue placeholder="Selecione o tipo de preço" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="per_unit" className="text-white">
                              Por Unidade
                            </SelectItem>
                            <SelectItem value="per_person" className="text-white">
                              Por Pessoa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <textarea value={editingDrinkeiraDrink.description} onChange={e => setEditingDrinkeiraDrink(prev => prev ? { ...prev, description: e.target.value } : null)} placeholder="Descrição" className="w-full h-20 border-gray-600 bg-gray-700 text-white rounded-md p-2 resize-none" />
                        <div className="flex items-center space-x-3">
                          <Switch checked={editingDrinkeiraDrink.popular} onCheckedChange={checked => setEditingDrinkeiraDrink(prev => prev ? { ...prev, popular: checked } : null)} />
                          <Label className="text-sm font-medium text-gray-200">Marcar como Popular</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch checked={editingDrinkeiraDrink.premium} onCheckedChange={checked => setEditingDrinkeiraDrink(prev => prev ? { ...prev, premium: checked } : null)} />
                          <Label className="text-sm font-medium text-gray-200">Marcar como Premium</Label>
                        </div>
                        <div className="flex space-x-2 pt-4">
                          <Button onClick={handleCancelDrinkeiraDrink} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</Button>
                          <Button onClick={handleSaveDrinkeiraDrink} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">Salvar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {/* Modal de confirmação de remoção */}
              {drinkeiraDrinkToDelete && (
                <Dialog open={!!drinkeiraDrinkToDelete} onOpenChange={() => setDrinkeiraDrinkToDelete(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar remoção</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja remover o drink <b>{drinkeiraDrinkToDelete.name}</b>?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setDrinkeiraDrinkToDelete(null)}>
                        Cancelar
                      </Button>
                      <Button className="bg-red-600 text-white" onClick={() => { handleDeleteDrinkeiraDrink(drinkeiraDrinkToDelete.id); setDrinkeiraDrinkToDelete(null); }}>
                        Remover
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* Content Area */}
          <div className="xl:col-span-3 lg:col-span-2">
            {activeTab === 'drinks' && (
            <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Drinks Cadastrados</CardTitle>
                    <CardDescription className="text-gray-300">
                        Gerencie todos os drinks do site ({drinks.length} drinks)
                    </CardDescription>
                  </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleResetDrinks}
                        variant="outline"
                        className="border-orange-600 text-orange-300 hover:bg-orange-900/50"
                      >
                        <span className="mr-2">🔄</span>
                        Resetar
                      </Button>
                  <Button
                    onClick={handleAddNew}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Drink
                  </Button>
                    </div>
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
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{drink.description}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">
                            {drink.category}
                          </Badge>
                          <Badge className="bg-blue-900/50 text-blue-200 border-blue-700/50 text-xs">
                            R$ {drink.price}
                          </Badge>
                        </div>
                          <div className="flex items-center space-x-2">
                        {drink.popular && (
                          <Badge className="bg-yellow-900/50 text-yellow-200 border-yellow-700/50 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                            {drink.premium && (
                              <Badge className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-200 border-purple-700/50 text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'events' && (
              <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-white">Eventos Cadastrados</CardTitle>
                      <CardDescription className="text-gray-300">
                        Gerencie todos os eventos
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleAddNew}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Evento
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <Card key={event.id} className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-lg flex items-center justify-center">
                              <span className="text-blue-300 font-bold">E</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => handleEdit(event)}
                                variant="outline"
                                size="sm"
                                className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(event.id)}
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-300 hover:bg-red-900/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h4 className="font-semibold text-white mb-2">{event.name}</h4>
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{event.description}</p>
                          <div className="space-y-1 text-xs text-gray-400">
                            <p>📅 {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                            <p>📍 {event.location}</p>
                            <p>👥 Máx: {event.maxGuests} convidados</p>
                          </div>
                          <div className="mt-3">
                            <Badge className={`text-xs ${
                              event.status === 'active' 
                                ? 'bg-green-900/50 text-green-200 border-green-700/50'
                                : event.status === 'completed'
                                ? 'bg-gray-900/50 text-gray-200 border-gray-700/50'
                                : 'bg-red-900/50 text-red-200 border-red-700/50'
                            }`}>
                              {event.status === 'active' ? 'Ativo' : event.status === 'completed' ? 'Concluído' : 'Inativo'}
                            </Badge>
                          </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Edit Form */}
          <div className="xl:col-span-1 lg:col-span-1">
            <Card className="sticky top-8 bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {editingDrink ? (isAddingNew ? "Adicionar Drink" : "Editar Drink") : 
                   editingEvent ? (isAddingNew ? "Adicionar Evento" : "Editar Evento") : "Formulário"}
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
                      <textarea
                        value={editingDrink.description}
                        onChange={(e) => setEditingDrink(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Descreva o drink..."
                        className="w-full h-20 border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400 rounded-md p-2 resize-none"
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
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : editingEvent ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Nome do Evento
                      </Label>
                      <Input
                        value={editingEvent.name}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, name: e.target.value } : null)}
                        placeholder="Ex: Aniversário João"
                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Descrição
                      </Label>
                      <textarea
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Descreva o evento..."
                        className="w-full h-20 border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400 rounded-md p-2 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Data do Evento
                      </Label>
                      <Input
                        type="date"
                        value={editingEvent.date}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, date: e.target.value } : null)}
                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Local
                      </Label>
                      <Input
                        value={editingEvent.location}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, location: e.target.value } : null)}
                        placeholder="Ex: Casa do João"
                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Máximo de Convidados
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={editingEvent.maxGuests}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, maxGuests: Number(e.target.value) } : null)}
                        placeholder="50"
                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Status
                      </Label>
                      <Select
                        value={editingEvent.status}
                        onValueChange={(value: "active" | "inactive" | "completed") => setEditingEvent(prev => prev ? { ...prev, status: value } : null)}
                      >
                        <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="active" className="text-white">
                            Ativo
                          </SelectItem>
                          <SelectItem value="inactive" className="text-white">
                            Inativo
                          </SelectItem>
                          <SelectItem value="completed" className="text-white">
                            Concluído
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                        onClick={handleSave}
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
                      Selecione um item para editar ou clique em "Novo"
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
      {drinkToDelete && activeTab === 'drinks' && (
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
    </div>
  )
} 