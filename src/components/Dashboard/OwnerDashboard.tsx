import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  ShoppingBag, 
  CreditCard, 
  ArrowUpRight, 
  Sparkles,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';

export const OwnerDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7days' | 'month'>('today');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Hourly turnover data for Warmindo Nocturnal (08:00 to 02:00)
  const hourlyData = [
    { hour: '08:00', amount: 140000, height: 18 },
    { hour: '10:00', amount: 280000, height: 35 },
    { hour: '12:00', amount: 620000, height: 75, isPeak: true, label: 'Makan Siang' },
    { hour: '14:00', amount: 390000, height: 48 },
    { hour: '16:00', amount: 260000, height: 32 },
    { hour: '18:00', amount: 480000, height: 60 },
    { hour: '20:00', amount: 720000, height: 88 },
    { hour: '22:00', amount: 890000, height: 100, isPeak: true, label: 'Puncak Nobar' },
    { hour: '00:00', amount: 560000, height: 68 },
    { hour: '02:00', amount: 310000, height: 38 },
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
      {/* Top Header & Live Pulse Stream */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Midnight Command Center (Owner)
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#064e3b] text-[#a7f3d0] border border-[#047857] text-[11px] font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
              LIVE PULSE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted">
            Monitoring performa omset shift malam, margin profit, dan peringatan stok outlet
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <div className="flex bg-[#1a1714] p-1 rounded-xl border border-border shadow-xs">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === 'today' ? 'bg-warm-amber text-[#12100e]' : 'text-ink-muted hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === '7days' ? 'bg-warm-amber text-[#12100e]' : 'text-ink-muted hover:text-white'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === 'month' ? 'bg-warm-amber text-[#12100e]' : 'text-ink-muted hover:text-white'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="h-9 px-3.5 rounded-xl bg-surface border border-border hover:bg-raised text-xs font-semibold text-white flex items-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-warm-amber" />
            <span>{downloadSuccess ? 'Berhasil Diunduh!' : 'Ekspor CSV'}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-warm-amber">Omset Shift Malam</span>
            <span className="p-2 rounded-lg bg-[#26221d] border border-border">
              <TrendingUp className="w-4 h-4 text-status-positive" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {formatRupiah(3420000)}
            </div>
            <div className="flex items-center gap-1 text-xs text-status-positive font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.2% vs rata-rata shift</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-warm-amber">Total Transaksi</span>
            <span className="p-2 rounded-lg bg-[#26221d] border border-border">
              <ShoppingBag className="w-4 h-4 text-status-chart" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              148 Struk
            </div>
            <div className="flex items-center gap-1 text-xs text-status-positive font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>9 / 12 Meja terisi aktif</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-warm-amber">Margin Bersih</span>
            <span className="p-2 rounded-lg bg-[#26221d] border border-border">
              <CreditCard className="w-4 h-4 text-status-positive" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              64.2%
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-muted font-medium mt-1">
              <span>Didorong minuman & ekstra topping</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Alert Radar */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-rose-400">Peringatan Stok</span>
            <span className="p-2 rounded-lg bg-[#26221d] border border-border">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </span>
          </div>
          <div>
            <div className="text-lg font-bold text-white line-clamp-1">
              2 Item Menipis
            </div>
            <div className="text-xs text-rose-300 font-mono mt-1">
              Telur sisa 14 butir • Soto sisa 8 bungkus
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Turnover Bar Graphic Card */}
      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              Fluktuasi Omset Warkop Nocturnal (18:00 - 04:00)
            </h3>
            <p className="text-xs text-ink-muted">
              Puncak omset terjadi pada pukul 21:00 - 23:30 saat nobar dan nongkrong malam
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#383129]" />
              <span className="text-ink-muted">Jam Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-warm-amber" />
              <span className="text-white font-semibold">Puncak Nobar Malam</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-border">
          {hourlyData.map((d) => (
            <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#12100e] text-[10px] font-mono font-bold py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-10 shadow-lg">
                {d.hour}: {formatRupiah(d.amount)} {d.label ? `(${d.label})` : ''}
              </div>

              {/* Bar */}
              <div
                style={{ height: `${d.height}%` }}
                className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                  d.isPeak ? 'bg-warm-amber' : 'bg-[#29241f] hover:bg-[#383129]'
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

      {/* Bottom 2-Column Split: Best Sellers Table & Profit Margin Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Best Seller */}
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">
              5 Menu Paling Laris Malam Ini
            </h3>
            <span className="text-xs text-warm-amber font-mono font-semibold">Urut: Omset</span>
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
                    <td className="py-2.5 font-mono text-warm-amber">#{item.rank}</td>
                    <td className="py-2.5">
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[10px] text-ink-muted">{item.category}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono font-medium text-white">
                      {item.qty}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-warm-amber">
                      {formatRupiah(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit Margin Breakdown per Category */}
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Margin Profitabilitas per Kategori Menu
            </h3>
            <p className="text-xs text-ink-muted">
              Minuman & topping menyumbang margin laba tertinggi bagi Warkop
            </p>
          </div>

          {/* Margins */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white">Kopi & Minuman Dingin (Es Teh)</span>
                <span className="text-status-positive font-mono">78% Margin</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#141210] overflow-hidden">
                <div className="h-full bg-status-positive" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white">Ekstra Topping (Telur / Kornet / Keju)</span>
                <span className="text-warm-amber font-mono">65% Margin</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#141210] overflow-hidden">
                <div className="h-full bg-warm-amber" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white">Indomie Racikan</span>
                <span className="text-ink-body font-mono">48% Margin</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#141210] overflow-hidden">
                <div className="h-full bg-ink-muted" style={{ width: '48%' }} />
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-[#141210] rounded-xl p-3.5 border border-border text-xs text-ink-body">
            <span className="font-bold text-warm-amber block mb-1">
              💡 Insight Strategi Omset:
            </span>
            Saran kasir untuk *upselling* Es Teh Manis Jumbo dan Telur Setengah Matang terbukti meningkatkan rata-rata keranjang hingga 32% pada shift malam.
          </div>
        </div>
      </div>
    </div>
  );
};
