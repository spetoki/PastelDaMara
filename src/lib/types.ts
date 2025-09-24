export type ProductCategory = 'Pastéis' | 'Bebidas' | 'Outros';
export type StockUnit = 'g' | 'kg' | 'ml' | 'l' | 'un';
export type PaymentMethod = 'Dinheiro' | 'Pix' | 'Cartão';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  cost: number;
  stock: number;
  stockUnit: 'g' | 'un';
  minStock: number;
  imageUrl: string;
  imageHint: string;
  barcode?: string;
};

export type Combo = {
  id: string;
  name: string;
  products: Product[];
  productIds?: string[]; // Used for storing in Firestore
  price: number;
  imageUrl: string;
  imageHint: string;
};

export type StockItem = {
  id: string;
  name: string;
  stock: number;
  unit: StockUnit;
  minStock: number;
};

export type SaleItem = {
  product: Product | Combo;
  quantity: number;
};

export type Sale = {
  id: string;
  date: string; // Stored as ISO string
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
};

export type Expense = {
  id: string;
  date: string; // Stored as ISO string
  description: string;
  amount: number;
};

export type CashRegisterSummary = {
  initial: number;
  sales: number;
  expenses: number;
  withdrawals: number;
  additions: number;
};
