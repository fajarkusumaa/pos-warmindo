import React, { useState } from 'react';
import { Building2, Calendar, Check, Plus } from 'lucide-react';
import { PoStatus, PURCHASE_BUDGET, PurchaseOrder } from '../../../data/ownerData';
import { formatRupiah } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { Button, Card, Field, PageHeader, PaperModal } from '../ui';

const COLUMNS: { status: PoStatus; label: string; dot: string }[] = [
  { status: 'draft', label: 'Draf', dot: 'bg-w-ink-2' },
  { status: 'ordered', label: 'Dipesan', dot: 'bg-w-amber' },
  { status: 'received', label: 'Diterima', dot: 'bg-w-chili' },
  { status: 'paid', label: 'Lunas', dot: 'bg-w-leaf' },
];

/** "24,8 jt" style for budget figures. */
const juta = (n: number) => `Rp ${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;

interface PurchasingPageProps {
  orders: PurchaseOrder[];
  onChange: (orders: PurchaseOrder[]) => void;
  /** Opens "Buat PO" straight away, prefilled — used by the low-stock banner. */
  draftItems?: string;
  onDraftHandled: () => void;
}

/** V2 · 10 — purchase orders on a four-column board with budget and supplier debt. */
export const PurchasingPage: React.FC<PurchasingPageProps> = ({ orders, onChange, draftItems, onDraftHandled }) => {
  const [creating, setCreating] = useState(draftItems !== undefined);

  const debt = orders.filter((o) => o.status === 'received').reduce((s, o) => s + o.total, 0);
  const nextDue = Math.min(...orders.filter((o) => o.status === 'received').map((o) => o.dueInDays ?? Infinity));
  const usedPct = Math.min(100, (PURCHASE_BUDGET.used / PURCHASE_BUDGET.budget) * 100);
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  const move = (id: string, patch: Partial<PurchaseOrder>) =>
    onChange(orders.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const closeCreate = () => {
    setCreating(false);
    onDraftHandled();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Pembelian">
        <Button icon={<Building2 className="w-4 h-4" />} title="Daftar supplier belum tersedia" disabled>
          Supplier
        </Button>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>
          Buat PO
        </Button>
      </PageHeader>

      <Card as="div" className="flex flex-wrap items-center gap-8 px-6 py-[18px] rounded-[18px]">
        <div className="flex-1 min-w-[280px] flex flex-col gap-2.5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="flex items-end gap-2">
              <span className="font-display text-2xl leading-none font-extrabold text-w-ink">{juta(PURCHASE_BUDGET.used)}</span>
              <span className="text-[13px] text-w-ink-2">dari anggaran {juta(PURCHASE_BUDGET.budget)}</span>
            </div>
            <span className="text-[13px] font-semibold text-w-ink-2">
              Sisa {juta(PURCHASE_BUDGET.budget - PURCHASE_BUDGET.used)} · {PURCHASE_BUDGET.daysLeft} hari lagi
            </span>
          </div>
          <div
            className="h-2.5 rounded-[5px] bg-w-sunk overflow-hidden"
            role="meter"
            aria-label="Anggaran pembelian terpakai"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(usedPct)}
          >
            <div className="h-full bg-w-ink" style={{ width: `${usedPct}%` }} />
          </div>
        </div>
        <div className="flex flex-col gap-1 pl-6 border-l border-w-line">
          <span className="text-xs text-w-ink-2">Utang supplier</span>
          <span className={cn('font-display text-xl font-bold', debt ? 'text-w-chili' : 'text-w-ink')}>
            {debt ? juta(debt) : 'Rp 0'}
          </span>
        </div>
        <div className="flex flex-col gap-1 pl-6 border-l border-w-line">
          <span className="text-xs text-w-ink-2">Jatuh tempo</span>
          <span className="font-display text-xl font-bold text-w-ink">
            {Number.isFinite(nextDue) ? `${nextDue} hari lagi` : '—'}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const cards = orders.filter((o) => o.status === col.status);
          return (
            <section
              key={col.status}
              aria-labelledby={`col-${col.status}`}
              className="min-h-[200px] flex flex-col gap-2.5 p-2.5 rounded-[18px] bg-w-sunk"
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className={cn('w-2 h-2 rounded-full', col.dot)} aria-hidden />
                <h2 id={`col-${col.status}`} className="flex-1 text-sm font-bold text-w-ink">
                  {col.label}
                </h2>
                <span className="text-[13px] font-semibold text-w-ink-2">{cards.length}</span>
              </div>
              {cards.map((o) => (
                <article
                  key={o.id}
                  className="flex flex-col gap-3 p-4 rounded-[14px] bg-w-card shadow-[0_1px_2px_rgba(28,25,23,0.07)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.3px] text-w-ink-2">{o.id}</span>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-xs font-semibold',
                        o.status === 'received' ? 'text-w-chili' : 'text-w-ink-2',
                      )}
                    >
                      {o.status === 'paid' ? (
                        <Check className="w-3 h-3" aria-hidden />
                      ) : (
                        <Calendar className="w-3 h-3" aria-hidden />
                      )}
                      {o.status === 'received' ? `Tempo ${o.dueInDays} hari` : o.when}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <h3 className="text-[15px] font-bold text-w-ink">{o.supplier}</h3>
                    <p className="text-[13px] text-w-ink-2">{o.items}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[17px] font-bold text-w-ink tabular-nums">{formatRupiah(o.total)}</span>
                    {o.status === 'draft' && (
                      <CardAction onClick={() => move(o.id, { status: 'ordered', when: 'Tiba besok' })}>Kirim</CardAction>
                    )}
                    {o.status === 'ordered' && (
                      <CardAction outline onClick={() => move(o.id, { status: 'received', when: '', dueInDays: 7 })}>
                        Terima
                      </CardAction>
                    )}
                    {o.status === 'received' && (
                      <CardAction onClick={() => move(o.id, { status: 'paid', when: today, dueInDays: undefined })}>
                        Bayar
                      </CardAction>
                    )}
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>

      {creating && (
        <CreatePoModal
          initialItems={draftItems ?? ''}
          onClose={closeCreate}
          onSubmit={(supplier, items, total) => {
            const next = Math.max(...orders.map((o) => Number(o.id.slice(3)))) + 1;
            onChange([
              { id: `PO-${String(next).padStart(4, '0')}`, supplier, items, total, status: 'draft', when: 'Hari ini' },
              ...orders,
            ]);
            closeCreate();
          }}
        />
      )}
    </div>
  );
};

const CardAction: React.FC<{ onClick: () => void; outline?: boolean; children: React.ReactNode }> = ({
  onClick,
  outline,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'px-3.5 py-[7px] rounded-[9px] text-[13px] font-bold',
      outline ? 'border border-w-line text-w-ink hover:border-w-line-strong' : 'bg-w-ink text-white hover:bg-black',
    )}
  >
    {children}
  </button>
);

const CreatePoModal: React.FC<{
  initialItems: string;
  onClose: () => void;
  onSubmit: (supplier: string, items: string, total: number) => void;
}> = ({ initialItems, onClose, onSubmit }) => {
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState('');
  const totalNum = Number(total.replace(/\D/g, ''));

  return (
    <PaperModal
      title="Buat PO"
      submitLabel="Simpan sebagai draf"
      submitDisabled={!supplier.trim() || !items.trim() || !totalNum}
      onClose={onClose}
      onSubmit={() => onSubmit(supplier.trim(), items.trim(), totalNum)}
    >
      <Field label="Supplier">
        <input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="mis. CV Sumber Makmur" data-autofocus />
      </Field>
      <Field label="Barang">
        <input value={items} onChange={(e) => setItems(e.target.value)} placeholder="Indomie 4 dus, Telur 5 tray" />
      </Field>
      <Field label="Perkiraan total" icon={<span className="text-sm text-w-ink-2">Rp</span>}>
        <input
          inputMode="numeric"
          value={totalNum ? totalNum.toLocaleString('id-ID') : ''}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="0"
        />
      </Field>
    </PaperModal>
  );
};
