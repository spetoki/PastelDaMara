'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getProducts, addSale, getCombos } from '@/lib/data';
import type { Product, SaleItem, PaymentMethod, Combo } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, Trash2, ShoppingCart, CreditCard, Barcode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Dinheiro');
  const [barcode, setBarcode] = useState('');
  const { toast } = useToast();
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
        const [productData, comboData] = await Promise.all([getProducts(), getCombos()]);

        // Hydrate combos with full product details
        const hydratedCombos = comboData.map(combo => {
            const comboProducts = (combo.productIds || []).map(id => productData.find(p => p.id === id)).filter(Boolean) as Product[];
            return { ...combo, products: comboProducts };
        });

        setProducts(productData);
        setCombos(hydratedCombos);
    }
    fetchData();

    // Focus barcode input on page load
    barcodeInputRef.current?.focus();

    // No need for interval with Firestore, but could add real-time listener later
  }, []);

  const handleAddToCart = (item: Product | Combo) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.product.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.product.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { product: item, quantity: 1 }];
    });
  };

  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode.trim() !== '') {
      e.preventDefault();
      const foundProduct = products.find(p => p.barcode === barcode.trim());
      if (foundProduct) {
        handleAddToCart(foundProduct);
        toast({
            title: 'Produto Adicionado',
            description: `${foundProduct.name} foi adicionado ao carrinho.`,
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Produto não encontrado',
            description: 'Nenhum produto corresponde a este código de barras.',
        });
      }
      setBarcode(''); // Clear input after scan
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== itemId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho para finalizar a venda.',
      });
      return;
    }

    await addSale({
      items: cart,
      total: cartTotal,
      paymentMethod,
    });

    toast({
      title: 'Venda Finalizada com Sucesso!',
      description: `Total: ${cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    });

    // Re-fetch products to get updated stock
    const productData = await getProducts();
    setProducts(productData);

    setCart([]);
    setCheckoutOpen(false);
    barcodeInputRef.current?.focus(); // Focus back to barcode input
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      {/* Product and Combo List */}
      <div className="md:col-span-2 space-y-4">
        <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ponto de Venda
            </h1>
            <div className="relative w-full max-w-sm">
                 <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Input
                    ref={barcodeInputRef}
                    type="text"
                    placeholder="Ler código de barras..."
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={handleBarcodeScan}
                    className="pl-10 h-11 text-base"
                />
            </div>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="combos">Combos</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:border-primary overflow-hidden flex flex-col"
                  onClick={() => handleAddToCart(product)}
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
                  <CardFooter className="p-3 flex flex-col items-start flex-grow justify-end">
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
          </TabsContent>
          <TabsContent value="combos">
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {combos.length > 0 ? combos.map((combo) => (
                <Card
                  key={combo.id}
                  className="cursor-pointer hover:border-primary overflow-hidden flex flex-col"
                  onClick={() => handleAddToCart(combo)}
                >
                  <CardContent className="p-0">
                    <Image
                      alt={combo.name}
                      className="aspect-square w-full object-cover"
                      height="150"
                      src={combo.imageUrl}
                      width="150"
                      data-ai-hint={combo.imageHint}
                    />
                  </CardContent>
                  <CardFooter className="p-3 flex flex-col items-start flex-grow justify-end">
                    <p className="font-semibold text-sm truncate w-full">{combo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {combo.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </CardFooter>
                </Card>
              )) : (
                <p className="text-muted-foreground col-span-full">Nenhum combo criado ainda.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {/* Cart */}
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart />
            Carrinho
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center">O carrinho está vazio.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                     <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/80" onClick={() => updateQuantity(item.product.id, 0)}>
                     <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        </CardContent>
        <CardFooter>
           <Button className="w-full" size="lg" disabled={cart.length === 0} onClick={() => setCheckoutOpen(true)}>
             <CreditCard className="mr-2 h-5 w-5" />
             Finalizar Venda
           </Button>
        </CardFooter>
      </Card>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Venda</DialogTitle>
            <DialogDescription>
              Revise os itens e selecione a forma de pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-medium">{(item.quantity * item.product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
             </div>
             <Separator />
             <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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
          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancelar</Button>
            <Button className="w-full" onClick={handleFinalizeSale}>
              Confirmar e Pagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
