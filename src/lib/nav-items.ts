import {
  Home,
  ShoppingBasket,
  LineChart,
  Boxes,
  Banknote,
  type LucideIcon,
  ShoppingCart,
  Gift,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Início',
    icon: Home,
  },
  {
    href: '/sales/new',
    label: 'Nova Venda',
    icon: ShoppingCart,
  },
  {
    href: '/products',
    label: 'Produtos',
    icon: ShoppingBasket,
  },
  {
    href: '/promotions',
    label: 'Promoções',
    icon: Gift,
  },
  {
    href: '/sales/history',
    label: 'Vendas',
    icon: LineChart,
  },
  {
    href: '/stock',
    label: 'Estoque',
    icon: Boxes,
  },
  {
    href: '/cash-register',
    label: 'Caixa',
    icon: Banknote,
  },
];
