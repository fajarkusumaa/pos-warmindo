import React from 'react';
import { TableInfo, TableStatus } from '../../types';
import { cn } from '../../utils/cn';

const STATUS: Record<TableStatus, { label: string; dot: string }> = {
  available: { label: 'Kosong', dot: 'bg-w-live' },
  eating: { label: 'Makan', dot: 'bg-w-yolk' },
  add_order: { label: 'Tambah', dot: 'bg-w-amber' },
  need_bill: { label: 'Minta bill', dot: 'bg-w-chili' },
};

interface TablePickerProps {
  tables: TableInfo[];
  selected: string;
  onSelect: (tableNumber: string) => void;
  className?: string;
}

/** Night-mode popover grid for choosing which table an order belongs to. */
export const TablePicker: React.FC<TablePickerProps> = ({ tables, selected, onSelect, className }) => (
  <div
    role="dialog"
    aria-label="Pilih meja"
    className={cn(
      'z-30 w-[300px] p-3 rounded-xl bg-w-night-2 border border-w-night-line shadow-[0_12px_32px_rgba(0,0,0,0.45)]',
      className,
    )}
  >
    <p className="px-1 pb-2 text-xs font-semibold text-w-night-muted">Pilih meja</p>
    <div className="grid grid-cols-4 gap-1.5">
      {tables.map((t) => {
        const label = `Meja ${t.number}`;
        const active = selected === label;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(label)}
            title={`${t.name} · ${STATUS[t.status].label}`}
            aria-pressed={active}
            className={cn(
              'h-12 rounded-lg flex flex-col items-center justify-center gap-1 text-sm font-bold transition-colors',
              active ? 'bg-w-yolk text-w-ink' : 'bg-w-night-3 text-w-night-text hover:bg-w-night-line',
            )}
          >
            {t.number}
            <span className={cn('w-1.5 h-1.5 rounded-full', STATUS[t.status].dot)} />
          </button>
        );
      })}
    </div>
    <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pt-3 text-[11px] text-w-night-muted">
      {Object.values(STATUS).map((s) => (
        <span key={s.label} className="flex items-center gap-1.5">
          <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
          {s.label}
        </span>
      ))}
    </div>
  </div>
);
