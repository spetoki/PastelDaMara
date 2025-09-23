import { ProductClient } from './ProductClient';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Gerenciamento de Produtos
        </h1>
        <p className="text-muted-foreground">
          Adicione, edite e remova os produtos da sua loja.
        </p>
      </div>
      <ProductClient />
    </div>
  );
}
