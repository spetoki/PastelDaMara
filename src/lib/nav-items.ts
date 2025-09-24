import {
  Home,
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
];
