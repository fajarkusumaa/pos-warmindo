import React, { useState } from 'react';
import { Trash2, Plus, Minus, QrCode, Banknote, Coffee, ShoppingBag, Delete } from 'lucide-react';
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
  const total = subtotal;

  const [cashInput, setCashInput] = useState<string>('0');
  const cashReceived = Number(cashInput) || 0;
  const change = cashReceived - total;

  const tables = [
    'Meja 01', 'Meja 02', 'Meja 03', 'Meja 04', 
    'Meja 05', 'Meja 06', 'Meja 07', 'Meja 08',
    'Meja 09', 'Meja 10', 'Meja 11', 'Meja 12',
    'Bungkus / Takeaway'
  ];

  const handleNumpad = (val: string) => {
    if (val === 'C') {
      setCashInput('0');
      return;
    }
    if (val === 'Pas') {
      setCashInput(total.toString());
      return;
    }
    if (val === '50k') {
      setCashInput('50000');
      return;
    }
    if (val === '100k') {
      setCashInput('100000');
      return;
    }
    if (val === '00') {
      if (cashInput === '0') return;
      setCashInput((p) => p + '00');
      return;
    }
    if (cashInput === '0') {
      setCashInput(val);
    } else {
      setCashInput((p) => p + val);
    }
  };

  return (
    <div className="w-full lg:w-[420px] xl:w-[460px] h-full bg-[#161412] border-l border-[#2b2520] flex flex-col justify-between select-none">
      {/* Perforated Receipt Header */}
      <div className="p-4 border-b border-[#2b2520] flex items-center justify-between gap-3 bg-[#1a1714]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-warm-amber text-[#12100e] flex items-center justify-center font-bold text-xs font-mono">
            #
          </div>
          <select
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="text-xs sm:text-sm font-bold bg-[#26221d] border border-[#383129] rounded-lg px-2.5 py-1 text-white focus:outline-none focus:ring-1 focus:ring-warm-amber cursor-pointer"
          >
            {tables.map((t) => (
              <option key={t} value={t} className="bg-[#1a1714] text-white">
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
            <div className="w-14 h-14 rounded-2xl bg-[#1f1c19] border border-[#2b2520] flex items-center justify-center mb-3">
              <ShoppingBag className="w-7 h-7 text-ink-muted/50" />
            </div>
            <p className="text-sm font-semibold text-white">Tiket Pesanan Kosong</p>
            <p className="text-xs text-ink-muted max-w-[200px] mt-0.5">
              Pilih menu racikan Indomie, kopi, atau gorengan untuk mulai transaksi
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-[#1f1c19] border border-[#2b2520] rounded-xl p-3 flex flex-col gap-2 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {item.menuItem.name}
                  </h4>
                  <span className="text-[11px] text-warm-amber font-mono">
                    @{formatRupiah(item.unitPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold font-mono text-white tabular-nums">
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
                <div className="text-[11px] text-ink-muted space-y-0.5 bg-[#161412] p-2 rounded-lg border border-[#2b2520]">
                  {item.customization.doneness !== 'Kenyal (Standar)' && (
                    <p className="text-white font-medium">
                      • {item.customization.doneness}
                    </p>
                  )}
                  {item.customization.spicinessLevel > 0 && (
                    <p className="text-status-negative font-medium">
                      • Pedas: {item.customization.spicinessLevel} cabai rawit 🔥
                    </p>
                  )}
                  {item.customization.egg && (
                    <p>• {item.customization.egg}</p>
                  )}
                  {item.customization.toppings.map((t) => (
                    <p key={t.id}>• +{t.name}</p>
                  ))}
                  {item.customization.notes && (
                    <p className="italic text-white">
                      "{item.customization.notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#2b2520]">
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                  className="w-6 h-6 rounded bg-[#29241f] border border-[#3d352e] flex items-center justify-center text-white hover:bg-raised"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold font-mono text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                  className="w-6 h-6 rounded bg-[#29241f] border border-[#3d352e] flex items-center justify-center text-white hover:bg-raised"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Calculation & Tactile Numpad */}
      <div className="p-4 bg-[#141210] border-t border-[#2b2520] space-y-3">
        {/* Subtotal & Total */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center pt-1 border-b border-[#2b2520] pb-2">
            <span className="text-sm font-bold text-white">Total Tagihan ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-warm-amber tabular-nums">
              {formatRupiah(total)}
            </span>
          </div>

          {/* Live Cash Change Calculation */}
          {items.length > 0 && (
            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-[#1f1c19] border border-[#2b2520]">
              <span className="text-ink-muted text-xs font-mono">
                Uang: {cashReceived > 0 ? formatRupiah(cashReceived) : 'Rp 0'}
              </span>
              <span className={`text-xs font-bold font-mono ${change >= 0 && cashReceived > 0 ? 'text-status-positive' : 'text-ink-muted'}`}>
                {change >= 0 && cashReceived > 0 ? `Kembalian: ${formatRupiah(change)}` : 'Masukkan Uang'}
              </span>
            </div>
          )}
        </div>

        {/* Tactile Cashier Mini-Numpad */}
        {items.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              ['7', '8', '9', '50k'],
              ['4', '5', '6', '100k'],
              ['1', '2', '3', 'Pas'],
              ['C', '0', '00', 'Tunai']
            ].flat().map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  if (k === 'Tunai') {
                    onOpenPaymentModal('cash');
                  } else {
                    handleNumpad(k);
                  }
                }}
                className={`h-9 rounded-lg text-xs font-bold font-mono transition-all active:scale-95 border ${
                  k === 'Tunai'
                    ? 'bg-warm-amber text-[#12100e] border-warm-amber shadow-xs'
                    : k === '50k' || k === '100k' || k === 'Pas'
                    ? 'bg-[#29241f] text-warm-amber border-[#3d352e]'
                    : 'bg-[#1c1917] text-white border-[#2b2520] hover:bg-[#26221d]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        )}

        {/* Quick Payment Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => onOpenPaymentModal('qris')}
            className="h-11 rounded-xl bg-[#1f1c19] border border-[#383129] hover:border-warm-amber text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <QrCode className="w-4 h-4 text-status-chart" />
            <span>Bayar QRIS</span>
          </button>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => onOpenPaymentModal('cash')}
            className="h-11 rounded-xl bg-warm-amber hover:bg-amber-500 text-[#12100e] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Banknote className="w-4 h-4" />
            <span>Bayar & Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
