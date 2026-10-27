import React, { useMemo, useState } from 'react';
import { Beef, Coffee, Egg, Ellipsis, Package, PackagePlus, Search, Snowflake, TriangleAlert, Truck, Wheat } from 'lucide-react';
import { StockItem } from '../../../data/ownerData';
import { formatNumber } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { Button, Field, PageHeader, PaperModal } from '../ui';

const ICONS = { egg: Egg, package: Package, snowflake: Snowflake, beef: Beef, coffee: Coffee, wheat: Wheat };

type Filter = 'semua' | 'menipis' | 'habis' | 'pokok' | 'minuman';

const daysLeft = (s: StockItem) => (s.stock <= 0 ? 0 : Math.max(1, Math.floor(s.stock / s.dailyUse)));
const level = (s: StockItem) => (s.stock <= 0 ? 'out' : s.stock < s.min ? 'low' : s.stock < s.min * 1.25 ? 'warn' : 'ok');

const FILTERS: { id: Filter; label: string; match: (s: StockItem) => boolean }[] = [
  { id: 'semua', label: 'Semua', match: () => true },
  { id: 'menipis', label: 'Menipis', match: (s) => ['low', 'warn'].includes(level(s)) },
  { id: 'habis', label: 'Habis', match: (s) => level(s) === 'out' },
  { id: 'pokok', label: 'Bahan pokok', match: (s) => s.group !== 'Minuman' },
  { id: 'minuman', label: 'Minuman', match: (s) => s.group === 'Minuman' },
];

interface InventoryPageProps {
  items: StockItem[];
  onStockIn: (id: string, quantity: number) => void;
  onCreatePo: (items: string) => void;
}

/** V2 · 09 — stock vs minimum gauges with a run-out estimate. */
export const InventoryPage: React.FC<InventoryPageProps> = ({ items, onStockIn, onCreatePo }) => {
  const [filter, setFilter] = useState<Filter>('semua');
  const [query, setQuery] = useState('');
  const [stockInFor, setStockInFor] = useState<string | null>(null);

  const stockValue = items.reduce((sum, s) => sum + s.stock * s.price, 0);
  const urgent = items.filter((s) => daysLeft(s) <= 2);
  const q = query.trim().toLowerCase();
  const rows = useMemo(
    () => items.filter((s) => FILTERS.find((f) => f.id === filter)!.match(s) && (!q || s.name.toLowerCase().includes(q))),
    [items, filter, q],
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Inventori" subtitle={`${items.length} bahan · nilai stok Rp ${formatNumber(stockValue)}`}>
        <label className="w-[260px] h-[42px] flex items-center gap-2 px-3 rounded-[11px] bg-w-card border border-w-line focus-within:border-w-ink">
          <Search className="w-4 h-4 text-w-ink-2" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari bahan…"
            aria-label="Cari bahan"
            className="flex-1 min-w-0 bg-transparent text-[13px] text-w-ink outline-none placeholder:text-w-ink-2"
          />
        </label>
        <Button variant="primary" icon={<PackagePlus className="w-4 h-4" />} onClick={() => setStockInFor(items[0]?.id ?? null)}>
          Catat stok masuk
        </Button>
      </PageHeader>

      {urgent.length > 0 && (
        <div role="alert" className="flex flex-wrap items-center gap-3.5 pl-[18px] pr-3.5 py-3.5 rounded-[14px] bg-w-chili-soft">
          <TriangleAlert className="w-5 h-5 text-w-chili" aria-hidden />
          <div className="flex-1 min-w-[200px] flex flex-col gap-0.5 text-w-chili-deep">
            <p className="text-[15px] font-bold">{urgent.length} bahan habis dalam 2 hari</p>
            <p className="text-[13px]">{urgent.map((s) => s.name).join(', ')}</p>
          </div>
          <button
            type="button"
            onClick={() => onCreatePo(urgent.map((s) => s.name).join(', '))}
            className="h-10 flex items-center gap-2 px-4 rounded-[10px] bg-w-card border border-w-chili text-[13px] font-bold text-w-chili-text hover:bg-white"
          >
            <Truck className="w-4 h-4" aria-hidden />
            Buat PO sekarang
          </button>
        </div>
      )}

      <div role="tablist" aria-label="Filter bahan" className="flex gap-6 border-b border-w-line overflow-x-auto">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 pb-3 -mb-px border-b-2 text-sm',
                active ? 'border-w-ink text-w-ink font-bold' : 'border-transparent text-w-ink-2 font-medium hover:text-w-ink',
              )}
            >
              {f.label}
              <span className="text-xs font-semibold text-w-ink-2">{items.filter(f.match).length}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-w-card border border-w-line rounded-[18px] overflow-x-auto">
        <table className="w-full min-w-[880px] text-left">
          <thead className="bg-w-paper border-b border-w-line">
            <tr className="text-xs font-bold text-w-ink-2">
              <th className="px-5 py-3 font-bold">Bahan</th>
              <th className="w-[340px] py-3 font-bold">Stok vs minimum</th>
              <th className="w-[170px] pl-5 py-3 font-bold">Perkiraan habis</th>
              <th className="w-[160px] py-3 font-bold">Harga satuan</th>
              <th className="w-[64px] pr-5 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-w-ink-2">
                  Tidak ada bahan di filter ini.
                </td>
              </tr>
            )}
            {rows.map((s) => {
              const Icon = ICONS[s.icon];
              const lvl = level(s);
              const days = daysLeft(s);
              return (
                <tr key={s.id} className="border-b border-w-line last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 shrink-0 rounded-[10px] bg-w-paper flex items-center justify-center">
                        <Icon className="w-4 h-4 text-w-ink-2" aria-hidden />
                      </span>
                      <span className="flex flex-col gap-px">
                        <span className="text-sm font-semibold text-w-ink">{s.name}</span>
                        <span className="text-xs text-w-ink-2">{s.group}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span
                          className={cn('text-[13px] font-bold', lvl === 'low' || lvl === 'out' ? 'text-w-chili' : 'text-w-ink')}
                        >
                          {s.stock} {s.unit}
                        </span>
                        <span className="text-xs text-w-ink-2">min {s.min}</span>
                      </div>
                      <div
                        className="relative h-2 rounded bg-w-sunk"
                        role="meter"
                        aria-valuemin={0}
                        aria-valuemax={s.capacity}
                        aria-valuenow={s.stock}
                        aria-label={`Stok ${s.name}, minimum ${s.min}`}
                      >
                        <div
                          className={cn(
                            'absolute inset-y-0 left-0 rounded',
                            lvl === 'ok' ? 'bg-w-leaf' : lvl === 'warn' ? 'bg-w-amber' : 'bg-w-chili',
                          )}
                          style={{ width: `${Math.min(100, (s.stock / s.capacity) * 100)}%` }}
                        />
                        <div
                          className="absolute -top-[3px] w-0.5 h-3.5 rounded-[1px] bg-w-ink"
                          style={{ left: `${(s.min / s.capacity) * 100}%` }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  </td>
                  <td className="pl-5 py-3">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-bold',
                        days <= 2
                          ? 'bg-w-chili-soft text-w-chili-text'
                          : days <= 5
                            ? 'bg-w-yolk-soft text-w-amber-text'
                            : 'bg-w-paper text-w-ink-2',
                      )}
                    >
                      {days === 0 ? 'Habis' : `≈ ${days} hari`}
                    </span>
                  </td>
                  <td className="py-3 text-[13px] text-w-ink-2">
                    Rp {formatNumber(s.price)} / {s.unit}
                  </td>
                  <td className="pr-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setStockInFor(s.id)}
                      aria-label={`Catat stok masuk untuk ${s.name}`}
                      title="Catat stok masuk"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-w-ink-2 hover:bg-w-paper hover:text-w-ink"
                    >
                      <Ellipsis className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stockInFor && (
        <StockInModal
          items={items}
          initialId={stockInFor}
          onClose={() => setStockInFor(null)}
          onSubmit={(id, qty) => {
            onStockIn(id, qty);
            setStockInFor(null);
          }}
        />
      )}
    </div>
  );
};

const StockInModal: React.FC<{
  items: StockItem[];
  initialId: string;
  onClose: () => void;
  onSubmit: (id: string, quantity: number) => void;
}> = ({ items, initialId, onClose, onSubmit }) => {
  const [id, setId] = useState(initialId);
  const [qty, setQty] = useState('');
  const item = items.find((s) => s.id === id)!;
  const qtyNum = Number(qty.replace(',', '.'));

  return (
    <PaperModal
      title="Catat stok masuk"
      submitLabel="Simpan"
      submitDisabled={!(qtyNum > 0)}
      onClose={onClose}
      onSubmit={() => onSubmit(id, qtyNum)}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold">Bahan</span>
        <select
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="h-11 px-3 rounded-[10px] bg-w-card border border-w-line-strong text-sm text-w-ink focus:outline-2 focus:outline-w-ink"
        >
          {items.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — sisa {s.stock} {s.unit}
            </option>
          ))}
        </select>
      </label>
      <Field label={`Jumlah masuk (${item.unit})`}>
        <input inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" data-autofocus />
      </Field>
    </PaperModal>
  );
};
