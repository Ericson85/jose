"use client"

import { useState, useEffect, useMemo } from "react"
import { Wine, Users, Clock, Calculator, Star, CheckCircle, Sparkles, Heart, Award, Moon, Sun, MapPin, Phone, Mail, MessageCircle, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

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

interface UserData {
  name: string
  age: number
  address: string
  city: string
  state: string
  phone: string
}

export interface CompletePlan {
  id: string
  name: string
  price: number
  description: string
  drinks: string[]
  popular?: boolean
}

interface DrinkeiraDrink {
  id: string
  name: string
  category: "Caipirinha" | "Caipiroska" | "Clássico"
  price: number
  description: string
  image?: string
  popular?: boolean
  premium?: boolean
}

const drinkeiraMenu: DrinkeiraDrink[] = [
  { id: "caip-1", name: "Caipirinha Tradicional", category: "Caipirinha", price: 12, description: "Cachaça, limão, açúcar e gelo", image: "/caipirinha.jpg", popular: true },
  { id: "caip-2", name: "Caipirinha de Morango", category: "Caipirinha", price: 14, description: "Cachaça, morango fresco, açúcar e gelo", image: "/caipirinha.jpg", popular: true },
  { id: "caip-3", name: "Caipirinha de Kiwi", category: "Caipirinha", price: 15, description: "Cachaça, kiwi, açúcar e gelo", image: "/caipirinha.jpg" },
  { id: "caip-4", name: "Caipirinha de Maracujá", category: "Caipirinha", price: 14, description: "Cachaça, polpa de maracujá, açúcar e gelo", image: "/caipirinha.jpg" },
  { id: "caip-5", name: "Caipirinha de Abacaxi", category: "Caipirinha", price: 13, description: "Cachaça, abacaxi fresco, açúcar e gelo", image: "/caipirinha.jpg" },
  { id: "caip-6", name: "Caipirinha Premium", category: "Caipirinha", price: 18, description: "Cachaça premium, limão tahiti, açúcar demerara", image: "/caipirinha-premium.jpg", premium: true },
  { id: "caipiroska-1", name: "Caipiroska Tradicional", category: "Caipiroska", price: 13, description: "Vodka, limão, açúcar e gelo", image: "/caipiroska.jpg", popular: true },
  { id: "caipiroska-2", name: "Caipiroska de Morango", category: "Caipiroska", price: 15, description: "Vodka, morango fresco, açúcar e gelo", image: "/caipiroska.jpg", popular: true },
  { id: "caipiroska-3", name: "Caipiroska de Frutas Vermelhas", category: "Caipiroska", price: 16, description: "Vodka, mix de frutas vermelhas, açúcar e gelo", image: "/caipiroska.jpg", premium: true },
  { id: "caipiroska-4", name: "Caipiroska de Maracujá", category: "Caipiroska", price: 15, description: "Vodka, polpa de maracujá, açúcar e gelo", image: "/caipiroska.jpg" },
  { id: "caipiroska-5", name: "Caipiroska de Pêssego", category: "Caipiroska", price: 15, description: "Vodka, pêssego em calda, açúcar e gelo", image: "/caipiroska.jpg" },
  { id: "caipiroska-6", name: "Caipiroska Premium", category: "Caipiroska", price: 20, description: "Vodka premium, limão siciliano, açúcar cristal", image: "/caipiroska.jpg", premium: true },
  { id: "classic-1", name: "Gin Tônica", category: "Clássico", price: 20, description: "Gin, água tônica, limão e especiarias", image: "/placeholder.jpg" },
  { id: "classic-2", name: "Mojito", category: "Clássico", price: 18, description: "Rum, hortelã, limão, açúcar e água com gás", image: "/mojito.jpg" },
  { id: "classic-3", name: "Daiquiri", category: "Clássico", price: 22, description: "Rum, suco de limão e açúcar", image: "/mojito.jpg" },
]

const drinks: Drink[] = [
  {
    id: "caipirinha",
    name: "Caipirinha",
    description: "Tradicional caipirinha brasileira com cachaça, limão e açúcar",
    price: 15,
    category: "Caipirinha",
    image: "/caipirinha.jpg",
    priceType: "per_person",
    popular: true
  },
  {
    id: "caipiroska",
    name: "Caipiroska",
    description: "Caipiroska refrescante com vodka, limão e açúcar",
    price: 18,
    category: "Caipiroska",
    image: "/caipiroska.jpg",
    priceType: "per_unit"
  },
  {
    id: "caipirinha-premium",
    name: "Caipirinha Premium",
    description: "Caipirinha premium com cachaça de qualidade superior",
    price: 20,
    category: "Caipirinha",
    image: "/caipirinha-premium.jpg",
    priceType: "per_unit"
  },
  {
    id: "aperol-spritz",
    name: "Aperol Spritz",
    description: "Cocktail italiano refrescante com Aperol e prosecco",
    price: 25,
    category: "Cocktails",
    image: "/Aperol-Spritz.jpg",
    priceType: "per_person",
    popular: true
  },
  {
    id: "gin-tonica",
    name: "Gin Tônica",
    description: "Gin tônica clássica com gim premium e água tônica",
    price: 22,
    category: "Cocktails",
    image: "/placeholder.jpg",
    priceType: "per_person",
    popular: true
  },
  {
    id: "mojito",
    name: "Mojito",
    description: "Mojito cubano com rum, hortelã, limão e açúcar",
    price: 20,
    category: "Cocktails",
    image: "/mojito.jpg",
    priceType: "per_person"
  },
  {
    id: "cupa-livre",
    name: "Cupa Livre",
    description: "Cupa livre com frutas frescas e bebida à escolha",
    price: 30,
    category: "Especiais",
    image: "/cupa-livre.jpg",
    priceType: "per_person"
  },
  {
    id: "open-bar-caipirinha",
    name: "Open Bar Caipirinha",
    description: "Open bar completo de caipirinhas durante o evento",
    price: 50,
    category: "Open Bar",
    image: "/Open-bar-caipirinha.jpg",
    priceType: "per_person"
  },
  {
    id: "open-bar-caipirinha-caipiroska",
    name: "Open Bar Caipirinha + Caipiroska",
    description: "Open bar com caipirinhas e caipiroskas ilimitadas",
    price: 60,
    category: "Open Bar",
    image: "/open-bar-caipirinha-caipiroska.jpg",
    priceType: "per_person"
  }
]

const completePlans: CompletePlan[] = [
  {
    id: "plano-festa",
    name: "Plano Festa",
    price: 60,
    description: "Ideal para festas animadas com amigos. Inclui drinks clássicos e opções refrescantes.",
    drinks: ["Caipirinha Tradicional", "Caipiroska", "Gin Tônica"],
    popular: true,
  },
  {
    id: "plano-aniversario",
    name: "Plano Aniversário",
    price: 80,
    description: "Perfeito para comemorar aniversários. Seleção especial de drinks para todos os gostos.",
    drinks: ["Caipirinha Premium", "Mojito", "Aperol Spritz"],
    popular: true,
  },
  {
    id: "plano-confraternizacao",
    name: "Plano Confraternização",
    price: 100,
    description: "Para eventos corporativos ou encontros de equipe. Drinks sofisticados e exclusivos.",
    drinks: ["Gin Tônica", "Daiquiri", "Cuba Libre", "Caipiroska Premium"],
  },
]

export default function TenderesPage() {
  const { theme, setTheme } = useTheme()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 0,
    address: "",
    city: "",
    state: "",
    phone: ""
  })
  const [isFormValid, setIsFormValid] = useState(false)
  
  // Estado para drinks dinâmicos (gerenciados pelo admin)
  const [dynamicDrinks, setDynamicDrinks] = useState<Drink[]>([])
  const [isLoadingDrinks, setIsLoadingDrinks] = useState(true)
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)

  // Carregar drinks do banco de dados via API
  useEffect(() => {
    let isMounted = true;
    const fetchDrinks = async () => {
      setIsLoadingDrinks(true);
      try {
        const response = await fetch("/api/drinks");
        const data = await response.json();
        if (isMounted) {
          // Mapear os dados da API para garantir compatibilidade
          const mappedDrinks = data.map((drink: any) => ({
            id: drink.id.toString(),
            name: drink.name,
            description: drink.description || '',
            price: Number(drink.price) || 0,
            category: drink.category || '',
            image: drink.image || '/placeholder.jpg',
            priceType: drink.price_type || drink.priceType || 'per_unit',
            popular: Boolean(drink.popular),
            premium: Boolean(drink.premium)
          }));
          console.log('Drinks carregados do banco:', mappedDrinks);
          console.log('Dados brutos da API:', data);
          setDynamicDrinks(mappedDrinks);
        }
      } catch (error) {
        console.error("Erro ao carregar drinks do banco de dados:", error);
        if (isMounted) {
          setDynamicDrinks(drinks); // fallback para os drinks padrão
        }
      }
      setIsLoadingDrinks(false);
    };
    fetchDrinks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Função para recarregar drinks (forçar atualização)
  const reloadDrinks = async () => {
    setIsLoadingDrinks(true);
    try {
      const response = await fetch("/api/drinks");
      const data = await response.json();
      
      const mappedDrinks = data.map((drink: any) => ({
        id: drink.id.toString(),
        name: drink.name,
        description: drink.description || '',
        price: Number(drink.price) || 0,
        category: drink.category || '',
        image: drink.image || '/placeholder.jpg',
        priceType: drink.price_type || drink.priceType || 'per_unit',
        popular: Boolean(drink.popular),
        premium: Boolean(drink.premium)
      }));
      
      console.log('Drinks recarregados:', mappedDrinks);
      setDynamicDrinks(mappedDrinks);
      showToast("Drinks atualizados!", "success");
    } catch (error) {
      console.error("Erro ao recarregar drinks:", error);
      showToast("Erro ao atualizar drinks", "error");
    }
    setIsLoadingDrinks(false);
  };

  // Carregar drinks do modo drinkeira do banco de dados
  useEffect(() => {
    let isMounted = true;
    const fetchDrinkeiraDrinks = async () => {
      setLoadingDrinkeiraDrinks(true);
      try {
        const response = await fetch("/api/drinkeira/drinks");
        const data = await response.json();
        if (isMounted) setDrinkeiraDrinks(data);
      } catch (error) {
        console.error("Erro ao carregar drinks do modo drinkeira:", error);
        if (isMounted) setDrinkeiraDrinks(drinkeiraMenu); // fallback para os drinks padrão
      }
      setLoadingDrinkeiraDrinks(false);
    };
    fetchDrinkeiraDrinks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Carregar planos completos do banco de dados via API
  const [completePlans, setCompletePlans] = useState<CompletePlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();
        if (isMounted) {
          // Mapear os dados do banco para a interface CompletePlan
          const mappedPlans = data.map((plan: any) => ({
            id: plan.id.toString(),
            name: plan.name,
            price: Number(plan.price) || 0,
            description: plan.description,
            drinks: plan.drinks_inclusos ? plan.drinks_inclusos.split(',').map((s: string) => s.trim()) : [],
            popular: plan.popular || false
          }));
          setCompletePlans(mappedPlans);
        }
      } catch (error) {
        console.error("Erro ao carregar planos completos do banco de dados:", error);
      }
      setIsLoadingPlans(false);
    };
    fetchPlans();
    
    // Carregar configurações de eventos e custos extras
    const fetchEventConfig = async () => {
      try {
        const response = await fetch("/api/event-config");
        const data = await response.json();
        if (isMounted && response.ok) {
          setConfig({
            transportationFee: Number(data.transportation_fee) || 150,
            bartenderBaseCost: Number(data.bartender_base_cost) || 100,
            extraHourCost: Number(data.extra_hour_cost) || 15,
            maxHoursBeforeExtra: Number(data.max_hours_before_extra) || 4,
            bartendersPer50People: Number(data.bartenders_per_50_people) || 1,
            // Nomes personalizáveis
            transportationFeeName: data.transportation_fee_name || 'Taxa de Locomoção',
            bartenderBaseCostName: data.bartender_base_cost_name || 'Custo Base Bartender',
            extraHourCostName: data.extra_hour_cost_name || 'Custo Hora Extra',
            maxHoursBeforeExtraName: data.max_hours_before_extra_name || 'Horas antes da Hora Extra',
            bartendersPer50PeopleName: data.bartenders_per_50_people_name || 'Bartenders por 50 Convidados'
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    const fetchExtraCosts = async () => {
      try {
        const response = await fetch("/api/extra-costs");
        const data = await response.json();
        if (isMounted && response.ok) {
          setExtraCosts(data.map((cost: any) => ({
            id: cost.id.toString(),
            name: cost.name,
            value: Number(cost.value) || 0
          })));
        }
      } catch (error) {
        console.error("Erro ao carregar custos extras:", error);
      }
    };

    fetchEventConfig();
    fetchExtraCosts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Verificar se o usuário já preencheu os dados
  useEffect(() => {
    const savedUserData = localStorage.getItem("tenderes_user_data")
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData))
    }
  }, [])

  // Validar formulário
  useEffect(() => {
    const isValid = (userData.name || "").trim() !== "" &&
                   userData.age >= 18 &&
                   (userData.address || "").trim() !== "" &&
                   (userData.city || "").trim() !== "" &&
                   (userData.state || "").trim() !== "" &&
                   (userData.phone || "").trim() !== ""
    setIsFormValid(isValid)
  }, [userData])

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.age < 18) {
      showToast("É necessário ter pelo menos 18 anos para continuar.", "error")
      return
    }
    if (isFormValid) {
      localStorage.setItem("tenderes_user_data", JSON.stringify(userData))
      setShowWelcomeModal(false)
      showToast(`Dados salvos com sucesso! Agora você pode solicitar seu orçamento.`, "success")
    }
  }

  const [selectedDrinks, setSelectedDrinks] = useState<{ [key: string]: number }>({})
  const [people, setPeople] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [isDrinkeiraMode, setIsDrinkeiraMode] = useState(false)
  const [mode, setMode] = useState<'planos' | 'detalhado' | 'drinkeira'>('planos')
  const [drinkeiraTab, setDrinkeiraTab] = useState<'caipirinhas' | 'caipiroskas' | 'classicos'>('caipirinhas')
  const [drinkeiraDrinks, setDrinkeiraDrinks] = useState<DrinkeiraDrink[]>([])
  const [loadingDrinkeiraDrinks, setLoadingDrinkeiraDrinks] = useState(false)
  
  // Configurações carregadas do banco de dados
  const [config, setConfig] = useState({
    transportationFee: 150,
    bartenderBaseCost: 100,
    extraHourCost: 15,
    maxHoursBeforeExtra: 4,
    bartendersPer50People: 1,
    // Nomes personalizáveis
    transportationFeeName: 'Taxa de Locomoção',
    bartenderBaseCostName: 'Custo Base Bartender',
    extraHourCostName: 'Custo Hora Extra',
    maxHoursBeforeExtraName: 'Horas antes da Hora Extra',
    bartendersPer50PeopleName: 'Bartenders por 50 Convidados'
  })
  
  // Custos extras carregados do banco de dados
  const [extraCosts, setExtraCosts] = useState<Array<{id: string, name: string, value: number}>>([])

  const handleDrinkQuantityChange = (drinkId: string, change: number) => {
    setSelectedDrinks((prev) => {
      const currentQuantity = prev[drinkId] || 0
      const newQuantity = currentQuantity + change
      
      if (newQuantity <= 0) {
        const newSelected = { ...prev }
        delete newSelected[drinkId]
        return newSelected
      } else {
        return {
          ...prev,
          [drinkId]: newQuantity,
        }
      }
    })
  }





  const calculateBartenders = () => {
    if (people <= 0) return 0
    return Math.ceil(people / 50) * config.bartendersPer50People
  }

  const budgetResult = useMemo(() => {
    const bartenders = calculateBartenders()

    if (isDrinkeiraMode) {
      let bartenderCost = bartenders * config.bartenderBaseCost
      let extraHours = 0
      
      if (hours > config.maxHoursBeforeExtra) {
        extraHours = hours - config.maxHoursBeforeExtra
        const extraCost = bartenders * extraHours * config.extraHourCost
        bartenderCost += extraCost
      }
      
      const extraCostsTotal = extraCosts.reduce((sum, cost) => sum + cost.value, 0)
      const total = bartenderCost + config.transportationFee + extraCostsTotal
      return { 
        total, 
        transportFee: config.transportationFee, 
        bartenderCost, 
        bartenders, 
        extraHours, 
        subtotal: bartenderCost,
        extraCosts: extraCostsTotal
      }
    }

    let subtotal = 0
    
    Object.entries(selectedDrinks).forEach(([drinkId, quantity]) => {
      const drink = dynamicDrinks.find((d) => d.id === drinkId)
      if (drink) {
        if (drink.priceType === 'per_person') {
          const drinkCost = drink.price * quantity * people
          subtotal += drinkCost
        } else {
          const drinkCost = drink.price * quantity
          subtotal += drinkCost
        }
      }
    })
    const extraCostsTotal = extraCosts.reduce((sum, cost) => sum + cost.value, 0)
    const total = subtotal + config.transportationFee + extraCostsTotal
    return { 
      total, 
      transportFee: config.transportationFee, 
      subtotal, 
      bartenders,
      extraCosts: extraCostsTotal
    }
  }, [isDrinkeiraMode, selectedDrinks, people, hours, dynamicDrinks, config, extraCosts])

  const sendToWhatsApp = () => {
    // Verificar se o usuário já preencheu os dados
    const savedUserData = localStorage.getItem("tenderes_user_data")
    if (!savedUserData || !userData.name || !userData.phone) {
      setShowWelcomeModal(true)
      showToast("Por favor, preencha seus dados antes de solicitar o orçamento.", "info")
      return
    }

    let message = `*Orçamento TENDERES - Drinks Premium*\n\n`
    message += `*Cliente:* ${userData.name || "Não informado"}\n`
    message += `*Contato:* ${userData.phone || "Não informado"}\n\n`
    message += `--- DETALHES DO EVENTO ---\n`
    message += `👥 Convidados: ${people}\n`
    message += `⏰ Duração: ${hours} horas\n`
    message += `👨‍🍳 Bartenders: ${budgetResult.bartenders}\n\n`

    if (isDrinkeiraMode) {
        message += `--- MODO DRINKEIRA ---\n`
        message += `${config.bartenderBaseCostName}: ${budgetResult.bartenderCost?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
        message += `${config.transportationFeeName}: ${budgetResult.transportFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
        if (budgetResult.extraCosts > 0) {
            message += `Custos Extras: ${budgetResult.extraCosts.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
            extraCosts.forEach(cost => {
                message += `  - ${cost.name}: ${cost.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
            })
        }
    } else {
        message += `--- MODO PRÉ-COMPRA ---\n`
        message += `Custo dos Drinks: ${budgetResult.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
        message += `Taxa de Locomoção: ${budgetResult.transportFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
        if (budgetResult.extraCosts > 0) {
            message += `Custos Extras: ${budgetResult.extraCosts.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
            extraCosts.forEach(cost => {
                message += `  - ${cost.name}: ${cost.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
            })
        }
        message += `\nDrinks Selecionados:\n`
        Object.entries(selectedDrinks).forEach(([drinkId, quantity]) => {
            const drink = dynamicDrinks.find(d => d.id === drinkId)
            if(drink) message += `- ${quantity}x ${drink.name}\n`
        })
    }

    message += `\n---------------------------------\n`
    message += `*VALOR TOTAL: ${(budgetResult.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}*`

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5585994330680&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const categories = [...new Set(dynamicDrinks.map((drink) => drink.category))]
  const caipirinhas = drinkeiraDrinks.filter((drink) => drink.category === "Caipirinha")
  const caipiroskas = drinkeiraDrinks.filter((drink) => drink.category === "Caipiroska")
  const outrosClassicos = drinkeiraDrinks.filter((drink) => drink.category === "Clássico")

  // Efeito para o toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Notification de atualização automática */}
      {showUpdateNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg border border-green-500/50 flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Drinks atualizados automaticamente!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 bg-gray-900/80 backdrop-blur-md border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wine className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Tenderes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-300 hover:text-white"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWelcomeModal(true)}
                className="border-purple-500 text-purple-300 hover:bg-purple-900/50"
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee */}
      <div className="bg-gray-800/50 py-3 text-center text-sm font-bold tracking-wider text-gray-300 overflow-hidden relative h-8">
        <div className="animate-marquee-infinite whitespace-nowrap">
          <span className="mx-8">&quot;UM BOM DRINK É COMO UMA POESIA ENGARRAFADA.&quot;</span>
          <span className="mx-8">&quot;A VIDA É MUITO CURTA PARA BEBER DRINKS RUINS.&quot;</span>
          <span className="mx-8">&quot;O MELHOR DRINK É AQUELE COMPARTILHADO COM AMIGOS.&quot;</span>
          <span className="mx-8">&quot;A ALEGRIA VEM EM TAÇAS.&quot;</span>
          <span className="mx-8">&quot;CELEBRE CADA MOMENTO COM UM BRINDE ESPECIAL.&quot;</span>
          <span className="mx-8">&quot;DRINKS BONS, HISTÓRIAS MELHORES.&quot;</span>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Drinks <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Perfeitos</span>
              <br className="hidden md:block"/>para Seu Evento
            </h2>
            <p className="text-lg md:text-2xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
               Monte seu pacote personalizado de drinks premium e receba um orçamento instantâneo. Transforme seu evento em uma experiência inesquecível.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-gray-300">
               <div className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-700 w-full sm:w-auto justify-center"><CheckCircle className="h-5 w-5 text-green-400" /> <span className="font-medium">Drinks Premium</span></div>
               <div className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-700 w-full sm:w-auto justify-center"><Award className="h-5 w-5 text-blue-400" /> <span className="font-medium">Serviço Profissional</span></div>
               <div className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-700 w-full sm:w-auto justify-center"><Calculator className="h-5 w-5 text-purple-400" /> <span className="font-medium">Orçamento Instantâneo</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 xl:col-span-1">
             <Card className="rounded-lg text-card-foreground lg:sticky top-24 bg-gray-800/80 backdrop-blur-md shadow-xl overflow-hidden border border-gray-700">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
               <CardHeader className="relative z-10 pb-4">
                 <CardTitle className="font-semibold tracking-tight flex items-center space-x-3 text-xl text-white">
                   <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Calculator className="h-5 w-5 text-white" />
                   </div>
                   <span>Configuração do Evento</span>
                 </CardTitle>
                 <CardDescription className="text-sm text-gray-300">Defina os detalhes do seu evento especial</CardDescription>
               </CardHeader>
               <CardContent className="p-6 pt-0 space-y-6 relative z-10">
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl border border-green-700/50">
                     <div>
                        <h4 className="font-semibold text-green-300">Modo Drinkeira</h4>
                        <p className="text-sm text-green-400">Bartender vende drinks na hora</p>
                     </div>
                     <Button 
                        onClick={() => {
                          setIsDrinkeiraMode(!isDrinkeiraMode);
                          setMode(isDrinkeiraMode ? 'planos' : 'drinkeira');
                        }}
                        variant={isDrinkeiraMode ? "default" : "outline"}
                        className={isDrinkeiraMode ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-400 text-green-300 hover:bg-green-900"}
                      >
                        {isDrinkeiraMode ? "Ativado" : "Ativar"}
                     </Button>
                  </div>
                 <div className="space-y-3">
                   <Label htmlFor="people" className="text-gray-300">Número de Convidados</Label>
                   <Input
                     id="people"
                     type="number"
                     value={people}
                     onChange={(e) => setPeople(Number(e.target.value))}
                     className="bg-gray-700 border-gray-600 text-white"
                     placeholder="Ex: 50"
                   />
                 </div>
                 <div className="space-y-3">
                   <Label htmlFor="hours" className="text-gray-300">Duração do Evento (horas)</Label>
                   <Input
                     id="hours"
                     type="number"
                     value={hours}
                     onChange={(e) => setHours(Number(e.target.value))}
                     className="bg-gray-700 border-gray-600 text-white"
                     placeholder="Ex: 4"
                   />
                 </div>


                 
                 {/* Resumo do Orçamento */}
                 {(people > 0 || hours > 0) && (
                   <div className="mt-6 space-y-4">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <Sparkles className="h-6 w-6 text-yellow-300" />
                       Resumo do Orçamento
                     </h3>
                     <div className="space-y-2 text-gray-200 text-lg">
                       <div className="flex justify-between items-center">
                         <span>
                            {isDrinkeiraMode ? "Custo Bartenders" : "Custo Drinks"}
                         </span>
                         <span className="font-semibold">{budgetResult.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                       </div>
                       <div className="flex justify-between items-center bg-purple-500/10 p-3 rounded-lg">
                         <span>{config.transportationFeeName}</span>
                         <span className="font-semibold">{budgetResult.transportFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                       </div>
                       {extraCosts.map((cost) => (
                         <div key={cost.id} className="flex justify-between items-center bg-orange-500/10 p-3 rounded-lg">
                           <span>{cost.name}</span>
                           <span className="font-semibold text-orange-300">{cost.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                         </div>
                       ))}
                     </div>
                     <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 flex justify-between items-center mt-4">
                       <span className="text-2xl font-bold text-white">Total</span>
                       <span className="text-3xl font-bold text-white">
                         {(budgetResult.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                       </span>
                     </div>
                     <Button 
                       onClick={sendToWhatsApp}
                       className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg h-14 rounded-xl shadow-lg mt-4"
                     >
                       <MessageCircle className="mr-2 h-5 w-5" />
                                               Finalizar Contrato
                     </Button>
                   </div>
                 )}
               </CardContent>
             </Card>
          </div>

          {/* Drink Selection */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            
             <Card className="rounded-lg text-card-foreground bg-gray-800/80 backdrop-blur-md shadow-xl border-0 border-gray-700">
                <CardContent className="p-4">
                   <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 shadow-2xl mb-8">
                     <h3 className="text-3xl font-bold text-center text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Escolha seu Tipo de Orçamento</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <Button 
                         onClick={() => setMode('planos')}
                         className={`h-24 text-xl font-bold transition-all duration-300 ${
                           mode === 'planos' 
                             ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-xl shadow-purple-500/40 scale-105 border-2 border-purple-300' 
                             : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-2 border-gray-600 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20'
                         }`}
                       >
                         <div className="flex flex-col items-center gap-2">
                           <Sparkles className="h-8 w-8 text-yellow-300" />
                           <span className="text-white">Planos Completos</span>
                           <p className="text-sm text-purple-200">Pacotes prontos</p>
                         </div>
                       </Button>
                       <Button 
                         onClick={() => setMode('detalhado')}
                         className={`h-24 text-xl font-bold transition-all duration-300 ${
                           mode === 'detalhado' 
                             ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-xl shadow-blue-500/40 scale-105 border-2 border-blue-300' 
                             : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-2 border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20'
                         }`}
                       >
                         <div className="flex flex-col items-center gap-2">
                           <Calculator className="h-8 w-8 text-cyan-300" />
                           <span className="text-white">Orçamento Detalhado</span>
                           <p className="text-sm text-cyan-200">Monte seu plano</p>
                         </div>
                       </Button>
                       <Button 
                         onClick={() => setMode('drinkeira')}
                         className={`h-24 text-xl font-bold transition-all duration-300 ${
                           mode === 'drinkeira' 
                             ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 shadow-xl shadow-green-500/40 scale-105 border-2 border-green-300' 
                             : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-2 border-gray-600 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20'
                         }`}
                       >
                         <div className="flex flex-col items-center gap-2">
                           <Wine className="h-8 w-8 text-green-300" />
                           <span className="text-white">Modo Drinkeira</span>
                           <p className="text-sm text-green-200">Bartender vende drinks na hora</p>
                         </div>
                       </Button>
                     </div>
                   </div>
                </CardContent>
             </Card>

            {/* Conteúdo dinâmico baseado no modo */}
            {mode === 'planos' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-white mb-8">Planos Completos</h2>
                {isLoadingPlans ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Carregando planos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {completePlans.map((plan) => (
                      <Card key={plan.id} className={`bg-gray-800 border border-gray-700 shadow-lg ${plan.popular ? 'border-2 border-purple-500' : ''}`}>
                        <CardHeader>
                          <CardTitle className="text-2xl text-white flex items-center gap-2">
                            {plan.popular && <Star className="h-5 w-5 text-yellow-400" />} {plan.name}
                          </CardTitle>
                          <CardDescription className="text-lg text-purple-200 font-bold mb-2">
                            {Number(plan.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} por pessoa
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 mb-4">{plan.description}</p>
                          <div>
                            <span className="font-semibold text-white">Drinks inclusos:</span>
                            <ul className="list-disc list-inside text-gray-200 mt-2">
                              {plan.drinks && plan.drinks.map((drink, idx) => (
                                <li key={idx}>{drink}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            {mode === 'detalhado' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">Orçamento Detalhado</h2>
                  <Button
                    onClick={reloadDrinks}
                    disabled={isLoadingDrinks}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoadingDrinks ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Atualizar Drinks
                  </Button>
                </div>
                
                {isLoadingDrinks ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Carregando drinks...</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Header Elegante */}
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                          <Wine className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight">TENDERES</h2>
                      </div>
                      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Descubra nossa seleção premium de drinks artesanais para seu evento
                      </p>
                    </div>
                    
                    {categories.map((category) => (
                      <div key={category} className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold text-white mb-2">{category}</h3>
                          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
                          {dynamicDrinks.filter((drink) => drink.category === category).map((drink) => {
                            // Função para obter imagem baseada na categoria
                            const getImageByCategory = (category: string) => {
                              switch (category.toLowerCase()) {
                                case 'caipirinha':
                                  return '/caipirinha.jpg';
                                case 'caipiroska':
                                  return '/caipiroska.jpg';
                                case 'cocktails':
                                case 'coquetéis':
                                  return '/placeholder.jpg';
                                case 'especiais':
                                  return '/cupa-livre.jpg';
                                case 'aperol':
                                  return '/Aperol-Spritz.jpg';
                                case 'mojito':
                                  return '/mojito.jpg';
                                default:
                                  return '/placeholder.jpg';
                              }
                            };

                            return (
                              <div key={drink.id} className="relative group">
                              {/* Card principal */}
                              <div className="relative border border-purple-600/30 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 hover:border-purple-500/50">
                                
                                {/* Imagem ocupando todo o espaço */}
                                <div className="h-48 md:h-64 lg:h-80 relative">
                                  <img 
                                    src={(() => {
                                      // MÉTODO NOVO: Lógica simplificada para imagens
                                      console.log(`Processando imagem para ${drink.name}:`, {
                                        drinkImage: drink.image,
                                        hasImage: drink.image && drink.image !== "",
                                        isBase64: drink.image && drink.image.startsWith('data:image'),
                                        isUrl: drink.image && (drink.image.startsWith('http') || drink.image.startsWith('/')),
                                        category: drink.category
                                      });

                                      // 1. Se tem imagem personalizada válida, usa ela
                                      if (drink.image && 
                                          drink.image !== "" && 
                                          drink.image !== "/placeholder.jpg" &&
                                          drink.image !== "/placeholder.svg?height=120&width=120") {
                                        
                                        // Validar se é base64 válido
                                        if (drink.image.startsWith('data:image')) {
                                          // Verificar se o base64 não está corrompido
                                          try {
                                            const base64Data = drink.image.split(',')[1];
                                            if (base64Data && base64Data.length > 100) {
                                              console.log(`Usando imagem base64 para ${drink.name}`);
                                              return drink.image;
                                            } else {
                                              console.log(`Base64 inválido para ${drink.name}, usando fallback`);
                                              return '/placeholder.jpg';
                                            }
                                          } catch (error) {
                                            console.log(`Erro ao validar base64 para ${drink.name}:`, error);
                                            return '/placeholder.jpg';
                                          }
                                        }
                                        
                                        // Se é URL válida
                                        if (drink.image.startsWith('http') || drink.image.startsWith('/')) {
                                          console.log(`Usando imagem URL para ${drink.name}:`, drink.image);
                                          return drink.image;
                                        }
                                        
                                        console.log(`Imagem inválida para ${drink.name}, usando fallback`);
                                        return '/placeholder.jpg';
                                      }

                                      // 2. Se não tem imagem, usa placeholder baseado na categoria
                                      const getCategoryImage = (category: string) => {
                                        switch (category.toLowerCase()) {
                                          case 'caipirinha':
                                            return '/placeholder.jpg';
                                          case 'caipiroska':
                                            return '/placeholder.jpg';
                                          case 'cocktails':
                                          case 'coquetéis':
                                            return '/placeholder.jpg';
                                          case 'especiais':
                                            return '/placeholder.jpg';
                                          case 'aperol':
                                            return '/placeholder.jpg';
                                          case 'mojito':
                                            return '/placeholder.jpg';
                                          default:
                                            return '/placeholder.jpg';
                                        }
                                      };

                                      const fallbackImage = getCategoryImage(drink.category);
                                      console.log(`Usando imagem de fallback para ${drink.name}:`, fallbackImage);
                                      return fallbackImage;
                                    })()}
                                    alt={drink.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      console.error(`Erro ao carregar imagem para ${drink.name}:`, target.src);
                                      
                                      // Se a imagem personalizada falhou, tentar placeholder
                                      if (target.src !== '/placeholder.jpg') {
                                        console.log(`Tentando placeholder para ${drink.name}`);
                                        target.src = '/placeholder.jpg';
                                      } else {
                                        // Se placeholder também falhou, esconder imagem
                                        console.log(`Escondendo imagem para ${drink.name}`);
                                        target.style.display = 'none';
                                      }
                                    }}
                                    onLoad={() => {
                                      console.log(`Imagem carregada com sucesso para ${drink.name}`);
                                    }}
                                  />
                                  {/* Overlay sutil */}
                                  <div className="absolute inset-0 bg-black/10"></div>
                                  
                                  {/* Nome do drink sobre a imagem */}
                                  <div className="absolute top-1 md:top-2 lg:top-3 left-1 md:left-2 lg:left-3 right-1 md:right-2 lg:right-3">
                                    <h3 className="text-xs md:text-sm lg:text-lg font-bold text-white text-center leading-tight drop-shadow-lg bg-black/30 px-1 md:px-2 lg:px-3 py-0.5 md:py-1 rounded-lg">
                                      {drink.name}
                                    </h3>
                                  </div>
                                </div>

                                {/* PEQUENOS CARDS EMBAIXO DA IMAGEM */}
                                <div className="p-0.5 md:p-1 lg:p-2 space-y-0.5 md:space-y-1">
                                  {/* Card do Preço */}
                                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg p-0.5 md:p-1">
                                    <div className="flex flex-col items-center">
                                      <div className="text-xs md:text-sm lg:text-base font-bold text-white">
                                        R$ {drink.price.toFixed(2).replace('.', ',')}
                                      </div>
                                      <div className="text-xs text-purple-200 font-medium">
                                        {drink.priceType === 'per_person' ? 'Por pessoa' : 'Por unidade'}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card da Quantidade */}
                                  <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-lg p-0.5 md:p-1">
                                    <div className="flex items-center justify-center space-x-1 md:space-x-2">
                                      <button
                                        onClick={() => handleDrinkQuantityChange(drink.id, -1)}
                                        className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-purple-600/60 hover:bg-purple-600/80 border border-purple-400/50 rounded flex items-center justify-center transition-all duration-200 hover:scale-105"
                                      >
                                        <span className="text-white text-xs font-bold">-</span>
                                      </button>
                                      
                                      <div className="min-w-[20px] md:min-w-[25px] lg:min-w-[30px] text-center">
                                        <span className="text-xs md:text-sm lg:text-sm font-bold text-white">
                                          {selectedDrinks[drink.id] || 0}
                                        </span>
                                      </div>
                                      
                                      <button
                                        onClick={() => handleDrinkQuantityChange(drink.id, 1)}
                                        className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-purple-600/60 hover:bg-purple-600/80 border border-purple-400/50 rounded flex items-center justify-center transition-all duration-200 hover:scale-105"
                                      >
                                        <span className="text-white text-xs font-bold">+</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {mode === 'drinkeira' && (
              <div className="space-y-8 bg-gray-900 p-8 rounded-xl border border-gray-700">
                {/* Abas de Navegação */}
                <div className="flex justify-center gap-4 mb-8">
                  <Button variant={drinkeiraTab === 'caipirinhas' ? 'default' : 'ghost'} onClick={() => setDrinkeiraTab('caipirinhas')} className="text-lg font-semibold text-green-400 hover:bg-green-500/10 hover:text-green-300">Caipirinhas</Button>
                  <Button variant={drinkeiraTab === 'caipiroskas' ? 'default' : 'ghost'} onClick={() => setDrinkeiraTab('caipiroskas')} className="text-lg font-semibold text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">Caipiroskas</Button>
                  <Button variant={drinkeiraTab === 'classicos' ? 'default' : 'ghost'} onClick={() => setDrinkeiraTab('classicos')} className="text-lg font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300">Clássicos</Button>
                </div>
                {/* Bloco informativo do modelo Drinkeira */}
                <section className="container mx-auto px-4 my-8">
                  <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">Como Funciona o Modo Drinkeira</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="inline-block bg-yellow-500 text-white text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full mb-4 mx-auto">1</div>
                        <h4 className="text-xl font-bold text-gray-100 mb-2">Contratação</h4>
                        <p className="text-gray-400">Você paga apenas pelos bartenders e taxa de locomoção</p>
                      </div>
                      <div>
                        <div className="inline-block bg-yellow-500 text-white text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full mb-4 mx-auto">2</div>
                        <h4 className="text-xl font-bold text-gray-100 mb-2">No Evento</h4>
                        <p className="text-gray-400">Bartender monta a drinkeira com todos os sabores disponíveis</p>
                      </div>
                      <div>
                        <div className="inline-block bg-yellow-500 text-white text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full mb-4 mx-auto">3</div>
                        <h4 className="text-xl font-bold text-gray-100 mb-2">Venda Direta</h4>
                        <p className="text-gray-400">Convidados escolhem sabores e pagam preços diferenciados</p>
                      </div>
                    </div>
                  </div>
                </section>
                {/* Lista dinâmica de drinks animada */}
                <div>
                  {drinkeiraTab === 'caipirinhas' && (
                    <div
                      key="caipirinhas"
                      className="p-6 rounded-lg bg-gray-900/90 border-2 border-transparent bg-clip-padding border-gradient-to-br from-purple-700 via-pink-700 to-purple-900 shadow-xl"
                    >
                      <h3 className="text-3xl font-bold text-green-400 mb-6 flex items-center"><Wine className="mr-3 h-8 w-8"/>Caipirinhas Especiais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {caipirinhas.map((drink) => (
                          <Card
                            key={drink.id}
                            className="bg-gray-900/90 border-2 border-transparent bg-clip-padding border-gradient-to-br from-purple-700 via-pink-700 to-purple-900 shadow-xl rounded-2xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
                          >
                            <CardHeader className="pb-2 flex flex-row items-center gap-3">
                              <Wine className="h-7 w-7 text-purple-300 drop-shadow" />
                              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                                {drink.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-700/60 text-white text-lg font-bold shadow">
                                  {drink.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                              </div>
                              <p className="text-gray-100 text-base leading-relaxed">{drink.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  {drinkeiraTab === 'caipiroskas' && (
                    <div
                      key="caipiroskas"
                      className="p-6 rounded-lg bg-gray-900/90 border-2 border-transparent bg-clip-padding border-gradient-to-br from-blue-700 via-cyan-700 to-blue-900 shadow-xl"
                    >
                      <h3 className="text-3xl font-bold text-blue-400 mb-6 flex items-center"><Wine className="mr-3 h-8 w-8"/>Caipiroskas Especiais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {caipiroskas.map((drink) => (
                          <Card
                            key={drink.id}
                            className="bg-gray-900/90 border-2 border-transparent bg-clip-padding border-gradient-to-br from-blue-700 via-cyan-700 to-blue-900 shadow-xl rounded-2xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
                          >
                            <CardHeader className="pb-2 flex flex-row items-center gap-3">
                              <Wine className="h-7 w-7 text-cyan-300 drop-shadow" />
                              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                                {drink.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-700/60 text-white text-lg font-bold shadow">
                                  {drink.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                              </div>
                              <p className="text-gray-100 text-base leading-relaxed">{drink.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  {drinkeiraTab === 'classicos' && (
                    <div
                      key="classicos"
                      className="p-6 rounded-lg bg-gray-900/90 border-2 border-transparent bg-clip-padding border-gradient-to-br from-red-700 via-pink-700 to-red-900 shadow-xl"
                    >
                      <h3 className="text-3xl font-bold text-red-400 mb-6 flex items-center"><Wine className="mr-3 h-8 w-8"/>Outros Clássicos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {outrosClassicos.map((drink) => (
                          <Card
                            key={drink.id}
                            className="bg-gray-900/90 border-2 border-transparent bg-clip-padding border-gradient-to-br from-red-700 via-pink-700 to-red-900 shadow-xl rounded-2xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
                          >
                            <CardHeader className="pb-2 flex flex-row items-center gap-3">
                              <Wine className="h-7 w-7 text-red-300 drop-shadow" />
                              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                                {drink.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-red-700/60 text-white text-lg font-bold shadow">
                                  {drink.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                              </div>
                              <p className="text-gray-100 text-base leading-relaxed">{drink.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-gray-800/90 backdrop-blur-md border-2 border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <CardHeader className="text-center pb-6 relative z-10">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Dados para Orçamento</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Para solicitar seu orçamento, precisamos de algumas informações. Seus dados ficarão salvos para futuras solicitações.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 relative z-10">
              <form onSubmit={handleWelcomeSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-200">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="h-12 bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="age" className="text-sm font-semibold text-gray-200">Idade</Label>
                     <Input 
                       id="age" 
                       type="number" 
                       value={userData.age || ''} 
                       onChange={(e) => setUserData({...userData, age: parseInt(e.target.value)})}
                       className={`h-12 bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-gray-400 ${
                         userData.age > 0 && userData.age < 18 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                       }`}
                       placeholder="Ex: 25"
                       min="18"
                     />
                     {userData.age > 0 && userData.age < 18 && (
                       <p className="text-red-400 text-xs mt-1 flex items-center">
                         <span className="mr-1">⚠</span>
                         É necessário ter pelo menos 18 anos
                       </p>
                     )}
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="state" className="text-sm font-semibold text-gray-200">Estado</Label>
                     <Input 
                       id="state" 
                       value={userData.state} 
                       onChange={(e) => setUserData({...userData, state: e.target.value})}
                       className="h-12 bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-gray-400"
                       placeholder="Ex: Ceará"
                     />
                   </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-200">Cidade</Label>
                  <Input 
                    id="city" 
                    value={userData.city} 
                    onChange={(e) => setUserData({...userData, city: e.target.value})}
                    className="h-12 bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Ex: Fortaleza"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-200">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={userData.phone} 
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="h-12 bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Ex: (85) 99999-9999"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-200">Endereço</Label>
                  <Input 
                    id="address" 
                    value={userData.address} 
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                    className="h-12 bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Digite seu endereço"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!isFormValid} 
                  className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!isFormValid && userData.age > 0 && userData.age < 18 
                    ? 'É necessário ter 18 anos ou mais' 
                    : !isFormValid 
                    ? 'Preencha todos os campos' 
                    : 'Salvar Dados e Continuar'
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Toast */}
      {toast && (
         <div className={`fixed top-5 right-5 p-4 rounded-xl text-white shadow-2xl z-50 max-w-sm border-l-4 ${
           toast.type === 'success' 
             ? 'bg-green-500 border-green-600' 
             : toast.type === 'error'
             ? 'bg-red-500 border-red-600'
             : 'bg-blue-500 border-blue-600'
         }`}>
            <div className="flex items-center space-x-3">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-100" />}
              {toast.type === 'error' && <div className="h-5 w-5 text-red-100">✕</div>}
              {toast.type === 'info' && <div className="h-5 w-5 text-blue-100">ℹ</div>}
              <span className="font-medium text-sm">{toast.message}</span>
            </div>
         </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800/80 backdrop-blur-md border-t border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <Wine className="h-8 w-8 text-purple-400" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TENDERES</h3>
              </div>
              <p className="text-gray-300 mb-4">Transformando eventos em experiências inesquecíveis em Fortaleza e região.</p>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-300">Fortaleza - Ceará</span>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">(85) 99433-0680</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">contato@tenderes.com.br</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">WhatsApp</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-white mb-4">Atendimento</h4>
              <div className="space-y-2 text-gray-300">
                <p>Segunda a Domingo</p>
                <p>24 horas por dia</p>
                <p>Atendimento em toda Fortaleza</p>
                <Badge variant="outline" className="bg-green-900/50 text-green-200 border-green-700/50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Disponível
                </Badge>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center">
            <p className="text-gray-400 text-sm">© 2024 TENDERES - Drinks Premium. Todos os direitos reservados. | Fortaleza - CE</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function WhatsappIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}