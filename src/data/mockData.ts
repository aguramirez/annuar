// src/data/mockData.ts
// This file centralizes all our mocked data for the cinema frontend

// Mock data for premium tickets - in real app, this would come from context or API
export const mockPremiumTickets = [
  {
    id: 'pt-1',
    issueDate: '2025-05-01',
    expiryDate: '2025-07-31',
    status: 'available' as const,
    source: 'monthly' as const
  },
  {
    id: 'pt-2',
    issueDate: '2025-05-01',
    expiryDate: '2025-07-31',
    status: 'available' as const,
    source: 'monthly' as const
  },
  {
    id: 'pt-3',
    issueDate: '2025-04-01',
    expiryDate: '2025-06-30',
    status: 'available' as const,
    source: 'monthly' as const
  },
  {
    id: 'pt-4',
    issueDate: '2025-04-01',
    expiryDate: '2025-06-30',
    status: 'used' as const,
    usedForMovieId: '2',
    usedForMovieTitle: 'Capitan America: Un Nuevo Mundo',
    usedDate: '2025-04-15',
    source: 'monthly' as const
  },
  {
    id: 'pt-5',
    issueDate: '2025-03-01',
    expiryDate: '2025-05-31',
    status: 'available' as const,
    source: 'monthly' as const
  },
  {
    id: 'pt-6',
    issueDate: '2025-03-01',
    expiryDate: '2025-05-31',
    status: 'used' as const,
    usedForMovieId: '1',
    usedForMovieTitle: 'Minecraft',
    usedDate: '2025-03-20',
    source: 'monthly' as const
  },
  {
    id: 'pt-7',
    issueDate: '2025-02-01',
    expiryDate: '2025-04-30',
    status: 'expired' as const,
    source: 'monthly' as const
  },
  {
    id: 'pt-8',
    issueDate: '2025-01-15',
    expiryDate: '2025-05-30',
    status: 'available' as const,
    source: 'refund' as const,
    refundOrderId: 'order-789'
  }
];

// Mock purchase history
export const mockPurchaseHistory = [
  {
    id: 'order123',
    date: '2025-05-10',
    total: 2400,
    items: [
      {
        type: 'ticket' as const,
        movie: 'Minecraft',
        quantity: 2,
        unitPrice: 1000,
        showtime: '2025-05-10 15:30',
        seats: ['A5', 'A6'],
        room: 'Sala 1'
      },
      {
        type: 'product' as const,
        name: 'Combo Pareja',
        quantity: 1,
        unitPrice: 400
      }
    ],
    status: 'active' as const,
    canCancel: true,
    refundStatus: null,
    refundAmount: null,
    canceledReason: null
  },
  {
    id: 'order456',
    date: '2025-04-25',
    total: 3200,
    items: [
      {
        type: 'ticket' as const,
        movie: 'Thunderbolts',
        quantity: 3,
        unitPrice: 900,
        showtime: '2025-04-25 19:45',
        seats: ['C10', 'C11', 'C12'],
        room: 'Sala 2'
      },
      {
        type: 'product' as const,
        name: 'Combo Familiar',
        quantity: 1,
        unitPrice: 500
      }
    ],
    status: 'completed' as const,
    canCancel: false,
    refundStatus: null,
    refundAmount: null,
    canceledReason: null
  },
  {
    id: 'order789',
    date: '2025-04-12',
    total: 1200,
    items: [
      {
        type: 'ticket' as const,
        movie: 'Karate Kid',
        quantity: 2,
        unitPrice: 600,
        showtime: '2025-04-12 21:00',
        seats: ['F8', 'F9'],
        room: 'Sala 3'
      }
    ],
    status: 'canceled' as const,
    canCancel: false,
    refundStatus: 'completed',
    refundAmount: 1200,
    canceledReason: 'Cambio de planes'
  },
  {
    id: 'order101',
    date: '2025-03-30',
    total: 750,
    items: [
      {
        type: 'product' as const,
        name: 'Popcorn Grande',
        quantity: 1,
        unitPrice: 450
      },
      {
        type: 'product' as const,
        name: 'Gaseosa Mediana',
        quantity: 2,
        unitPrice: 150
      }
    ],
    status: 'completed' as const,
    canCancel: false,
    refundStatus: null,
    refundAmount: null,
    canceledReason: null
  }
];

// Mock employee data for sales metrics
export const mockEmployeeSalesData = [
  {
    id: 1,
    name: "María García",
    position: "Cajero/a",
    salesData: [
      { date: "2025-05-01", ticketSales: 15000, candySales: 8000, totalSales: 23000, transactions: 42, averageTransaction: 547.62, expectedCash: 23000, reportedCash: 23000, variance: 0, variances: [] },
      { date: "2025-05-02", ticketSales: 18500, candySales: 9200, totalSales: 27700, transactions: 51, averageTransaction: 543.14, expectedCash: 27700, reportedCash: 27300, variance: -400, variances: [{ type: "Candy", amount: -400, reason: "Error en cálculo" }] },
      { date: "2025-05-03", ticketSales: 22400, candySales: 12500, totalSales: 34900, transactions: 65, averageTransaction: 536.92, expectedCash: 34900, reportedCash: 34900, variance: 0, variances: [] },
      { date: "2025-05-04", ticketSales: 24000, candySales: 15800, totalSales: 39800, transactions: 72, averageTransaction: 552.78, expectedCash: 39800, reportedCash: 39800, variance: 0, variances: [] },
      { date: "2025-05-05", ticketSales: 12000, candySales: 6500, totalSales: 18500, transactions: 35, averageTransaction: 528.57, expectedCash: 18500, reportedCash: 18500, variance: 0, variances: [] }
    ],
    totalSales: 143900,
    averageVariance: -80
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    position: "Cajero/a",
    salesData: [
      { date: "2025-05-01", ticketSales: 12500, candySales: 6800, totalSales: 19300, transactions: 38, averageTransaction: 507.89, expectedCash: 19300, reportedCash: 18800, variance: -500, variances: [{ type: "Ticket", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-02", ticketSales: 14200, candySales: 7300, totalSales: 21500, transactions: 41, averageTransaction: 524.39, expectedCash: 21500, reportedCash: 21000, variance: -500, variances: [{ type: "Candy", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-03", ticketSales: 18300, candySales: 8900, totalSales: 27200, transactions: 55, averageTransaction: 494.55, expectedCash: 27200, reportedCash: 26700, variance: -500, variances: [{ type: "Candy", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-04", ticketSales: 21500, candySales: 11200, totalSales: 32700, transactions: 63, averageTransaction: 519.05, expectedCash: 32700, reportedCash: 32200, variance: -500, variances: [{ type: "Ticket", amount: -500, reason: "Pendiente de investigación" }] },
      { date: "2025-05-05", ticketSales: 10500, candySales: 5800, totalSales: 16300, transactions: 30, averageTransaction: 543.33, expectedCash: 16300, reportedCash: 15800, variance: -500, variances: [{ type: "Candy", amount: -500, reason: "Pendiente de investigación" }] }
    ],
    totalSales: 117000,
    averageVariance: -500,
    isFlagged: true
  },
  {
    id: 3,
    name: "Ana Martínez",
    position: "Cajero/a Senior",
    salesData: [
      { date: "2025-05-01", ticketSales: 19500, candySales: 12000, totalSales: 31500, transactions: 58, averageTransaction: 543.10, expectedCash: 31500, reportedCash: 31800, variance: 300, variances: [{ type: "Candy", amount: 300, reason: "Error en cálculo" }] },
      { date: "2025-05-02", ticketSales: 22300, candySales: 13500, totalSales: 35800, transactions: 64, averageTransaction: 559.38, expectedCash: 35800, reportedCash: 35800, variance: 0, variances: [] },
      { date: "2025-05-03", ticketSales: 25800, candySales: 16200, totalSales: 42000, transactions: 75, averageTransaction: 560.00, expectedCash: 42000, reportedCash: 42000, variance: 0, variances: [] },
      { date: "2025-05-04", ticketSales: 28500, candySales: 18000, totalSales: 46500, transactions: 82, averageTransaction: 567.07, expectedCash: 46500, reportedCash: 46500, variance: 0, variances: [] },
      { date: "2025-05-05", ticketSales: 15200, candySales: 9500, totalSales: 24700, transactions: 45, averageTransaction: 548.89, expectedCash: 24700, reportedCash: 24700, variance: 0, variances: [] }
    ],
    totalSales: 180500,
    averageVariance: 60
  }
];

// Mock movie license contracts data for tracking licenses and payment schedules
export const mockMovieContracts = [
  {
    id: 1,
    movieTitle: "Minecraft",
    studio: "Warner Bros. Pictures",
    licenseType: "Standard",
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    revenueSplit: 60, // Percentage that goes to the studio
    minimumGuarantee: 20000,
    currentRevenue: 85400,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-30",
    notes: "Contrato estándar, 60/40 split durante las primeras 8 semanas.",
    attachments: ["minecraft_contract.pdf", "addendum_1.pdf"],
    status: "active",
    daysLeft: 16
  },
  {
    id: 2,
    movieTitle: "Capitan America: Un Nuevo Mundo",
    studio: "Disney/Marvel",
    licenseType: "Premium",
    startDate: "2025-04-01",
    endDate: "2025-06-15",
    revenueSplit: 70, // Percentage that goes to the studio
    minimumGuarantee: 35000,
    currentRevenue: 124800,
    paymentStatus: "Pending",
    lastPaymentDate: "2025-04-15",
    nextPaymentDue: "2025-05-15",
    notes: "Contrato premium, 70/30 split durante toda la exhibición. Mínimo de 45 funciones por semana.",
    attachments: ["captain_america_contract.pdf"],
    status: "active",
    daysLeft: 31,
    pendingPaymentAmount: 25600
  },
  {
    id: 3,
    movieTitle: "Blanca Nieves",
    studio: "Disney",
    licenseType: "Standard",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    revenueSplit: 55, // Percentage that goes to the studio
    minimumGuarantee: 15000,
    currentRevenue: 42300,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-30",
    notes: "Película familiar con buen desempeño en sesiones matinales.",
    attachments: ["snow_white_contract.pdf"],
    status: "active",
    daysLeft: 0,
    warningDays: true
  },
  {
    id: 4,
    movieTitle: "Thunderbolts",
    studio: "Disney/Marvel",
    licenseType: "Premium",
    startDate: "2025-04-10",
    endDate: "2025-06-30",
    revenueSplit: 65, // Percentage that goes to the studio
    minimumGuarantee: 30000,
    currentRevenue: 78600,
    paymentStatus: "Pending",
    lastPaymentDate: "2025-04-30",
    nextPaymentDue: "2025-05-15",
    notes: "Contrato premium con exhibición en salas premium obligatoria.",
    attachments: ["thunderbolts_contract.pdf", "marketing_requirements.pdf"],
    status: "active",
    daysLeft: 46,
    pendingPaymentAmount: 18700
  },
  {
    id: 5,
    movieTitle: "Karate Kid",
    studio: "Sony Pictures",
    licenseType: "Standard",
    startDate: "2025-04-01",
    endDate: "2025-05-31",
    revenueSplit: 55, // Percentage that goes to the studio
    minimumGuarantee: 18000,
    currentRevenue: 38200,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-30",
    notes: "Contrato estándar, posibilidad de extensión basada en desempeño.",
    attachments: ["karate_kid_contract.pdf"],
    status: "active",
    daysLeft: 16
  },
  {
    id: 6,
    movieTitle: "Mazel Tov",
    studio: "Warner Bros. Pictures",
    licenseType: "Indie/Special",
    startDate: "2025-03-25",
    endDate: "2025-05-10",
    revenueSplit: 50, // Percentage that goes to the studio
    minimumGuarantee: 8000,
    currentRevenue: 12300,
    paymentStatus: "Paid",
    lastPaymentDate: "2025-04-15",
    notes: "Película de arte con condiciones especiales, mínimo de 14 funciones por semana.",
    attachments: ["mazel_tov_contract.pdf"],
    status: "expired",
    daysLeft: -5
  }
];

// Mock upcoming contracts (movies that will be available soon)
export const mockUpcomingContracts = [
  {
    id: 101,
    movieTitle: "Dune Parte 3",
    studio: "Warner Bros. Pictures",
    licenseType: "Premium",
    startDate: "2025-06-15",
    endDate: "2025-08-31",
    revenueSplit: 75, // Percentage that goes to the studio
    minimumGuarantee: 45000,
    status: "pending_signature",
    notes: "Contrato premium para una de las películas más esperadas del año.",
    daysToStart: 31
  },
  {
    id: 102,
    movieTitle: "Avatar 3",
    studio: "Disney/20th Century",
    licenseType: "Premium Plus",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    revenueSplit: 80, // Percentage that goes to the studio
    minimumGuarantee: 60000,
    status: "negotiation",
    notes: "En negociación, se espera firmar antes del 30 de mayo.",
    daysToStart: 47
  },
  {
    id: 103,
    movieTitle: "Gladiador II",
    studio: "Paramount Pictures",
    licenseType: "Premium",
    startDate: "2025-06-01",
    endDate: "2025-08-15",
    revenueSplit: 70, // Percentage that goes to the studio
    minimumGuarantee: 40000,
    status: "confirmed",
    notes: "Contrato confirmado, pendiente de recibir documentación final.",
    daysToStart: 17
  }
];

// Candy Store Products with Stock Management
export const candyProducts = [
  {
    id: '1',
    name: 'Combo Familiar',
    description: 'Popcorn grande + 4 Gaseosas medianas + 2 Chocolates',
    price: 2000,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000198.png?v=00002574',
    category: 'combos',
    discount: 20,
    popular: true,
    stock: 35
  },
  {
    id: '2',
    name: 'Combo Pareja',
    description: 'Popcorn grande + 2 Gaseosas medianas',
    price: 1400,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000196.png?v=00002574',
    category: 'combos',
    discount: 15,
    popular: true,
    stock: 25
  },
  {
    id: '3',
    name: 'Popcorn Grande',
    description: 'Popcorn recién hecho en balde grande',
    price: 800,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000011.png?v=00002574',
    category: 'popcorn',
    popular: true,
    stock: 80
  },
  {
    id: '4',
    name: 'Popcorn Mediano',
    description: 'Popcorn recién hecho en balde mediano',
    price: 600,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000010.png?v=00002574',
    category: 'popcorn',
    stock: 120
  },
  {
    id: '5',
    name: 'Nachos con Queso',
    description: 'Crujientes nachos con salsa de queso',
    price: 700,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000038.png?v=00002574',
    category: 'snacks',
    popular: true,
    stock: 45
  },
  {
    id: '6',
    name: 'Gaseosa Grande',
    description: 'Coca-Cola, Sprite o Fanta (selecciona al retirar)',
    price: 400,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000028.png?v=00002574',
    category: 'drinks',
    stock: 150
  },
  {
    id: '7',
    name: 'Gaseosa Mediana',
    description: 'Coca-Cola, Sprite o Fanta (selecciona al retirar)',
    price: 300,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000027.png?v=00002574',
    category: 'drinks',
    stock: 200
  },
  {
    id: '8',
    name: 'Agua Mineral',
    description: 'Botella de agua mineral 500ml',
    price: 200,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000000013.png?v=00002574',
    category: 'drinks',
    stock: 120
  },
  {
    id: '9',
    name: 'Chocolate',
    description: 'Barra de chocolate con leche',
    price: 250,
    imageUrl: 'https://static.cinemarkhoyts.com.ar/Images/ConcessionItemImageN/A000004153.png?v=00002574',
    category: 'sweets',
    stock: 75
  }
];

// Mock user with subscription status, premium tickets, etc.
export const mockUserProfile = {
  id: 'user1',
  name: 'Alberto Rodríguez',
  email: 'alberto.rodriguez@gmail.com',
  phone: '388-155-123456',
  birthdate: '1985-05-15',
  address: 'Av. San Martín 456, San Salvador de Jujuy',
  memberSince: '2023-03-10',
  isPremium: true,
  premiumPlan: 'premium-black', // 'premium-basic', 'premium-plus', 'premium-black'
  premiumUntil: '2025-03-10',
  premiumTicketsLeft: 2, // For the current month
  premiumTicketsTotal: 2, // Per month entitlement
  accumulatedPremiumTickets: 4, // Total premium tickets accumulated
  points: 850
};

// Price configurations and discounts
export const priceConfiguration = {
  ticketTypes: [
    { id: 'adult', name: 'Adulto', price: 1000, premiumDiscount: 20 },
    { id: 'child', name: 'Niño', price: 700, premiumDiscount: 15 },
    { id: 'senior', name: 'Jubilado', price: 600, premiumDiscount: 10 },
    { id: 'student', name: 'Estudiante', price: 800, premiumDiscount: 15 }
  ],
  seatTypes: [
    { type: 'standard', priceMultiplier: 1.0 },
    { type: 'premium', priceMultiplier: 1.2 },
    { type: 'vip', priceMultiplier: 1.5 },
    { type: 'accessible', priceMultiplier: 0.8 }
  ],
  premiumPlans: [
    { 
      id: 'premium-basic', 
      name: 'Premium Básico', 
      price: 1500, 
      ticketsPerMonth: 1, 
      candyDiscount: 10, 
      ticketDiscount: 10,
      accumulation: 60 // Days tickets can accumulate
    },
    { 
      id: 'premium-plus', 
      name: 'Premium Plus', 
      price: 2500, 
      ticketsPerMonth: 2, 
      candyDiscount: 15, 
      ticketDiscount: 15,
      accumulation: 60 // Days tickets can accumulate
    },
    { 
      id: 'premium-black', 
      name: 'Premium Black', 
      price: 3500, 
      ticketsPerMonth: 4, 
      candyDiscount: 20, 
      ticketDiscount: 20,
      accumulation: 90 // Days tickets can accumulate
    }
  ]
};

// Utility functions for pricing and discounts
export const calculateDiscountedPrice = (
  originalPrice: number, 
  discountPercentage: number
): number => {
  return originalPrice * (1 - discountPercentage / 100);
};

export const getPremiumDiscount = (userId: string, itemType: 'ticket' | 'candy'): number => {
  // In a real app, you would look up the user's premium status
  // For now, just return a hardcoded discount based on the mock user
  
  if (mockUserProfile.isPremium) {
    const plan = priceConfiguration.premiumPlans.find(p => p.id === mockUserProfile.premiumPlan);
    if (!plan) return 0;
    
    return itemType === 'ticket' ? plan.ticketDiscount : plan.candyDiscount;
  }
  
  return 0;
};

export const getUserPremiumTickets = (): typeof mockPremiumTickets => {
  // In a real app, this would be an API call based on user ID
  return mockPremiumTickets;
};

export const getUserPurchaseHistory = (): typeof mockPurchaseHistory => {
  // In a real app, this would be an API call based on user ID
  return mockPurchaseHistory;
};