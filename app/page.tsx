"use client"

import { useState, useEffect } from "react"
import { Wine, Users, Clock, Calculator, Star, CheckCircle, Sparkles, Heart, Award, Moon, Sun, MapPin, Phone, Mail, MessageCircle, User, Calendar, Home } from "lucide-react"
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
  price: number
  category: string
  image: string
  priceType: "per_person" | "per_unit"
  popular?: boolean
}

interface UserData {
  name: string
  age: number
  address: string
  city: string
  state: string
}

export interface CompletePlan {
  id: string
  name: string
  price: number
  description: string
  drinks: string[]
  popular?: boolean
}

export default function TenderesPage() {
  const { theme, setTheme } = useTheme()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 0,
    address: "",
    city: "",
    state: ""
  })
  const [isFormValid, setIsFormValid] = useState(false)

  // Verificar se o usuário já preencheu os dados
  useEffect(() => {
    const savedUserData = localStorage.getItem("tenderes_user_data")
    if (!savedUserData) {
      setShowWelcomeModal(true)
    } else {
      setUserData(JSON.parse(savedUserData))
    }
  }, [])

  // Validar formulário
  useEffect(() => {
    const isValid = userData.name.trim() !== "" &&
                   userData.age > 0 &&
                   userData.address.trim() !== "" &&
                   userData.city.trim() !== "" &&
                   userData.state.trim() !== ""
    setIsFormValid(isValid)
  }, [userData])

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      localStorage.setItem("tenderes_user_data", JSON.stringify(userData))
      setShowWelcomeModal(false)
      showToast(`Bem-vindo(a), ${userData.name}!`, "success")
    }
  }

  const [drinks, setDrinks] = useState<Drink[]>([
    {
      id: "1",
      name: "Caipirinha Premium",
      price: 12,
      category: "Coquetéis",
      image: "/caipirinha-premium.jpg",
      priceType: "per_unit",
      popular: true,
    },
    {
      id: "caipirinha",
      name: "Caipirinha",
      price: 12,
      category: "Coquetéis",
      image: "/caipirinha.jpg",
      priceType: "per_unit",
    },
    {
      id: "caipiroska",
      name: "Caipiroska",
      price: 12,
      category: "Coquetéis",
      image: "/caipiroska.jpg",
      priceType: "per_unit",
    },
    {
      id: "1a",
      name: "Open Bar Caipirinha",
      price: 60,
      category: "Open Bar",
      image: "/open-bar-caipirinha.jpg",
      priceType: "per_person",
      popular: true,
    },
    {
      id: "1b",
      name: "Open Bar Caipirinha + Caipiroska",
      price: 95,
      category: "Open Bar",
      image: "/open-bar-caipirinha-caipiroska.jpg",
      priceType: "per_person",
      popular: true,
    },
    {
      id: "2",
      name: "Mojito",
      price: 12,
      category: "Coquetéis",
      image: "/mojito.jpg",
      priceType: "per_person",
    },
    {
      id: "3",
      name: "Cuba Libre",
      price: 12,
      category: "Coquetéis",
      image: "/cupa-livre.jpg",
      priceType: "per_person",
    },
    {
      id: "aperol-spritz",
      name: "Aperol Spritz",
      price: 12,
      category: "Coquetéis",
      image: "/aperol-spritz.jpg",
      priceType: "per_person",
    },
    {
      id: "4",
      name: "Gin Tônica",
      price: 12,
      category: "Coquetéis",
      image: "/gin-tonica.jpg",
      priceType: "per_person",
    },
    {
      id: "5",
      name: "Cerveja Artesanal",
      price: 12,
      category: "Cervejas",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
    {
      id: "6",
      name: "Cerveja Premium",
      price: 12,
      category: "Cervejas",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
    {
      id: "7",
      name: "Vinho Tinto",
      price: 12,
      category: "Vinhos",
      image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad04?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
    {
      id: "8",
      name: "Vinho Branco",
      price: 12,
      category: "Vinhos",
      image: "https://images.unsplash.com/photo-1514361892635-cebb9b6c7ca7?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
    {
      id: "9",
      name: "Espumante",
      price: 12,
      category: "Vinhos",
      image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
      popular: true,
    },
    {
      id: "10",
      name: "Água",
      price: 12,
      category: "Não Alcoólicos",
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
    {
      id: "11",
      name: "Refrigerante",
      price: 12,
      category: "Não Alcoólicos",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
    {
      id: "12",
      name: "Suco Natural",
      price: 12,
      category: "Não Alcoólicos",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&crop=center",
      priceType: "per_person",
    },
  ])

  // Planos Completos
  const completePlans: CompletePlan[] = [
    {
      id: "plan-festa",
      name: "Plano Festa",
      price: 1500,
      description: "Ideal para pequenas comemorações, com os drinks mais populares.",
      drinks: ["Caipirinha Premium", "Mojito", "Gin Tônica", "Cuba Libre"],
      popular: true,
    },
    {
      id: "plan-casamento",
      name: "Plano Casamento",
      price: 3500,
      description: "Uma seleção sofisticada para um dia inesquecível.",
      drinks: ["Aperol Spritz", "Gin Tônica", "Espumante", "Vinho Tinto", "Vinho Branco"],
      popular: true,
    },
    {
      id: "plan-corporativo",
      name: "Plano Corporativo",
      price: 2500,
      description: "Opções clássicas e não alcoólicas para eventos de negócios.",
      drinks: ["Gin Tônica", "Cuba Libre", "Suco Natural", "Água", "Refrigerante"],
      popular: false,
    },
  ]
  
  const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>({})
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0)
  const [eventDuration, setEventDuration] = useState<number>(0)
  const [budget, setBudget] = useState<number>(0)
  const [bartenders, setBartenders] = useState<number>(0)
  const [budgetMode, setBudgetMode] = useState<"complete-plan" | "custom" | "drinker-mode">("complete-plan")
  const [selectedPlan, setSelectedPlan] = useState<CompletePlan | null>(null)
  
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

  const handleDrinkQuantityChange = (drinkId: string, quantity: number) => {
    setSelectedDrinks((prev) => {
      const newSelectedDrinks = { ...prev }
      if (quantity > 0) {
        newSelectedDrinks[drinkId] = quantity
      } else {
        delete newSelectedDrinks[drinkId]
      }
      return newSelectedDrinks
    })
  }

  const handleSelectPlan = (plan: CompletePlan) => {
    setSelectedPlan(plan);
    const newSelectedDrinks: Record<string, number> = {};
    drinks.forEach(drink => {
      if (plan.drinks.includes(drink.name)) {
        newSelectedDrinks[drink.id] = 0; // Defaulting to 0, assuming user will specify quantity
      }
    });
    setSelectedDrinks(newSelectedDrinks);
    setBudgetMode('complete-plan');
  };

  const calculateBartenders = () => {
    if (numberOfPeople > 0) {
      const calculatedBartenders = Math.ceil(numberOfPeople / 50)
      setBartenders(calculatedBartenders)
    } else {
      setBartenders(0)
    }
  }

  const calculateBudget = () => {
    let total = 0
    if (budgetMode === "custom") {
      for (const drinkId in selectedDrinks) {
        const drink = drinks.find((d) => d.id === drinkId)
        const quantity = selectedDrinks[drinkId]
        if (drink && quantity > 0) {
          if (drink.priceType === "per_person") {
            total += drink.price * numberOfPeople
          } else {
            total += drink.price * quantity
          }
        }
      }
    } else if (budgetMode === "complete-plan" && selectedPlan) {
      total = selectedPlan.price
    }
    setBudget(total)
  }

  useEffect(() => {
    calculateBudget()
    calculateBartenders()
  }, [selectedDrinks, numberOfPeople, eventDuration, budgetMode, selectedPlan])

  const sendToWhatsApp = () => {
    const formatCurrency = (value: number) => {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    let message = `*Orçamento TENDERES - Drinks Premium*\n\n`
    message += `*Cliente:* ${userData.name}\n`
    message += `*Cidade:* ${userData.city} - ${userData.state}\n`
    message += `--------------------------------------\n`
    message += `*Detalhes do Evento*\n`
    message += `*Número de Pessoas:* ${numberOfPeople}\n`
    message += `*Duração do Evento:* ${eventDuration} horas\n`
    message += `*Bartenders Sugeridos:* ${bartenders}\n`
    message += `--------------------------------------\n`

    if (budgetMode === "complete-plan" && selectedPlan) {
      message += `*Plano Selecionado: ${selectedPlan.name}*\n\n`
      message += `*Drinks Inclusos:*\n`
      selectedPlan.drinks.forEach((drinkName) => {
        message += `- ${drinkName}\n`
      })
    } else {
      message += `*Drinks Selecionados (Plano Personalizado):*\n`
      if (Object.keys(selectedDrinks).length > 0) {
        for (const drinkId in selectedDrinks) {
          const drink = drinks.find((d) => d.id === drinkId)
          if (drink) {
            if (drink.priceType === "per_person") {
              message += `- ${drink.name} (para ${numberOfPeople} pessoas)\n`
            } else {
              message += `- ${selectedDrinks[drinkId]}x ${drink.name}\n`
            }
          }
        }
      } else {
        message += `- Nenhum drink selecionado\n`
      }
    }

    message += `--------------------------------------\n`
    message += `*Orçamento Total Estimado:*\n`
    message += `*${formatCurrency(budget)}*\n\n`
    message += `_Este é um orçamento preliminar. Aguarde nosso contato para confirmação e detalhes adicionais._`

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5585994330680&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-purple-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Wine className="h-8 w-8 md:h-10 md:w-10 text-purple-400" />
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TENDERES
                </h1>
                <div className="flex items-center space-x-2">
                   <p className="text-xs md:text-sm text-gray-300 font-medium">Drinks Premium</p>
                   <Badge variant="outline" className="bg-purple-900/50 text-purple-200 border-purple-700/50 text-xs">
                     <MapPin className="h-3 w-3 mr-1" />
                     Fortaleza - CE
                   </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                     <Button variant="outline" size="sm" className="border-green-600 hover:bg-green-900/50 text-green-300">Ativar</Button>
                  </div>
                 <div className="space-y-3">
                   <Label htmlFor="people" className="flex items-center space-x-2 text-sm font-medium text-gray-200">
                     <Users className="h-4 w-4 text-purple-400" />
                     <span>Número de Pessoas</span>
                   </Label>
                   <Input 
                     type="number" 
                     id="people" 
                     placeholder="Ex: 50" 
                     value={numberOfPeople || ''} 
                     onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                     className="rounded-xl h-12 placeholder-gray-400"
                     min="1"
                   />
                 </div>
                 <div className="space-y-3">
                   <Label htmlFor="hours" className="flex items-center space-x-2 text-sm font-medium text-gray-200">
                     <Clock className="h-4 w-4 text-purple-400" />
                     <span>Duração (horas)</span>
                   </Label>
                   <Input 
                     type="number" 
                     id="hours" 
                     placeholder="Ex: 4" 
                     value={eventDuration || ''} 
                     onChange={(e) => setEventDuration(parseInt(e.target.value))}
                     className="rounded-xl h-12 placeholder-gray-400"
                     min="1"
                     max="12"
                   />
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Drink Selection */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            
             <Card className="rounded-lg text-card-foreground bg-gray-800/80 backdrop-blur-md shadow-xl border-0 border-gray-700">
                <CardContent className="p-4">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                     <Button onClick={() => setBudgetMode('complete-plan')} className={`h-10 px-4 py-6 text-base ${budgetMode === 'complete-plan' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}><Sparkles className="h-5 w-5 mr-2" />Planos Prontos</Button>
                     <Button onClick={() => setBudgetMode('custom')} variant="outline" className={`h-10 px-4 py-6 text-base border-gray-600 text-gray-300 hover:bg-gray-700 ${budgetMode === 'custom' ? 'bg-gray-700' : ''}`}><Calculator className="h-5 w-5 mr-2" />Monte seu Plano</Button>
                     <Button onClick={() => setBudgetMode('drinker-mode')} variant="outline" className={`h-10 px-4 py-6 text-base border-gray-600 text-gray-300 hover:bg-gray-700 ${budgetMode === 'drinker-mode' ? 'bg-gray-700' : ''}`}><Wine className="h-5 w-5 mr-2" />Modo Drinkeira</Button>
                   </div>
                </CardContent>
             </Card>

            {/* Conteúdo dinâmico baseado no modo */}
            {budgetMode === 'complete-plan' && (
              <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0 overflow-hidden border border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center space-x-3 text-2xl text-white">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <span>Planos Completos</span>
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Pacotes prontos para facilitar sua escolha e garantir o sucesso do seu evento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                      {completePlans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => handleSelectPlan(plan)}
                          className={`group relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                            selectedPlan?.id === plan.id
                              ? "border-green-500 shadow-green-500/20"
                              : "border-gray-600 hover:border-green-500/50"
                          }`}
                        >
                          {plan.popular && (
                            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 z-10">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          {selectedPlan?.id === plan.id && (
                            <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 z-10">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Selecionado
                            </Badge>
                          )}
                          <h3 className="text-xl font-bold text-green-300 mb-2">{plan.name}</h3>
                          <p className="text-sm text-gray-300 mb-4 h-10">{plan.description}</p>
                          <div className="mb-4">
                            <p className="text-xs text-gray-400 mb-1">Incluso:</p>
                            <div className="flex flex-wrap gap-2">
                              {plan.drinks.map(drink => (
                                <Badge key={drink} variant="outline" className="text-xs border-green-700 text-green-300">{drink}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-white text-right">R$ {plan.price}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            )}

            {budgetMode === 'custom' && (
              <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0 overflow-hidden border border-gray-700">
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-3 text-2xl text-white">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                         <Wine className="h-6 w-6 text-white" />
                      </div>
                      <span>Monte Seu Plano - Escolha os Drinks</span>
                   </CardTitle>
                   <CardDescription className="text-gray-300">
                      Selecione os drinks e as quantidades para criar um pacote sob medida.
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {drinks.map((drink) => (
                        <DrinkCard 
                           key={drink.id} 
                           drink={drink} 
                           quantity={selectedDrinks[drink.id] || 0}
                           onQuantityChange={handleDrinkQuantityChange}
                        />
                      ))}
                   </div>
                 </CardContent>
              </Card>
            )}

            {budgetMode === 'drinker-mode' && (
               <Card className="bg-gray-800/80 backdrop-blur-md shadow-xl border-0 overflow-hidden border border-gray-700 text-center">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center space-x-3 text-2xl text-white">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                           <Heart className="h-6 w-6 text-white" />
                        </div>
                        <span>Modo Drinkeira</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-gray-300 mb-4">Neste modo, o bartender vai até o seu evento e vende os drinks diretamente aos convidados. Você não tem custo fixo, apenas fornece o espaço!</p>
                     <p className="text-lg font-bold text-green-400">Entre em contato para mais detalhes!</p>
                  </CardContent>
               </Card>
            )}

          </div>
        </div>
      </div>
      
      {/* Budget Summary & CTA */}
      <div className="sticky bottom-0 z-50">
        <div className="container mx-auto px-4 pb-4">
          <div className="bg-gray-900/80 backdrop-blur-lg border-2 border-purple-500/50 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-grow text-center md:text-left">
              <p className="text-sm text-gray-300 font-medium">Orçamento Estimado</p>
              <p className="text-4xl font-bold text-white tracking-tight">{
                budget.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-300">Bartenders</p>
                <p className="text-2xl font-bold text-white">{bartenders}</p>
              </div>
              <Separator orientation="vertical" className="h-10 hidden md:block bg-gray-600"/>
              <Button onClick={sendToWhatsApp} size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg h-16 w-full md:w-auto px-10 rounded-xl shadow-lg">
                <WhatsappIcon className="h-6 w-6 mr-3" />
                Falar com Atendente
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg bg-gray-900 border-purple-700">
            <CardHeader>
              <CardTitle>Bem-vindo(a) à TENDERES!</CardTitle>
              <CardDescription>Para uma melhor experiência, por favor, nos informe alguns dados.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWelcomeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="age">Idade</Label>
                     <Input id="age" type="number" value={userData.age || ''} onChange={(e) => setUserData({...userData, age: parseInt(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="state">Estado</Label>
                     <Input id="state" value={userData.state} onChange={(e) => setUserData({...userData, state: e.target.value})} />
                   </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={userData.city} onChange={(e) => setUserData({...userData, city: e.target.value})} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})} />
                </div>
                <Button type="submit" disabled={!isFormValid} className="w-full bg-purple-600 hover:bg-purple-700">Salvar e Começar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Toast */}
      {toast && (
         <div className={`fixed top-5 right-5 p-4 rounded-lg text-white shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
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

function DrinkCard({ drink, quantity, onQuantityChange }: { drink: Drink, quantity: number, onQuantityChange: (id: string, q: number) => void }) {
  return (
    <Card className="overflow-hidden bg-gray-800/80 border-gray-700 transition-all hover:border-purple-500/50 hover:shadow-lg">
      <CardHeader className="p-0">
        <img src={drink.image} alt={drink.name} className="w-full h-40 object-cover" />
        {drink.popular && <Badge className="absolute top-2 right-2">Popular</Badge>}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg text-white mb-1">{drink.name}</CardTitle>
        <CardDescription className="text-sm text-gray-400 mb-4">{drink.category}</CardDescription>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-purple-400">
            {drink.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            <span className="text-xs text-gray-500"> {drink.priceType === "per_person" ? "/ pessoa" : "/ un"}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={() => onQuantityChange(drink.id, Math.max(0, quantity - 1))}>-</Button>
            <span className="w-10 text-center font-bold text-lg">{quantity}</span>
            <Button size="icon" variant="outline" onClick={() => onQuantityChange(drink.id, quantity + 1)}>+</Button>
          </div>
        </div>
      </CardContent>
    </Card>
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