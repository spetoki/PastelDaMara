'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { getProducts, addCombo, getCombos } from '@/lib/data';
import type { Product, Combo } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const comboSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  productIds: z.array(z.string()).min(1, 'Selecione ao menos um produto.'),
});

export function PromotionsClient() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const [comboData, productData] = await Promise.all([getCombos(), getProducts()]);
      
      // Since Firestore doesn't store the full product, we need to re-hydrate it.
      const hydratedCombos = comboData.map(combo => {
        const comboProducts = (combo.productIds || []).map(id => productData.find(p => p.id === id)).filter(Boolean) as Product[];
        return { ...combo, products: comboProducts };
      });

      setCombos(hydratedCombos);
      setProducts(productData);
    }
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof comboSchema>>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: '',
      price: 0,
      productIds: [],
    },
  });

  function handleOpenDialog() {
    form.reset();
    setOpen(true);
  }

  async function onSubmit(values: z.infer<typeof comboSchema>) {
    const selectedProducts = products.filter(p => values.productIds.includes(p.id));
    
    await addCombo({
      name: values.name,
      price: values.price,
      products: selectedProducts,
      imageUrl: `https://picsum.photos/seed/${values.name}/200/200`,
      imageHint: 'combo offer',
    });

    const comboData = await getCombos();
    const productData = products; // no need to refetch
     const hydratedCombos = comboData.map(combo => {
        const comboProducts = (combo.productIds || []).map(id => productData.find(p => p.id === id)).filter(Boolean) as Product[];
        return { ...combo, products: comboProducts };
      });
    setCombos(hydratedCombos);
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Combo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Combo</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo combo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Combo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Combo Família" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço do Combo (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="productIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Produtos Inclusos</FormLabel>
                      </div>
                      <ScrollArea className="h-40">
                      {products.map((product) => (
                        <FormField
                          key={product.id}
                          control={form.control}
                          name="productIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={product.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(product.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), product.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== product.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {product.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Salvar Combo</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Imagem</span>
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="hidden md:table-cell">Preço</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combos.length > 0 ? combos.map((combo) => (
              <TableRow key={combo.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={combo.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={combo.imageUrl}
                    width="64"
                    data-ai-hint={combo.imageHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{combo.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                   {combo.products.map(p => p.name).join(', ')}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {combo.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive">
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
               <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum combo criado ainda.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
