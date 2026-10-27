import React, { useState } from 'react';
import { Coffee, Clock, Users, ArrowRight } from 'lucide-react';
import { TableInfo, TableStatus } from '../../types';
import { formatRupiah, formatDuration } from '../../utils/format';

interface TableTrackerProps {
  tables: TableInfo[];
  onSelectTable: (table: TableInfo) => void;
}

export const TableTracker: React.FC<TableTrackerProps> = ({ tables, onSelectTable }) => {
  const [filter, setFilter] = useState<'all' | TableStatus>('all');

  const filteredTables = tables.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'eating':
        return {
          label: 'Sedang Makan',
          className: 'bg-[#064e3b] text-[#a7f3d0] border-[#047857]',
        };
      case 'add_order':
        return {
          label: 'Tambah Menu',
          className: 'bg-[#78350f] text-[#fde68a] border-[#b45309]',
        };
      case 'need_bill':
        return {
          label: 'Minta Bill!',
          className: 'bg-[#881337] text-[#fecdd3] border-red-800 animate-pulse',
        };
      case 'available':
      default:
        return {
          label: 'Kosong',
          className: 'bg-[#1f1c19] text-ink-muted border-[#2b2520]',
        };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-ground">
      {/* Top Header & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Status Meja & Durasi Nongkrong
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#26221d] text-warm-amber text-xs font-mono font-bold border border-[#383129]">
              Live Seating
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Monitoring durasi waktu nongkrong, pesanan tambahan, dan status siap bayar
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-warm-amber text-[#12100e] shadow-xs'
                : 'bg-surface text-ink-body border border-border hover:bg-raised'
            }`}
          >
            Semua ({tables.length})
          </button>
          <button
            onClick={() => setFilter('eating')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'eating'
                ? 'bg-[#10b981] text-[#12100e] shadow-xs font-bold'
                : 'bg-surface text-ink-body border border-border hover:bg-raised'
            }`}
          >
            Sedang Makan ({tables.filter((t) => t.status === 'eating').length})
          </button>
          <button
            onClick={() => setFilter('need_bill')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'need_bill'
                ? 'bg-rose-500 text-white shadow-xs font-bold'
                : 'bg-surface text-ink-body border border-border hover:bg-raised'
            }`}
          >
            Minta Bill ({tables.filter((t) => t.status === 'need_bill').length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'available'
                ? 'bg-white text-[#12100e] shadow-xs font-bold'
                : 'bg-surface text-ink-body border border-border hover:bg-raised'
            }`}
          >
            Kosong ({tables.filter((t) => t.status === 'available').length})
          </button>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
        {filteredTables.map((table) => {
          const badge = getStatusBadge(table.status);
          const isOccupied = table.status !== 'available';

          return (
            <div
              key={table.id}
              className={`bg-surface rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 shadow-xs hover:shadow-lg ${
                table.status === 'need_bill'
                  ? 'border-red-600/70 ring-1 ring-red-500/30'
                  : 'border-border hover:border-warm-amber/50'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span className="font-mono text-warm-amber">{table.number}</span>
                      <span className="text-xs font-medium text-ink-muted">
                        ({table.name})
                      </span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {isOccupied
                          ? `${table.guestCount} Pelanggan`
                          : `Kapasitas ${table.capacity} Orang`}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Duration & Bill Info */}
                {isOccupied && (
                  <div className="bg-[#141210] rounded-xl p-3 border border-border space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Durasi Nongkrong
                      </span>
                      <span className="font-mono font-bold text-white">
                        {formatDuration(table.elapsedSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border">
                      <span className="text-ink-muted">Estimasi Tagihan</span>
                      <span className="font-mono font-bold text-warm-amber text-sm">
                        {formatRupiah(table.totalBill || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectTable(table)}
                className={`w-full h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  isOccupied
                    ? 'bg-warm-amber hover:bg-amber-500 text-[#12100e]'
                    : 'bg-[#231f1a] hover:bg-[#2c2721] text-white border border-border'
                }`}
              >
                <span>{isOccupied ? 'Buka Kasir Meja Ini' : 'Mulai Pesanan Baru'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
