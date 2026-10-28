import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  Download,
  FileSpreadsheet,
  Printer,
  Receipt,
  Search,
  Wallet,
  X,
} from 'lucide-react';
import { Order, PrinterConfig } from '../../types';
import { formatNumber, formatReceiptTime, formatRupiah } from '../../utils/format';
import { generateEscPosShiftSummary } from '../../utils/escpos';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';

interface TransactionSummaryModalProps {
  orders: Order[];
  cashierName: string;
  shiftLabel: string;
  printerConfig: PrinterConfig;
  onClose: () => void;
}

export const TransactionSummaryModal: React.FC<TransactionSummaryModalProps> = ({
  orders,
  cashierName,
  shiftLabel,
  printerConfig,
  onClose,
}) => {
  const [filterMethod, setFilterMethod] = useState<'all' | 'cash' | 'qris'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [printSuccess, setPrintSuccess] = useState(false);

  // Perhitungan KPI Ringkasan Shift
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let cashRevenue = 0;
    let qrisRevenue = 0;
    let cashCount = 0;
    let qrisCount = 0;

    orders.forEach((o) => {
      totalRevenue += o.total;
      if (o.paymentMethod === 'cash') {
        cashRevenue += o.total;
        cashCount += 1;
      } else {
        qrisRevenue += o.total;
        qrisCount += 1;
      }
    });

    return {
      totalRevenue,
      cashRevenue,
      qrisRevenue,
      cashCount,
      qrisCount,
      totalCount: orders.length,
    };
  }, [orders]);

  // Filter daftar transaksi
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchMethod = filterMethod === 'all' || o.paymentMethod === filterMethod;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.tableNumber.toLowerCase().includes(q) ||
        o.cashierName.toLowerCase().includes(q);
      return matchMethod && matchQuery;
    });
  }, [orders, filterMethod, searchQuery]);

  const handlePrintSummary = () => {
    const summary = generateEscPosShiftSummary(
      {
        cashierName,
        shiftLabel,
        orders,
        outletName: 'Warmindo 88',
      },
      printerConfig.paperSize,
    );

    // Mock cetak thermal (log ke console & berikan feedback UI)
    console.log('[ESC/POS SHIFT REKAP]:\n' + summary.textPreview);
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 3000);
  };

  return (
    <Modal
      labelledBy="summary-title"
      onClose={onClose}
      className="w-full max-w-[760px] h-[85vh] rounded-[24px] bg-w-night-2 border border-w-night-line text-w-night-text shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header Modal */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-w-night-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-w-yolk/15 text-w-yolk flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 id="summary-title" className="font-display text-xl font-bold">
              Rekap Transaksi Kasir
            </h2>
            <p className="text-xs text-w-night-muted">
              {cashierName} · {shiftLabel} · {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintSummary}
            className={cn(
              'h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs font-bold transition-colors',
              printSuccess
                ? 'bg-w-leaf text-white'
                : 'bg-w-night-3 hover:bg-w-night-line border border-w-night-line text-w-night-text',
            )}
            title="Cetak struk rekap shift ke printer thermal"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{printSuccess ? 'Tercetak!' : 'Cetak Rekap'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-w-night-3 hover:bg-w-night-line text-w-night-muted hover:text-w-night-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ringkasan KPI Cards */}
      <div className="p-6 pb-4 grid grid-cols-3 gap-3.5 shrink-0 bg-w-night/50">
        <div className="p-4 rounded-2xl bg-w-night-3/60 border border-w-night-line flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-w-night-muted">Total Omzet Shift</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-w-yolk/15 text-w-yolk font-bold">
              {stats.totalCount} Struk
            </span>
          </div>
          <span className="font-display text-2xl font-black text-w-yolk tabular-nums mt-0.5">
            {formatRupiah(stats.totalRevenue)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-w-night-3/60 border border-w-night-line flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-w-night-muted flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-w-leaf" />
              Tunai (Cash)
            </span>
            <span className="text-[11px] text-w-night-muted">{stats.cashCount}x</span>
          </div>
          <span className="font-display text-xl font-bold text-w-leaf tabular-nums mt-0.5">
            {formatRupiah(stats.cashRevenue)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-w-night-3/60 border border-w-night-line flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-w-night-muted flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-w-yolk" />
              QRIS
            </span>
            <span className="text-[11px] text-w-night-muted">{stats.qrisCount}x</span>
          </div>
          <span className="font-display text-xl font-bold text-w-night-text tabular-nums mt-0.5">
            {formatRupiah(stats.qrisRevenue)}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="px-6 py-3 border-y border-w-night-line flex items-center justify-between gap-3 shrink-0 bg-w-night-2">
        <div className="flex gap-1.5">
          {(
            [
              { id: 'all', label: `Semua (${orders.length})` },
              { id: 'cash', label: `Tunai (${stats.cashCount})` },
              { id: 'qris', label: `QRIS (${stats.qrisCount})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilterMethod(t.id)}
              className={cn(
                'h-8 px-3 rounded-lg text-xs font-semibold transition-colors',
                filterMethod === t.id
                  ? 'bg-w-yolk text-w-ink font-bold'
                  : 'bg-w-night-3 text-w-night-muted hover:text-w-night-text',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="h-8 w-56 flex items-center gap-2 px-2.5 rounded-lg bg-w-night-3 border border-w-night-line focus-within:border-w-yolk">
          <Search className="w-3.5 h-3.5 text-w-night-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no struk / meja..."
            className="flex-1 bg-transparent text-xs text-w-night-text placeholder:text-w-night-muted outline-none"
          />
        </label>
      </div>

      {/* Daftar Riwayat Transaksi */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-3 divide-y divide-w-night-line/60">
        {filteredOrders.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center gap-1.5 text-center text-w-night-muted">
            <Receipt className="w-8 h-8 opacity-40 mb-1" />
            <p className="text-sm font-semibold">Tidak ada transaksi ditemukan</p>
            <p className="text-xs">Selesaikan pesanan di layar kasir untuk melihat transaksi di sini.</p>
          </div>
        ) : (
          filteredOrders.map((o) => {
            const isExpanded = expandedOrderId === o.id;
            const isCash = o.paymentMethod === 'cash';

            return (
              <div key={o.id} className="py-3 flex flex-col gap-2">
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold uppercase',
                        isCash ? 'bg-w-leaf/15 text-w-leaf' : 'bg-w-yolk/15 text-w-yolk',
                      )}
                    >
                      {isCash ? 'CASH' : 'QRIS'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-w-night-text">{o.orderNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-w-night-3 text-w-night-muted font-medium">
                          {o.tableNumber}
                        </span>
                      </div>
                      <span className="text-xs text-w-night-muted">
                        {new Date(o.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}{' '}
                        · {o.items.length} item
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-display text-base font-bold text-w-yolk tabular-nums block">
                        {formatRupiah(o.total)}
                      </span>
                      {isCash && o.change !== undefined && o.change > 0 && (
                        <span className="text-[11px] text-w-night-muted">
                          Kembali: {formatRupiah(o.change)}
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-w-night-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-w-night-muted group-hover:text-w-night-text" />
                    )}
                  </div>
                </div>

                {/* Detail Item saat Expand */}
                {isExpanded && (
                  <div className="mt-1 pl-11 pr-2 py-2.5 rounded-xl bg-w-night-3/40 border border-w-night-line text-xs flex flex-col gap-1.5">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-w-night-muted">
                        <span>
                          <strong className="text-w-night-text">{item.quantity}x</strong> {item.menuItem.name}
                          {item.customization?.egg && ` (+${item.customization.egg.shortName})`}
                        </span>
                        <span className="tabular-nums font-semibold text-w-night-text">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-w-night-line/50 pt-1.5 mt-1 flex justify-between text-xs font-semibold text-w-night-text">
                      <span>Kasir: {o.cashierName}</span>
                      <span>Total: {formatRupiah(o.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-w-night-line flex items-center justify-between shrink-0 bg-w-night/60">
        <span className="text-xs text-w-night-muted">
          Menampilkan {filteredOrders.length} dari {orders.length} transaksi
        </span>
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-5 rounded-xl bg-w-night-3 hover:bg-w-night-line border border-w-night-line text-xs font-bold text-w-night-text"
        >
          Tutup Rekap
        </button>
      </div>
    </Modal>
  );
};
