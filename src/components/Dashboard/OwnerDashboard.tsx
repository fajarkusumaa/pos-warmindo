import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  ShoppingBag, 
  Coffee, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';

export const OwnerDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7days' | 'month'>('today');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Hourly turnover data for Warmindo (peaks at lunch 12:00 and night hangout 21:00 - 01:00)
  const hourlyData = [
    { hour: '08:00', amount: 140000, height: 18 },
    { hour: '10:00', amount: 280000, height: 35 },
    { hour: '12:00', amount: 620000, height: 78, isPeak: true, label: 'Makan Siang' },
    { hour: '14:00', amount: 390000, height: 48 },
    { hour: '16:00', amount: 260000, height: 32 },
    { hour: '18:00', amount: 480000, height: 60 },
    { hour: '20:00', amount: 720000, height: 90 },
    { hour: '21:00', amount: 840000, height: 100, isPeak: true, label: 'Peak Nongkrong' },
    { hour: '23:00', amount: 560000, height: 70 },
    { hour: '01:00', amount: 310000, height: 40 },
  ];

  const bestSellers = [
    { rank: 1, name: 'Indomie Bangladesh Medan', category: 'Goreng', qty: 54, revenue: 972000 },
    { rank: 2, name: 'Es Teh Manis Jumbo', category: 'Minuman Dingin', qty: 118, revenue: 590000 },
    { rank: 3, name: 'Indomie Kari Ayam Telur', category: 'Kuah', qty: 42, revenue: 630000 },
    { rank: 4, name: 'Gorengan Bakwan Hangat', category: 'Gorengan', qty: 96, revenue: 160000 },
    { rank: 5, name: 'Kopi Susu Vietnam Drip', category: 'Kopi Panas', qty: 38, revenue: 342000 },
  ];

  const handleExportCSV = () => {
    const csvContent = [
      'Rank,Menu,Kategori,Qty Terjual,Omset (IDR)',
      ...bestSellers.map((b) => `${b.rank},"${b.name}","${b.category}",${b.qty},${b.revenue}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan_penjualan_warmindo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-ground space-y-6">
      {/* Dashboard Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-ink">
              Dashboard Analitik Pemilik
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-status-chart/10 text-status-chart text-xs font-semibold">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted">
            Ringkasan omset penjualan, tren jam sibuk, dan performa menu Warmindo 88
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <div className="flex bg-surface p-1 rounded-xl border border-border shadow-2xs">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                period === 'today' ? 'bg-accent text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                period === '7days' ? 'bg-accent text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                period === 'month' ? 'bg-accent text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="h-9 px-3.5 rounded-xl bg-surface border border-border hover:bg-raised text-xs font-semibold text-ink flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Berhasil Diunduh!' : 'Ekspor CSV'}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider">Omset Hari Ini</span>
            <span className="p-2 rounded-lg bg-ground border border-border/60">
              <TrendingUp className="w-4 h-4 text-status-positive" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-ink tabular-nums">
              {formatRupiah(3420000)}
            </div>
            <div className="flex items-center gap-1 text-xs text-status-positive font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% vs kemarin</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider">Total Transaksi</span>
            <span className="p-2 rounded-lg bg-ground border border-border/60">
              <ShoppingBag className="w-4 h-4 text-status-chart" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-ink tabular-nums">
              148 Struk
            </div>
            <div className="flex items-center gap-1 text-xs text-status-positive font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12 struk dari target</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider">Rata-Rata Keranjang</span>
            <span className="p-2 rounded-lg bg-ground border border-border/60">
              <CreditCard className="w-4 h-4 text-warm-amber" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-ink tabular-nums">
              {formatRupiah(23108)}
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-muted font-medium mt-1">
              <span>Stabil (+Rp 1.400 / struk)</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider">Menu Paling Laris</span>
            <span className="p-2 rounded-lg bg-ground border border-border/60">
              <Sparkles className="w-4 h-4 text-warm-amber" />
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-ink line-clamp-1">
              Indomie Bangladesh
            </div>
            <div className="text-xs text-ink-muted font-mono mt-1">
              54 porsi terjual hari ini
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Turnover Bar Graphic Card */}
      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-ink">
              Fluktuasi Omset Jam-ke-Jam (08:00 - 02:00)
            </h3>
            <p className="text-xs text-ink-muted">
              Puncak omset terjadi pada makan siang (12:00) dan jam nongkrong malam (21:00 - 23:00)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-accent" />
              <span className="text-ink-muted">Shift Reguler</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-status-chart" />
              <span className="text-ink font-semibold">Peak Rush Hour</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-border">
          {hourlyData.map((d) => (
            <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white text-[10px] font-mono py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-10">
                {d.hour}: {formatRupiah(d.amount)} {d.label ? `(${d.label})` : ''}
              </div>

              {/* Bar */}
              <div
                style={{ height: `${d.height}%` }}
                className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                  d.isPeak ? 'bg-status-chart' : 'bg-accent/80 hover:bg-accent'
                }`}
              />

              {/* Hour Label */}
              <span className="text-[10px] sm:text-xs text-ink-muted font-mono whitespace-nowrap">
                {d.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-Column Split: Best Sellers Table & Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Best Seller */}
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-ink">
              5 Menu Terlaris (Qty & Omset)
            </h3>
            <span className="text-xs text-ink-muted">Berdasarkan data hari ini</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-ink-muted uppercase tracking-wider font-semibold">
                  <th className="pb-2.5">No</th>
                  <th className="pb-2.5">Nama Menu</th>
                  <th className="pb-2.5 text-center">Qty</th>
                  <th className="pb-2.5 text-right">Total Omset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bestSellers.map((item) => (
                  <tr key={item.rank} className="hover:bg-ground/50 transition-colors">
                    <td className="py-2.5 font-mono text-ink-muted">#{item.rank}</td>
                    <td className="py-2.5">
                      <span className="font-semibold text-ink block">{item.name}</span>
                      <span className="text-[10px] text-ink-muted">{item.category}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono font-medium">
                      {item.qty}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-ink">
                      {formatRupiah(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Shift Distribution */}
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-ink mb-1">
              Metode Pembayaran & Kinerja Shift
            </h3>
            <p className="text-xs text-ink-muted">
              Distribusi transaksi Tunai vs QRIS di kasir
            </p>
          </div>

          {/* Payment Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-ink">Tunai / Cash (68%)</span>
              <span className="text-status-chart">QRIS Dinamis (32%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-ground border border-border overflow-hidden flex">
              <div className="h-full bg-accent" style={{ width: '68%' }} />
              <div className="h-full bg-status-chart" style={{ width: '32%' }} />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-ink-muted">
              <span>{formatRupiah(2325600)}</span>
              <span>{formatRupiah(1094400)}</span>
            </div>
          </div>

          {/* Shift Comparison Box */}
          <div className="bg-ground rounded-xl p-3.5 border border-border space-y-2.5">
            <span className="text-xs font-bold text-ink block">
              Ringkasan Kinerja Kasir Hari Ini
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-surface border border-border/80">
                <span className="text-[11px] text-ink-muted block">Shift Pagi (Budi)</span>
                <span className="font-bold text-ink font-mono text-sm">
                  {formatRupiah(1450000)}
                </span>
                <span className="text-[10px] text-ink-muted block mt-0.5">62 Struk Selesai</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface border border-border/80">
                <span className="text-[11px] text-ink-muted block">Shift Malam (Anton)</span>
                <span className="font-bold text-ink font-mono text-sm">
                  {formatRupiah(1970000)}
                </span>
                <span className="text-[10px] text-ink-muted block mt-0.5">86 Struk Selesai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
