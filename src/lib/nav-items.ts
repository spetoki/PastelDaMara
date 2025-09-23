import {
  Home,
  ShoppingBasket,
  LineChart,
  Boxes,
  Banknote,
  type LucideIcon,
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
    href: '/products',
    label: 'Produtos',
    icon: ShoppingBasket,
  },
  {
    href: '/sales',
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
