'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Banknote,
  Boxes,
  DollarSign,
  MessageSquare,
  PackagePlus,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load the message from localStorage on component mount
    const savedMessage = localStorage.getItem('dashboardMessage') || '';
    setMessage(savedMessage);
    setNewMessage(savedMessage);
  }, []);

  const handleSaveMessage = () => {
    localStorage.setItem('dashboardMessage', newMessage);
    setMessage(newMessage);
    toast({
      title: 'Aviso salvo!',
      description: 'O novo aviso está visível para todos os usuários.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas de Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">
              +0.0% em relação a ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 itens</div>
            <p className="text-xs text-muted-foreground">
              Farinha, Queijo, Carne
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0</div>
            <p className="text-xs text-muted-foreground">
              Total de vendas individuais
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caixa Atual</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Status: Fechado</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mural de Avisos
              </CardTitle>
               <CardDescription>Deixe uma mensagem para a equipe.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 mb-4 bg-muted/50 rounded-lg min-h-[60px]">
                    <p className="text-sm text-foreground">{message || 'Nenhum aviso no momento.'}</p>
                </div>
               <Textarea
                placeholder="Escreva um novo aviso aqui..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-4"
                />
            </CardContent>
             <CardFooter>
                <Button onClick={handleSaveMessage}>Salvar Aviso</Button>
            </CardFooter>
          </Card>
        </div>


      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            asChild
            className="h-24 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/sales/new">
              <ShoppingCart className="mr-2 h-6 w-6" /> Nova Venda
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-24 text-lg">
            <Link href="/products">
              <PackagePlus className="mr-2 h-6 w-6" /> Adicionar Produto
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-24 text-lg">
            <Link href="/stock">
              <Boxes className="mr-2 h-6 w-6" /> Estoque
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-24 text-lg">
            <Link href="/cash-register">
              <Banknote className="mr-2 h-6 w-6" /> Caixa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
