// src/common/services/candyService.ts
import { apiRequest } from './apiClient';

export interface CandyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'popcorn' | 'drinks' | 'snacks' | 'combos' | 'sweets';
  available: boolean;
  isPopular?: boolean;
  discount?: number; // Percentage discount
}

export interface CandyCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Mock data for products
const mockProducts: CandyProduct[] = [
  {
    id: '1',
    name: 'Popcorn Grande',
    description: 'Delicioso popcorn recién hecho en balde grande',
    price: 650,
    imageUrl: 'https://via.placeholder.com/300?text=Popcorn+Grande',
    category: 'popcorn',
    available: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Popcorn Mediano',
    description: 'Popcorn recién hecho en balde mediano',
    price: 450,
    imageUrl: 'https://via.placeholder.com/300?text=Popcorn+Mediano',
    category: 'popcorn',
    available: true
  },
  {
    id: '3',
    name: 'Popcorn Pequeño',
    description: 'Popcorn recién hecho en balde pequeño',
    price: 350,
    imageUrl: 'https://via.placeholder.com/300?text=Popcorn+Pequeño',
    category: 'popcorn',
    available: true
  },
  {
    id: '4',
    name: 'Gaseosa Grande',
    description: 'Refresco de cola, sprite o fanta (selecciona al retirar)',
    price: 450,
    imageUrl: 'https://via.placeholder.com/300?text=Gaseosa+Grande',
    category: 'drinks',
    available: true,
    isPopular: true
  },
  {
    id: '5',
    name: 'Gaseosa Mediana',
    description: 'Refresco de cola, sprite o fanta (selecciona al retirar)',
    price: 350,
    imageUrl: 'https://via.placeholder.com/300?text=Gaseosa+Mediana',
    category: 'drinks',
    available: true
  },
  {
    id: '6',
    name: 'Agua Mineral',
    description: 'Botella de agua mineral de 500ml',
    price: 250,
    imageUrl: 'https://via.placeholder.com/300?text=Agua+Mineral',
    category: 'drinks',
    available: true
  },
  {
    id: '7',
    name: 'Nachos con Queso',
    description: 'Crujientes nachos con salsa de queso',
    price: 550,
    imageUrl: 'https://via.placeholder.com/300?text=Nachos+Queso',
    category: 'snacks',
    available: true,
    isPopular: true
  },
  {
    id: '8',
    name: 'Hot Dog',
    description: 'Hot dog con salchicha premium y pan suave',
    price: 500,
    imageUrl: 'https://via.placeholder.com/300?text=Hot+Dog',
    category: 'snacks',
    available: true
  },
  {
    id: '9',
    name: 'Chocolatinas',
    description: 'Surtido de chocolates de primera calidad',
    price: 300,
    imageUrl: 'https://via.placeholder.com/300?text=Chocolatinas',
    category: 'sweets',
    available: true
  },
  {
    id: '10',
    name: 'Combo Individual',
    description: 'Popcorn mediano + Gaseosa mediana',
    price: 750,
    imageUrl: 'https://via.placeholder.com/300?text=Combo+Individual',
    category: 'combos',
    available: true,
    isPopular: true,
    discount: 10
  },
  {
    id: '11',
    name: 'Combo Pareja',
    description: 'Popcorn grande + 2 Gaseosas medianas',
    price: 1100,
    imageUrl: 'https://via.placeholder.com/300?text=Combo+Pareja',
    category: 'combos',
    available: true,
    isPopular: true,
    discount: 15
  },
  {
    id: '12',
    name: 'Combo Familiar',
    description: 'Popcorn grande + Nachos + 4 Gaseosas medianas',
    price: 1800,
    imageUrl: 'https://via.placeholder.com/300?text=Combo+Familiar',
    category: 'combos',
    available: true,
    discount: 20
  },
  {
    id: '13',
    name: 'Combo Snack',
    description: 'Nachos con queso + Gaseosa mediana',
    price: 850,
    imageUrl: 'https://via.placeholder.com/300?text=Combo+Snack',
    category: 'combos',
    available: true,
    discount: 10
  },
  {
    id: '14',
    name: 'Gomitas Surtidas',
    description: 'Bolsa de gomitas de diferentes sabores',
    price: 280,
    imageUrl: 'https://via.placeholder.com/300?text=Gomitas',
    category: 'sweets',
    available: true
  },
  {
    id: '15',
    name: 'Maní con Chocolate',
    description: 'Bolsa de maní cubierto con chocolate',
    price: 320,
    imageUrl: 'https://via.placeholder.com/300?text=Mani+Chocolate',
    category: 'sweets',
    available: true
  }
];

// Mock categories
const mockCategories: CandyCategory[] = [
  {
    id: 'popcorn',
    name: 'Popcorn',
    description: 'Nuestro delicioso popcorn recién hecho',
    imageUrl: 'https://via.placeholder.com/50?text=Popcorn'
  },
  {
    id: 'drinks',
    name: 'Bebidas',
    description: 'Refrescos y bebidas para acompañar tu película',
    imageUrl: 'https://via.placeholder.com/50?text=Bebidas'
  },
  {
    id: 'snacks',
    name: 'Snacks',
    description: 'Deliciosos snacks para disfrutar durante la función',
    imageUrl: 'https://via.placeholder.com/50?text=Snacks'
  },
  {
    id: 'sweets',
    name: 'Dulces',
    description: 'Variedad de dulces para los amantes de lo dulce',
    imageUrl: 'https://via.placeholder.com/50?text=Dulces'
  },
  {
    id: 'combos',
    name: 'Combos',
    description: 'Nuestras mejores combinaciones a un precio especial',
    imageUrl: 'https://via.placeholder.com/50?text=Combos'
  }
];

// This would normally fetch from the API, but we'll use mock data
const candyService = {
  /**
   * Get all candy products
   */
  getAllProducts: async (): Promise<CandyProduct[]> => {
    // In a real app, this would be: return apiRequest<CandyProduct[]>({ method: 'GET', url: '/candy/products' });
    return Promise.resolve(mockProducts);
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (category: string): Promise<CandyProduct[]> => {
    // In a real app, this would fetch from the API
    return Promise.resolve(
      mockProducts.filter(product => product.category === category)
    );
  },

  /**
   * Get popular products
   */
  getPopularProducts: async (): Promise<CandyProduct[]> => {
    // In a real app, this would fetch from the API
    return Promise.resolve(
      mockProducts.filter(product => product.isPopular)
    );
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: string): Promise<CandyProduct | undefined> => {
    // In a real app, this would fetch from the API
    return Promise.resolve(
      mockProducts.find(product => product.id === id)
    );
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<CandyCategory[]> => {
    // In a real app, this would fetch from the API
    return Promise.resolve(mockCategories);
  }
};

export default candyService;