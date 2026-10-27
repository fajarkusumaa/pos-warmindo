// Sample data for the owner panel (V2 · 04, 07–13). Figures match the pos-warmindo.pen designs.

export type DashboardRange = 'today' | '7d' | '30d';

export const DASHBOARD_HERO: Record<
  DashboardRange,
  { label: string; revenue: string; delta: string; compare: string; transactions: string; average: string; grossProfit: string }
> = {
  today: { label: 'Omzet hari ini', revenue: 'Rp 3,42 jt', delta: '12,4%', compare: 'vs Selasa lalu', transactions: '148', average: 'Rp 23.108', grossProfit: 'Rp 1,37 jt' },
  '7d': { label: 'Omzet 7 hari', revenue: 'Rp 22,9 jt', delta: '6,1%', compare: 'vs minggu lalu', transactions: '1.002', average: 'Rp 22.854', grossProfit: 'Rp 9,2 jt' },
  '30d': { label: 'Omzet 30 hari', revenue: 'Rp 82,4 jt', delta: '8,2%', compare: 'vs September', transactions: '3.612', average: 'Rp 22.813', grossProfit: 'Rp 35,0 jt' },
};

/** Sales per hour (thousand rupiah), 00:00 → 23:00. */
export const HOURLY_SALES = [65, 42, 27, 15, 11, 19, 53, 80, 72, 57, 68, 110, 137, 103, 76, 68, 84, 118, 133, 148, 167, 190, 182, 122].map(
  (v) => Math.round(v * 1.19),
);

export const TOP_MENU = [
  { name: 'Indomie Goreng Aceh', portions: 42, revenue: 504 },
  { name: 'Indomie Kari Telur', portions: 28, revenue: 420 },
  { name: 'Es Teh Manis Jumbo', portions: 71, revenue: 355 },
  { name: 'Gorengan Bakwan', portions: 36, revenue: 180 },
  { name: 'Kopi Hitam Tubruk', portions: 24, revenue: 96 },
];

export const PAYMENT_SPLIT = { cash: { share: 65, amount: 'Rp 2,22 jt' }, qris: { share: 35, amount: 'Rp 1,20 jt' }, drawer: 'Rp 2.470.000' };

// ── Laporan ────────────────────────────────────────────────────────────────
export const PROFIT = {
  revenue: { value: 'Rp 82,4 jt', note: '▲ 8,2% vs Sep' },
  cogs: { value: 'Rp 35,3 jt', share: 43 },
  opex: { value: 'Rp 12,1 jt', share: 15 },
  net: { value: 'Rp 35,0 jt', share: 42, margin: '42,5%' },
};

/** Daily revenue for October 2026 (thousand rupiah). */
export const DAILY_REVENUE = [126, 138, 189, 207, 147, 115, 108, 133, 140, 195, 216, 161, 124, 120, 131, 145, 202, 221, 166, 129, 115, 136, 152, 212, 230, 170, 133, 143, 120, 110].map(
  (v) => v * 13,
);

export const REPORTS = [
  { id: 'harian', name: 'Penjualan per hari', formats: 'Excel · PDF', icon: 'receipt' },
  { id: 'laba-rugi', name: 'Laba rugi bulanan', formats: 'PDF', icon: 'scale' },
  { id: 'pb1', name: 'Pajak restoran (PB1)', formats: 'PDF', icon: 'landmark' },
  { id: 'stok', name: 'Stok & pemakaian bahan', formats: 'Excel', icon: 'package' },
  { id: 'kasir', name: 'Kinerja kasir & shift', formats: 'Excel', icon: 'users' },
] as const;

// ── Inventori ──────────────────────────────────────────────────────────────
export type StockGroup = 'Protein' | 'Mie instan' | 'Minuman' | 'Topping' | 'Bahan dapur';

export interface StockItem {
  id: string;
  name: string;
  group: StockGroup;
  icon: 'egg' | 'package' | 'snowflake' | 'beef' | 'coffee' | 'wheat';
  stock: number;
  min: number;
  /** Full scale of the gauge, so the minimum marker sits where the design puts it. */
  capacity: number;
  unit: string;
  dailyUse: number;
  price: number;
}

export const STOCK_ITEMS: StockItem[] = [
  { id: 'telur', name: 'Telur ayam', group: 'Protein', icon: 'egg', stock: 18, min: 20, capacity: 120, unit: 'butir', dailyUse: 16, price: 2100 },
  { id: 'indomie-goreng', name: 'Indomie Goreng', group: 'Mie instan', icon: 'package', stock: 24, min: 40, capacity: 200, unit: 'bungkus', dailyUse: 22, price: 3100 },
  { id: 'es-batu', name: 'Es batu kristal', group: 'Minuman', icon: 'snowflake', stock: 6, min: 10, capacity: 40, unit: 'kg', dailyUse: 3, price: 2500 },
  { id: 'kornet', name: 'Kornet sapi', group: 'Topping', icon: 'beef', stock: 9, min: 8, capacity: 30, unit: 'kaleng', dailyUse: 2, price: 28500 },
  { id: 'indomie-soto', name: 'Indomie Kuah Soto', group: 'Mie instan', icon: 'package', stock: 64, min: 40, capacity: 200, unit: 'bungkus', dailyUse: 7, price: 3000 },
  { id: 'teh', name: 'Teh celup', group: 'Minuman', icon: 'coffee', stock: 14, min: 5, capacity: 30, unit: 'box', dailyUse: 1.15, price: 6800 },
  { id: 'gula', name: 'Gula pasir', group: 'Bahan dapur', icon: 'wheat', stock: 22, min: 8, capacity: 40, unit: 'kg', dailyUse: 1.45, price: 17000 },
  { id: 'kopi', name: 'Kopi bubuk', group: 'Minuman', icon: 'coffee', stock: 12, min: 4, capacity: 24, unit: 'pack', dailyUse: 0.66, price: 9500 },
];

// ── Pembelian ──────────────────────────────────────────────────────────────
export type PoStatus = 'draft' | 'ordered' | 'received' | 'paid';

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: string;
  total: number;
  status: PoStatus;
  /** Free text for the card's top-right: "Hari ini", "Tiba besok", "20 Okt"… */
  when: string;
  /** Payment terms in days, only for received-but-unpaid orders. */
  dueInDays?: number;
}

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-0921', supplier: 'Toko Sinar Jaya', items: 'Gula 20 kg, Teh celup 10 box', total: 408000, status: 'draft', when: 'Hari ini' },
  { id: 'PO-0918', supplier: 'CV Sumber Makmur', items: 'Indomie 4 dus, Telur 5 tray', total: 1840000, status: 'ordered', when: 'Tiba besok' },
  { id: 'PO-0920', supplier: 'Agen Es Kristal', items: 'Es batu 40 kg', total: 100000, status: 'ordered', when: 'Tiba 23:00' },
  { id: 'PO-0915', supplier: 'Distributor Minuman Jkt', items: 'Nutrisari 10 pack, Kopi 12', total: 2450000, status: 'received', when: '', dueInDays: 3 },
  { id: 'PO-0912', supplier: 'Pasar Induk Kramat Jati', items: 'Cabai, bawang, sawi', total: 780000, status: 'received', when: '', dueInDays: 7 },
  { id: 'PO-0911', supplier: 'CV Sumber Makmur', items: 'Indomie 6 dus', total: 1420000, status: 'paid', when: '20 Okt' },
  { id: 'PO-0909', supplier: 'Toko Sinar Jaya', items: 'Minyak 18 L, gas 3 kg ×4', total: 690000, status: 'paid', when: '18 Okt' },
];

export const PURCHASE_BUDGET = { used: 24_800_000, budget: 30_000_000, daysLeft: 4 };

// ── Karyawan ───────────────────────────────────────────────────────────────
export type Shift = 'pagi' | 'sore' | 'malam' | 'izin';

export const SHIFT_HOURS: Record<Exclude<Shift, 'izin'>, [number, number]> = {
  pagi: [6, 14],
  sore: [14, 22],
  malam: [22, 30],
};

export interface Employee {
  id: string;
  name: string;
  role: 'Kasir' | 'Juru masak' | 'Pelayan';
  shift: Shift;
}

export const EMPLOYEES: Employee[] = [
  { id: 'bs', name: 'Budi Santoso', role: 'Kasir', shift: 'malam' },
  { id: 'aw', name: 'Anton Wijaya', role: 'Juru masak', shift: 'malam' },
  { id: 'rk', name: 'Rizky Kurnia', role: 'Pelayan', shift: 'malam' },
  { id: 'dl', name: 'Dewi Lestari', role: 'Kasir', shift: 'sore' },
  { id: 'js', name: 'Joko Susilo', role: 'Juru masak', shift: 'sore' },
  { id: 'sr', name: 'Sari Rahma', role: 'Kasir', shift: 'izin' },
  { id: 'rn', name: 'Rina Novita', role: 'Juru masak', shift: 'pagi' },
];

export const CASHIER_PERFORMANCE = [
  { id: 'bs', name: 'Budi Santoso', shift: 'Shift Malam', transactions: 1204, revenue: 31.2, cashDiff: 0, avgSeconds: 38 },
  { id: 'dl', name: 'Dewi Lestari', shift: 'Shift Sore', transactions: 986, revenue: 26.8, cashDiff: -12000, avgSeconds: 44 },
  { id: 'sr', name: 'Sari Rahma', shift: 'Shift Pagi', transactions: 812, revenue: 24.4, cashDiff: 0, avgSeconds: 51 },
];

// ── Outlet ─────────────────────────────────────────────────────────────────
export interface Outlet {
  id: string;
  name: string;
  address: string;
  revenueToday: string;
  delta: number;
  cashier: string;
  receipts: number;
  spark: number[];
  month: { revenue: number; transactions: number; avgTicket: number; margin: number };
}

export const OUTLETS: Outlet[] = [
  {
    id: 'kemang', name: 'Kemang', address: 'Jl. Kemang Raya 88', revenueToday: 'Rp 3,42 jt', delta: 12, cashier: 'Budi', receipts: 148,
    spark: [11, 15, 17, 12, 19, 22, 29, 34, 40, 49, 56, 46],
    month: { revenue: 82.4, transactions: 3612, avgTicket: 22.8, margin: 42.5 },
  },
  {
    id: 'tebet', name: 'Tebet', address: 'Jl. Tebet Raya 21', revenueToday: 'Rp 2,61 jt', delta: 4, cashier: 'Wulan', receipts: 112,
    spark: [17, 19, 16, 22, 25, 28, 27, 31, 36, 39, 41, 34],
    month: { revenue: 64.1, transactions: 2880, avgTicket: 22.3, margin: 38.1 },
  },
  {
    id: 'cipete', name: 'Cipete', address: 'Jl. Cipete Raya 5', revenueToday: 'Rp 1,83 jt', delta: -6, cashier: 'Galih', receipts: 76,
    spark: [10, 12, 15, 13, 17, 16, 20, 22, 21, 26, 28, 24],
    month: { revenue: 47.9, transactions: 2104, avgTicket: 22.8, margin: 33.4 },
  },
];

// ── Pengaturan ─────────────────────────────────────────────────────────────
export interface BusinessProfile {
  name: string;
  whatsapp: string;
  email: string;
  address: string;
  timezone: string;
  hours: string;
  logoUrl?: string;
  receipt: { logo: boolean; address: boolean; whatsapp: boolean; email: boolean };
}

export const INITIAL_PROFILE: BusinessProfile = {
  name: 'Warmindo 88 — Kemang',
  whatsapp: '+62 812-8008-0088',
  email: 'owner@warmindo88.id',
  address: 'Jl. Kemang Raya No. 88, Jakarta Selatan',
  timezone: 'WIB (Jakarta)',
  hours: '24 jam',
  receipt: { logo: true, address: true, whatsapp: true, email: false },
};
