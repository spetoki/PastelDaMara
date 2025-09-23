import type { Product, Sale, StockItem } from './types';

export const mockProducts: Product[] = [];

export const mockStockItems: StockItem[] = [
  { id: '1', name: 'Farinha de Trigo', stock: 5000, unit: 'g', minStock: 1000 },
  { id: '2', name: 'Carne Moída', stock: 2500, unit: 'g', minStock: 500 },
  { id: '3', name: 'Queijo Mussarela', stock: 800, unit: 'g', minStock: 300 },
  { id: '4', name: 'Óleo de Soja', stock: 3000, unit: 'ml', minStock: 1000 },
  { id: '5', name: 'Frango Desfiado', stock: 1500, unit: 'g', minStock: 400 },
  { id: '6', name: 'Tomate', stock: 2000, unit: 'g', minStock: 500 },
];

export const mockSales: Sale[] = [];
