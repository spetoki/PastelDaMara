'use client';

import type { Product, Sale, CashRegisterSummary, Combo, Expense } from './types';
import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  writeBatch,
  query,
  orderBy,
  limit,
  Timestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';

// --- Collection References ---
const productsCollection = collection(db, 'products');
const combosCollection = collection(db, 'combos');
const salesCollection = collection(db, 'sales');
const expensesCollection = collection(db, 'expenses');
const appStateCollection = collection(db, 'appState');


// --- Helper to convert Firestore docs to objects ---
function docToItem<T>(doc: any): T {
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        // Convert Timestamps to ISO strings
        ...(data.date && { date: data.date.toDate().toISOString() }),
    };
}


// --- Product Functions ---
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(d => docToItem<Product>(d));
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const docRef = doc(collection(db, 'products')); // Create a reference with a new ID
  await setDoc(docRef, product); // Use setDoc to create the document
  return { ...product, id: docRef.id };
}

export async function updateProduct(updatedProduct: Product) {
  const { id, ...data } = updatedProduct;
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, data);
  return updatedProduct;
}

// --- Combo Functions ---
export async function getCombos(): Promise<Combo[]> {
    const snapshot = await getDocs(combosCollection);
    return snapshot.docs.map(d => docToItem<Combo>(d));
}

export async function addCombo(combo: Omit<Combo, 'id'>) {
    // Firestore can't store nested objects with methods, so we store product IDs
    const comboData = {
      ...combo,
      productIds: combo.products.map(p => p.id),
      products: undefined, // Remove the full product objects before saving
    };
    delete comboData.products;

    const docRef = doc(collection(db, 'combos')); // Create a reference with a new ID
    await setDoc(docRef, comboData); // Use setDoc to create the document

    // For returning, we still want the full product objects for the UI
    return { ...combo, id: docRef.id };
}


// --- Sale Functions ---
export async function getSales(): Promise<Sale[]> {
  const q = query(salesCollection, orderBy('date', 'desc'), limit(100));
  const snapshot = await getDocs(q);
  // This is more complex now because we need to fetch product details for each sale item.
  // For simplicity, we're returning what's stored. A real app would resolve these.
  const sales = snapshot.docs.map(d => docToItem<Sale>(d));
  return sales;
}

export async function addSale(sale: Omit<Sale, 'id' | 'date'>) {
  const batch = writeBatch(db);

  // Create the sale document
  const newSale: Omit<Sale, 'id'> = {
    ...sale,
    date: Timestamp.now().toDate().toISOString(),
  };
  const saleRef = doc(collection(db, 'sales'));
  batch.set(saleRef, newSale);

  // Decrement stock for each item sold
  for (const item of sale.items) {
    const productsToUpdate = 'products' in item.product ? item.product.products : [item.product];
    for (const p of productsToUpdate) {
      if (p.stock !== undefined) {
         const productRef = doc(db, 'products', p.id);
         const newStock = p.stock - item.quantity;
         batch.update(productRef, { stock: newStock < 0 ? 0 : newStock });
      }
    }
  }

  // Update cash register
  const cashRegister = await getCashRegisterSummary();
  const registerRef = doc(db, 'appState', 'cashRegister');
  batch.update(registerRef, { sales: cashRegister.sales + sale.total });


  await batch.commit();

  return { ...newSale, id: saleRef.id };
}

// --- Expense Functions ---
export async function getExpenses(): Promise<Expense[]> {
    const q = query(expensesCollection, orderBy('date', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => docToItem<Expense>(d));
}

export async function addExpense(expense: Omit<Expense, 'id' | 'date'>) {
    const batch = writeBatch(db);
    
    // Add expense doc
    const newExpense = { ...expense, date: Timestamp.now() };
    const expenseRef = doc(collection(db, 'expenses'));
    batch.set(expenseRef, newExpense);

    // Update cash register
    const cashRegister = await getCashRegisterSummary();
    const registerRef = doc(db, 'appState', 'cashRegister');
    batch.update(registerRef, { expenses: cashRegister.expenses + expense.amount });

    await batch.commit();
    return { ...expense, id: expenseRef.id, date: newExpense.date.toDate().toISOString() };
}

// --- Cash Register Functions ---
export async function getCashRegisterSummary(): Promise<CashRegisterSummary> {
    const docRef = doc(db, 'appState', 'cashRegister');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as CashRegisterSummary;
    } else {
        // If it doesn't exist, create it.
        const initialSummary: CashRegisterSummary = {
            initial: 0,
            sales: 0,
            expenses: 0,
            withdrawals: 0,
            additions: 0,
        };
        await setDoc(docRef, initialSummary);
        return initialSummary;
    }
}

// --- Dashboard Message Functions ---
export async function getDashboardMessage(): Promise<string> {
    const docRef = doc(db, 'appState', 'dashboardMessage');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().message) {
        return docSnap.data().message;
    }
    return '';
}

export async function saveDashboardMessage(message: string): Promise<void> {
    const docRef = doc(db, 'appState', 'dashboardMessage');
    await setDoc(docRef, { message });
}

// --- Rafael Message Functions ---
export async function getRafaelMessage(): Promise<string> {
    const docRef = doc(db, 'appState', 'rafaelMessage');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().message) {
        return docSnap.data().message;
    }
    return '';
}

export async function saveRafaelMessage(message: string): Promise<void> {
    const docRef = doc(db, 'appState', 'rafaelMessage');
    await setDoc(docRef, { message });
}
