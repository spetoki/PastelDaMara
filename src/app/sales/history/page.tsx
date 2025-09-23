'use client';

import { useState, useEffect } from 'react';
import { mockSales } from '@/lib/data';
import type { Sale } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales);

  // This is a simple way to force a re-render if the underlying data changes.
  // In a real-world app, you might use a state management library or context.
  useEffect(() => {
    const interval = setInterval(() => {
      // A simple check to see if the length has changed.
      if (mockSales.length !== sales.length) {
        setSales([...mockSales]);
      }
    }, 500); // Check every half a second

    return () => clearInterval(interval);
  }, [sales.length]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Histórico de Vendas
        </h1>
        <p className="text-muted-foreground">
          Visualize todas as vendas registradas no sistema.
        </p>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="month">Este Mês</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <SalesList sales={sales} />
        </TabsContent>
        <TabsContent value="week">
          <SalesList sales={sales} />
        </TabsContent>
        <TabsContent value="month">
          <SalesList sales={sales} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SalesList({ sales }: { sales: Sale[] }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente/Pedido</TableHead>
              <TableHead className="hidden sm:table-cell">
                Tipo de Pagamento
              </TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="font-medium">Venda #{sale.id.slice(-4)}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {sale.items.map((i) => i.product.name).join(', ')}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {sale.paymentMethod}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant="secondary">
                        Concluído
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {sale.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma venda registrada ainda.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
