import React, { useState } from 'react';
import { Check, Printer, Plus, Share2, Copy } from 'lucide-react';
import { Order, PrinterConfig } from '../../types';
import { generateEscPosReceipt } from '../../utils/escpos';
import { formatRupiah, formatReceiptTime } from '../../utils/format';

interface ReceiptModalProps {
  order: Order;
  printerConfig: PrinterConfig;
  onNewTransaction: () => void;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  printerConfig,
  onNewTransaction,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const { textPreview } = generateEscPosReceipt(order, printerConfig.paperSize);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 600);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(textPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-md shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Success Banner */}
        <div className="bg-status-positive-bg border-b border-status-positive/20 p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-status-positive text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Check className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-status-positive">
            Transaksi Berhasil Disimpan
          </h3>
          <p className="text-xs text-status-positive/80 font-mono">
            {order.orderNumber} • {order.tableNumber}
          </p>
        </div>

        {/* Realistic Thermal Receipt Slip */}
        <div className="p-4 sm:p-6 bg-ground/50 flex justify-center">
          <div className="w-full max-w-[340px] bg-white rounded-lg shadow-md border border-border/80 p-5 font-mono text-xs text-ink space-y-3 relative">
            {/* Store Header */}
            <div className="text-center space-y-0.5 border-b border-dashed border-border pb-3">
              <h4 className="text-sm font-bold text-ink">
                WARMINDO & WARKOP 88
              </h4>
              <p className="text-[10px] text-ink-muted">
                Jl. Kemang Raya No. 88, Jaksel
              </p>
              <p className="text-[10px] text-ink-muted">
                WA: 0812-8888-9999
              </p>
            </div>

            {/* Meta */}
            <div className="text-[11px] space-y-1 border-b border-dashed border-border pb-2.5">
              <div className="flex justify-between">
                <span className="text-ink-muted">No. Order</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Meja</span>
                <span className="font-bold">{order.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Waktu</span>
                <span>{formatReceiptTime(new Date(order.timestamp))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Kasir</span>
                <span>{order.cashierName}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 border-b border-dashed border-border pb-3">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                  {item.customization && (
                    <div className="text-[10px] text-ink-muted pl-2 space-y-0.5">
                      {item.customization.doneness !== 'Kenyal (Standar)' && (
                        <p>• {item.customization.doneness}</p>
                      )}
                      {item.customization.spicinessLevel > 0 && (
                        <p>• Pedas: {item.customization.spicinessLevel} rawit</p>
                      )}
                      {item.customization.egg && (
                        <p>• +{item.customization.egg}</p>
                      )}
                      {item.customization.toppings.map((t) => (
                        <p key={t.id}>• +{t.name}</p>
                      ))}
                      {item.customization.notes && (
                        <p>• Note: {item.customization.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 border-b border-dashed border-border pb-2.5">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-ink pt-1">
                <span>TOTAL</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="text-[11px] space-y-1 border-b border-dashed border-border pb-2.5">
              {order.paymentMethod === 'cash' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Bayar Tunai</span>
                    <span>{formatRupiah(order.cashReceived || order.total)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-status-positive">
                    <span>Kembalian</span>
                    <span>{formatRupiah(order.change || 0)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between font-semibold text-status-chart">
                  <span>Metode</span>
                  <span>QRIS (LUNAS)</span>
                </div>
              )}
            </div>

            {/* Footer text */}
            <div className="text-center text-[10px] text-ink-muted pt-1 space-y-0.5">
              <p>SSID: W88_KEMANG • Pass: indomiegoreng</p>
              <p className="font-sans text-[11px] font-semibold text-ink pt-1">
                Matur Nuwun! Ditunggu rawuhnya lagi.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-surface border-t border-border space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="h-10 rounded-xl bg-surface border border-border hover:bg-raised text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? 'Mencetak...' : 'Cetak Thermal'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="h-10 rounded-xl bg-surface border border-border hover:bg-raised text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-positive" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>

          <button
            onClick={onNewTransaction}
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
