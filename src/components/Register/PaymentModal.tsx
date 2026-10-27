import React, { useState } from 'react';
import { X, QrCode, Banknote, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatRupiah } from '../../utils/format';

interface PaymentModalProps {
  totalAmount: number;
  tableNumber: string;
  initialMethod: 'cash' | 'qris';
  onClose: () => void;
  onPaymentSuccess: (method: 'cash' | 'qris', cashReceived?: number, change?: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  totalAmount,
  tableNumber,
  initialMethod,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'cash' | 'qris'>(initialMethod);
  const [cashInput, setCashInput] = useState<string>(totalAmount.toString());

  const cashReceived = Number(cashInput) || 0;
  const change = cashReceived - totalAmount;
  const isCashSufficient = cashReceived >= totalAmount;

  const quickAmounts = [
    { label: 'Uang Pas', value: totalAmount },
    { label: '20.000', value: 20000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
  ];

  const handleNumpad = (digit: string) => {
    if (digit === 'C') {
      setCashInput('0');
      return;
    }
    if (digit === '00') {
      if (cashInput === '0') return;
      setCashInput((prev) => prev + '00');
      return;
    }
    if (cashInput === '0') {
      setCashInput(digit);
    } else {
      setCashInput((prev) => prev + digit);
    }
  };

  const handleConfirm = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    if (method === 'cash') {
      onPaymentSuccess('cash', cashReceived, change);
    } else {
      onPaymentSuccess('qris');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1c1917] rounded-2xl border border-[#2b2520] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b2520] flex items-center justify-between bg-[#1a1714]">
          <div>
            <h3 className="text-base font-bold text-white">
              Penyelesaian Pembayaran
            </h3>
            <p className="text-xs text-ink-muted">
              {tableNumber} • Tagihan: <span className="font-mono font-bold text-warm-amber">{formatRupiah(totalAmount)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#26221d] hover:bg-[#383129] flex items-center justify-center text-ink-muted hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="p-4 bg-[#141210] border-b border-[#2b2520]">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1c1917] rounded-xl border border-[#2b2520]">
            <button
              onClick={() => setMethod('cash')}
              className={`h-11 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                method === 'cash'
                  ? 'bg-warm-amber text-[#12100e] shadow-xs'
                  : 'text-ink-muted hover:text-white'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Tunai / Cash</span>
            </button>
            <button
              onClick={() => setMethod('qris')}
              className={`h-11 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                method === 'qris'
                  ? 'bg-warm-amber text-[#12100e] shadow-xs'
                  : 'text-ink-muted hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-status-chart" />
              <span>QRIS Dinamis</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto">
          {method === 'cash' ? (
            <div className="space-y-4">
              {/* Cash Received Display */}
              <div>
                <label className="block text-xs font-semibold text-warm-amber uppercase tracking-wider mb-1.5">
                  Uang Tunai Diterima
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-ink-muted">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={new Intl.NumberFormat('id-ID').format(cashReceived)}
                    readOnly
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#141210] border border-[#2b2520] text-lg font-bold font-mono text-white text-right focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Cash Chips */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => setCashInput(q.value.toString())}
                    className="h-9 rounded-lg bg-[#26221d] border border-[#383129] hover:bg-[#332c25] text-xs font-semibold font-mono text-warm-amber"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Numpad Calculator for fast touch cashier */}
              <div className="grid grid-cols-3 gap-2">
                {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '00'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleNumpad(digit)}
                    className="h-11 rounded-lg bg-[#231f1a] border border-[#2b2520] hover:bg-[#2b2520] text-sm font-bold font-mono text-white active:scale-95 transition-transform"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              {/* Kembalian Highlight Box */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isCashSufficient
                    ? 'bg-[#064e3b] border-[#047857]'
                    : 'bg-[#881337] border-red-900/50'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider block text-white/90">
                    {isCashSufficient ? 'Uang Kembalian' : 'Uang Kurang'}
                  </span>
                  <span
                    className={`text-xl font-bold font-mono tabular-nums ${
                      isCashSufficient ? 'text-[#a7f3d0]' : 'text-rose-300'
                    }`}
                  >
                    {formatRupiah(Math.abs(change))}
                  </span>
                </div>
                {isCashSufficient && (
                  <CheckCircle2 className="w-6 h-6 text-[#a7f3d0]" />
                )}
              </div>
            </div>
          ) : (
            /* QRIS Simulation View */
            <div className="flex flex-col items-center justify-center text-center py-4 space-y-4">
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-status-chart/40 shadow-xs">
                <div className="w-48 h-48 bg-ground rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white rounded">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-black'
                            : (i % 5 === 0 ? 'bg-blue-600' : 'bg-transparent')
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold tracking-widest uppercase">
                      QRIS
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-white">
                  WARMINDO 88 KEMANG
                </p>
                <p className="text-[11px] text-ink-muted font-mono">
                  NMID: ID102938475688 • Real-Time Dinamis
                </p>
                <p className="text-base font-bold text-warm-amber font-mono pt-1">
                  {formatRupiah(totalAmount)}
                </p>
              </div>

              <p className="text-xs text-ink-muted max-w-xs">
                Scan via GoPay, ShopeePay, OVO, Dana, BCA, atau Livin'. QRIS otomatis mendeteksi status pembayaran lunas.
              </p>
            </div>
          )}
        </div>

        {/* Footer Confirm Button */}
        <div className="p-4 bg-[#141210] border-t border-[#2b2520] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#383129] text-xs sm:text-sm font-semibold text-ink-body hover:bg-[#26221d]"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={method === 'cash' && !isCashSufficient}
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-warm-amber hover:bg-amber-500 text-[#12100e] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <span>{method === 'cash' ? 'Selesaikan Tunai & Struk' : 'Konfirmasi QRIS Lunas'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
