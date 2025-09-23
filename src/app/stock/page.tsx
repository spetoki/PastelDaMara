import { StockManager } from './StockManager';

export default function StockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Controle de Estoque
        </h1>
        <p className="text-muted-foreground">
          Adicione, edite e gerencie os ingredientes e itens em estoque.
        </p>
      </div>
      <StockManager />
    </div>
  );
}
