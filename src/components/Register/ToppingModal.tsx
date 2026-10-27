import React, { useState } from 'react';
import { Check, Flame, Minus, Plus, X } from 'lucide-react';
import { Doneness, EggOption, MenuItem, SelectedCustomization, Topping } from '../../types';
import { formatNumber, formatRupiah } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';
import { CATEGORY_ICONS } from './shared';

interface ToppingModalProps {
  item: MenuItem;
  eggs: EggOption[];
  toppings: Topping[];
  onClose: () => void;
  onConfirm: (customization: SelectedCustomization, quantity: number) => void;
}

const DONENESS: Doneness[] = ['Kenyal', 'Lembut', 'Kering'];
const SPICE_LEVELS = [0, 1, 2, 3, 4, 5];
const NO_EGG = 'none';

/** V2 · 02 — "Racik pesanan": doneness, egg, toppings, spice level and portion count for a mie bowl. */
export const ToppingModal: React.FC<ToppingModalProps> = ({ item, eggs, toppings, onClose, onConfirm }) => {
  const [doneness, setDoneness] = useState<Doneness>('Kenyal');
  const [eggId, setEggId] = useState<string>(eggs[0]?.id ?? NO_EGG);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [spice, setSpice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const egg = eggs.find((e) => e.id === eggId);
  const unitPrice = item.basePrice + (egg?.price ?? 0) + selectedToppings.reduce((s, t) => s + t.price, 0);
  const Icon = CATEGORY_ICONS[item.category];

  const toggleTopping = (t: Topping) =>
    setSelectedToppings((prev) => (prev.some((p) => p.id === t.id) ? prev.filter((p) => p.id !== t.id) : [...prev, t]));

  const eggOptions = [
    ...eggs.map((e) => ({ id: e.id, name: e.name, price: `+${formatNumber(e.price)}` })),
    { id: NO_EGG, name: 'Tanpa telur', price: 'Gratis' },
  ];

  return (
    <Modal
      labelledBy="racik-title"
      onClose={onClose}
      className="w-full max-w-[480px] rounded-[20px] bg-w-night-2 border border-w-night-line text-w-night-text"
    >
      <div
        className="h-[150px] shrink-0 flex justify-end items-start p-4 bg-w-night-3 bg-cover bg-center relative"
        style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
      >
        {!item.image && <Icon className="absolute inset-0 m-auto w-10 h-10 text-w-night-line" aria-hidden />}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-w-night/80 hover:bg-w-night"
        >
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-5 pt-4 pb-1 flex flex-col gap-0.5">
          <h2 id="racik-title" className="font-display text-[22px] font-bold">
            {item.name}
          </h2>
          <p className="text-[13px] text-w-night-muted">Harga dasar {formatRupiah(item.basePrice)}</p>
        </div>

        <div className="flex flex-col gap-5 px-5 pt-3 pb-5">
          <Section title="Kematangan mie">
            <div role="radiogroup" aria-label="Kematangan mie" className="flex p-1 rounded-xl bg-w-night">
              {DONENESS.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={doneness === d}
                  onClick={() => setDoneness(d)}
                  className={cn(
                    'flex-1 h-10 rounded-[9px] text-sm font-bold transition-colors',
                    doneness === d ? 'bg-w-yolk text-w-ink' : 'hover:bg-w-night-3',
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Telur" hint="Pilih satu">
            <div role="radiogroup" aria-label="Telur" className="flex gap-2">
              {eggOptions.map((o) => {
                const active = eggId === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setEggId(o.id)}
                    className={cn(
                      'flex-1 flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl text-left outline -outline-offset-1',
                      active ? 'bg-w-yolk/10 outline-2 outline-w-yolk' : 'bg-w-night-3 outline-1 outline-w-night-line',
                    )}
                  >
                    <span className="text-[13px] font-semibold">{o.name}</span>
                    <span className={cn('text-xs', active ? 'text-w-yolk' : 'text-w-night-muted')}>{o.price}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {toppings.length > 0 && (
            <Section title="Topping tambahan" hint="Bisa lebih dari satu">
              <div className="flex flex-col gap-2.5">
                {toppings.map((t) => {
                  const checked = selectedToppings.some((s) => s.id === t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggleTopping(t)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-w-night-3 text-left hover:bg-w-night-line/70"
                    >
                      <span
                        className={cn(
                          'w-[22px] h-[22px] rounded-md flex items-center justify-center',
                          checked ? 'bg-w-yolk' : 'border-[1.5px] border-w-night-muted',
                        )}
                      >
                        {checked && <Check className="w-3.5 h-3.5 text-w-ink" strokeWidth={3} />}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{t.name}</span>
                      <span className="text-[13px] text-w-night-muted">+{formatNumber(t.price)}</span>
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          <Section title="Level pedas" hint={spice ? `Level ${spice}` : 'Tidak pedas'}>
            <div role="radiogroup" aria-label="Level pedas" className="flex gap-1.5">
              {SPICE_LEVELS.map((lvl) => {
                const active = spice === lvl;
                const below = lvl > 0 && lvl < spice;
                return (
                  <button
                    key={lvl}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={lvl ? `Level ${lvl}` : 'Tidak pedas'}
                    onClick={() => setSpice(lvl)}
                    className={cn(
                      'flex-1 h-11 flex items-center justify-center gap-1 rounded-[10px] text-[13px] font-bold transition-colors',
                      active && lvl > 0
                        ? 'bg-w-chili text-white'
                        : below
                          ? 'bg-w-chili/25 text-white'
                          : active
                            ? 'bg-w-night-line text-w-night-text'
                            : 'bg-w-night-3 text-w-night-muted hover:text-w-night-text',
                    )}
                  >
                    {lvl === 0 ? (
                      <span className="text-xs font-semibold">Tidak</span>
                    ) : (
                      <>
                        <Flame className="w-4 h-4" aria-hidden />
                        {lvl}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-t border-w-night-line">
        <div className="h-[52px] flex items-center rounded-xl bg-w-night-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity === 1}
            aria-label="Kurangi porsi"
            className="w-11 h-full flex items-center justify-center disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-5 text-center text-base font-extrabold tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Tambah porsi"
            className="w-11 h-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() =>
            onConfirm({ doneness, egg, toppings: selectedToppings, spicinessLevel: spice }, quantity)
          }
          className="flex-1 h-[52px] flex items-center justify-between px-[18px] rounded-xl bg-w-yolk text-w-ink hover:brightness-105"
        >
          <span className="text-[15px] font-extrabold">Tambah ke pesanan</span>
          <span className="font-display text-base font-extrabold tabular-nums">
            {formatRupiah(unitPrice * quantity)}
          </span>
        </button>
      </div>
    </Modal>
  );
};

const Section: React.FC<{ title: string; hint?: string; children: React.ReactNode }> = ({ title, hint, children }) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex justify-between">
      <h3 className="text-[13px] font-bold tracking-[0.3px]">{title}</h3>
      {hint && <span className="text-xs text-w-night-muted">{hint}</span>}
    </div>
    {children}
  </div>
);
