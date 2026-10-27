import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  User, 
  LayoutDashboard, 
  ShoppingBag, 
  Coffee, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { PrinterConfig } from '../types';

interface NavbarProps {
  activeTab: 'register' | 'tables' | 'dashboard';
  setActiveTab: (tab: 'register' | 'tables' | 'dashboard') => void;
  userRole: 'cashier' | 'owner';
  setUserRole: (role: 'cashier' | 'owner') => void;
  printerConfig: PrinterConfig;
  onOpenPrinterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  printerConfig,
  onOpenPrinterModal,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Brand & Outlet */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
            W88
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold leading-tight tracking-tight text-ink">
              WARMINDO 88
            </h1>
            <p className="text-[11px] text-ink-muted leading-none hidden sm:block">
              Outlet Kemang Raya
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-raised/80 p-1 rounded-lg border border-border/80">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kasir</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'tables'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span className="flex items-center gap-1">
              Meja
              <span className="w-2 h-2 rounded-full bg-status-positive animate-pulse" />
            </span>
          </button>

          {userRole === 'owner' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Owner</span>
            </button>
          )}
        </nav>
      </div>

      {/* Hardware & User Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center px-2.5 py-1 rounded bg-raised text-[11px] font-mono text-ink-muted">
          {time}
        </div>

        {/* Printer Status Badge (clickable) */}
        <button
          onClick={onOpenPrinterModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            printerConfig.connected
              ? 'bg-status-positive-bg text-status-positive border-status-positive/30 hover:bg-emerald-100'
              : 'bg-status-warning-bg text-status-warning border-status-warning/30 hover:bg-amber-100'
          }`}
          title="Klik untuk konfigurasi printer thermal Bluetooth"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {printerConfig.connected ? `Thermal ${printerConfig.paperSize}` : 'Printer Terputus'}
          </span>
        </button>

        {/* Role Switcher Pill (Great for Client Demos!) */}
        <div className="flex items-center rounded-lg border border-border bg-ground p-0.5">
          <button
            onClick={() => setUserRole('cashier')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              userRole === 'cashier'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Kasir</span>
          </button>
          <button
            onClick={() => {
              setUserRole('owner');
              setActiveTab('dashboard');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              userRole === 'owner'
                ? 'bg-accent text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner</span>
          </button>
        </div>
      </div>
    </header>
  );
};
