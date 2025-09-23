import { PromotionsClient } from './PromotionsClient';

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Gerenciamento de Promoções
        </h1>
        <p className="text-muted-foreground">
          Crie e gerencie seus combos e promoções especiais.
        </p>
      </div>
      <PromotionsClient />
    </div>
  );
}
