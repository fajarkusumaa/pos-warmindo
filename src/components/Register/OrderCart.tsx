import React from 'react';
import { Trash2, Plus, Minus, QrCode, Banknote, Coffee, ShoppingBag } from 'lucide-react';
import { CartItem } from '../../types';
import { formatRupiah } from '../../utils/format';

interface OrderCartProps {
  items: CartItem[];
  tableNumber: string;
  setTableNumber: (tbl: string) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOpenPaymentModal: (method: 'cash' | 'qris') => void;
}

export const OrderCart: React.FC<OrderCartProps> = ({
  items,
  tableNumber,
  setTableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenPaymentModal,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal; // tax or discount if needed

  const tables = [
    'Meja 01', 'Meja 02', 'Meja 03', 'Meja 04', 
    'Meja 05', 'Meja 06', 'Meja 07', 'Meja 08',
    'Meja 09', 'Meja 10', 'Meja 11', 'Meja 12',
    'Bungkus / Takeaway'
  ];

  return (
    <div className="w-full lg:w-[420px] xl:w-[460px] h-full bg-surface border-l border-border flex flex-col justify-between select-none">
      {/* Cart Header */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 bg-surface">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-ink-muted" />
          <select
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="text-xs sm:text-sm font-bold bg-ground border border-border rounded-lg px-2.5 py-1 text-ink focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
          >
            {tables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-status-negative hover:underline font-medium"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 text-ink-muted">
            <div className="w-14 h-14 rounded-2xl bg-ground border border-border flex items-center justify-center mb-3">
              <ShoppingBag className="w-7 h-7 text-ink-muted/50" />
            </div>
            <p className="text-sm font-semibold text-ink">Keranjang Kosong</p>
            <p className="text-xs text-ink-muted max-w-[200px] mt-0.5">
              Pilih menu mie, minuman, atau gorengan di katalog untuk mulai transaksi
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-ground/60 border border-border/80 rounded-xl p-3 flex flex-col gap-2 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-ink">
                    {item.menuItem.name}
                  </h4>
                  <span className="text-[11px] text-ink-muted font-mono">
                    @{formatRupiah(item.unitPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold font-mono text-ink tabular-nums">
                    {formatRupiah(item.subtotal)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="text-ink-muted hover:text-status-negative p-1 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Modifiers Pill Details */}
              {item.customization && (
                <div className="text-[11px] text-ink-muted space-y-0.5 bg-surface/80 p-2 rounded-lg border border-border/40">
                  {item.customization.doneness !== 'Kenyal (Standar)' && (
                    <p className="text-ink font-medium">
                      • {item.customization.doneness}
                    </p>
                  )}
                  {item.customization.spicinessLevel > 0 && (
                    <p className="text-status-negative font-medium">
                      • Pedas: {item.customization.spicinessLevel} cabai rawit
                    </p>
                  )}
                  {item.customization.egg && (
                    <p>• {item.customization.egg}</p>
                  )}
                  {item.customization.toppings.map((t) => (
                    <p key={t.id}>• +{t.name}</p>
                  ))}
                  {item.customization.notes && (
                    <p className="italic text-ink">
                      "{item.customization.notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                  className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink hover:bg-raised"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold font-mono">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                  className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink hover:bg-raised"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Calculation & Payment Actions */}
      <div className="p-4 bg-ground border-t border-border space-y-3">
        {/* Subtotal & Total */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-ink-muted">
            <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
            <span className="font-mono tabular-nums">{formatRupiah(subtotal)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm font-bold text-ink">Total Tagihan</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-ink tabular-nums">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        {/* Quick Payment Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => onOpenPaymentModal('qris')}
            className="h-12 rounded-xl bg-surface border border-border hover:border-ink/30 text-ink font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <QrCode className="w-4 h-4 text-status-chart" />
            <span>Bayar QRIS</span>
          </button>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => onOpenPaymentModal('cash')}
            className="h-12 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Banknote className="w-4 h-4 text-warm-amber" />
            <span>Bayar Tunai</span>
          </button>
        </div>
      </div>
    </div>
  );
};
