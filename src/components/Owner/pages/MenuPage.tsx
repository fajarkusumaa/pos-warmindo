import React, { useMemo, useState } from 'react';
import { Cookie, CookingPot, CupSoda, Egg, LucideIcon, Plus, Search, Soup } from 'lucide-react';
import { Category, EggOption, MenuItem, Topping } from '../../../types';
import { formatRupiah } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { Toggle } from '../../ui/Toggle';
import { Button, Field, PageHeader, PaperModal } from '../ui';

type BoardId = 'mie' | 'nasi' | 'minuman' | 'camilan' | 'topping';

const BOARDS: { id: BoardId; label: string; icon: LucideIcon; categories: Category[] }[] = [
  { id: 'mie', label: 'Mie', icon: Soup, categories: ['mie'] },
  { id: 'nasi', label: 'Nasi & Lauk', icon: CookingPot, categories: ['nasi'] },
  { id: 'minuman', label: 'Minuman', icon: CupSoda, categories: ['minum', 'kopi'] },
  { id: 'camilan', label: 'Camilan', icon: Cookie, categories: ['camilan'] },
  { id: 'topping', label: 'Topping', icon: Egg, categories: [] },
];

interface Row {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

interface MenuPageProps {
  menu: MenuItem[];
  eggs: EggOption[];
  toppings: Topping[];
  onSetAvailable: (kind: 'menu' | 'egg' | 'topping', id: string, available: boolean) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onAddTopping: (topping: Topping) => void;
}

/** V2 · 07 — menu boards per category with sold-out toggles. */
export const MenuPage: React.FC<MenuPageProps> = ({ menu, eggs, toppings, onSetAvailable, onAddMenuItem, onAddTopping }) => {
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState<BoardId | null>(null);

  const soldOut = menu.filter((m) => !m.available).length;
  const q = query.trim().toLowerCase();

  const boards = useMemo(
    () =>
      BOARDS.map((b) => {
        const rows: (Row & { kind: 'menu' | 'egg' | 'topping' })[] =
          b.id === 'topping'
            ? [
                ...eggs.map((e) => ({ id: e.id, name: e.shortName, price: e.price, available: e.available !== false, kind: 'egg' as const })),
                ...toppings.map((t) => ({ id: t.id, name: t.name, price: t.price, available: t.available !== false, kind: 'topping' as const })),
              ]
            : menu
                .filter((m) => b.categories.includes(m.category))
                .map((m) => ({ id: m.id, name: m.name, price: m.basePrice, available: m.available, kind: 'menu' as const }));
        return { ...b, rows: q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows, total: rows.length };
      }),
    [menu, eggs, toppings, q],
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Papan menu" subtitle={`${menu.length} menu · ${soldOut} sedang habis`}>
        <label className="w-[260px] h-[42px] flex items-center gap-2 px-3 rounded-[11px] bg-w-card border border-w-line focus-within:border-w-ink">
          <Search className="w-4 h-4 text-w-ink-2" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu…"
            aria-label="Cari menu"
            className="flex-1 min-w-0 bg-transparent text-[13px] text-w-ink outline-none placeholder:text-w-ink-2"
          />
        </label>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setAdding('mie')}>
          Tambah menu
        </Button>
      </PageHeader>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 items-start">
        {boards.map((b) => (
          <section
            key={b.id}
            aria-labelledby={`board-${b.id}`}
            className="flex flex-col bg-w-card border border-w-line rounded-[18px] overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-[18px] py-4 border-b border-w-line">
              <span className="w-8 h-8 rounded-[9px] bg-w-yolk flex items-center justify-center">
                <b.icon className="w-4 h-4 text-w-ink" aria-hidden />
              </span>
              <h2 id={`board-${b.id}`} className="flex-1 font-display text-[17px] font-bold text-w-ink">
                {b.label}
              </h2>
              <span className="text-[13px] font-semibold text-w-ink-2">{b.total}</span>
            </div>
            <ul className="flex flex-col px-2 py-1.5">
              {b.rows.length === 0 && <li className="px-2.5 py-3 text-[13px] text-w-ink-2">Tidak ada yang cocok.</li>}
              {b.rows.map((r) => (
                <li key={r.id} className="flex items-center gap-2.5 px-2.5 py-3 rounded-[10px] hover:bg-w-paper">
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className={cn('text-sm font-semibold', r.available ? 'text-w-ink' : 'text-w-ink-2')}>
                      {r.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] text-w-ink-2">
                      {formatRupiah(r.price)}
                      {!r.available && (
                        <span className="px-1.5 py-px rounded bg-w-chili-soft text-[11px] font-bold text-w-chili-text">
                          Habis
                        </span>
                      )}
                    </span>
                  </div>
                  <Toggle
                    checked={r.available}
                    onChange={(v) => onSetAvailable(r.kind, r.id, v)}
                    label={`${r.name} tersedia`}
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAdding(b.id)}
              className="flex items-center gap-2 px-[18px] py-3.5 border-t border-w-line text-[13px] font-semibold text-w-ink-2 hover:text-w-ink hover:bg-w-paper text-left"
            >
              <Plus className="w-4 h-4" aria-hidden />
              Tambah ke {b.label}
            </button>
          </section>
        ))}
      </div>

      {adding && (
        <AddItemModal
          board={adding}
          onClose={() => setAdding(null)}
          onSubmit={(name, price, board) => {
            const id = `${board}_${Date.now()}`;
            if (board === 'topping') onAddTopping({ id, name, price, available: true });
            else {
              const category = BOARDS.find((b) => b.id === board)!.categories[0];
              onAddMenuItem({ id, name, basePrice: price, category, available: true, customizable: category === 'mie' });
            }
            setAdding(null);
          }}
        />
      )}
    </div>
  );
};

const AddItemModal: React.FC<{
  board: BoardId;
  onClose: () => void;
  onSubmit: (name: string, price: number, board: BoardId) => void;
}> = ({ board: initialBoard, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [board, setBoard] = useState<BoardId>(initialBoard);
  const priceNum = Number(price.replace(/\D/g, ''));

  return (
    <PaperModal
      title={board === 'topping' ? 'Tambah topping' : 'Tambah menu'}
      submitLabel="Simpan"
      submitDisabled={!name.trim() || !priceNum}
      onClose={onClose}
      onSubmit={() => onSubmit(name.trim(), priceNum, board)}
    >
      <Field label="Nama">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Indomie Goreng Rendang" />
      </Field>
      <Field label="Harga" icon={<span className="text-sm text-w-ink-2">Rp</span>}>
        <input
          inputMode="numeric"
          value={priceNum ? priceNum.toLocaleString('id-ID') : ''}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="12.000"
        />
      </Field>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-[13px] font-semibold mb-1.5">Papan</legend>
        <div className="flex flex-wrap gap-1.5">
          {BOARDS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={board === b.id}
              onClick={() => setBoard(b.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[13px] font-semibold border',
                board === b.id ? 'bg-w-ink text-white border-w-ink' : 'border-w-line text-w-ink-2 hover:text-w-ink',
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>
    </PaperModal>
  );
};

