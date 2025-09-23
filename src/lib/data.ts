import type { Product, Sale, StockItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

const pastelCarne = PlaceHolderImages.find(p => p.id === 'pastel-carne');
const pastelQueijo = PlaceHolderImages.find(p => p.id === 'pastel-queijo');
const cocaCola = PlaceHolderImages.find(p => p.id === 'coca-cola');


export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Pastel de Carne',
        category: 'Pastéis',
        price: 8.5,
        cost: 3.0,
        stock: 50,
        stockUnit: 'un',
        imageUrl: pastelCarne?.imageUrl || '',
        imageHint: pastelCarne?.imageHint || 'food pastel'
    },
    {
        id: '2',
        name: 'Pastel de Queijo',
        category: 'Pastéis',
        price: 8.0,
        cost: 2.8,
        stock: 40,
        stockUnit: 'un',
        imageUrl: pastelQueijo?.imageUrl || '',
        imageHint: pastelQueijo?.imageHint || 'cheese pastel'
    },
    {
        id: '3',
        name: 'Coca-Cola Lata',
        category: 'Bebidas',
        price: 5.0,
        cost: 2.2,
        stock: 100,
        stockUnit: 'un',
        imageUrl: cocaCola?.imageUrl || '',
        imageHint: cocaCola?.imageHint || 'soda can'
    }
];

export const mockStockItems: StockItem[] = [
  { id: '1', name: 'Farinha de Trigo', stock: 5000, unit: 'g', minStock: 1000 },
  { id: '2', name: 'Carne Moída', stock: 2500, unit: 'g', minStock: 500 },
  { id: '3', name: 'Queijo Mussarela', stock: 800, unit: 'g', minStock: 300 },
  { id: '4', name: 'Óleo de Soja', stock: 3000, unit: 'ml', minStock: 1000 },
  { id: '5', name: 'Frango Desfiado', stock: 1500, unit: 'g', minStock: 400 },
  { id: '6', name: 'Tomate', stock: 2000, unit: 'g', minStock: 500 },
];

export const mockSales: Sale[] = [];
