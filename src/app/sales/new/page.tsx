'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProducts } from '@/lib/data';
import type { Product, SaleItem, PaymentMethod } from '@/lib/types';
import { MinusCircle, PlusCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewSalePage() {
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Dinheiro');
  const { toast } = useToast();

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  function addToCart(product: Product) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }

  function finishSale() {
    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar a venda.',
      });
      return;
    }
    
    console.log('Venda Finalizada:', {
      items: cart,
      total,
      paymentMethod,
    });
    
    toast({
      title: 'Venda Finalizada com Sucesso!',
      description: `Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    });

    // Aqui você adicionaria a lógica para salvar a venda e limpar o carrinho
    setCart([]);
    setPaymentMethod('Dinheiro');
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl mb-6">
          Ponto de Venda
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:border-primary"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-0">
                <Image
                  alt={product.name}
                  className="aspect-square w-full rounded-t-lg object-cover"
                  height="150"
                  src={product.imageUrl}
                  width="150"
                  data-ai-hint={product.imageHint}
                />
              </CardContent>
              <CardFooter className="p-2 flex flex-col items-start">
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Pedido Atual</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">O carrinho está vazio.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                           <span>{item.quantity}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.product.price * item.quantity).toLocaleString(
                          'pt-BR',
                          { style: 'currency', currency: 'BRL' }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex-col space-y-4">
               <div className="w-full flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
               <div className="w-full space-y-2">
                 <label htmlFor="paymentMethod" className="text-sm font-medium">Forma de Pagamento</label>
                 <Select onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} defaultValue={paymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Pix">Pix</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
              <Button className="w-full" size="lg" onClick={finishSale}>
                <CreditCard className="mr-2 h-5 w-5" />
                Finalizar Venda
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
