import React, { useState } from 'react';
import { Check, Printer, Plus, Copy } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1c1917] rounded-2xl border border-[#2b2520] w-full max-w-md shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Success Banner */}
        <div className="bg-[#064e3b] border-b border-[#047857] p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-[#10b981] text-[#12100e] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <h3 className="text-base font-bold text-[#a7f3d0]">
            Transaksi Sukses & Disimpan
          </h3>
          <p className="text-xs text-[#a7f3d0]/80 font-mono">
            {order.orderNumber} • {order.tableNumber}
          </p>
        </div>

        {/* Realistic Thermal Receipt Slip */}
        <div className="p-4 sm:p-6 bg-[#12100e] flex justify-center">
          <div className="w-full max-w-[340px] bg-white rounded-lg shadow-xl border border-gray-300 p-5 font-mono text-xs text-black space-y-3 relative">
            {/* Store Header */}
            <div className="text-center space-y-0.5 border-b border-dashed border-gray-400 pb-3">
              <h4 className="text-sm font-bold text-black">
                WARMINDO & WARKOP 88
              </h4>
              <p className="text-[10px] text-gray-600">
                Jl. Kemang Raya No. 88, Jaksel
              </p>
              <p className="text-[10px] text-gray-600">
                WA: 0812-8888-9999
              </p>
            </div>

            {/* Meta */}
            <div className="text-[11px] space-y-1 border-b border-dashed border-gray-400 pb-2.5">
              <div className="flex justify-between">
                <span className="text-gray-600">No. Order</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meja</span>
                <span className="font-bold">{order.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu</span>
                <span>{formatReceiptTime(new Date(order.timestamp))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kasir</span>
                <span>{order.cashierName}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 border-b border-dashed border-gray-400 pb-3">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                  {item.customization && (
                    <div className="text-[10px] text-gray-600 pl-2 space-y-0.5">
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
            <div className="space-y-1 border-b border-dashed border-gray-400 pb-2.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black pt-1">
                <span>TOTAL</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="text-[11px] space-y-1 border-b border-dashed border-gray-400 pb-2.5">
              {order.paymentMethod === 'cash' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bayar Tunai</span>
                    <span>{formatRupiah(order.cashReceived || order.total)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Kembalian</span>
                    <span>{formatRupiah(order.change || 0)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between font-semibold text-blue-700">
                  <span>Metode</span>
                  <span>QRIS (LUNAS)</span>
                </div>
              )}
            </div>

            {/* Footer text */}
            <div className="text-center text-[10px] text-gray-600 pt-1 space-y-0.5">
              <p>SSID: W88_KEMANG • Pass: indomiegoreng</p>
              <p className="font-sans text-[11px] font-semibold text-black pt-1">
                Matur Nuwun! Ditunggu rawuhnya lagi.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#1a1714] border-t border-[#2b2520] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="h-10 rounded-xl bg-[#231f1a] border border-[#383129] hover:bg-[#2d2822] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? 'Mencetak...' : 'Cetak Thermal'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="h-10 rounded-xl bg-[#231f1a] border border-[#383129] hover:bg-[#2d2822] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-positive" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>

          <button
            onClick={onNewTransaction}
            className="w-full h-11 rounded-xl bg-warm-amber hover:bg-amber-500 text-[#12100e] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
