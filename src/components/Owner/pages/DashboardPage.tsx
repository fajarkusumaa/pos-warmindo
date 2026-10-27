import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronRight, Download, LucideIcon, PackageX, TrendingUp, Truck, UserX, Wallet } from 'lucide-react';
import { DASHBOARD_HERO, DashboardRange, HOURLY_SALES, PAYMENT_SPLIT, TOP_MENU } from '../../../data/ownerData';
import { downloadCsv } from '../../../utils/csv';
import { cn } from '../../../utils/cn';
import { OwnerPage } from '../OwnerSidebar';
import { Button, Card, PageHeader, SectionTitle, Swatch } from '../ui';

const RANGES: { id: DashboardRange; label: string }[] = [
  { id: 'today', label: 'Hari ini' },
  { id: '7d', label: '7 hari' },
  { id: '30d', label: '30 hari' },
];

const greeting = (hour: number) =>
  hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 19 ? 'Selamat sore' : 'Selamat malam';

const ALERTS: { title: string; detail: string; icon: LucideIcon; tone: string; to: OwnerPage }[] = [
  { title: '3 bahan hampir habis', detail: 'Telur, Indomie Goreng, Es batu', icon: PackageX, tone: 'bg-w-chili-soft text-w-chili', to: 'inventori' },
  { title: 'PO-0918 tiba besok', detail: 'CV Sumber Makmur · Rp 1,8 jt', icon: Truck, tone: 'bg-w-sunk text-w-ink', to: 'pembelian' },
  { title: 'Kasir shift pagi kurang 1', detail: 'Sari izin sakit', icon: UserX, tone: 'bg-w-yolk-soft text-w-amber-text', to: 'karyawan' },
];

/** V2 · 04 — owner dashboard. */
export const DashboardPage: React.FC<{ onNavigate: (page: OwnerPage) => void }> = ({ onNavigate }) => {
  const [range, setRange] = useState<DashboardRange>('today');
  const hero = DASHBOARD_HERO[range];
  const now = new Date();

  const { max, peaks, peakLabel } = useMemo(() => {
    const max = Math.max(...HOURLY_SALES);
    const ranked = HOURLY_SALES.map((v, h) => ({ v, h })).sort((a, b) => b.v - a.v);
    const peaks = new Set(ranked.slice(0, 3).map((r) => r.h));
    const hours = [...peaks].sort((a, b) => a - b);
    const sum = hours.reduce((s, h) => s + HOURLY_SALES[h], 0);
    const peakLabel = `Puncak ${String(hours[0]).padStart(2, '0')}:00 – ${String(hours[hours.length - 1] + 1).padStart(2, '0')}:00 · Rp ${sum} rb`;
    return { max, peaks, peakLabel };
  }, []);
  const topRevenue = Math.max(...TOP_MENU.map((m) => m.revenue));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow={now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        title={`${greeting(now.getHours())}, Fajar`}
      >
        <div role="radiogroup" aria-label="Rentang waktu" className="flex p-1 rounded-[11px] bg-w-sunk">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={range === r.id}
              onClick={() => setRange(r.id)}
              className={cn(
                'px-3.5 py-2 rounded-lg text-[13px] transition-colors',
                range === r.id ? 'bg-w-card text-w-ink font-bold' : 'text-w-ink-2 font-medium hover:text-w-ink',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <Button
          variant="dark"
          icon={<Download className="w-4 h-4" />}
          onClick={() =>
            downloadCsv('penjualan-per-jam.csv', [
              ['Jam', 'Penjualan (ribu Rp)'],
              ...HOURLY_SALES.map((v, h) => [`${String(h).padStart(2, '0')}:00`, v]),
            ])
          }
        >
          Unduh
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-5">
        <section className="min-h-[340px] flex flex-col gap-4 p-6 rounded-[20px] bg-w-ink text-w-night-text">
          <h2 className="text-[13px] font-semibold text-w-night-muted">{hero.label}</h2>
          <div className="flex flex-col gap-2.5">
            <p className="font-display text-[52px] leading-none font-extrabold tracking-[-1.5px] text-w-yolk tabular-nums">
              {hero.revenue}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 px-2 py-[3px] rounded-md bg-w-live/15 text-w-live text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden />
                {hero.delta}
              </span>
              <span className="text-xs text-w-night-muted">{hero.compare}</span>
            </div>
          </div>
          <div className="flex-1" />
          <dl className="grid grid-cols-3 pt-4 border-t border-w-night-line">
            {[
              ['Transaksi', hero.transactions],
              ['Rata-rata', hero.average],
              ['Laba kotor', hero.grossProfit],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="text-xs text-w-night-muted">{k}</dt>
                <dd className="font-display text-[17px] font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Card className="min-h-[340px] flex flex-col gap-4 p-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <SectionTitle>{range === 'today' ? 'Penjualan per jam' : 'Rata-rata penjualan per jam'}</SectionTitle>
              <p className="text-[13px] text-w-ink-2">{peakLabel}</p>
            </div>
            <div className="flex items-center gap-3.5">
              <Swatch color="#1C1917" label="Hari ini" />
              <Swatch color="#FFC531" label="Jam puncak" />
            </div>
          </div>
          <div
            className="flex-1 min-h-[180px] flex items-end gap-1 border-b border-w-line"
            role="img"
            aria-label={`Grafik penjualan per jam. ${peakLabel}.`}
          >
            {HOURLY_SALES.map((v, h) => (
              <div
                key={h}
                title={`${String(h).padStart(2, '0')}:00 · Rp ${v} rb`}
                className={cn('flex-1 rounded-t', peaks.has(h) ? 'bg-w-yolk' : 'bg-w-ink')}
                style={{ height: `${(v / max) * 92}%` }}
              />
            ))}
          </div>
          <div className="flex gap-1" aria-hidden>
            {HOURLY_SALES.map((_, h) => (
              <span key={h} className="flex-1 h-3.5 text-[11px] leading-none text-w-ink-2">
                {h % 3 === 0 ? String(h).padStart(2, '0') : ''}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[1fr_340px_340px] gap-5">
        <Card className="flex flex-col gap-4 p-6 lg:col-span-2 2xl:col-span-1">
          <div className="flex items-center justify-between">
            <SectionTitle>Menu terlaris</SectionTitle>
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="flex items-center gap-1 text-[13px] font-semibold text-w-ink-2 hover:text-w-ink"
            >
              Semua menu
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
          <ol className="flex flex-col gap-3.5">
            {TOP_MENU.map((m, i) => (
              <li key={m.name} className="flex items-center gap-3.5">
                <span
                  className={cn('w-4 font-display text-base font-extrabold', i === 0 ? 'text-w-chili' : 'text-w-ink-2')}
                >
                  {i + 1}
                </span>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex justify-between gap-3">
                    <span className="text-sm font-semibold text-w-ink">{m.name}</span>
                    <span className="text-[13px] text-w-ink-2 tabular-nums">
                      {m.portions} porsi · Rp {m.revenue} rb
                    </span>
                  </div>
                  <div className="h-1.5 rounded-[3px] bg-w-sunk">
                    <div
                      className={cn('h-full rounded-[3px]', i === 0 ? 'bg-w-chili' : 'bg-w-ink')}
                      style={{ width: `${(m.revenue / topRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <SectionTitle>Metode bayar</SectionTitle>
          <div className="flex gap-4">
            {(
              [
                ['Tunai', PAYMENT_SPLIT.cash, '#1C1917'],
                ['QRIS', PAYMENT_SPLIT.qris, '#FFC531'],
              ] as const
            ).map(([label, s, color]) => (
              <div key={label} className="flex-1 flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-[13px] text-w-ink-2">
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color }} aria-hidden />
                  {label} · {s.share}%
                </span>
                <span className="font-display text-[22px] font-bold text-w-ink tabular-nums">{s.amount}</span>
              </div>
            ))}
          </div>
          <div className="h-3.5 flex gap-[3px] rounded-[7px] overflow-hidden" aria-hidden>
            <div className="bg-w-ink" style={{ width: `${PAYMENT_SPLIT.cash.share}%` }} />
            <div className="flex-1 bg-w-yolk" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-w-paper">
            <Wallet className="w-[18px] h-[18px] text-w-ink-2" aria-hidden />
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-xs text-w-ink-2">Uang di laci</span>
              <span className="text-[15px] font-bold text-w-ink tabular-nums">{PAYMENT_SPLIT.drawer}</span>
            </div>
            <span className="text-xs font-bold text-w-leaf">Cocok</span>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <SectionTitle>Perlu perhatian</SectionTitle>
          <ul className="flex flex-col gap-1">
            {ALERTS.map((a) => (
              <li key={a.title}>
                <button
                  type="button"
                  onClick={() => onNavigate(a.to)}
                  className="w-full flex items-center gap-3 py-2 -mx-2 px-2 rounded-xl text-left hover:bg-w-paper"
                >
                  <span className={cn('w-9 h-9 shrink-0 rounded-[10px] flex items-center justify-center', a.tone)}>
                    <a.icon className="w-[18px] h-[18px]" aria-hidden />
                  </span>
                  <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-w-ink">{a.title}</span>
                    <span className="text-xs text-w-ink-2">{a.detail}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-w-ink-2" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
