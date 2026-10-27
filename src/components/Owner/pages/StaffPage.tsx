import React, { useEffect, useState } from 'react';
import { Calendar, Check, UserPlus } from 'lucide-react';
import { CASHIER_PERFORMANCE, Employee, Shift, SHIFT_HOURS } from '../../../data/ownerData';
import { formatNumber } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { Button, Card, Field, PageHeader, PaperModal, SectionTitle, Swatch } from '../ui';

const SHIFT_STYLE: Record<Shift, { block: string; legend?: { color: string; label: string } }> = {
  pagi: { block: 'bg-[#FFE08A] text-w-ink', legend: { color: '#FFE08A', label: 'Pagi 06–14' } },
  sore: { block: 'bg-[#F2B98A] text-w-ink', legend: { color: '#F2B98A', label: 'Sore 14–22' } },
  malam: { block: 'bg-w-ink text-white', legend: { color: '#1C1917', label: 'Malam 22–06' } },
  izin: { block: 'bg-[#FFF3CC] text-w-ink-2 outline outline-1 -outline-offset-1 outline-[#E3C463]' },
};

const pct = (hour: number) => `${(hour / 24) * 100}%`;
const hh = (h: number) => `${String(h % 24).padStart(2, '0')}:00`;
const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Night shift wraps past midnight, so it is drawn as two blocks. */
const blocksFor = (shift: Shift): { start: number; end: number; label?: string }[] => {
  if (shift === 'izin') return [{ start: 6, end: 14, label: 'Izin sakit' }];
  const [start, end] = SHIFT_HOURS[shift];
  const label = `${hh(start)} – ${hh(end)}`;
  return end > 24 ? [{ start: 0, end: end - 24, label }, { start, end: 24 }] : [{ start, end, label }];
};

const useNow = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
};

interface StaffPageProps {
  employees: Employee[];
  onAddEmployee: (e: Employee) => void;
}

/** V2 · 11 — today's shift timeline and cashier performance. */
export const StaffPage: React.FC<StaffPageProps> = ({ employees, onAddEmployee }) => {
  const [adding, setAdding] = useState(false);
  const now = useNow();
  const nowHours = now.getHours() + now.getMinutes() / 60;
  const nowLabel = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const onDuty = employees.filter((e) => e.shift !== 'izin' && blocksFor(e.shift).some((b) => nowHours >= b.start && nowHours < b.end)).length;
  const maxRevenue = Math.max(...CASHIER_PERFORMANCE.map((c) => c.revenue));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Karyawan" subtitle={`${employees.length} orang · ${onDuty} sedang bertugas`}>
        <div className="h-[42px] flex items-center gap-2 px-3.5 rounded-[11px] bg-w-card border border-w-line text-[13px] font-bold">
          <Calendar className="w-4 h-4" aria-hidden />
          {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
        </div>
        <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setAdding(true)}>
          Tambah karyawan
        </Button>
      </PageHeader>

      <Card className="flex flex-col gap-1.5 p-6 overflow-x-auto">
        <div className="flex flex-wrap items-center gap-3 pb-2.5">
          <SectionTitle className="flex-1">Jadwal shift</SectionTitle>
          <div className="flex gap-4">
            {Object.values(SHIFT_STYLE).map((s) => s.legend && <Swatch key={s.legend.label} {...s.legend} />)}
          </div>
        </div>

        <div className="min-w-[760px] flex flex-col">
          <div className="flex gap-4">
            <div className="w-[200px] shrink-0" />
            <div className="relative flex-1 h-4" aria-hidden>
              {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
                <span key={h} className="absolute top-0 text-[11px] text-w-ink-2" style={{ left: pct(h) }}>
                  {String(h).padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <ul>
              {employees.map((e) => (
                <li key={e.id} className="flex items-center gap-4 py-1.5 border-t border-w-line">
                  <div className="w-[200px] shrink-0 flex items-center gap-2.5">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-w-sunk text-[11px] font-bold text-w-ink flex items-center justify-center">
                      {initials(e.name)}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[13px] font-semibold text-w-ink">{e.name}</span>
                      <span className="text-xs text-w-ink-2">{e.role}</span>
                    </span>
                  </div>
                  <div className="relative flex-1 h-8 rounded-lg bg-w-paper">
                    {blocksFor(e.shift).map((b) => (
                      <div
                        key={b.start}
                        className={cn('absolute inset-y-0 flex items-center px-2.5 rounded-lg text-xs font-bold whitespace-nowrap overflow-hidden', SHIFT_STYLE[e.shift].block)}
                        style={{ left: pct(b.start), width: pct(b.end - b.start) }}
                      >
                        {b.label}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-y-0 left-[216px] right-0" aria-hidden>
              <div className="absolute -top-5 bottom-0 w-0.5 bg-w-chili" style={{ left: pct(nowHours) }} />
              <span
                className="absolute -top-[26px] -translate-x-1/2 px-1.5 py-0.5 rounded-[5px] bg-w-chili text-[11px] font-bold text-white"
                style={{ left: pct(nowHours) }}
              >
                {nowLabel}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 py-[18px]">
          <SectionTitle>Kasir bulan ini</SectionTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-w-paper border-y border-w-line text-xs font-bold text-w-ink-2">
              <tr>
                <th className="px-6 py-2.5 font-bold">Kasir</th>
                <th className="w-[140px] py-2.5 font-bold">Transaksi</th>
                <th className="w-[300px] py-2.5 font-bold">Omzet dilayani</th>
                <th className="w-[160px] py-2.5 font-bold">Selisih kas</th>
                <th className="w-[160px] pr-6 py-2.5 font-bold">Rata-rata layani</th>
              </tr>
            </thead>
            <tbody>
              {CASHIER_PERFORMANCE.map((c) => (
                <tr key={c.id} className="border-b border-w-line last:border-b-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-w-sunk text-[11px] font-bold text-w-ink flex items-center justify-center">
                        {initials(c.name)}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-w-ink">{c.name}</span>
                        <span className="text-xs text-w-ink-2">{c.shift}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm font-semibold text-w-ink tabular-nums">{formatNumber(c.transactions)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-[150px] h-1.5 rounded-[3px] bg-w-sunk">
                        <div className="h-full rounded-[3px] bg-w-ink" style={{ width: `${(c.revenue / maxRevenue) * 100}%` }} />
                      </div>
                      <span className="text-[13px] font-semibold text-w-ink tabular-nums">
                        Rp {c.revenue.toLocaleString('id-ID')} jt
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    {c.cashDiff === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-w-leaf-soft text-xs font-bold text-w-leaf">
                        <Check className="w-3 h-3" aria-hidden />
                        Pas
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-[3px] rounded-full bg-w-chili-soft text-xs font-bold text-w-chili-text tabular-nums">
                        {c.cashDiff < 0 ? '−' : '+'}Rp {formatNumber(Math.abs(c.cashDiff))}
                      </span>
                    )}
                  </td>
                  <td className="pr-6 py-3 text-[13px] text-w-ink-2">{c.avgSeconds} dtk</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {adding && (
        <AddEmployeeModal
          onClose={() => setAdding(false)}
          onSubmit={(e) => {
            onAddEmployee(e);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
};

const AddEmployeeModal: React.FC<{ onClose: () => void; onSubmit: (e: Employee) => void }> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Employee['role']>('Kasir');
  const [shift, setShift] = useState<Exclude<Shift, 'izin'>>('pagi');

  return (
    <PaperModal
      title="Tambah karyawan"
      submitLabel="Simpan"
      submitDisabled={!name.trim()}
      onClose={onClose}
      onSubmit={() => onSubmit({ id: `emp_${Date.now()}`, name: name.trim(), role, shift })}
    >
      <Field label="Nama lengkap">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Wulan Sari" data-autofocus />
      </Field>
      <fieldset>
        <legend className="text-[13px] font-semibold mb-1.5">Peran</legend>
        <div className="flex flex-wrap gap-1.5">
          {(['Kasir', 'Juru masak', 'Pelayan'] as const).map((r) => (
            <Choice key={r} value={r} current={role} set={setRole} />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-[13px] font-semibold mb-1.5">Shift</legend>
        <div className="flex flex-wrap gap-1.5">
          {(['pagi', 'sore', 'malam'] as const).map((s) => (
            <Choice key={s} value={s} current={shift} set={setShift} />
          ))}
        </div>
      </fieldset>
    </PaperModal>
  );
};

const Choice = <T extends string>({ value, current, set }: { value: T; current: T; set: (v: T) => void }) => (
  <button
    type="button"
    aria-pressed={current === value}
    onClick={() => set(value)}
    className={cn(
      'px-3 py-1.5 rounded-full text-[13px] font-semibold border capitalize',
      current === value ? 'bg-w-ink text-white border-w-ink' : 'border-w-line text-w-ink-2 hover:text-w-ink',
    )}
  >
    {value}
  </button>
);
