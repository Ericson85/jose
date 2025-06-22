export interface User {
  id: string
  email: string
  name: string
  role: "developer" | "client" | "owner"
  createdAt: string
}

export interface ClientProfile {
  id: string
  name: string
  email: string
  phone: string
  age: number
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  // Dados protegidos - não visíveis para o proprietário
  protectedData: {
    bankAccount?: string
    creditCard?: string
    cpf?: string
  }
  preferences: {
    favoriteEvents: string[]
    budget: string
  }
  createdAt: string
}

export interface EventTemplate {
  id: string
  name: string
  description: string
  suggestedDrinks: string[]
  estimatedPeople: number
  estimatedHours: number
  category: string
  createdBy: string
  createdAt: string
}
