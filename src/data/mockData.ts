import { MenuItem, Topping, TableInfo } from '../types';

export const TOPPINGS_AVAILABLE: Topping[] = [
  { id: 'top_kornet', name: 'Kornet Sapi Manis Gurih', price: 5000 },
  { id: 'top_keju', name: 'Keju Cheddar Parut Tebal', price: 3000 },
  { id: 'top_sosis', name: 'Sosis Sapi Panggang', price: 4000 },
  { id: 'top_bakso', name: 'Bakso Sapi Urat (2 pcs)', price: 4000 },
  { id: 'top_sayur', name: 'Sawi Hijau & Kol Ekstra', price: 2000 },
];

export const EGGS_AVAILABLE = [
  { id: 'egg_ceplok_half', name: 'Telur Ayam Ceplok ½ Matang Lumer', price: 4000 },
  { id: 'egg_ceplok_full', name: 'Telur Ayam Ceplok Matang', price: 4000 },
  { id: 'egg_dadar', name: 'Telur Ayam Dadar Keriting Renyah', price: 4000 },
  { id: 'egg_bebek', name: 'Telur Bebek Kocok Kuah Rempah', price: 6000 },
  { id: 'egg_rebus', name: 'Telur Ayam Rebus Utuh', price: 3500 },
];

export const MENU_ITEMS: MenuItem[] = [
  // Indomie Kuah
  {
    id: 'wmd_soto',
    name: 'Indomie Soto Spesial',
    category: 'kuah',
    categoryLabel: 'Indomie Kuah',
    basePrice: 11000,
    description: 'Kuah koya gurih segar jeruk nipis dengan cabai rawit hijau',
    badge: 'Pedas Segar',
    badgeType: 'spicy',
    available: true,
    imageIcon: '🍜'
  },
  {
    id: 'wmd_kari',
    name: 'Indomie Kari Ayam Telur',
    category: 'kuah',
    categoryLabel: 'Indomie Kuah',
    basePrice: 15000,
    description: 'Kuah kari kental medok langsung dimasak dengan telur kocok',
    badge: 'Favorit',
    badgeType: 'popular',
    available: true,
    imageIcon: '🍲'
  },
  {
    id: 'wmd_dokdok',
    name: 'Indomie Dok-Dok Jogja',
    category: 'kuah',
    categoryLabel: 'Indomie Kuah',
    basePrice: 17000,
    description: 'Racikan legendaris Jogja: kuah nyemek gurih manis, telur, kol & sosis',
    badge: 'Spesial',
    badgeType: 'special',
    available: true,
    imageIcon: '🥣'
  },
  {
    id: 'wmd_seblak',
    name: 'Indomie Seblak Hot Jeletot',
    category: 'kuah',
    categoryLabel: 'Indomie Kuah',
    basePrice: 16000,
    description: 'Bumbu kencur pedas berkuah merah merona dengan kerupuk kenyal',
    badge: 'Lv.10 Pedas',
    badgeType: 'spicy',
    available: true,
    imageIcon: '🌶️'
  },

  // Indomie Goreng
  {
    id: 'wmd_gr_aceh',
    name: 'Indomie Goreng Aceh',
    category: 'goreng',
    categoryLabel: 'Indomie Goreng',
    basePrice: 12000,
    description: 'Mie tebal aroma rempah kapulaga tajam khas Serambi Mekkah',
    badge: 'Top Seller',
    badgeType: 'popular',
    available: true,
    imageIcon: '🍛'
  },
  {
    id: 'wmd_bangladesh',
    name: 'Indomie Bangladesh Medan',
    category: 'goreng',
    categoryLabel: 'Indomie Goreng',
    basePrice: 18000,
    description: 'Rempah kuah nyemek kari khas Warkop Medan bertabur bawang goreng renyah',
    badge: 'Signature',
    badgeType: 'special',
    available: true,
    imageIcon: '🥘'
  },
  {
    id: 'wmd_gr_rendang',
    name: 'Indomie Goreng Rendang',
    category: 'goreng',
    categoryLabel: 'Indomie Goreng',
    basePrice: 12000,
    description: 'Aroma minyak bumbu rendang Padang gurih menggoda selera',
    available: true,
    imageIcon: '🍛'
  },
  {
    id: 'wmd_magelangan',
    name: 'Nasi Magelangan Warmindo',
    category: 'goreng',
    categoryLabel: 'Indomie Goreng',
    basePrice: 18000,
    description: 'Kolaborasi nasi pulen + mie goreng diaduk bumbu kecap gurih',
    badge: 'Kenyang Pol',
    badgeType: 'popular',
    available: true,
    imageIcon: '🍳'
  },

  // Minuman Dingin
  {
    id: 'drink_esteh',
    name: 'Es Teh Manis Jumbo',
    category: 'minuman_dingin',
    categoryLabel: 'Minuman Dingin',
    basePrice: 5000,
    description: 'Racikan 3 merk daun teh melati wangi, kental dan dingin menyegarkan',
    badge: 'Paling Laris',
    badgeType: 'popular',
    available: true,
    imageIcon: '🧊'
  },
  {
    id: 'drink_esjeruk',
    name: 'Es Jeruk Peras Asli',
    category: 'minuman_dingin',
    categoryLabel: 'Minuman Dingin',
    basePrice: 7000,
    description: 'Jeruk peras lokal segar asli tanpa pengawet dengan gula asli',
    available: true,
    imageIcon: '🍊'
  },
  {
    id: 'drink_soda_gembira',
    name: 'Soda Gembira Klasik',
    category: 'minuman_dingin',
    categoryLabel: 'Minuman Dingin',
    basePrice: 14000,
    description: 'Air soda F&N dingin dipadu sirup merah dan susu kental manis',
    badge: 'Nostalgia',
    badgeType: 'special',
    available: true,
    imageIcon: '🥤'
  },
  {
    id: 'drink_nutrisari',
    name: 'Es Nutrisari Aneka Rasa',
    category: 'minuman_dingin',
    categoryLabel: 'Minuman Dingin',
    basePrice: 6000,
    description: 'Pilihan Jeruk Peras, Blewah, Florida Orange, atau American Sweet',
    available: true,
    imageIcon: '🧃'
  },

  // Kopi & Teh Panas
  {
    id: 'coffee_tubruk',
    name: 'Kopi Hitam Tubruk Warkop',
    category: 'kopi_panas',
    categoryLabel: 'Kopi & Teh Panas',
    basePrice: 4000,
    description: 'Robusta murni gilingan halus beraroma pekat khas warung kopi',
    available: true,
    imageIcon: '☕'
  },
  {
    id: 'coffee_vietnam',
    name: 'Kopi Susu Vietnam Drip',
    category: 'kopi_panas',
    categoryLabel: 'Kopi & Teh Panas',
    basePrice: 9000,
    description: 'Tetesan drip lambat kopi pekat di atas layer kental manis legit',
    badge: 'Wajib Coba',
    badgeType: 'special',
    available: true,
    imageIcon: '☕'
  },
  {
    id: 'coffee_jahe',
    name: 'Kopi Jahe Bakar Geprek',
    category: 'kopi_panas',
    categoryLabel: 'Kopi & Teh Panas',
    basePrice: 8000,
    description: 'Kopi hitam hangat dipadu jahe bakar geprek penghangat badan',
    available: true,
    imageIcon: '🫚'
  },
  {
    id: 'tea_tarik',
    name: 'Teh Tarik Buih Melimpah',
    category: 'kopi_panas',
    categoryLabel: 'Kopi & Teh Panas',
    basePrice: 9000,
    description: 'Ditarik sampai berbusa tebal lembut dan creamy gurih',
    available: true,
    imageIcon: '🫖'
  },

  // Snack & Topping
  {
    id: 'snack_bakwan',
    name: 'Gorengan Bakwan Hangat (3 pcs)',
    category: 'snack_topping',
    categoryLabel: 'Gorengan & Camilan',
    basePrice: 5000,
    description: 'Gorengan dadakan isi sayur renyah dengan cabai rawit lalap',
    badge: 'Renyah',
    badgeType: 'popular',
    available: true,
    imageIcon: '🥟'
  },
  {
    id: 'snack_mendoan',
    name: 'Tempe Mendoan Sambal Kecap (3)',
    category: 'snack_topping',
    categoryLabel: 'Gorengan & Camilan',
    basePrice: 10000,
    description: 'Tempe mendoan basah gurih daun bawang + cocolan sambal kecap rawit',
    badge: 'Favorit',
    badgeType: 'special',
    available: true,
    imageIcon: '🫓'
  },
  {
    id: 'snack_rotibakar',
    name: 'Roti Bakar Coklat Keju Susu',
    category: 'snack_topping',
    categoryLabel: 'Gorengan & Camilan',
    basePrice: 15000,
    description: 'Roti kasino empuk dibakar mentega gurih dengan meses & parutan keju melimpah',
    available: true,
    imageIcon: '🍞'
  },
  {
    id: 'snack_pisangbakar',
    name: 'Pisang Bakar Brown Sugar Keju',
    category: 'snack_topping',
    categoryLabel: 'Gorengan & Camilan',
    basePrice: 14000,
    description: 'Pisang raja bakar karamelisasi gula palem dan parutan keju gurih',
    available: true,
    imageIcon: '🍌'
  }
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
