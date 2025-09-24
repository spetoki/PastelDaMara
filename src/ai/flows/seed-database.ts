'use server';
/**
 * @fileOverview A flow to seed the database with initial data.
 *
 * - seedDatabase - A function that seeds the database with initial products.
 */

import {ai} from '@/ai/genkit';
import {addProduct} from '@/lib/data';
import {z} from 'zod';

export async function seedDatabase(): Promise<{success: boolean}> {
  return seedDatabaseFlow();
}

const seedDatabaseFlow = ai.defineFlow(
  {
    name: 'seedDatabaseFlow',
    inputSchema: z.void(),
    outputSchema: z.object({success: z.boolean()}),
  },
  async () => {
    console.log('Seeding database...');

    const initialProducts = [
      {
        name: 'Pastel de Carne',
        category: 'Pastéis',
        price: 8.0,
        cost: 2.5,
        stock: 50,
        stockUnit: 'un',
        minStock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1747932987138-aed6073021db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmb29kJTIwcGFzdGVsfGVufDB8fHx8MTc1ODY2MTQ1MHww&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'food pastel',
      },
      {
        name: 'Coca-Cola Lata',
        category: 'Bebidas',
        price: 5.0,
        cost: 2.0,
        stock: 100,
        stockUnit: 'un',
        minStock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1603569239784-0a4b159fa3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzb2RhJTIwY2FufGVufDB8fHx8MTc1ODU4ODQ3OXww&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'soda can',
      },
      {
        name: 'Pastel de Queijo',
        category: 'Pastéis',
        price: 8.0,
        cost: 2.5,
        stock: 40,
        stockUnit: 'un',
        minStock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1685708683548-f82156a40056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBwYXN0ZWx8ZW58MHx8fHwxNzU4NjYxNDUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'cheese pastel',
      },
    ];

    try {
      for (const product of initialProducts) {
        await addProduct(product);
      }
      return {success: true};
    } catch (error) {
      console.error('Error seeding database:', error);
      return {success: false};
    }
  }
);
