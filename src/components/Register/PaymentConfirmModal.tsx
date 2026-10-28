import React from 'react';
import { AlertCircle, CheckCircle2, QrCode, Wallet, X } from 'lucide-react';
import { formatNumber, formatRupiah } from '../../utils/format';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';

interface PaymentConfirmModalProps {
  orderNumber: number;
  tableNumber: string;
  orderType: 'dine_in' | 'takeaway';
  method: 'cash' | 'qris';
  total: number;
  cashReceived?: number;
  itemCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PaymentConfirmModal: React.FC<PaymentConfirmModalProps> = ({
  orderNumber,
  tableNumber,
  orderType,
  method,
  total,
  cashReceived,
  itemCount,
  onCancel,
  onConfirm,
}) => {
  const isCash = method === 'cash';
  const received = cashReceived ?? total;
  const change = Math.max(0, received - total);
  const isShort = isCash && received < total;

  return (
    <Modal
      labelledBy="confirm-title"
      onClose={onCancel}
      className="w-full max-w-[440px] rounded-[22px] bg-w-night-2 border border-w-night-line text-w-night-text shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-w-night-line">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-w-yolk/15 text-w-yolk flex items-center justify-center">
            {isCash ? <Wallet className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
          </div>
          <div>
            <h2 id="confirm-title" className="font-display text-lg font-bold">
              Konfirmasi Pembayaran
            </h2>
            <p className="text-xs text-w-night-muted">
              Pesanan #{String(orderNumber).padStart(3, '0')} · {orderType === 'takeaway' ? 'Bungkus' : tableNumber}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Tutup konfirmasi"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-w-night-3 hover:bg-w-night-line text-w-night-muted hover:text-w-night-text"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        {isShort && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-w-chili/15 border border-w-chili/30 text-w-chili text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Uang yang diterima kurang dari total belanja!</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-w-night-3/70 border border-w-night-line flex flex-col gap-2.5">
          <div className="flex justify-between text-xs text-w-night-muted">
            <span>Metode Bayar</span>
            <span className="font-semibold text-w-night-text uppercase tracking-wider">
              {isCash ? 'Tunai (Cash)' : 'QRIS Dinamis'}
            </span>
          </div>
          <div className="flex justify-between text-xs text-w-night-muted">
            <span>Jumlah Pesanan</span>
            <span className="font-semibold text-w-night-text">{itemCount} item</span>
          </div>
          <div className="border-t border-w-night-line/60 pt-2 flex justify-between items-baseline">
            <span className="text-sm font-semibold text-w-night-text">Total Tagihan</span>
            <span className="font-display text-2xl font-black text-w-yolk tabular-nums">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        {isCash && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-w-night-3/40 border border-w-night-line">
              <span className="text-[11px] text-w-night-muted block mb-1">Uang Diterima</span>
              <span className="font-display text-lg font-bold text-w-night-text tabular-nums">
                {formatRupiah(received)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-w-leaf/10 border border-w-leaf/25">
              <span className="text-[11px] text-w-leaf block mb-1">Kembalian</span>
              <span className="font-display text-lg font-extrabold text-w-leaf tabular-nums">
                {formatRupiah(change)}
              </span>
            </div>
          </div>
        )}

        <p className="text-[13px] text-w-night-muted text-center pt-1">
          Apakah kasir sudah memverifikasi uang fisik / mutasi pembayaran pelanggan?
        </p>
      </div>

      <div className="flex items-center gap-3 px-6 pb-6 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl bg-w-night-3 hover:bg-w-night-line border border-w-night-line text-sm font-bold text-w-night-text transition-colors"
        >
          Tidak / Batal
        </button>
        <button
          type="button"
          data-autofocus
          disabled={isShort}
          onClick={onConfirm}
          className={cn(
            'flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-all',
            isShort
              ? 'bg-w-night-3 text-w-night-muted cursor-not-allowed border border-w-night-line'
              : 'bg-w-yolk text-w-ink hover:brightness-105 shadow-md shadow-w-yolk/10',
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Ya, Selesaikan</span>
        </button>
      </div>
    </Modal>
  );
};
