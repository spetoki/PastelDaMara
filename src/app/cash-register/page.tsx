import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockCashRegister } from '@/lib/data';
import { Briefcase, PlusCircle, MinusCircle } from 'lucide-react';

export default function CashRegisterPage() {
  const summary = mockCashRegister;

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
        <Card className="lg:col-span-2">
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
        <div className="space-y-4">
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
                Adicionar Dinheiro
              </Button>
               <Button size="lg" variant="outline">
                <MinusCircle className="mr-2 h-4 w-4" />
                Retirar Dinheiro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
