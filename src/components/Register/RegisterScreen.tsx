import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, LucideIcon, Receipt, Search } from 'lucide-react';
import { Category, MenuItem, PrinterConfig } from '../../types';
import { CATEGORY_LABELS } from '../../data/mockData';
import { formatNumber } from '../../utils/format';
import { cn } from '../../utils/cn';
import { BrandMark } from '../ui/BrandMark';
import { Kbd } from '../ui/Kbd';
import { OrderPanel } from './OrderPanel';
import { CATEGORY_ICONS } from './shared';

type OrderPanelProps = React.ComponentProps<typeof OrderPanel>;

interface RegisterScreenProps extends Omit<OrderPanelProps, 'className' | 'headerAction'> {
  menu: MenuItem[];
  cashierName: string;
  shiftLabel: string;
  printerConfig: PrinterConfig;
  onOpenPrinter: () => void;
  onOpenOwner: () => void;
  onOpenSummary: () => void;
  onSelectItem: (item: MenuItem) => void;
}

const RAIL: { id: Category | 'all'; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'Semua', icon: LayoutGrid },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
    icon: CATEGORY_ICONS[id],
  })),
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  menu,
  cashierName,
  shiftLabel,
  printerConfig,
  onOpenPrinter,
  onOpenOwner,
  onOpenSummary,
  onSelectItem,
  ...orderPanel
}) => {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const { cart, hotkeysEnabled } = orderPanel;

  useEffect(() => {
    if (!hotkeysEnabled) return;
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea');
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkeysEnabled]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter(
      (m) => (q ? m.name.toLowerCase().includes(q) : category === 'all' || m.category === category),
    );
  }, [menu, category, query]);

  const heading = query.trim()
    ? `Hasil “${query.trim()}”`
    : category === 'all'
      ? 'Semua Menu'
      : CATEGORY_LABELS[category];

  const initials = cashierName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-full flex flex-col bg-w-night text-w-night-text">
      <header className="h-16 shrink-0 flex items-center gap-4 px-5 border-b border-w-night-line">
        <div className="flex items-center gap-2.5">
          <BrandMark className="w-8 h-8 rounded-[9px] text-sm" />
          <span className="font-display text-[17px] font-bold">Warmindo 88</span>
        </div>

        <label className="flex-1 h-10 flex items-center gap-2.5 px-3.5 bg-w-night-2 border border-w-night-line rounded-[10px] focus-within:border-w-yolk">
          <Search className="w-4 h-4 text-w-night-muted" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (setQuery(''), e.currentTarget.blur())}
            placeholder="Cari menu atau ketik kode…"
            aria-label="Cari menu"
            className="flex-1 bg-transparent text-[13px] text-w-night-text placeholder:text-w-night-muted outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <Kbd className="bg-w-night-3 text-w-night-muted font-semibold px-1.5 py-0.5 rounded-[5px]">/</Kbd>
        </label>

        <button
          type="button"
          onClick={onOpenSummary}
          title="Lihat Rekap Transaksi Shift"
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-w-night-2 hover:bg-w-night-3 text-[13px] font-medium text-w-night-text border border-w-night-line/80 hover:border-w-yolk/50 transition-colors"
        >
          <Receipt className="w-4 h-4 text-w-yolk" />
          <span>Rekap Transaksi</span>
        </button>

        <button
          type="button"
          onClick={onOpenPrinter}
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-w-night-2 hover:bg-w-night-3 text-[13px] font-medium"
        >
          <span
            className={cn('w-2 h-2 rounded-full', printerConfig.connected ? 'bg-w-live' : 'bg-w-chili')}
            aria-hidden
          />
          {printerConfig.connected ? 'Printer siap' : 'Printer terputus'}
        </button>

        <button
          type="button"
          onClick={onOpenOwner}
          title="Buka panel pemilik"
          className="flex items-center gap-2.5 py-1 pl-1 pr-3 rounded-full bg-w-night-2 hover:bg-w-night-3 text-left"
        >
          <span className="w-8 h-8 rounded-full bg-w-yolk text-w-ink text-xs font-bold flex items-center justify-center">
            {initials}
          </span>
          <span className="flex flex-col">
            <span className="text-[13px] font-semibold">
              {cashierName.split(' ')[0]} · {shiftLabel}
            </span>
            <span className="text-[11px] text-w-night-muted">22:00 – 06:00</span>
          </span>
        </button>
      </header>

      <div className="flex-1 min-h-0 flex">
        <nav aria-label="Kategori" className="w-[136px] shrink-0 flex flex-col gap-1.5 px-3 py-4 border-r border-w-night-line">
          {RAIL.map(({ id, label, icon: Icon }) => {
            const active = category === id && !query;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCategory(id);
                  setQuery('');
                }}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'h-[72px] shrink-0 flex flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-colors',
                  active ? 'bg-w-yolk text-w-ink' : 'text-w-night-text hover:bg-w-night-2',
                )}
              >
                <Icon className={cn('w-[22px] h-[22px]', !active && 'text-w-night-muted')} aria-hidden />
                {label}
              </button>
            );
          })}
        </nav>

        <section className="flex-1 min-w-0 flex flex-col gap-4 p-5">
          <div className="flex items-center">
            <h1 className="flex-1 font-display text-xl font-bold truncate">{heading}</h1>
            <span className="text-[13px] text-w-night-muted">{visible.length} item</span>
          </div>
          {visible.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
              <p className="text-sm font-semibold">Menu tidak ditemukan</p>
              <p className="text-[13px] text-w-night-muted">Coba kata lain, misalnya “aceh” atau “es teh”.</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto -mr-2 pr-2">
              <div className="grid grid-cols-3 2xl:grid-cols-4 auto-rows-[204px] gap-[14px]">
                {visible.map((item) => (
                  <MenuTile
                    key={item.id}
                    item={item}
                    qty={cart.qtyByMenuItem[item.id] ?? 0}
                    onSelect={() => onSelectItem(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <OrderPanel {...orderPanel} className="w-[392px] shrink-0 border-l border-w-night-line" />
      </div>
    </div>
  );
};

const MenuTile: React.FC<{ item: MenuItem; qty: number; onSelect: () => void }> = ({ item, qty, onSelect }) => {
  const Icon = CATEGORY_ICONS[item.category];
  const soldOut = !item.available;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={soldOut}
      aria-label={`${item.name}, Rp ${formatNumber(item.basePrice)}${qty ? `, ${qty} di pesanan` : ''}${soldOut ? ', habis' : ''}`}
      className={cn(
        'group flex flex-col rounded-[14px] overflow-hidden bg-w-night-2 text-left outline -outline-offset-1 transition-[outline-color]',
        qty ? 'outline-2 outline-w-yolk' : 'outline-1 outline-w-night-line hover:outline-w-night-muted',
        soldOut && 'opacity-50 cursor-not-allowed',
      )}
    >
      <div
        className="relative flex-1 w-full flex items-start justify-between p-2.5 bg-w-night-3 bg-cover bg-center"
        style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
      >
        {!item.image && (
          <Icon className="absolute inset-0 m-auto w-8 h-8 text-w-night-line" aria-hidden />
        )}
        {soldOut ? (
          <Tag className="bg-w-night">Habis</Tag>
        ) : item.tag === 'laris' ? (
          <Tag className="bg-w-chili">Laris</Tag>
        ) : item.tag === 'baru' ? (
          <Tag className="bg-w-leaf">Baru</Tag>
        ) : (
          <span />
        )}
        {qty > 0 && (
          <span className="relative w-7 h-7 rounded-full bg-w-yolk text-w-ink text-[13px] font-extrabold flex items-center justify-center tabular-nums">
            {qty}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="flex-1 min-w-0 truncate text-sm font-semibold" title={item.name}>
          {item.name}
        </span>
        <span className="font-display text-[15px] font-bold text-w-yolk tabular-nums">
          {formatNumber(item.basePrice)}
        </span>
      </div>
    </button>
  );
};

const Tag: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={cn('relative px-2 py-1 rounded-md text-[11px] font-bold text-white', className)}>{children}</span>
);
