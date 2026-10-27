import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  User, 
  LayoutDashboard, 
  ShoppingBag, 
  Coffee, 
  ShieldCheck,
  Wallet
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
    <header className="sticky top-0 z-30 h-14 bg-[#181512] border-b border-[#2b2520] px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Brand & Shift Info */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-warm-amber text-[#12100e] flex items-center justify-center font-bold text-sm tracking-tight font-mono shadow-sm">
            W88
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold leading-tight tracking-tight text-white">
                WARMINDO & WARKOP 88
              </h1>
              <span className="hidden md:inline px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#26221d] text-warm-amber border border-[#383129]">
                V2 NOCTURNAL
              </span>
            </div>
            <p className="text-[11px] text-ink-muted leading-none hidden sm:block">
              Shift Malam (20:00 - 04:00) • Outlet Kemang
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-[#231f1a] p-1 rounded-xl border border-[#383129]">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'register'
                ? 'bg-warm-amber text-[#12100e] shadow-xs'
                : 'text-ink-muted hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kasir</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'tables'
                ? 'bg-warm-amber text-[#12100e] shadow-xs'
                : 'text-ink-muted hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              Meja
              <span className="w-2 h-2 rounded-full bg-status-positive animate-pulse" />
            </span>
          </button>

          {userRole === 'owner' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-warm-amber text-[#12100e] shadow-xs'
                  : 'text-ink-muted hover:text-white'
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
        {/* Cash Drawer Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#26221d] border border-[#383129] text-xs font-mono">
          <Wallet className="w-3.5 h-3.5 text-warm-amber" />
          <span className="text-warm-amber font-semibold">Kas Laci: Rp 1.450.000</span>
        </div>

        {/* Live Clock */}
        <div className="hidden lg:flex items-center px-2.5 py-1 rounded-lg bg-[#26221d] text-[11px] font-mono text-ink-muted border border-[#383129]">
          {time}
        </div>

        {/* Printer Status Badge (clickable) */}
        <button
          onClick={onOpenPrinterModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            printerConfig.connected
              ? 'bg-[#064e3b] text-[#a7f3d0] border-[#047857] hover:bg-[#065f46]'
              : 'bg-[#78350f] text-[#fde68a] border-[#b45309] hover:bg-[#854d0e]'
          }`}
          title="Klik untuk konfigurasi printer thermal Bluetooth"
        >
          <Printer className="w-3.5 h-3.5 text-status-positive" />
          <span className="hidden sm:inline">
            {printerConfig.connected ? `Thermal ${printerConfig.paperSize}` : 'Printer Putus'}
          </span>
        </button>

        {/* Role Switcher Pill */}
        <div className="flex items-center rounded-xl border border-[#383129] bg-[#12100e] p-0.5">
          <button
            onClick={() => setUserRole('cashier')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              userRole === 'cashier'
                ? 'bg-warm-amber text-[#12100e] shadow-xs'
                : 'text-ink-muted hover:text-white'
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              userRole === 'owner'
                ? 'bg-warm-amber text-[#12100e] shadow-xs'
                : 'text-ink-muted hover:text-white'
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
