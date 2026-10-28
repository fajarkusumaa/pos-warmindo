import { EggOption, MenuItem, Order, TableInfo, Topping } from '../types';

export const TOPPINGS_AVAILABLE: Topping[] = [
  { id: 'top_kornet', name: 'Kornet sapi', price: 5000 },
  { id: 'top_keju', name: 'Keju parut', price: 3000 },
  { id: 'top_sosis', name: 'Sosis', price: 4000 },
];

export const EGGS_AVAILABLE: EggOption[] = [
  { id: 'egg_ceplok_half', name: 'Ceplok ½ matang', shortName: 'Telur ceplok', price: 4000 },
  { id: 'egg_dadar', name: 'Dadar', shortName: 'Telur dadar', price: 4000 },
];

export const CATEGORY_LABELS: Record<MenuItem['category'], string> = {
  mie: 'Mie',
  nasi: 'Nasi',
  minum: 'Minum',
  kopi: 'Kopi',
  camilan: 'Camilan',
};

const mie = (id: string, name: string, basePrice: number, extra: Partial<MenuItem> = {}): MenuItem => ({
  id, name, basePrice, category: 'mie', available: true, customizable: true, ...extra,
});
const item = (id: string, name: string, category: MenuItem['category'], basePrice: number, extra: Partial<MenuItem> = {}): MenuItem => ({
  id, name, category, basePrice, available: true, ...extra,
});

export const MENU_ITEMS: MenuItem[] = [
  mie('mie_goreng_aceh', 'Indomie Goreng Aceh', 12000, { tag: 'laris', image: '/images/indomie-goreng-aceh.jpg' }),
  mie('mie_kuah_soto', 'Indomie Kuah Soto', 11000, { image: '/images/indomie-kuah-soto.jpg' }),
  mie('mie_kari_telur', 'Indomie Kari Telur', 15000, { image: '/images/indomie-kari-telur.jpg' }),
  mie('mie_rendang_dobel', 'Indomie Rendang Dobel', 20000),
  mie('mie_tektek', 'Mie Tek-tek Spesial', 16000, { available: false }),
  mie('mie_seblak', 'Indomie Seblak', 14000),

  item('nasi_telur_kornet', 'Nasi Telur Kornet', 'nasi', 16000, { tag: 'baru', image: '/images/nasi-telur-kornet.jpg' }),
  item('nasi_ayam_geprek', 'Nasi Ayam Geprek', 'nasi', 18000),
  item('nasi_telur_dadar', 'Nasi Telur Dadar', 'nasi', 10000),
  item('nasi_sarden', 'Nasi Sarden', 'nasi', 13000, { available: false }),

  item('minum_es_teh', 'Es Teh Manis Jumbo', 'minum', 5000),
  item('minum_nutrisari', 'Es Nutrisari Jeruk', 'minum', 6000, { available: false }),
  item('minum_susu_jahe', 'Susu Jahe Hangat', 'minum', 7000),

  item('kopi_tubruk', 'Kopi Hitam Tubruk', 'kopi', 4000),
  item('kopi_susu_aren', 'Kopi Susu Gula Aren', 'kopi', 8000),

  item('camilan_bakwan', 'Gorengan Bakwan', 'camilan', 5000),
  item('camilan_pisang_bakar', 'Pisang Bakar Keju', 'camilan', 14000),
];

export const INITIAL_TABLES: TableInfo[] = [
  {
    id: 'tbl_1',
    number: '01',
    name: 'Meja 01 (Depan)',
    capacity: 4,
    status: 'eating',
    guestCount: 3,
    elapsedSeconds: 5240, // 1h 27m
    totalBill: 64000,
  },
  {
    id: 'tbl_2',
    number: '02',
    name: 'Meja 02 (Tengah)',
    capacity: 2,
    status: 'add_order',
    guestCount: 2,
    elapsedSeconds: 2100, // 35m
    totalBill: 34000,
  },
  {
    id: 'tbl_3',
    number: '03',
    name: 'Meja 03 (Sudut TV)',
    capacity: 4,
    status: 'need_bill',
    guestCount: 4,
    elapsedSeconds: 7800, // 2h 10m
    totalBill: 82000,
  },
  {
    id: 'tbl_4',
    number: '04',
    name: 'Meja 04 (Bar Kasir)',
    capacity: 2,
    status: 'available',
  },
  {
    id: 'tbl_5',
    number: '05',
    name: 'Lesehan Nobar Utama',
    capacity: 8,
    status: 'eating',
    guestCount: 6,
    elapsedSeconds: 8400, // 2h 20m
    totalBill: 145000,
  },
  {
    id: 'tbl_6',
    number: '06',
    name: 'Meja 06 (Outdoor)',
    capacity: 4,
    status: 'eating',
    guestCount: 3,
    elapsedSeconds: 1500, // 25m
    totalBill: 46000,
  },
  {
    id: 'tbl_7',
    number: '07',
    name: 'Meja 07 (Outdoor)',
    capacity: 4,
    status: 'add_order',
    guestCount: 2,
    elapsedSeconds: 4300,
    totalBill: 51000,
  },
  {
    id: 'tbl_8',
    number: '08',
    name: 'Meja 08 (Dalam)',
    capacity: 2,
    status: 'available',
  },
  {
    id: 'tbl_9',
    number: '09',
    name: 'Meja 09 (Dalam)',
    capacity: 4,
    status: 'eating',
    guestCount: 4,
    elapsedSeconds: 3400,
    totalBill: 72000,
  },
  {
    id: 'tbl_10',
    number: '10',
    name: 'Meja 10 (Depan Bar)',
    capacity: 3,
    status: 'need_bill',
    guestCount: 3,
    elapsedSeconds: 5800,
    totalBill: 69000,
  },
  {
    id: 'tbl_11',
    number: '11',
    name: 'Meja 11 (Sudut Kiri)',
    capacity: 2,
    status: 'eating',
    guestCount: 1,
    elapsedSeconds: 900,
    totalBill: 19000,
  },
  {
    id: 'tbl_12',
    number: '12',
    name: 'Meja 12 (Pintu Masuk)',
    capacity: 4,
    status: 'available',
  }
];

export const INITIAL_SHIFT_ORDERS: Order[] = [
  {
    id: 'ord_sample_1',
    orderNumber: 'WMD-20261028-089',
    tableNumber: 'Meja 01',
    items: [
      {
        cartItemId: 'c1',
        menuItem: MENU_ITEMS[0], // Indomie Goreng Aceh
        quantity: 2,
        customization: {
          doneness: 'Kenyal',
          egg: EGGS_AVAILABLE[0],
          toppings: [TOPPINGS_AVAILABLE[0]],
          spicinessLevel: 2,
        },
        unitPrice: 21000,
        subtotal: 42000,
      },
      {
        cartItemId: 'c2',
        menuItem: MENU_ITEMS[10], // Es Teh Manis Jumbo
        quantity: 2,
        unitPrice: 5000,
        subtotal: 10000,
      },
    ],
    subtotal: 52000,
    discount: 0,
    tax: 0,
    total: 52000,
    paymentMethod: 'cash',
    cashReceived: 100000,
    change: 48000,
    cashierName: 'Budi Santoso',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_sample_2',
    orderNumber: 'WMD-20261028-090',
    tableNumber: 'Bungkus',
    items: [
      {
        cartItemId: 'c3',
        menuItem: MENU_ITEMS[2], // Indomie Kari Telur
        quantity: 1,
        unitPrice: 15000,
        subtotal: 15000,
      },
      {
        cartItemId: 'c4',
        menuItem: MENU_ITEMS[14], // Kopi Susu Aren
        quantity: 1,
        unitPrice: 8000,
        subtotal: 8000,
      },
    ],
    subtotal: 23000,
    discount: 0,
    tax: 0,
    total: 23000,
    paymentMethod: 'qris',
    cashierName: 'Budi Santoso',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_sample_3',
    orderNumber: 'WMD-20261028-091',
    tableNumber: 'Meja 06',
    items: [
      {
        cartItemId: 'c5',
        menuItem: MENU_ITEMS[6], // Nasi Telur Kornet
        quantity: 2,
        unitPrice: 16000,
        subtotal: 32000,
      },
      {
        cartItemId: 'c6',
        menuItem: MENU_ITEMS[15], // Gorengan Bakwan
        quantity: 1,
        unitPrice: 5000,
        subtotal: 5000,
      },
      {
        cartItemId: 'c7',
        menuItem: MENU_ITEMS[10], // Es Teh
        quantity: 2,
        unitPrice: 5000,
        subtotal: 10000,
      },
    ],
    subtotal: 47000,
    discount: 0,
    tax: 0,
    total: 47000,
    paymentMethod: 'cash',
    cashReceived: 50000,
    change: 3000,
    cashierName: 'Budi Santoso',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];
