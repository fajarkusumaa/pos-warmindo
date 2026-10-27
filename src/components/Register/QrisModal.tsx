import React from 'react';
import { QrCode, X } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { Modal } from '../ui/Modal';

interface QrisModalProps {
  total: number;
  onClose: () => void;
  onPaid: () => void;
}

/** Shows the static QRIS code and lets the cashier confirm once the customer's app says paid. */
export const QrisModal: React.FC<QrisModalProps> = ({ total, onClose, onPaid }) => (
  <Modal
    labelledBy="qris-title"
    onClose={onClose}
    className="w-full max-w-[400px] rounded-[20px] bg-w-night-2 border border-w-night-line text-w-night-text"
  >
    <div className="flex items-center gap-3 px-6 pt-5">
      <h2 id="qris-title" className="flex-1 font-display text-xl font-bold">
        Bayar dengan QRIS
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-w-night-3 hover:bg-w-night-line"
      >
        <X className="w-[18px] h-[18px]" />
      </button>
    </div>
    <div className="flex flex-col items-center gap-4 px-6 py-6">
      <div className="w-[220px] h-[220px] rounded-2xl bg-white flex items-center justify-center">
        <QrCode className="w-[180px] h-[180px] text-w-ink" strokeWidth={1.25} aria-label="Kode QRIS Warmindo 88" />
      </div>
      <div className="text-center">
        <p className="text-[13px] text-w-night-muted">Total tagihan</p>
        <p className="font-display text-[34px] leading-tight font-extrabold text-w-yolk tabular-nums">
          {formatRupiah(total)}
        </p>
      </div>
      <p className="text-[13px] text-w-night-muted text-center">
        Minta pelanggan memindai kode, lalu cek notifikasi masuk sebelum konfirmasi.
      </p>
    </div>
    <div className="flex gap-2.5 px-6 pb-6">
      <button
        type="button"
        onClick={onClose}
        className="h-12 px-5 rounded-xl border border-w-night-line text-sm font-semibold hover:bg-w-night-3"
      >
        Batal
      </button>
      <button
        type="button"
        data-autofocus
        onClick={onPaid}
        className="flex-1 h-12 rounded-xl bg-w-yolk text-w-ink text-[15px] font-extrabold hover:brightness-105"
      >
        Pembayaran masuk
      </button>
    </div>
  </Modal>
);
