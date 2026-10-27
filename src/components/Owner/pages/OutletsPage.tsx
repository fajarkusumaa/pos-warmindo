import React from 'react';
import { ArrowUpRight, Plus, Receipt, User } from 'lucide-react';
import { Outlet } from '../../../data/ownerData';
import { formatNumber } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { Button, Card, PageHeader, SectionTitle, Swatch } from '../ui';

const SERIES = ['#1C1917', '#E0A800', '#B9AE9C'];

const METRICS: { label: string; value: (o: Outlet) => number; format: (v: number) => string }[] = [
  { label: 'Omzet', value: (o) => o.month.revenue, format: (v) => `Rp ${v.toLocaleString('id-ID')} jt` },
  { label: 'Transaksi', value: (o) => o.month.transactions, format: formatNumber },
  { label: 'Rata-rata struk', value: (o) => o.month.avgTicket, format: (v) => `Rp ${v.toLocaleString('id-ID')} rb` },
  { label: 'Margin bersih', value: (o) => o.month.margin, format: (v) => `${v.toLocaleString('id-ID')}%` },
];

interface OutletsPageProps {
  outlets: Outlet[];
  onOpenOutlet: (id: string) => void;
}

/** V2 · 12 — today's ranking per outlet and an October comparison. */
export const OutletsPage: React.FC<OutletsPageProps> = ({ outlets, onOpenOutlet }) => {
  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Outlet" subtitle={`Hari ini, sampai ${now}`}>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} disabled title="Penambahan outlet belum tersedia">
          Tambah outlet
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {outlets.map((o, i) => {
          const lead = i === 0;
          const peak = Math.max(...o.spark);
          return (
            <section
              key={o.id}
              aria-labelledby={`outlet-${o.id}`}
              className={cn(
                'flex flex-col gap-[18px] p-[22px] rounded-[20px]',
                lead ? 'bg-w-ink text-w-night-text' : 'bg-w-card border border-w-line text-w-ink',
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-xs font-extrabold',
                    lead ? 'bg-w-yolk text-w-ink' : 'bg-w-sunk text-w-ink',
                  )}
                >
                  #{i + 1}
                </span>
                <div className="flex-1 flex flex-col">
                  <h2 id={`outlet-${o.id}`} className="font-display text-[19px] font-bold">
                    {o.name}
                  </h2>
                  <span className={cn('text-xs', lead ? 'text-w-night-muted' : 'text-w-ink-2')}>{o.address}</span>
                </div>
                <span
                  className={cn(
                    'flex items-center gap-1.5 px-[9px] py-1 rounded-full text-xs font-bold',
                    lead ? 'bg-w-live/[0.13] text-w-live' : 'bg-w-leaf-soft text-w-leaf',
                  )}
                >
                  <span className={cn('w-[7px] h-[7px] rounded-full', lead ? 'bg-w-live' : 'bg-w-leaf')} aria-hidden />
                  Buka
                </span>
              </div>

              <div className="flex items-end gap-2.5">
                <span
                  className={cn(
                    'font-display text-4xl leading-none font-extrabold tracking-[-1px] tabular-nums',
                    lead ? 'text-w-yolk' : 'text-w-ink',
                  )}
                >
                  {o.revenueToday}
                </span>
                <span
                  className={cn(
                    'text-[13px] font-bold',
                    o.delta < 0 ? 'text-w-chili' : lead ? 'text-w-live' : 'text-w-leaf',
                  )}
                >
                  {o.delta < 0 ? '▼' : '▲'} {Math.abs(o.delta)}%
                </span>
              </div>

              <div className="h-14 flex items-end gap-[3px]" role="img" aria-label={`Tren omzet ${o.name} per jam`}>
                {o.spark.map((v, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex-1 rounded-t-sm',
                      v === peak ? (lead ? 'bg-w-yolk' : 'bg-w-ink') : lead ? 'bg-[#4A4038]' : 'bg-w-sunk',
                    )}
                    style={{ height: `${(v / peak) * 100}%` }}
                  />
                ))}
              </div>

              <div className={cn('flex items-center gap-4 pt-3.5 border-t', lead ? 'border-w-night-line' : 'border-w-line')}>
                <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                  <User className={cn('w-3.5 h-3.5', lead ? 'text-w-night-muted' : 'text-w-ink-2')} aria-hidden />
                  {o.cashier}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                  <Receipt className={cn('w-3.5 h-3.5', lead ? 'text-w-night-muted' : 'text-w-ink-2')} aria-hidden />
                  {o.receipts} struk
                </span>
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => onOpenOutlet(o.id)}
                  aria-label={`Buka dasbor ${o.name}`}
                  className={cn(
                    'w-8 h-8 -m-1.5 flex items-center justify-center rounded-lg',
                    lead ? 'text-w-night-muted hover:bg-w-night-3 hover:text-w-night-text' : 'text-w-ink-2 hover:bg-w-paper hover:text-w-ink',
                  )}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <Card className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <SectionTitle className="flex-1">
            Perbandingan {new Date().toLocaleDateString('id-ID', { month: 'long' })}
          </SectionTitle>
          <div className="flex gap-3.5">
            {outlets.map((o, i) => (
              <Swatch key={o.id} color={SERIES[i % SERIES.length]} label={o.name} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {METRICS.map((m) => {
            const max = Math.max(...outlets.map(m.value));
            return (
              <div key={m.label} className="flex flex-col gap-3">
                <h3 className="text-[13px] font-bold text-w-ink-2">{m.label}</h3>
                {outlets.map((o, i) => (
                  <div key={o.id} className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-w-ink tabular-nums">
                      {o.name} · {m.format(m.value(o))}
                    </span>
                    <div className="h-2 rounded bg-w-sunk">
                      <div
                        className="h-full rounded"
                        style={{ width: `${(m.value(o) / max) * 80}%`, backgroundColor: SERIES[i % SERIES.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
