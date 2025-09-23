'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockProducts, addSale } from '@/lib/data';
import type { Product, PaymentMethod } from '@/lib/types';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewSalePage() {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Dinheiro');
  const { toast } = useToast();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setPaymentMethod('Dinheiro');
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const handleFinalizeSale = () => {
    if (!selectedProduct || quantity <= 0) {
      toast({
        variant: 'destructive',
        title: 'Venda inválida',
        description: 'Selecione um produto e uma quantidade válida.',
      });
      return;
    }

    const saleTotal = selectedProduct.price * quantity;

    addSale({
      items: [{ product: selectedProduct, quantity }],
      total: saleTotal,
      paymentMethod,
    });

    toast({
      title: 'Venda Finalizada com Sucesso!',
      description: `Total: ${saleTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    });

    handleCloseDialog();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Ponto de Venda
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:border-primary overflow-hidden"
            onClick={() => handleProductClick(product)}
          >
            <CardContent className="p-0">
              <Image
                alt={product.name}
                className="aspect-square w-full object-cover"
                height="150"
                src={product.imageUrl}
                width="150"
                data-ai-hint={product.imageHint}
              />
            </CardContent>
            <CardFooter className="p-3 flex flex-col items-start">
              <p className="font-semibold text-sm truncate w-full">{product.name}</p>
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

      <Dialog open={!!selectedProduct} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-4">
               <div className="flex items-center gap-4">
                <Image
                    alt={selectedProduct.name}
                    className="aspect-square rounded-md object-cover"
                    height="80"
                    src={selectedProduct.imageUrl}
                    width="80"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
              </div>

              <div className="grid grid-cols-2 items-end gap-4">
                 <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="text-base"
                    />
                 </div>
                 <p className="text-right text-lg font-bold">
                    Total: {(selectedProduct.price * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
              </div>

              <div className="space-y-2">
                 <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button className="w-full" size="lg" onClick={handleFinalizeSale}>
              <CreditCard className="mr-2 h-5 w-5" />
              Finalizar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
