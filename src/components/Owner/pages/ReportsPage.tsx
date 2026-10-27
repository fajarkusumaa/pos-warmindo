import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, FileX, Landmark, Package, Receipt, Scale, Users } from 'lucide-react';
import { DAILY_REVENUE, PROFIT, REPORTS } from '../../../data/ownerData';
import { downloadCsv } from '../../../utils/csv';
import { cn } from '../../../utils/cn';
import { Button, Card, PageHeader, SectionTitle, Swatch } from '../ui';

const REPORT_ICONS = { receipt: Receipt, scale: Scale, landmark: Landmark, package: Package, users: Users };

/** The sample data covers October 2026, the current month. */
const DATA_MONTH = { year: 2026, month: 9 };

const monthLabel = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

/** V2 · 08 — profit equation, daily revenue and report downloads. */
export const ReportsPage: React.FC = () => {
  const [cursor, setCursor] = useState(DATA_MONTH);
  const hasData = cursor.year === DATA_MONTH.year && cursor.month === DATA_MONTH.month;
  const isLatest = hasData;
  const label = monthLabel(cursor.year, cursor.month);

  const shift = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const max = Math.max(...DAILY_REVENUE);
  const isWeekend = (day: number) => [0, 6].includes(new Date(DATA_MONTH.year, DATA_MONTH.month, day).getDay());

  const downloadAll = () =>
    downloadCsv(`omzet-harian-${DATA_MONTH.year}-${DATA_MONTH.month + 1}.csv`, [
      ['Tanggal', 'Omzet (ribu Rp)'],
      ...DAILY_REVENUE.map((v, i) => [`${i + 1}/${DATA_MONTH.month + 1}/${DATA_MONTH.year}`, v]),
    ]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Laporan">
        <div className="h-[42px] flex items-center gap-1 px-1.5 rounded-[11px] bg-w-card border border-w-line">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Bulan sebelumnya"
            className="w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-w-paper"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="w-[120px] text-center text-[13px] font-bold capitalize" aria-live="polite">
            {label}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={isLatest}
            aria-label="Bulan berikutnya"
            className="w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-w-paper disabled:text-w-line-strong disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <Button variant="dark" icon={<Download className="w-4 h-4" />} onClick={downloadAll} disabled={!hasData}>
          Unduh semua
        </Button>
      </PageHeader>

      {!hasData ? (
        <Card className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <FileX className="w-8 h-8 text-w-line-strong" aria-hidden />
          <p className="text-base font-bold text-w-ink">Belum ada laporan untuk {label}</p>
          <p className="text-sm text-w-ink-2">Data contoh hanya tersedia untuk {monthLabel(DATA_MONTH.year, DATA_MONTH.month)}.</p>
          <Button className="mt-2" onClick={() => setCursor(DATA_MONTH)}>
            Kembali ke bulan ini
          </Button>
        </Card>
      ) : (
        <>
          <Card className="flex flex-col gap-5 p-7">
            <div className="flex flex-wrap items-center gap-4">
              <Term label="Omzet" value={PROFIT.revenue.value} note={PROFIT.revenue.note} noteClass="text-w-leaf" />
              <Operator>−</Operator>
              <Term label="Bahan baku (HPP)" value={PROFIT.cogs.value} note={`${PROFIT.cogs.share}% dari omzet`} />
              <Operator>−</Operator>
              <Term label="Operasional" value={PROFIT.opex.value} note="Gaji, listrik, gas, sewa" />
              <Operator>=</Operator>
              <Term
                label="Laba bersih"
                value={PROFIT.net.value}
                note={`Margin ${PROFIT.net.margin}`}
                className="px-5 py-4 bg-w-yolk"
                noteClass="text-w-ink"
                labelClass="text-w-ink"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-2.5 flex gap-[3px] rounded-[5px] overflow-hidden" aria-hidden>
                <div className="bg-[#B9AE9C]" style={{ width: `${PROFIT.cogs.share}%` }} />
                <div className="bg-w-toggle-off" style={{ width: `${PROFIT.opex.share}%` }} />
                <div className="flex-1 bg-w-yolk" />
              </div>
              <div className="flex gap-[3px] text-xs font-semibold text-w-ink-2">
                <span style={{ width: `${PROFIT.cogs.share}%` }}>Bahan baku {PROFIT.cogs.share}%</span>
                <span style={{ width: `${PROFIT.opex.share}%` }}>Operasional {PROFIT.opex.share}%</span>
                <span className="flex-1">Laba {PROFIT.net.share}%</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5">
            <Card className="min-h-[420px] flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <SectionTitle>Omzet harian</SectionTitle>
                <div className="flex gap-3.5">
                  <Swatch color="#1C1917" label="Hari kerja" />
                  <Swatch color="#FFC531" label="Akhir pekan" />
                </div>
              </div>
              <div
                className="flex-1 min-h-[260px] flex items-end gap-[5px] border-b border-w-line"
                role="img"
                aria-label="Grafik omzet harian Oktober. Akhir pekan konsisten lebih tinggi dari hari kerja."
              >
                {DAILY_REVENUE.map((v, i) => (
                  <div
                    key={i}
                    title={`${i + 1} Okt · Rp ${v.toLocaleString('id-ID')} rb`}
                    className={cn('flex-1 rounded-t-[3px]', isWeekend(i + 1) ? 'bg-w-yolk' : 'bg-w-ink')}
                    style={{ height: `${(v / max) * 54}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-w-ink-2" aria-hidden>
                <span>1 Okt</span>
                <span>8</span>
                <span>15</span>
                <span>22</span>
                <span>30</span>
              </div>
            </Card>

            <Card className="flex flex-col gap-2 pt-6 px-2 pb-2">
              <SectionTitle className="px-4 pb-2">Unduh laporan</SectionTitle>
              <ul className="flex flex-col">
                {REPORTS.map((r) => {
                  const Icon = REPORT_ICONS[r.icon];
                  return (
                    <li key={r.id} className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-w-paper">
                      <span className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-w-paper flex items-center justify-center">
                        <Icon className="w-[18px] h-[18px] text-w-ink" aria-hidden />
                      </span>
                      <span className="flex-1 flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-w-ink">{r.name}</span>
                        <span className="text-xs text-w-ink-2">{r.formats}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          downloadCsv(`${r.id}-${DATA_MONTH.year}-${DATA_MONTH.month + 1}.csv`, [
                            ['Laporan', r.name],
                            ['Periode', label],
                          ])
                        }
                        aria-label={`Unduh ${r.name}`}
                        className="w-[34px] h-[34px] flex items-center justify-center rounded-[9px] border border-w-line bg-w-card hover:border-w-line-strong"
                      >
                        <Download className="w-4 h-4 text-w-ink" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

const Term: React.FC<{
  label: string;
  value: string;
  note: string;
  className?: string;
  noteClass?: string;
  labelClass?: string;
}> = ({ label, value, note, className, noteClass, labelClass }) => (
  <div className={cn('flex-1 min-w-[160px] flex flex-col gap-1.5 rounded-[14px]', className)}>
    <span className={cn('text-[13px] font-semibold text-w-ink-2', labelClass)}>{label}</span>
    <span className="font-display text-[34px] leading-none font-extrabold tracking-[-1px] text-w-ink tabular-nums">{value}</span>
    <span className={cn('text-xs font-semibold text-w-ink-2', noteClass)}>{note}</span>
  </div>
);

const Operator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="w-9 h-9 shrink-0 rounded-full bg-w-paper flex items-center justify-center font-display text-xl font-bold text-w-ink-2"
    aria-hidden
  >
    {children}
  </span>
);
