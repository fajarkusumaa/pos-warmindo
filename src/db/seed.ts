import { config } from 'dotenv';
import { getDb } from './index';
import {
  outlets,
  employees,
  toppings,
  eggOptions,
  menuItems,
  diningTables,
  stockItems,
  purchaseOrders,
} from './schema';

config({ path: '.env.local' });
config({ path: '.env' });

async function seed() {
  const db = getDb();
  console.log('🌱 Memulai proses seeding data awal ke Neon menggunakan Drizzle ORM...');

  // 1. Outlets
  await db
    .insert(outlets)
    .values([
      {
        id: 'kemang',
        name: 'Warmindo 88 — Kemang',
        code: 'KMG',
        address: 'Jl. Kemang Raya No. 88, Jakarta Selatan',
        whatsapp: '+62 812-8008-0088',
        email: 'owner@warmindo88.id',
        timezone: 'Asia/Jakarta',
        openingHours: '24 jam',
      },
      {
        id: 'tebet',
        name: 'Warmindo 88 — Tebet',
        code: 'TBT',
        address: 'Jl. Tebet Raya No. 21, Jakarta Selatan',
        whatsapp: '+62 812-8008-0089',
        email: 'tebet@warmindo88.id',
        timezone: 'Asia/Jakarta',
        openingHours: '24 jam',
      },
      {
        id: 'cipete',
        name: 'Warmindo 88 — Cipete',
        code: 'CPT',
        address: 'Jl. Cipete Raya No. 5, Jakarta Selatan',
        whatsapp: '+62 812-8008-0090',
        email: 'cipete@warmindo88.id',
        timezone: 'Asia/Jakarta',
        openingHours: '24 jam',
      },
    ])
    .onConflictDoNothing();

  // 2. Employees
  await db
    .insert(employees)
    .values([
      { id: 'bs', outletId: 'kemang', name: 'Budi Santoso', role: 'kasir', defaultShift: 'malam' },
      { id: 'aw', outletId: 'kemang', name: 'Anton Wijaya', role: 'juru_masak', defaultShift: 'malam' },
      { id: 'rk', outletId: 'kemang', name: 'Rizky Kurnia', role: 'pelayan', defaultShift: 'malam' },
      { id: 'dl', outletId: 'kemang', name: 'Dewi Lestari', role: 'kasir', defaultShift: 'sore' },
      { id: 'js', outletId: 'kemang', name: 'Joko Susilo', role: 'juru_masak', defaultShift: 'sore' },
      { id: 'sr', outletId: 'kemang', name: 'Sari Rahma', role: 'kasir', defaultShift: 'izin' },
      { id: 'rn', outletId: 'kemang', name: 'Rina Novita', role: 'juru_masak', defaultShift: 'pagi' },
    ])
    .onConflictDoNothing();

  // 3. Toppings & Egg Options
  await db
    .insert(toppings)
    .values([
      { id: 'top_kornet', name: 'Kornet sapi', price: 5000, available: true, sortOrder: 1 },
      { id: 'top_keju', name: 'Keju parut', price: 3000, available: true, sortOrder: 2 },
      { id: 'top_sosis', name: 'Sosis', price: 4000, available: true, sortOrder: 3 },
    ])
    .onConflictDoNothing();

  await db
    .insert(eggOptions)
    .values([
      { id: 'egg_ceplok_half', name: 'Ceplok ½ matang', shortName: 'Telur ceplok', price: 4000, available: true, sortOrder: 1 },
      { id: 'egg_dadar', name: 'Dadar', shortName: 'Telur dadar', price: 4000, available: true, sortOrder: 2 },
    ])
    .onConflictDoNothing();

  // 4. Menu Items
  await db
    .insert(menuItems)
    .values([
      { id: 'mie_goreng_aceh', name: 'Indomie Goreng Aceh', category: 'mie', basePrice: 12000, cogsEstimate: 4800, tag: 'laris', imageUrl: '/images/indomie-goreng-aceh.jpg', available: true, customizable: true, sortOrder: 1 },
      { id: 'mie_kuah_soto', name: 'Indomie Kuah Soto', category: 'mie', basePrice: 11000, cogsEstimate: 4500, imageUrl: '/images/indomie-kuah-soto.jpg', available: true, customizable: true, sortOrder: 2 },
      { id: 'mie_kari_telur', name: 'Indomie Kari Telur', category: 'mie', basePrice: 15000, cogsEstimate: 6500, imageUrl: '/images/indomie-kari-telur.jpg', available: true, customizable: true, sortOrder: 3 },
      { id: 'mie_rendang_dobel', name: 'Indomie Rendang Dobel', category: 'mie', basePrice: 20000, cogsEstimate: 8500, available: true, customizable: true, sortOrder: 4 },
      { id: 'mie_tektek', name: 'Mie Tek-tek Spesial', category: 'mie', basePrice: 16000, cogsEstimate: 7000, available: false, customizable: true, sortOrder: 5 },
      { id: 'mie_seblak', name: 'Indomie Seblak', category: 'mie', basePrice: 14000, cogsEstimate: 6000, available: true, customizable: true, sortOrder: 6 },
      { id: 'nasi_telur_kornet', name: 'Nasi Telur Kornet', category: 'nasi', basePrice: 16000, cogsEstimate: 7200, tag: 'baru', imageUrl: '/images/nasi-telur-kornet.jpg', available: true, customizable: false, sortOrder: 7 },
      { id: 'nasi_ayam_geprek', name: 'Nasi Ayam Geprek', category: 'nasi', basePrice: 18000, cogsEstimate: 8500, available: true, customizable: false, sortOrder: 8 },
      { id: 'nasi_telur_dadar', name: 'Nasi Telur Dadar', category: 'nasi', basePrice: 10000, cogsEstimate: 4200, available: true, customizable: false, sortOrder: 9 },
      { id: 'nasi_sarden', name: 'Nasi Sarden', category: 'nasi', basePrice: 13000, cogsEstimate: 6000, available: false, customizable: false, sortOrder: 10 },
      { id: 'minum_es_teh', name: 'Es Teh Manis Jumbo', category: 'minum', basePrice: 5000, cogsEstimate: 1500, available: true, customizable: false, sortOrder: 11 },
      { id: 'minum_nutrisari', name: 'Es Nutrisari Jeruk', category: 'minum', basePrice: 6000, cogsEstimate: 2200, available: false, customizable: false, sortOrder: 12 },
      { id: 'minum_susu_jahe', name: 'Susu Jahe Hangat', category: 'minum', basePrice: 7000, cogsEstimate: 2800, available: true, customizable: false, sortOrder: 13 },
      { id: 'kopi_tubruk', name: 'Kopi Hitam Tubruk', category: 'kopi', basePrice: 4000, cogsEstimate: 1200, available: true, customizable: false, sortOrder: 14 },
      { id: 'kopi_susu_aren', name: 'Kopi Susu Gula Aren', category: 'kopi', basePrice: 8000, cogsEstimate: 3200, available: true, customizable: false, sortOrder: 15 },
      { id: 'camilan_bakwan', name: 'Gorengan Bakwan', category: 'camilan', basePrice: 5000, cogsEstimate: 2000, available: true, customizable: false, sortOrder: 16 },
      { id: 'camilan_pisang_bakar', name: 'Pisang Bakar Keju', category: 'camilan', basePrice: 14000, cogsEstimate: 5500, available: true, customizable: false, sortOrder: 17 },
    ])
    .onConflictDoNothing();

  // 5. Dining Tables
  await db
    .insert(diningTables)
    .values([
      { id: 'tbl_1', outletId: 'kemang', tableNumber: '01', name: 'Meja 01 (Depan)', capacity: 4, status: 'eating', guestCount: 3 },
      { id: 'tbl_2', outletId: 'kemang', tableNumber: '02', name: 'Meja 02 (Tengah)', capacity: 2, status: 'add_order', guestCount: 2 },
      { id: 'tbl_3', outletId: 'kemang', tableNumber: '03', name: 'Meja 03 (Sudut TV)', capacity: 4, status: 'need_bill', guestCount: 4 },
      { id: 'tbl_4', outletId: 'kemang', tableNumber: '04', name: 'Meja 04 (Bar Kasir)', capacity: 2, status: 'available', guestCount: 0 },
      { id: 'tbl_5', outletId: 'kemang', tableNumber: '05', name: 'Lesehan Nobar Utama', capacity: 8, status: 'eating', guestCount: 6 },
      { id: 'tbl_6', outletId: 'kemang', tableNumber: '06', name: 'Meja 06 (Outdoor)', capacity: 4, status: 'eating', guestCount: 3 },
      { id: 'tbl_7', outletId: 'kemang', tableNumber: '07', name: 'Meja 07 (Outdoor)', capacity: 4, status: 'add_order', guestCount: 2 },
      { id: 'tbl_8', outletId: 'kemang', tableNumber: '08', name: 'Meja 08 (Dalam)', capacity: 2, status: 'available', guestCount: 0 },
      { id: 'tbl_9', outletId: 'kemang', tableNumber: '09', name: 'Meja 09 (Dalam)', capacity: 4, status: 'eating', guestCount: 4 },
      { id: 'tbl_10', outletId: 'kemang', tableNumber: '10', name: 'Meja 10 (Depan Bar)', capacity: 3, status: 'need_bill', guestCount: 3 },
      { id: 'tbl_11', outletId: 'kemang', tableNumber: '11', name: 'Meja 11 (Sudut Kiri)', capacity: 2, status: 'eating', guestCount: 1 },
      { id: 'tbl_12', outletId: 'kemang', tableNumber: '12', name: 'Meja 12 (Pintu Masuk)', capacity: 4, status: 'available', guestCount: 0 },
    ])
    .onConflictDoNothing();

  // 6. Stock Items
  await db
    .insert(stockItems)
    .values([
      { id: 'telur', outletId: 'kemang', name: 'Telur ayam', stockGroup: 'Protein', icon: 'egg', currentStock: '18', minStock: '20', capacity: '120', unit: 'butir', dailyUseEstimate: '16.00', unitCost: 2100 },
      { id: 'indomie-goreng', outletId: 'kemang', name: 'Indomie Goreng', stockGroup: 'Mie instan', icon: 'package', currentStock: '24', minStock: '40', capacity: '200', unit: 'bungkus', dailyUseEstimate: '22.00', unitCost: 3100 },
      { id: 'es-batu', outletId: 'kemang', name: 'Es batu kristal', stockGroup: 'Minuman', icon: 'snowflake', currentStock: '6', minStock: '10', capacity: '40', unit: 'kg', dailyUseEstimate: '3.00', unitCost: 2500 },
      { id: 'kornet', outletId: 'kemang', name: 'Kornet sapi', stockGroup: 'Topping', icon: 'beef', currentStock: '9', minStock: '8', capacity: '30', unit: 'kaleng', dailyUseEstimate: '2.00', unitCost: 28500 },
      { id: 'indomie-soto', outletId: 'kemang', name: 'Indomie Kuah Soto', stockGroup: 'Mie instan', icon: 'package', currentStock: '64', minStock: '40', capacity: '200', unit: 'bungkus', dailyUseEstimate: '7.00', unitCost: 3000 },
      { id: 'teh', outletId: 'kemang', name: 'Teh celup', stockGroup: 'Minuman', icon: 'coffee', currentStock: '14', minStock: '5', capacity: '30', unit: 'box', dailyUseEstimate: '1.15', unitCost: 6800 },
      { id: 'gula', outletId: 'kemang', name: 'Gula pasir', stockGroup: 'Bahan dapur', icon: 'wheat', currentStock: '22', minStock: '8', capacity: '40', unit: 'kg', dailyUseEstimate: '1.45', unitCost: 17000 },
      { id: 'kopi', outletId: 'kemang', name: 'Kopi bubuk', stockGroup: 'Minuman', icon: 'coffee', currentStock: '12', minStock: '4', capacity: '24', unit: 'pack', dailyUseEstimate: '0.66', unitCost: 9500 },
    ])
    .onConflictDoNothing();

  // 7. Purchase Orders
  await db
    .insert(purchaseOrders)
    .values([
      { id: 'PO-0921', outletId: 'kemang', supplierName: 'Toko Sinar Jaya', itemsSummary: 'Gula 20 kg, Teh celup 10 box', totalAmount: 408000, status: 'draft', etaLabel: 'Hari ini' },
      { id: 'PO-0918', outletId: 'kemang', supplierName: 'CV Sumber Makmur', itemsSummary: 'Indomie 4 dus, Telur 5 tray', totalAmount: 1840000, status: 'ordered', etaLabel: 'Tiba besok' },
      { id: 'PO-0920', outletId: 'kemang', supplierName: 'Agen Es Kristal', itemsSummary: 'Es batu 40 kg', totalAmount: 100000, status: 'ordered', etaLabel: 'Tiba 23:00' },
      { id: 'PO-0915', outletId: 'kemang', supplierName: 'Distributor Minuman Jkt', itemsSummary: 'Nutrisari 10 pack, Kopi 12', totalAmount: 2450000, status: 'received', etaLabel: '' },
      { id: 'PO-0912', outletId: 'kemang', supplierName: 'Pasar Induk Kramat Jati', itemsSummary: 'Cabai, bawang, sawi', totalAmount: 780000, status: 'received', etaLabel: '' },
      { id: 'PO-0911', outletId: 'kemang', supplierName: 'CV Sumber Makmur', itemsSummary: 'Indomie 6 dus', totalAmount: 1420000, status: 'paid', etaLabel: '20 Okt' },
      { id: 'PO-0909', outletId: 'kemang', supplierName: 'Toko Sinar Jaya', itemsSummary: 'Minyak 18 L, gas 3 kg ×4', totalAmount: 690000, status: 'paid', etaLabel: '18 Okt' },
    ])
    .onConflictDoNothing();

  console.log('✅ Seeding database Neon dengan Drizzle ORM selesai!');
}

seed().catch((err) => {
  console.error('❌ Gagal melakukan seeding:', err);
  process.exit(1);
});
