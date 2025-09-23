
'use client';

import type { Product, Sale, CashRegisterSummary, Combo } from './types';
import { PlaceHolderImages } from './placeholder-images';

const pastelCarne = PlaceHolderImages.find(p => p.id === 'pastel-carne');
const pastelQueijo = PlaceHolderImages.find(p => p.id === 'pastel-queijo');
const cocaCola = PlaceHolderImages.find(p => p.id === 'coca-cola');

const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Pastel de Carne',
        category: 'Pastéis',
        price: 8.5,
        cost: 3.0,
        stock: 50,
        stockUnit: 'un',
        minStock: 10,
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
        minStock: 10,
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
        minStock: 24,
        imageUrl: cocaCola?.imageUrl || '',
        imageHint: cocaCola?.imageHint || 'soda can'
    }
];

// --- LocalStorage Logic ---
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot save to localStorage: window is not defined.');
    return;
  }
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: serializedValue,
    }));
  } catch (error) {
    console.warn(`Error writing to localStorage key “${key}”:`, error);
  }
}


// Initialize data from localStorage or with initial values
let mockProducts: Product[] = loadFromStorage('products', initialProducts);
let mockCombos: Combo[] = loadFromStorage('combos', []);
let mockSales: Sale[] = loadFromStorage('sales', []);
let mockCashRegister: CashRegisterSummary = loadFromStorage('cashRegister', {
  initial: 0.0,
  sales: 0.0,
  expenses: 0.0,
  withdrawals: 0.0,
  additions: 0.0,
});

// Funções para manipular os dados mockados
export function addSale(sale: Omit<Sale, 'id' | 'date'>) {
  const currentSales = getSales();
  const newSale: Sale = {
    ...sale,
    id: (currentSales.length + 1).toString(),
    date: new Date().toISOString(),
  };

  // Decrement stock for each item sold
  let currentProducts = getProducts();
  newSale.items.forEach(item => {
    const productsToUpdate = 'products' in item.product ? item.product.products : [item.product];
    productsToUpdate.forEach(p => {
       const productIndex = currentProducts.findIndex(mp => mp.id === p.id);
        if (productIndex !== -1) {
          // This logic might be too simple for real-world scenarios (e.g., ingredients)
          // but for now, we decrement the unit stock.
          if(currentProducts[productIndex].stock > 0) {
            currentProducts[productIndex].stock -= item.quantity;
          }
        }
    });
  });
  saveToStorage('products', currentProducts);

  const updatedSales = [newSale, ...currentSales];
  saveToStorage('sales', updatedSales);
  
  const cashRegister = loadFromStorage('cashRegister', mockCashRegister);
  cashRegister.sales += newSale.total;
  saveToStorage('cashRegister', cashRegister);

  return newSale;
}


export function getProducts() {
  return loadFromStorage('products', initialProducts);
}

export function getSales() {
  return loadFromStorage('sales', []);
}

export function addProduct(product: Omit<Product, 'id'>) {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: (products.length > 0 ? Math.max(...products.map(p => parseInt(p.id, 10))) + 1 : 1).toString(),
  };
  const updatedProducts = [newProduct, ...products];
  saveToStorage('products', updatedProducts);
  return newProduct;
}

export function updateProduct(updatedProduct: Product) {
  const products = getProducts();
  const updatedProducts = products.map((p) =>
    p.id === updatedProduct.id ? updatedProduct : p
  );
  saveToStorage('products', updatedProducts);
  return updatedProduct;
}

export function getCombos() {
  return loadFromStorage('combos', []);
}

export function addCombo(combo: Omit<Combo, 'id'>) {
  const combos = getCombos();
  const newCombo: Combo = {
    ...combo,
    id: `combo-${combos.length + 1}`,
  };
  const updatedCombos = [newCombo, ...combos];
  saveToStorage('combos', updatedCombos);
  return newCombo;
}
