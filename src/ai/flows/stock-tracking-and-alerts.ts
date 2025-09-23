'use server';
/**
 * @fileOverview AI-powered stock tracking and alerts flow.
 *
 * - trackStockAndAlert - A function that handles the stock tracking and alerting process.
 * - StockTrackingAndAlertInput - The input type for the trackStockAndAlert function.
 * - StockTrackingAndAlertOutput - The return type for the trackStockAndAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockTrackingAndAlertInputSchema = z.object({
  ingredientName: z.string().describe('The name of the ingredient to track.'),
  currentStockLevel: z.number().describe('The current stock level of the ingredient.'),
  stockUnit: z.enum(['g', 'kg', 'un']).describe('The unit of measurement for the stock (grams, kilograms, or units).'),
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data for products using this ingredient (e.g., daily sales for the past month), as a comma-separated list of numbers.'
    ),
  minimumStockLevel: z
    .number()
    .describe('The minimum stock level for this ingredient before triggering an alert.'),
});
export type StockTrackingAndAlertInput = z.infer<typeof StockTrackingAndAlertInputSchema>;

const StockTrackingAndAlertOutputSchema = z.object({
  reorderNeeded: z.boolean().describe('Whether a reorder is needed based on the analysis.'),
  estimatedDaysUntilOutOfStock: z
    .number()
    .optional()
    .describe('Estimated number of days until the ingredient is out of stock.'),
  recommendedReorderQuantity: z
    .number()
    .optional()
    .describe('Recommended reorder quantity to avoid stockout.'),
  reasoning: z.string().describe('The AI reasoning behind the reorder recommendation.'),
});
export type StockTrackingAndAlertOutput = z.infer<typeof StockTrackingAndAlertOutputSchema>;

export async function trackStockAndAlert(input: StockTrackingAndAlertInput): Promise<StockTrackingAndAlertOutput> {
  return trackStockAndAlertFlow(input);
}

const trackStockAndAlertPrompt = ai.definePrompt({
  name: 'trackStockAndAlertPrompt',
  input: {schema: StockTrackingAndAlertInputSchema},
  output: {schema: StockTrackingAndAlertOutputSchema},
  prompt: `You are an AI assistant helping a shop owner manage their ingredient stock levels.

  Analyze the current stock level, historical sales data, and minimum stock level for the given ingredient to determine if a reorder is needed.

  Ingredient: {{{ingredientName}}}
Current Stock Level: {{{currentStockLevel}}} {{{stockUnit}}}
Historical Sales Data (comma-separated): {{{historicalSalesData}}}
Minimum Stock Level: {{{minimumStockLevel}}} {{{stockUnit}}}

  Based on this information, determine:
  - If a reorder is needed (reorderNeeded: true/false)
  - Estimate the number of days until the ingredient is out of stock (estimatedDaysUntilOutOfStock). If reorderNeeded is false, omit this.
  - Recommend a reorder quantity (recommendedReorderQuantity). If reorderNeeded is false, omit this.
  - Explain your reasoning for the reorder recommendation (reasoning). The recommended quantity unit should match the input unit.

  Output in JSON format.
  `,
});

const trackStockAndAlertFlow = ai.defineFlow(
  {
    name: 'trackStockAndAlertFlow',
    inputSchema: StockTrackingAndAlertInputSchema,
    outputSchema: StockTrackingAndAlertOutputSchema,
  },
  async input => {
    const {output} = await trackStockAndAlertPrompt(input);
    return output!;
  }
);
