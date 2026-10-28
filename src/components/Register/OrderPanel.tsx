import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Minus, Plus, QrCode, ReceiptText } from 'lucide-react';
import { Cart } from '../../hooks/useCart';
import { OrderType, TableInfo } from '../../types';
import { formatNumber, formatRupiah } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Kbd } from '../ui/Kbd';
import { TablePicker } from './TablePicker';
import { describeLine } from './shared';

interface OrderPanelProps {
  cart: Cart;
  orderNumber: number;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  tableNumber: string;
  tables: TableInfo[];
  onTableChange: (tableNumber: string) => void;
  onPayCash: (cashReceived: number) => void;
  onPayQris: () => void;
  /** F9 pays cash; turned off while a modal is open. */
  hotkeysEnabled: boolean;
  headerAction?: React.ReactNode;
  className?: string;
}

type DenominationKey = 'pas' | 10000 | 20000 | 50000 | 100000 | 'custom';

export const OrderPanel: React.FC<OrderPanelProps> = ({
  cart,
  orderNumber,
  orderType,
  onOrderTypeChange,
  tableNumber,
  tables,
  onTableChange,
  onPayCash,
  onPayQris,
  hotkeysEnabled,
  headerAction,
  className,
}) => {
  const [selectedDenom, setSelectedDenom] = useState<DenominationKey>('pas');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const isEmpty = cart.items.length === 0;

  // Hitung uang yang diterima berdasarkan pilihan pecahan
  const cashReceived = React.useMemo(() => {
    if (selectedDenom === 'pas') return cart.total;
    if (selectedDenom === 'custom') {
      const parsed = parseInt(customAmount.replace(/\D/g, ''), 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return selectedDenom;
  }, [selectedDenom, customAmount, cart.total]);

  const change = Math.max(0, cashReceived - cart.total);
  const isShort = !isEmpty && cashReceived < cart.total;

  useEffect(() => {
    if (isEmpty) {
      setSelectedDenom('pas');
      setCustomAmount('');
    }
  }, [isEmpty]);

  useEffect(() => {
    if (selectedDenom === 'custom') {
      customInputRef.current?.focus();
    }
  }, [selectedDenom]);

  useEffect(() => {
    if (!hotkeysEnabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F9' && !isEmpty && !isShort) {
        e.preventDefault();
        onPayCash(cashReceived);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkeysEnabled, isEmpty, isShort, onPayCash, cashReceived]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPickerOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  const handleDineIn = () => {
    if (orderType === 'dine_in') setPickerOpen((o) => !o);
    else onOrderTypeChange('dine_in');
  };

  const denominations: { key: DenominationKey; label: string }[] = [
    { key: 'pas', label: 'Uang Pas' },
    { key: 10000, label: '10rb' },
    { key: 20000, label: '20rb' },
    { key: 50000, label: '50rb' },
    { key: 100000, label: '100rb' },
    { key: 'custom', label: 'Custom' },
  ];

  return (
    <section
      aria-label="Pesanan aktif"
      className={cn('flex flex-col gap-3.5 bg-w-night-2 px-5 pt-4 pb-5 min-h-0', className)}
    >
      <div className="flex items-center gap-2">
        <h2 className="flex-1 font-display text-lg font-bold text-w-night-text">
          Pesanan #{String(orderNumber).padStart(3, '0')}
        </h2>
        <div ref={pickerRef} className="relative">
          <div role="group" aria-label="Jenis pesanan" className="flex p-[3px] bg-w-night rounded-[9px]">
            <button
              type="button"
              onClick={handleDineIn}
              aria-pressed={orderType === 'dine_in'}
              aria-haspopup="dialog"
              aria-expanded={pickerOpen}
              className={cn(
                'px-2.5 py-1.5 rounded-[7px] text-xs font-semibold transition-colors',
                orderType === 'dine_in' ? 'bg-w-night-3 text-w-night-text' : 'text-w-night-muted hover:text-w-night-text',
              )}
            >
              {tableNumber}
            </button>
            <button
              type="button"
              onClick={() => {
                onOrderTypeChange('takeaway');
                setPickerOpen(false);
              }}
              aria-pressed={orderType === 'takeaway'}
              className={cn(
                'px-2.5 py-1.5 rounded-[7px] text-xs font-semibold transition-colors',
                orderType === 'takeaway' ? 'bg-w-night-3 text-w-night-text' : 'text-w-night-muted hover:text-w-night-text',
              )}
            >
              Bungkus
            </button>
          </div>
          {pickerOpen && (
            <TablePicker
              tables={tables}
              selected={tableNumber}
              onSelect={(t) => {
                onTableChange(t);
                setPickerOpen(false);
              }}
              className="absolute right-0 top-full mt-2"
            />
          )}
        </div>
        {headerAction}
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-3 bg-w-paper rounded px-[18px] py-4 text-w-ink">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <ReceiptText className="w-6 h-6 text-w-line-strong" aria-hidden />
            <p className="text-sm font-semibold">Belum ada pesanan</p>
            <p className="text-xs text-w-ink-2">Ketuk menu di kiri untuk mulai.</p>
          </div>
        ) : (
          <ul className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 flex flex-col">
            {cart.items.map((line, idx) => {
              const sub = describeLine(line);
              return (
                <li
                  key={line.cartItemId}
                  className={cn(
                    'flex items-center gap-3 py-3 first:pt-0',
                    idx < cart.items.length - 1 && 'border-b border-dashed border-[#CFC3AF]',
                  )}
                >
                  <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
                    <p className="text-sm font-semibold">{line.menuItem.name}</p>
                    {sub && <p className="text-xs text-w-ink-2">{sub}</p>}
                  </div>
                  <div className="flex items-center gap-0.5 bg-w-card border border-w-line rounded-lg">
                    <button
                      type="button"
                      onClick={() => cart.updateQuantity(line.cartItemId, -1)}
                      aria-label={`Kurangi ${line.menuItem.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-w-paper"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-[18px] text-center text-sm font-bold tabular-nums" aria-live="polite">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => cart.updateQuantity(line.cartItemId, 1)}
                      aria-label={`Tambah ${line.menuItem.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-w-paper"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="w-16 shrink-0 text-right font-display text-[15px] font-bold tabular-nums">
                    {formatNumber(line.subtotal)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-col gap-1 text-[13px] text-w-ink-2">
          <div className="flex justify-between">
            <span>Subtotal · {cart.count} item</span>
            <span className="tabular-nums font-semibold">{formatNumber(cart.total)}</span>
          </div>
        </div>
        <div className="flex items-end justify-between border-t-2 border-w-ink pt-2">
          <span className="text-[13px] font-extrabold tracking-[1px]">TOTAL</span>
          <span className="font-display text-[28px] leading-none font-extrabold tabular-nums">
            {formatRupiah(cart.total)}
          </span>
        </div>
      </div>

      {/* Pilihan Pecahan Uang Tunai (Pas, 10, 20, 50, 100, Custom) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-w-night-muted font-medium">Uang Diterima:</span>
          {!isEmpty && (
            <span
              className={cn(
                'font-bold tabular-nums',
                isShort ? 'text-w-chili' : 'text-w-leaf',
              )}
            >
              {isShort ? `Kurang ${formatRupiah(cart.total - cashReceived)}` : `Kembali ${formatRupiah(change)}`}
            </span>
          )}
        </div>

        <div role="radiogroup" aria-label="Pilihan pecahan uang tunai" className="grid grid-cols-3 gap-1.5">
          {denominations.map((d) => {
            const active = selectedDenom === d.key;
            return (
              <button
                key={String(d.key)}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={isEmpty}
                onClick={() => setSelectedDenom(d.key)}
                className={cn(
                  'h-9 rounded-lg border text-xs font-bold transition-all disabled:opacity-40',
                  active
                    ? 'bg-w-yolk text-w-ink border-w-yolk shadow-sm'
                    : 'bg-w-night-3 text-w-night-text border-w-night-line hover:border-w-night-muted',
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Input Custom Nominal jika memilih Custom */}
        {selectedDenom === 'custom' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-w-night-3 border border-w-yolk">
            <span className="text-xs font-bold text-w-night-muted">Rp</span>
            <input
              ref={customInputRef}
              type="text"
              inputMode="numeric"
              value={customAmount}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '');
                setCustomAmount(clean ? formatNumber(parseInt(clean, 10)) : '');
              }}
              placeholder="Masukkan nominal uang tunai..."
              className="flex-1 bg-transparent text-sm font-bold text-w-night-text placeholder:text-w-night-muted outline-none tabular-nums"
            />
            {customAmount && (
              <button
                type="button"
                onClick={() => setCustomAmount('')}
                className="text-[11px] text-w-night-muted hover:text-w-night-text"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onPayQris}
          disabled={isEmpty}
          className="w-[110px] h-13 shrink-0 flex items-center justify-center gap-2 rounded-xl bg-w-night-3 border border-w-night-line text-sm font-bold text-w-night-text hover:border-w-night-muted disabled:opacity-40"
        >
          <QrCode className="w-[18px] h-[18px]" />
          QRIS
        </button>
        <button
          type="button"
          onClick={() => onPayCash(cashReceived)}
          disabled={isEmpty || isShort}
          className={cn(
            'flex-1 h-13 flex items-center justify-between gap-2.5 px-4 rounded-xl text-w-ink transition-all',
            isEmpty || isShort
              ? 'bg-w-night-3 text-w-night-muted border border-w-night-line cursor-not-allowed opacity-50'
              : 'bg-w-yolk hover:brightness-105 shadow-md shadow-w-yolk/10',
          )}
        >
          <span className="text-sm font-extrabold">
            {isShort ? 'Uang Kurang' : 'Bayar Tunai'}
          </span>
          <Kbd className="bg-black/[0.08] text-xs">F9</Kbd>
        </button>
      </div>
    </section>
  );
};
