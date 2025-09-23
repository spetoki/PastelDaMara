import type { Product, Sale, StockItem } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pastel de Carne',
    category: 'Pastéis',
    price: 8.5,
    cost: 2.5,
    stock: 50,
    stockUnit: 'un',
    imageUrl: 'https://picsum.photos/seed/pastel1/200/200',
    imageHint: 'food pastel',
  },
  {
    id: '2',
    name: 'Pastel de Queijo',
    category: 'Pastéis',
    price: 8.0,
    cost: 2.2,
    stock: 45,
    stockUnit: 'un',
    imageUrl: 'https://picsum.photos/seed/pastel2/200/200',
    imageHint: 'cheese pastel',
  },
  {
    id: '3',
    name: 'Coca-Cola Lata 350ml',
    category: 'Bebidas',
    price: 5.0,
    cost: 2.0,
    stock: 100,
    stockUnit: 'un',
    imageUrl: 'https://picsum.photos/seed/soda1/200/200',
    imageHint: 'soda can',
  },
  {
    id: '4',
    name: 'Pastel de Frango com Catupiry',
    category: 'Pastéis',
    price: 9.0,
    cost: 3.0,
    stock: 30,
    stockUnit: 'un',
    imageUrl: 'https://picsum.photos/seed/pastel3/200/200',
    imageHint: 'chicken pastel',
  },
  {
    id: '5',
    name: 'Guaraná Antarctica 350ml',
    category: 'Bebidas',
    price: 5.0,
    cost: 2.0,
    stock: 80,
    stockUnit: 'un',
    imageUrl: 'https://picsum.photos/seed/soda2/200/200',
    imageHint: 'soda can green',
  },
];

export const mockStockItems: StockItem[] = [
  { id: '1', name: 'Farinha de Trigo', stock: 5000, unit: 'g', minStock: 1000 },
  { id: '2', name: 'Carne Moída', stock: 2500, unit: 'g', minStock: 500 },
  { id: '3', name: 'Queijo Mussarela', stock: 800, unit: 'g', minStock: 300 },
  { id: '4', name: 'Óleo de Soja', stock: 3000, unit: 'ml', minStock: 1000 },
  { id: '5', name: 'Frango Desfiado', stock: 1500, unit: 'g', minStock: 400 },
  { id: '6', name: 'Tomate', stock: 2000, unit: 'g', minStock: 500 },
];

export const mockSales: Sale[] = [
  {
    id: 'SALE001',
    date: '2024-07-28T10:30:00Z',
    items: [
      { product: mockProducts[0], quantity: 2 },
      { product: mockProducts[2], quantity: 1 },
    ],
    total: 22.0,
    paymentMethod: 'Pix',
  },
  {
    id: 'SALE002',
    date: '2024-07-28T11:15:00Z',
    items: [{ product: mockProducts[1], quantity: 4 }],
    total: 32.0,
    paymentMethod: 'Cartão',
  },
  {
    id: 'SALE003',
    date: '2024-07-28T12:00:00Z',
    items: [
      { product: mockProducts[3], quantity: 1 },
      { product: mockProducts[4], quantity: 1 },
    ],
    total: 14.0,
    paymentMethod: 'Dinheiro',
  },
];
