'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CashRegisterSummary, Expense } from '@/lib/types';
import { Briefcase, PlusCircle, MinusCircle, Trash2 } from 'lucide-react';
import { getCashRegisterSummary, getExpenses, addExpense } from '@/lib/data';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
});


export default function CashRegisterPage() {
  const [summary, setSummary] = useState<CashRegisterSummary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  async function refreshData() {
      const [summaryData, expensesData] = await Promise.all([
          getCashRegisterSummary(),
          getExpenses()
      ]);
      setSummary(summaryData);
      setExpenses(expensesData);
  }

  useEffect(() => {
    refreshData();
    // Optional: set an interval to auto-refresh
    const interval = setInterval(refreshData, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { description: '', amount: 0 },
  });

  async function onExpenseSubmit(values: z.infer<typeof expenseSchema>) {
    await addExpense(values);
    expenseForm.reset();
    refreshData();
  }
  
  if (!summary) {
    return <div>Carregando...</div>; // Or a skeleton loader
  }

  const profit = summary.sales - summary.expenses;
  const currentBalance =
    summary.initial + summary.sales - summary.expenses - summary.withdrawals + summary.additions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Fechamento de Caixa
        </h1>
        <p className="text-muted-foreground">
          Gerencie a abertura, fechamento e movimentações do seu caixa.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
           {/* Resumo do Dia */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Dia</CardTitle>
              <CardDescription>
                Turno aberto em 28/07/2024 às 09:00
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Valor Inicial</span>
                <span className="font-medium">
                  {summary.initial.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vendas Totais</span>
                <span className="font-medium text-green-500">
                  +{' '}
                  {summary.sales.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Despesas</span>
                <span className="font-medium text-red-500">
                  -{' '}
                  {summary.expenses.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Suprimentos (Entradas)</span>
                <span className="font-medium text-blue-500">
                  +{' '}
                  {summary.additions.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sangrias (Retiradas)</span>
                <span className="font-medium text-orange-500">
                  -{' '}
                  {summary.withdrawals.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Lucro do Dia</span>
                <span className="text-lg font-bold">
                  {profit.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Saldo em Caixa</span>
                <span className="text-lg font-bold text-primary">
                  {currentBalance.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
          {/* Histórico de Despesas */}
           <Card>
              <CardHeader>
                <CardTitle>Histórico de Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length > 0 ? (
                      expenses.map(expense => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell className="text-right">
                             {expense.amount.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                           <TableCell className="hidden md:table-cell">
                             {new Date(expense.date).toLocaleString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                          Nenhuma despesa registrada hoje.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
          </Card>
        </div>
        {/* Coluna da Direita */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações do Caixa</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button size="lg">
                <Briefcase className="mr-2 h-4 w-4" />
                Fechar Caixa
              </Button>
               <Button size="lg" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Suprimento
              </Button>
               <Button size="lg" variant="outline">
                <MinusCircle className="mr-2 h-4 w-4" />
                Sangria
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registrar Despesa</CardTitle>
            </CardHeader>
            <CardContent>
               <Form {...expenseForm}>
                <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-4">
                  <FormField
                    control={expenseForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Compra de guardanapos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={expenseForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Adicionar Despesa
                  </Button>
                </form>
               </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
