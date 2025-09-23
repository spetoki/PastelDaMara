import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Banknote,
  Boxes,
  DollarSign,
  PackagePlus,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
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
            <div className="text-2xl font-bold">R$ 1.832,75</div>
            <p className="text-xs text-muted-foreground">Status: Aberto</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            asChild
            className="h-24 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/sales">
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
