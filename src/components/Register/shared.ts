import { Coffee, Cookie, CookingPot, CupSoda, LucideIcon, Soup } from 'lucide-react';
import { CartItem, Category } from '../../types';

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  mie: Soup,
  nasi: CookingPot,
  minum: CupSoda,
  kopi: Coffee,
  camilan: Cookie,
};

/** "Telur ceplok · Pedas lv 3" — the grey sub-line under a cart item. */
export const describeLine = (line: CartItem): string | undefined => {
  const c = line.customization;
  if (!c) return undefined;
  const parts: string[] = [];
  if (c.doneness !== 'Kenyal') parts.push(`Mie ${c.doneness.toLowerCase()}`);
  if (c.egg) parts.push(c.egg.shortName);
  parts.push(...c.toppings.map((t) => t.name));
  if (c.spicinessLevel > 0) parts.push(`Pedas lv ${c.spicinessLevel}`);
  if (c.notes) parts.push(c.notes);
  return parts.length ? parts.join(' · ') : undefined;
};

/** 50000 → "50rb" */
export const shortRupiah = (amount: number) => `${Math.round(amount / 1000)}rb`;

const NOTES = [20000, 50000, 100000, 200000, 500000, 1000000];

/** "Uang pas" plus the next two notes a customer is likely to hand over. */
export const quickCashOptions = (total: number): { label: string; value: number }[] => [
  { label: 'Uang pas', value: total },
  ...NOTES.filter((n) => n > total)
    .slice(0, 2)
    .map((n) => ({ label: shortRupiah(n), value: n })),
];
