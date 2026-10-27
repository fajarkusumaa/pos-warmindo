import React, { useEffect, useState } from 'react';
import { Check, Printer } from 'lucide-react';
import { Order, PrinterConfig } from '../../types';
import { breakDownChange, formatNumber, formatRupiah } from '../../utils/format';
import { Kbd } from '../ui/Kbd';
import { Modal } from '../ui/Modal';

interface ChangeModalProps {
  order: Order;
  printerConfig: PrinterConfig;
  onNewTransaction: () => void;
  onOpenPrinter: () => void;
}

const NOTE_COLORS: Record<number, string> = {
  100000: '#C8604F',
  50000: '#5A7FA8',
  20000: '#5F9A6E',
  10000: '#B98A5A',
  5000: '#A88B4A',
  2000: '#8C8C84',
  1000: '#7F9A8A',
};

/** V2 · 03 — big yolk change amount plus which notes to pull from the drawer. */
export const ChangeModal: React.FC<ChangeModalProps> = ({ order, printerConfig, onNewTransaction, onOpenPrinter }) => {
  const [printState, setPrintState] = useState<'idle' | 'printing' | 'done'>('idle');
  const isCash = order.paymentMethod === 'cash';
  const change = order.change ?? 0;
  const notes = breakDownChange(change);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target as HTMLElement).closest('button')) {
        e.preventDefault();
        onNewTransaction();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNewTransaction]);

  const handleReprint = () => {
    if (!printerConfig.connected) {
      onOpenPrinter();
      return;
    }
    setPrintState('printing');
    window.setTimeout(() => setPrintState('done'), 1200);
  };

  return (
    <Modal
      labelledBy="change-title"
      onClose={onNewTransaction}
      className="w-full max-w-[440px] rounded-[20px] bg-w-night-2 border border-w-night-line text-w-night-text"
    >
      <div className="flex flex-col gap-1 px-6 pt-6 pb-7 bg-w-yolk text-w-ink">
        <div className="self-start flex items-center gap-2 pl-1.5 pr-2.5 py-[5px] rounded-full bg-w-ink/[0.08]">
          <span className="w-5 h-5 rounded-full bg-w-leaf flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
          <span className="text-[13px] font-bold">Lunas · {isCash ? 'Tunai' : 'QRIS'}</span>
        </div>
        <p id="change-title" className="mt-3 text-[15px] font-semibold">
          {isCash ? 'Kembalian' : 'Total dibayar'}
        </p>
        <p className="font-display text-[clamp(44px,13vw,64px)] leading-none font-extrabold tracking-[-1.5px] tabular-nums" aria-live="polite">
          {formatRupiah(isCash ? change : order.total)}
        </p>
      </div>

      <div className="flex flex-col gap-[18px] px-6 py-5">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-w-night-muted">Total tagihan</dt>
            <dd className="font-semibold tabular-nums">{formatRupiah(order.total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-w-night-muted">{isCash ? 'Uang diterima' : 'Metode'}</dt>
            <dd className="font-semibold tabular-nums">
              {isCash ? formatRupiah(order.cashReceived ?? order.total) : 'QRIS'}
            </dd>
          </div>
        </dl>

        {isCash && (
          <div className="flex flex-col gap-2.5 pt-4 border-t border-w-night-line">
            <h3 className="text-[13px] font-bold">Siapkan uang</h3>
            {notes.length === 0 ? (
              <p className="text-[13px] text-w-night-muted">Uang pas, tidak ada kembalian.</p>
            ) : (
              <ul className="grid grid-cols-3 gap-2">
                {notes.map((n) => (
                  <li
                    key={n.value}
                    className="h-14 flex items-center gap-2.5 px-3 rounded-[10px] bg-w-night-3 border border-w-night-line"
                  >
                    <span
                      className="w-1.5 h-[30px] shrink-0 rounded-[3px]"
                      style={{ backgroundColor: NOTE_COLORS[n.value] ?? '#B8B2A6' }}
                      aria-hidden
                    />
                    <span className="flex flex-col">
                      <span className="text-xs text-w-night-muted">{n.count}×</span>
                      <span className="font-display text-base font-bold tabular-nums">{formatNumber(n.value)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-6 pt-1 pb-6">
        <button
          type="button"
          data-autofocus
          onClick={onNewTransaction}
          className="h-14 flex items-center justify-between px-[18px] rounded-xl bg-w-paper text-w-ink hover:bg-white"
        >
          <span className="text-base font-extrabold">Transaksi baru</span>
          <Kbd className="bg-w-ink/10 px-2">Enter</Kbd>
        </button>
        <button
          type="button"
          onClick={handleReprint}
          disabled={printState === 'printing'}
          className="h-12 flex items-center justify-center gap-2 rounded-xl border border-w-night-line text-sm font-semibold hover:bg-w-night-3 disabled:opacity-60"
        >
          <Printer className="w-4 h-4" aria-hidden />
          <span aria-live="polite">
            {!printerConfig.connected
              ? 'Hubungkan printer'
              : printState === 'printing'
                ? 'Mencetak…'
                : printState === 'done'
                  ? 'Struk dicetak · cetak lagi'
                  : 'Cetak ulang struk'}
          </span>
        </button>
      </div>
    </Modal>
  );
};
