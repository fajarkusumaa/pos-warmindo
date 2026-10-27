import React, { useState } from 'react';
import { Bluetooth, Loader2, Printer, RefreshCw, X } from 'lucide-react';
import { PrinterConfig } from '../../types';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';

interface PrinterSettingsModalProps {
  config: PrinterConfig;
  onSaveConfig: (config: PrinterConfig) => void;
  onClose: () => void;
}

interface Device {
  name: string;
  macAddress: string;
  battery?: number;
}

const KNOWN_DEVICES: Device[] = [
  { name: 'RPP02N Thermal 58', macAddress: '66:32:B1:4C:90:11', battery: 82 },
  { name: 'Zjiang 5805DD', macAddress: '11:22:33:44:55:66' },
];
const FOUND_ON_SCAN: Device = { name: 'Panda PRJ-80', macAddress: 'A4:C1:38:0E:22:7B', battery: 64 };

const SAMPLE_LINES: [string, string][] = [
  ['2 Indomie Aceh', '24.000'],
  ['1 Indomie Soto', '11.000'],
  ['1 Es Teh Jumbo', '5.000'],
];

/** V2 · 05 — receipt preview on the left, Bluetooth device + paper width on the right. */
export const PrinterSettingsModal: React.FC<PrinterSettingsModalProps> = ({ config, onSaveConfig, onClose }) => {
  const [draft, setDraft] = useState<PrinterConfig>({ ...config });
  const [devices, setDevices] = useState<Device[]>(KNOWN_DEVICES);
  const [scanning, setScanning] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'printing' | 'done'>('idle');

  const handleScan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setDevices((prev) => (prev.some((d) => d.macAddress === FOUND_ON_SCAN.macAddress) ? prev : [...prev, FOUND_ON_SCAN]));
      setScanning(false);
    }, 1400);
  };

  const connect = (d: Device) =>
    setDraft((prev) => ({ ...prev, name: d.name, macAddress: d.macAddress, battery: d.battery, connected: true }));

  const handleTestPrint = () => {
    setTestState('printing');
    window.setTimeout(() => setTestState('done'), 1200);
  };

  const dash = '-'.repeat(draft.paperSize === '58mm' ? 26 : 36);

  return (
    <Modal
      labelledBy="printer-title"
      onClose={onClose}
      className="w-full max-w-[760px] md:h-[580px] md:flex-row rounded-[20px] bg-w-card border border-w-line text-w-ink"
    >
      <aside className="hidden md:flex w-[280px] shrink-0 flex-col items-center gap-4 p-6 bg-w-sunk">
        <div className="w-full flex items-center justify-between">
          <span className="text-[13px] font-bold">Pratinjau struk</span>
          <span className="text-xs font-semibold text-w-ink-2">{draft.paperSize.replace('mm', ' mm')}</span>
        </div>
        <div
          className={cn(
            'flex flex-col gap-2 px-3.5 py-4 bg-white shadow-[0_6px_16px_rgba(28,25,23,0.08)] font-mono text-[9px] text-[#2A2723] transition-[width]',
            draft.paperSize === '58mm' ? 'w-[184px]' : 'w-[232px]',
          )}
          aria-label="Contoh struk"
        >
          <p className="text-center text-[11px] font-bold">WARMINDO 88</p>
          <p className="text-center text-[#6B655D]">Jl. Kemang Raya No. 88</p>
          <p className="text-[#9C958A] overflow-hidden whitespace-nowrap">{dash}</p>
          {SAMPLE_LINES.map(([l, r]) => (
            <p key={l} className="flex justify-between">
              <span>{l}</span>
              <span>{r}</span>
            </p>
          ))}
          <p className="text-[#9C958A] overflow-hidden whitespace-nowrap">{dash}</p>
          <p className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>40.000</span>
          </p>
          <p className="flex justify-between">
            <span>TUNAI</span>
            <span>50.000</span>
          </p>
          <p className="flex justify-between">
            <span>KEMBALI</span>
            <span>10.000</span>
          </p>
          <p className="text-[#9C958A] overflow-hidden whitespace-nowrap">{dash}</p>
          <p className="text-center">Terima kasih!</p>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleTestPrint}
          disabled={!draft.connected || testState === 'printing'}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-[10px] bg-w-card border border-w-line text-sm font-semibold hover:border-w-line-strong disabled:opacity-50"
        >
          {testState === 'printing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
          <span aria-live="polite">
            {testState === 'printing' ? 'Mencetak…' : testState === 'done' ? 'Terkirim · cetak lagi' : 'Cetak uji coba'}
          </span>
        </button>
      </aside>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 p-7">
        <div className="flex items-center gap-3">
          <h2 id="printer-title" className="flex-1 font-display text-2xl font-bold">
            Printer struk
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-w-paper hover:bg-w-sunk"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold">Perangkat Bluetooth</h3>
            <button
              type="button"
              onClick={handleScan}
              disabled={scanning}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-w-ink-2 hover:text-w-ink disabled:opacity-60"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', scanning && 'animate-spin')} aria-hidden />
              {scanning ? 'Memindai…' : 'Pindai ulang'}
            </button>
          </div>
          <ul className="flex flex-col gap-2.5">
            {devices.map((d) => {
              const active = draft.connected && draft.macAddress === d.macAddress;
              return (
                <li
                  key={d.macAddress}
                  className={cn(
                    'flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] border',
                    active ? 'bg-w-leaf-soft border-w-leaf border-[1.5px]' : 'bg-w-card border-w-line',
                  )}
                >
                  <span
                    className={cn(
                      'w-10 h-10 shrink-0 rounded-[10px] flex items-center justify-center',
                      active ? 'bg-w-leaf text-white' : 'bg-w-paper text-w-ink-2',
                    )}
                  >
                    <Bluetooth className="w-[18px] h-[18px]" aria-hidden />
                  </span>
                  <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-[15px] font-bold">{d.name}</span>
                    <span className={cn('text-xs', active ? 'text-w-leaf' : 'text-w-ink-2')}>
                      {active ? `Terhubung${d.battery ? ` · Baterai ${d.battery}%` : ''}` : d.macAddress}
                    </span>
                  </span>
                  {active ? (
                    <button
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, connected: false }))}
                      className="px-3.5 py-2 rounded-[9px] border border-w-leaf text-[13px] font-bold text-w-leaf hover:bg-w-leaf/10"
                    >
                      Putuskan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => connect(d)}
                      className="px-3.5 py-2 rounded-[9px] bg-w-ink text-[13px] font-bold text-white hover:bg-black"
                    >
                      Hubungkan
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-[13px] font-bold" id="paper-width">
            Lebar kertas
          </h3>
          <div role="radiogroup" aria-labelledby="paper-width" className="flex p-1 rounded-xl bg-w-paper">
            {(
              [
                ['58mm', '58 mm', '32 karakter'],
                ['80mm', '80 mm', '48 karakter'],
              ] as const
            ).map(([value, label, chars]) => {
              const active = draft.paperSize === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDraft((prev) => ({ ...prev, paperSize: value }))}
                  className={cn(
                    'flex-1 h-[52px] flex flex-col items-center justify-center rounded-[9px] transition-colors',
                    active && 'bg-w-card shadow-[0_1px_3px_rgba(28,25,23,0.12)]',
                  )}
                >
                  <span className="text-[15px] font-bold">{label}</span>
                  <span className="text-xs text-w-ink-2">{chars}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex-1" />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              onSaveConfig(draft);
              onClose();
            }}
            className="h-12 px-6 rounded-xl bg-w-yolk text-[15px] font-extrabold hover:brightness-105"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
};
