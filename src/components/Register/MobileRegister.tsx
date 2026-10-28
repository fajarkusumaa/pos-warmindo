import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Minus, Plus, Receipt, Search, X } from 'lucide-react';
import { Category, MenuItem } from '../../types';
import { formatRupiah } from '../../utils/format';
import { cn } from '../../utils/cn';
import { OrderPanel } from './OrderPanel';
import { TablePicker } from './TablePicker';
import { CATEGORY_ICONS } from './shared';

type OrderPanelProps = React.ComponentProps<typeof OrderPanel>;

interface MobileRegisterProps extends Omit<OrderPanelProps, 'className' | 'headerAction'> {
  menu: MenuItem[];
  cashierName: string;
  shiftLabel: string;
  onOpenSummary?: () => void;
  onSelectItem: (item: MenuItem) => void;
}

const CHIPS: { label: string; categories: Category[] }[] = [
  { label: 'Makanan', categories: ['mie', 'nasi'] },
  { label: 'Minuman', categories: ['minum'] },
  { label: 'Kopi', categories: ['kopi'] },
  { label: 'Camilan', categories: ['camilan'] },
];

/** Handheld cashier (V2 · 06): one-column menu list with a sticky pay bar. */
export const MobileRegister: React.FC<MobileRegisterProps> = ({
  menu,
  cashierName,
  shiftLabel,
  onOpenSummary,
  onSelectItem,
  ...orderPanel
}) => {
  const [chip, setChip] = useState(CHIPS[0].label);
  const [query, setQuery] = useState('');
  const [tableOpen, setTableOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { cart, tableNumber, tables, onTableChange, orderType } = orderPanel;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cats = CHIPS.find((c) => c.label === chip)!.categories;
    return menu.filter((m) => (q ? m.name.toLowerCase().includes(q) : cats.includes(m.category)));
  }, [menu, chip, query]);

  return (
    <div className="h-full flex flex-col bg-w-night text-w-night-text">
      <header className="flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3">
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <h1 className="font-display text-2xl font-bold">Pesanan baru</h1>
          <p className="text-[13px] text-w-night-muted">
            {cashierName.split(' ')[0]} · {shiftLabel}
          </p>
        </div>
        {onOpenSummary && (
          <button
            type="button"
            onClick={onOpenSummary}
            title="Rekap Transaksi"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-w-night-2 border border-w-night-line text-w-yolk hover:bg-w-night-3"
          >
            <Receipt className="w-5 h-5" />
          </button>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTableOpen((o) => !o)}
            aria-haspopup="dialog"
            aria-expanded={tableOpen}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-w-night-2 border border-w-night-line text-sm font-bold"
          >
            {orderType === 'takeaway' ? 'Bungkus' : tableNumber}
            <ChevronDown className="w-4 h-4 text-w-night-muted" aria-hidden />
          </button>
          {tableOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setTableOpen(false)} aria-hidden />
              <TablePicker
                tables={tables}
                selected={orderType === 'dine_in' ? tableNumber : ''}
                onSelect={(t) => {
                  onTableChange(t);
                  orderPanel.onOrderTypeChange('dine_in');
                  setTableOpen(false);
                }}
                className="absolute right-0 top-full mt-2"
              />
            </>
          )}
        </div>
      </header>

      <div className="px-5">
        <label className="h-[46px] flex items-center gap-2.5 px-3.5 rounded-xl bg-w-night-2 focus-within:ring-1 focus-within:ring-w-yolk">
          <Search className="w-[18px] h-[18px] text-w-night-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu"
            aria-label="Cari menu"
            className="flex-1 bg-transparent text-[15px] placeholder:text-w-night-muted outline-none"
          />
        </label>
      </div>

      <div role="tablist" aria-label="Kategori" className="flex gap-2 px-5 py-3.5 overflow-x-auto">
        {CHIPS.map((c) => {
          const active = c.label === chip && !query;
          return (
            <button
              key={c.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setChip(c.label);
                setQuery('');
              }}
              className={cn(
                'shrink-0 px-3.5 py-[9px] rounded-full text-[13px] font-bold',
                active ? 'bg-w-yolk text-w-ink' : 'bg-w-night-2 text-w-night-text',
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <ul className="flex-1 min-h-0 overflow-y-auto px-5">
        {visible.length === 0 && (
          <li className="py-10 text-center text-sm text-w-night-muted">Menu tidak ditemukan.</li>
        )}
        {visible.map((item) => {
          const qty = cart.qtyByMenuItem[item.id] ?? 0;
          const Icon = CATEGORY_ICONS[item.category];
          return (
            <li
              key={item.id}
              className={cn(
                'flex items-center gap-3.5 py-3 border-b border-w-night-line last:border-b-0',
                !item.available && 'opacity-50',
              )}
            >
              <div
                className="w-[72px] h-[72px] shrink-0 rounded-[14px] bg-w-night-3 bg-cover bg-center flex items-center justify-center"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              >
                {!item.image && <Icon className="w-6 h-6 text-w-night-line" aria-hidden />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
                {!item.available ? (
                  <MobileTag className="bg-w-night-3">Habis</MobileTag>
                ) : item.tag === 'laris' ? (
                  <MobileTag className="bg-w-chili">Laris</MobileTag>
                ) : item.tag === 'baru' ? (
                  <MobileTag className="bg-w-leaf">Baru</MobileTag>
                ) : null}
                <p className="text-[15px] font-semibold">{item.name}</p>
                <p className="font-display text-[15px] font-bold text-w-yolk">{formatRupiah(item.basePrice)}</p>
              </div>
              {qty > 0 ? (
                <div className="flex items-center rounded-xl bg-w-night-2 outline outline-[1.5px] -outline-offset-1 outline-w-yolk">
                  <button
                    type="button"
                    onClick={() => cart.decrementMenuItem(item.id)}
                    aria-label={`Kurangi ${item.name}`}
                    className="w-9 h-10 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-4 text-center text-[15px] font-extrabold tabular-nums" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectItem(item)}
                    disabled={!item.available}
                    aria-label={`Tambah ${item.name}`}
                    className="w-9 h-10 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  disabled={!item.available}
                  aria-label={`Tambah ${item.name}`}
                  className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-w-night-2 border border-w-night-line disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="shrink-0 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] bg-w-night-2 border-t border-w-night-line">
        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          disabled={cart.count === 0}
          className="w-full h-[60px] flex items-center gap-3 pl-[18px] pr-2 rounded-2xl bg-w-yolk text-w-ink text-left disabled:opacity-50"
        >
          <span className="flex-1 flex flex-col">
            <span className="text-xs font-semibold">{cart.count ? `${cart.count} item` : 'Belum ada item'}</span>
            <span className="font-display text-[19px] font-extrabold tabular-nums">{formatRupiah(cart.total)}</span>
          </span>
          <span className="h-11 flex items-center gap-1.5 px-4 rounded-[11px] bg-w-ink text-w-yolk text-[15px] font-extrabold">
            Bayar
            <ArrowRight className="w-4 h-4" aria-hidden />
          </span>
        </button>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/60" role="dialog" aria-modal="true" aria-label="Pembayaran">
          <div className="absolute inset-0" onClick={() => setCheckoutOpen(false)} aria-hidden />
          <OrderPanel
            {...orderPanel}
            onPayCash={(cash) => {
              setCheckoutOpen(false);
              orderPanel.onPayCash(cash);
            }}
            onPayQris={() => {
              setCheckoutOpen(false);
              orderPanel.onPayQris();
            }}
            className="relative h-[85dvh] rounded-t-[20px] pb-[max(env(safe-area-inset-bottom),20px)]"
            headerAction={
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Tutup"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-w-night-3"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            }
          />
        </div>
      )}
    </div>
  );
};

const MobileTag: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={cn('px-[7px] py-0.5 rounded-[5px] text-[11px] font-bold text-white', className)}>{children}</span>
);
