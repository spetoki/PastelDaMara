import type { Product, Sale, StockItem, CashRegisterSummary, Combo } from './types';
import { PlaceHolderImages } from './placeholder-images';

const pastelCarne = PlaceHolderImages.find(p => p.id === 'pastel-carne');
const pastelQueijo = PlaceHolderImages.find(p => p.id === 'pastel-queijo');
const cocaCola = PlaceHolderImages.find(p => p.id === 'coca-cola');


export let mockProducts: Product[] = [
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

export let mockCombos: Combo[] = [];
export let mockSales: Sale[] = [];

export let mockCashRegister: CashRegisterSummary = {
  initial: 0.0,
  sales: 0.0,
  expenses: 0.0,
  withdrawals: 0.0,
  additions: 0.0,
};

// Funções para manipular os dados mockados
export function addSale(sale: Omit<Sale, 'id' | 'date'>) {
  const newSale: Sale = {
    ...sale,
    id: (mockSales.length + 1).toString(),
    date: new Date().toISOString(),
  };

  // Decrement stock for each item sold
  newSale.items.forEach(item => {
    if ('products' in item.product) { // It's a combo
      item.product.products.forEach(p => {
        const productIndex = mockProducts.findIndex(mp => mp.id === p.id);
        if (productIndex !== -1) {
          mockProducts[productIndex].stock -= item.quantity;
        }
      });
    } else { // It's a single product
      const productIndex = mockProducts.findIndex(mp => mp.id === item.product.id);
      if (productIndex !== -1) {
          mockProducts[productIndex].stock -= item.quantity;
      }
    }
  });


  mockSales.push(newSale);
  mockCashRegister.sales += newSale.total;
  return newSale;
}


export function getProducts() {
  return mockProducts;
}

export function addProduct(product: Omit<Product, 'id'>) {
  const newProduct: Product = {
    ...product,
    id: (mockProducts.length + 1).toString(),
  };
  mockProducts = [newProduct, ...mockProducts];
  return newProduct;
}

export function updateProduct(updatedProduct: Product) {
  mockProducts = mockProducts.map((p) =>
    p.id === updatedProduct.id ? updatedProduct : p
  );
  return updatedProduct;
}

export function getCombos() {
  return mockCombos;
}

export function addCombo(combo: Omit<Combo, 'id'>) {
  const newCombo: Combo = {
    ...combo,
    id: `combo-${mockCombos.length + 1}`,
  };
  mockCombos = [newCombo, ...mockCombos];
  return newCombo;
}
