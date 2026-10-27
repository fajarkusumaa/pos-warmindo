import React, { useState } from 'react';
import {
  ChevronsUpDown,
  FileText,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Monitor,
  Package,
  Settings,
  Store,
  Truck,
  Users,
  Utensils,
} from 'lucide-react';
import { Outlet } from '../../data/ownerData';
import { cn } from '../../utils/cn';
import { BrandMark } from '../ui/BrandMark';

export type OwnerPage =
  | 'dasbor'
  | 'menu'
  | 'laporan'
  | 'inventori'
  | 'pembelian'
  | 'karyawan'
  | 'outlet'
  | 'pengaturan';

export const OWNER_NAV: { id: OwnerPage; label: string; icon: LucideIcon }[] = [
  { id: 'dasbor', label: 'Dasbor', icon: LayoutDashboard },
  { id: 'menu', label: 'Kelola Menu', icon: Utensils },
  { id: 'laporan', label: 'Laporan', icon: FileText },
  { id: 'inventori', label: 'Inventori', icon: Package },
  { id: 'pembelian', label: 'Pembelian', icon: Truck },
  { id: 'karyawan', label: 'Karyawan', icon: Users },
  { id: 'outlet', label: 'Outlet', icon: Store },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

interface OwnerSidebarProps {
  active: OwnerPage;
  onNavigate: (page: OwnerPage) => void;
  outlets: Outlet[];
  outletId: string;
  onOutletChange: (id: string) => void;
  onOpenCashier: () => void;
}

/** V2 / Owner Sidebar (Ff347): ink rail with outlet switcher, nav, cashier shortcut and user row. */
export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  active,
  onNavigate,
  outlets,
  outletId,
  onOutletChange,
  onOpenCashier,
}) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const outlet = outlets.find((o) => o.id === outletId) ?? outlets[0];

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col gap-6 px-4 py-5 bg-w-ink text-w-night-text">
      <div className="flex items-center gap-3 px-1">
        <BrandMark className="w-9 h-9 rounded-[10px] text-base" />
        <div className="flex flex-col gap-px">
          <span className="font-display text-base font-bold">Warmindo 88</span>
          <span className="text-xs text-w-night-muted">Panel Pemilik</span>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setSwitcherOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={switcherOpen}
          aria-label={`Outlet: ${outlet.name}. Ganti outlet`}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-w-side-raised hover:bg-w-side-avatar text-left"
        >
          <Store className="w-4 h-4 text-w-yolk" aria-hidden />
          <span className="flex-1 text-sm font-semibold">{outlet.name}</span>
          <ChevronsUpDown className="w-4 h-4 text-w-night-muted" aria-hidden />
        </button>
        {switcherOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setSwitcherOpen(false)} aria-hidden />
            <ul
              role="listbox"
              aria-label="Pilih outlet"
              className="absolute z-20 left-0 right-0 top-full mt-1.5 p-1 rounded-[10px] bg-w-side-raised border border-w-night-line shadow-lg"
            >
              {outlets.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={o.id === outlet.id}
                    onClick={() => {
                      onOutletChange(o.id);
                      setSwitcherOpen(false);
                    }}
                    className={cn(
                      'w-full flex flex-col px-3 py-2 rounded-lg text-left hover:bg-w-side-avatar',
                      o.id === outlet.id && 'bg-w-side-avatar',
                    )}
                  >
                    <span className="text-sm font-semibold">{o.name}</span>
                    <span className="text-xs text-w-night-muted">{o.address}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <nav aria-label="Panel pemilik" className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-0.5">
        {OWNER_NAV.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'h-10 shrink-0 flex items-center gap-3 px-3 rounded-[10px] text-sm transition-colors',
                isActive ? 'bg-w-yolk text-w-ink font-bold' : 'text-w-side-text font-medium hover:bg-w-side-raised',
              )}
            >
              <Icon className={cn('w-[18px] h-[18px]', !isActive && 'text-w-night-muted')} aria-hidden />
              {label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onOpenCashier}
        className="h-10 shrink-0 flex items-center justify-center gap-2 rounded-[10px] border border-w-night-line text-[13px] font-semibold hover:bg-w-side-raised"
      >
        <Monitor className="w-4 h-4" aria-hidden />
        Buka mode kasir
      </button>

      <div className="flex items-center gap-2.5 px-1 pt-3 border-t border-w-night-line">
        <span className="w-8 h-8 shrink-0 rounded-full bg-w-side-avatar text-w-yolk text-xs font-bold flex items-center justify-center">
          FK
        </span>
        <span className="flex-1 flex flex-col">
          <span className="text-[13px] font-semibold">Fajar Kusuma</span>
          <span className="text-xs text-w-night-muted">Pemilik</span>
        </span>
        <button
          type="button"
          onClick={onOpenCashier}
          aria-label="Keluar dari panel pemilik"
          title="Keluar dari panel pemilik"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-w-night-muted hover:text-w-night-text hover:bg-w-side-raised"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
