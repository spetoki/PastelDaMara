'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockStockItems } from '@/lib/data';
import {
  trackStockAndAlert,
  type StockTrackingAndAlertOutput,
} from '@/ai/flows/stock-tracking-and-alerts';
import { Loader2, Zap, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  ingredientName: z.string().min(1, 'Selecione um ingrediente.'),
  currentStockLevel: z.coerce
    .number()
    .min(0, 'Estoque atual não pode ser negativo.'),
  stockUnit: z.enum(['g', 'kg', 'un']),
  minimumStockLevel: z.coerce
    .number()
    .min(0, 'Estoque mínimo não pode ser negativo.'),
});

export function StockManager() {
  const [analysisResult, setAnalysisResult] =
    useState<StockTrackingAndAlertOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredientName: '',
      currentStockLevel: 0,
      stockUnit: 'g',
      minimumStockLevel: 0,
    },
  });
  
  const selectedIngredientName = form.watch("ingredientName");

  const handleIngredientChange = (value: string) => {
    form.setValue("ingredientName", value);
    const selected = mockStockItems.find(item => item.name === value);
    if (selected) {
      form.setValue("currentStockLevel", selected.stock);
      form.setValue("minimumStockLevel", selected.minStock);
      if (selected.unit === 'g' || selected.unit === 'kg' || selected.unit === 'un') {
        form.setValue("stockUnit", selected.unit);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await trackStockAndAlert(values);
      setAnalysisResult(result);
    } catch (e) {
      setError('Ocorreu um erro ao analisar o estoque. Tente novamente.');
      console.error(e);
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary" /> Análise de Estoque com IA
            </CardTitle>
            <CardDescription>
              Preencha os dados para receber uma recomendação de compra.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="ingredientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingrediente</FormLabel>
                       <Select onValueChange={handleIngredientChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um ingrediente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockStockItems.map(item => (
                            <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Atual</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stockUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Unidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="g">Gramas (g)</SelectItem>
                            <SelectItem value="kg">Quilos (kg)</SelectItem>
                            <SelectItem value="un">Unidades (un)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="minimumStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                       <FormDescription>
                        A unidade é a mesma do estoque atual.
                       </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  Analisar Estoque
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
         <Card className="h-full">
            <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full min-h-[300px]">
             {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
             {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

              {!isLoading && !analysisResult && !error && (
                <div className="text-center text-muted-foreground">
                    <p>Aguardando análise...</p>
                    <p className="text-sm">Preencha o formulário e clique em "Analisar".</p>
                </div>
              )}
              
              {analysisResult && (
                <div className="w-full space-y-4">
                  {analysisResult.reorderNeeded ? (
                     <Alert variant="destructive">
                      <AlertTitle className="font-bold">Atenção: Recompra Necessária!</AlertTitle>
                     </Alert>
                  ) : (
                     <Alert className="border-green-500 text-green-700 dark:text-green-400">
                        <AlertTitle className="font-bold text-green-700 dark:text-green-400">Estoque OK!</AlertTitle>
                     </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-center">
                    {analysisResult.estimatedDaysUntilOutOfStock != null && (
                         <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Acaba em</p>
                            <p className="text-2xl font-bold">{analysisResult.estimatedDaysUntilOutOfStock} dias</p>
                        </div>
                    )}
                    {analysisResult.recommendedReorderQuantity != null && (
                        <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Recompra Sugerida</p>
                            <p className="text-2xl font-bold">{analysisResult.recommendedReorderQuantity} {form.getValues('stockUnit')}</p>
                        </div>
                    )}
                  </div>
                  
                  <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertTitle>Análise da IA</AlertTitle>
                      <AlertDescription>
                        {analysisResult.reasoning}
                      </AlertDescription>
                  </Alert>

                </div>
              )}
            </CardContent>
         </Card>
      </div>
      <div className="lg:col-span-5">
        <Card>
          <CardHeader>
            <CardTitle>Itens em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStockItems.map((item) => (
                  <TableRow key={item.id} className={item.stock < item.minStock ? 'bg-destructive/10' : ''}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.stock} {item.unit}</TableCell>
                    <TableCell>{item.minStock} {item.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
