import React, { useRef, useState } from 'react';
import { Bell, ChevronDown, LucideIcon, Mail, MapPin, Percent, Phone, Printer, Shield, Store, Upload, Wallet } from 'lucide-react';
import { BusinessProfile } from '../../../data/ownerData';
import { cn } from '../../../utils/cn';
import { Toggle } from '../../ui/Toggle';
import { Button, Card, Field, PageHeader } from '../ui';

type Section = 'profil' | 'struk' | 'pembayaran' | 'pajak' | 'notifikasi' | 'akses';

const SECTIONS: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: 'profil', label: 'Profil usaha', icon: Store },
  { id: 'struk', label: 'Struk & printer', icon: Printer },
  { id: 'pembayaran', label: 'Pembayaran', icon: Wallet },
  { id: 'pajak', label: 'Pajak & biaya', icon: Percent },
  { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { id: 'akses', label: 'Akses & keamanan', icon: Shield },
];

const RECEIPT_TOGGLES: { key: keyof BusinessProfile['receipt']; label: string }[] = [
  { key: 'logo', label: 'Logo' },
  { key: 'address', label: 'Alamat' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email' },
];

const countChanges = (a: BusinessProfile, b: BusinessProfile) => {
  const fields: (keyof Omit<BusinessProfile, 'receipt'>)[] = ['name', 'whatsapp', 'email', 'address', 'timezone', 'hours', 'logoUrl'];
  return (
    fields.filter((f) => a[f] !== b[f]).length +
    RECEIPT_TOGGLES.filter(({ key }) => a.receipt[key] !== b.receipt[key]).length
  );
};

interface SettingsPageProps {
  profile: BusinessProfile;
  onSave: (profile: BusinessProfile) => void;
  onOpenPrinter: () => void;
}

/** V2 · 13 — business profile form with a live receipt preview. */
export const SettingsPage: React.FC<SettingsPageProps> = ({ profile, onSave, onOpenPrinter }) => {
  const [draft, setDraft] = useState(profile);
  const [section, setSection] = useState<Section>('profil');
  const fileRef = useRef<HTMLInputElement>(null);
  const changes = countChanges(draft, profile);

  const set = <K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Pengaturan">
        {changes > 0 && (
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-w-ink-2" aria-live="polite">
            <span className="w-2 h-2 rounded-full bg-w-amber" aria-hidden />
            {changes} perubahan belum disimpan
          </span>
        )}
        <Button onClick={() => setDraft(profile)} disabled={!changes}>
          Batalkan
        </Button>
        <Button variant="primary" className="px-[18px] font-extrabold" onClick={() => onSave(draft)} disabled={!changes}>
          Simpan
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] 2xl:grid-cols-[200px_1fr_300px] gap-5 items-start">
        <nav aria-label="Bagian pengaturan" className="flex flex-col gap-0.5">
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => (id === 'struk' ? onOpenPrinter() : setSection(id))}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'h-10 flex items-center gap-2.5 px-3 rounded-[10px] text-sm text-left',
                  active ? 'bg-w-card border border-w-line text-w-ink font-bold' : 'text-w-ink-2 font-medium hover:text-w-ink hover:bg-w-card/60',
                )}
              >
                <Icon className={cn('w-4 h-4', active ? 'text-w-ink' : 'text-w-ink-2')} aria-hidden />
                {label}
              </button>
            );
          })}
        </nav>

        {section !== 'profil' ? (
          <Card className="p-7 flex flex-col gap-2">
            <h2 className="font-display text-xl font-bold text-w-ink">{SECTIONS.find((s) => s.id === section)!.label}</h2>
            <p className="text-sm text-w-ink-2">Bagian ini belum tersedia di versi ini.</p>
          </Card>
        ) : (
          <Card className="flex flex-col gap-[22px] p-7">
            <div className="flex items-center gap-4">
              <span
                className="w-16 h-16 shrink-0 rounded-2xl bg-w-yolk bg-cover bg-center flex items-center justify-center font-display text-[26px] font-extrabold text-w-ink"
                style={draft.logoUrl ? { backgroundImage: `url(${draft.logoUrl})` } : undefined}
              >
                {!draft.logoUrl && '88'}
              </span>
              <span className="flex-1 flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-w-ink">Logo usaha</span>
                <span className="text-[13px] text-w-ink-2">PNG atau SVG, persegi</span>
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/svg+xml"
                className="sr-only"
                tabIndex={-1}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) set('logoUrl', URL.createObjectURL(file));
                }}
              />
              <Button className="h-[38px] px-3.5 rounded-[10px]" icon={<Upload className="w-3.5 h-3.5" />} onClick={() => fileRef.current?.click()}>
                Ganti
              </Button>
            </div>

            <Field label="Nama usaha">
              <input value={draft.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nomor WhatsApp" icon={<Phone className="w-4 h-4 text-w-ink-2" aria-hidden />}>
                <input type="tel" value={draft.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
              </Field>
              <Field label="Email" icon={<Mail className="w-4 h-4 text-w-ink-2" aria-hidden />}>
                <input type="email" value={draft.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
            </div>
            <Field label="Alamat" icon={<MapPin className="w-4 h-4 text-w-ink-2" aria-hidden />}>
              <input value={draft.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Zona waktu"
                value={draft.timezone}
                options={['WIB (Jakarta)', 'WITA (Makassar)', 'WIT (Jayapura)']}
                onChange={(v) => set('timezone', v)}
              />
              <SelectField
                label="Jam buka"
                value={draft.hours}
                options={['24 jam', '06:00 – 22:00', '16:00 – 04:00']}
                onChange={(v) => set('hours', v)}
              />
            </div>

            <fieldset className="flex flex-col gap-3.5 pt-[18px] border-t border-w-line">
              <legend className="sr-only">Tampil di struk</legend>
              <p className="text-sm font-bold text-w-ink" aria-hidden>
                Tampil di struk
              </p>
              <div className="flex flex-wrap gap-6">
                {RECEIPT_TOGGLES.map(({ key, label }) => (
                  <span key={key} className="flex items-center gap-2.5">
                    <Toggle
                      checked={draft.receipt[key]}
                      onChange={(v) => set('receipt', { ...draft.receipt, [key]: v })}
                      label={`Tampilkan ${label.toLowerCase()} di struk`}
                    />
                    <span className="text-sm font-medium text-w-ink" aria-hidden>
                      {label}
                    </span>
                  </span>
                ))}
              </div>
            </fieldset>
          </Card>
        )}

        <ReceiptPreview profile={draft} />
      </div>
    </div>
  );
};

const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[13px] font-semibold text-w-ink">{label}</span>
    <span className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 appearance-none pl-3.5 pr-10 rounded-[10px] bg-w-card text-sm text-w-ink outline outline-1 -outline-offset-1 outline-w-line-strong focus:outline-2 focus:outline-w-ink"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-w-ink-2" aria-hidden />
    </span>
  </label>
);

const ReceiptPreview: React.FC<{ profile: BusinessProfile }> = ({ profile }) => {
  const { receipt } = profile;
  const dash = '- - - - - - - - - - - - - - -';
  return (
    <aside
      aria-label="Pratinjau struk"
      className="lg:col-start-2 2xl:col-start-auto flex flex-col items-center gap-3.5 p-5 rounded-[20px] bg-w-sunk"
    >
      <div className="w-full flex justify-between">
        <span className="text-[13px] font-bold text-w-ink">Pratinjau struk</span>
        <span className="flex items-center gap-[5px] text-xs font-semibold text-w-leaf">
          <span className="w-1.5 h-1.5 rounded-full bg-w-leaf" aria-hidden />
          Langsung
        </span>
      </div>
      <div className="w-[220px] flex flex-col items-center gap-2 px-4 py-[18px] bg-white shadow-[0_6px_16px_rgba(28,25,23,0.08)] font-mono text-[10px] text-[#2A2723]">
        {receipt.logo && (
          <span
            className="w-9 h-9 rounded-[9px] bg-w-ink bg-cover bg-center flex items-center justify-center font-display text-sm font-extrabold text-white"
            style={profile.logoUrl ? { backgroundImage: `url(${profile.logoUrl})` } : undefined}
          >
            {!profile.logoUrl && '88'}
          </span>
        )}
        <p className="w-full text-center text-[11px] font-bold uppercase">{profile.name || 'Nama usaha'}</p>
        {receipt.address && profile.address && <p className="w-full text-center text-[#6B655D]">{profile.address}</p>}
        {receipt.whatsapp && profile.whatsapp && (
          <p className="text-[#6B655D]">WA {profile.whatsapp.replace(/^\+62\s?/, '0')}</p>
        )}
        {receipt.email && profile.email && <p className="text-[#6B655D]">{profile.email}</p>}
        <p className="text-[#9C958A]">{dash}</p>
        <p className="w-full flex justify-between">
          <span>2 Indomie Aceh</span>
          <span>24.000</span>
        </p>
        <p className="w-full flex justify-between">
          <span>1 Es Teh Jumbo</span>
          <span>5.000</span>
        </p>
        <p className="text-[#9C958A]">{dash}</p>
        <p className="w-full flex justify-between font-bold">
          <span>TOTAL</span>
          <span>29.000</span>
        </p>
        <p className="text-[#9C958A]">{dash}</p>
        <p className="w-full text-center">Terima kasih, mampir lagi ya!</p>
      </div>
    </aside>
  );
};
