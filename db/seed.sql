-- ============================================================================
-- POS WARMINDO - INITIAL SEED DATA FOR NEON POSTGRESQL
-- Matches existing mockData.ts & ownerData.ts
-- ============================================================================

-- 1. Outlets
INSERT INTO outlets (id, name, code, address, whatsapp, email, timezone, opening_hours)
VALUES
  ('kemang', 'Warmindo 88 — Kemang', 'KMG', 'Jl. Kemang Raya No. 88, Jakarta Selatan', '+62 812-8008-0088', 'owner@warmindo88.id', 'Asia/Jakarta', '24 jam'),
  ('tebet',  'Warmindo 88 — Tebet',  'TBT', 'Jl. Tebet Raya No. 21, Jakarta Selatan',  '+62 812-8008-0089', 'tebet@warmindo88.id', 'Asia/Jakarta', '24 jam'),
  ('cipete', 'Warmindo 88 — Cipete', 'CPT', 'Jl. Cipete Raya No. 5, Jakarta Selatan',  '+62 812-8008-0090', 'cipete@warmindo88.id', 'Asia/Jakarta', '24 jam')
ON CONFLICT (id) DO NOTHING;

-- 2. Employees
INSERT INTO employees (id, outlet_id, name, role, default_shift)
VALUES
  ('bs', 'kemang', 'Budi Santoso',  'kasir',      'malam'),
  ('aw', 'kemang', 'Anton Wijaya',  'juru_masak', 'malam'),
  ('rk', 'kemang', 'Rizky Kurnia',  'pelayan',    'malam'),
  ('dl', 'kemang', 'Dewi Lestari',  'kasir',      'sore'),
  ('js', 'kemang', 'Joko Susilo',   'juru_masak', 'sore'),
  ('sr', 'kemang', 'Sari Rahma',    'kasir',      'izin'),
  ('rn', 'kemang', 'Rina Novita',   'juru_masak', 'pagi')
ON CONFLICT (id) DO NOTHING;

-- 3. Toppings & Egg Options
INSERT INTO toppings (id, name, price, available, sort_order)
VALUES
  ('top_kornet', 'Kornet sapi', 5000, TRUE, 1),
  ('top_keju',   'Keju parut',  3000, TRUE, 2),
  ('top_sosis',  'Sosis',       4000, TRUE, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO egg_options (id, name, short_name, price, available, sort_order)
VALUES
  ('egg_ceplok_half', 'Ceplok ½ matang', 'Telur ceplok', 4000, TRUE, 1),
  ('egg_dadar',       'Dadar',           'Telur dadar',  4000, TRUE, 2)
ON CONFLICT (id) DO NOTHING;

-- 4. Menu Items
INSERT INTO menu_items (id, name, category, base_price, cogs_estimate, tag, image_url, available, customizable, sort_order)
VALUES
  ('mie_goreng_aceh',   'Indomie Goreng Aceh',    'mie',     12000, 4800, 'laris', '/images/indomie-goreng-aceh.jpg', TRUE,  TRUE,  1),
  ('mie_kuah_soto',     'Indomie Kuah Soto',      'mie',     11000, 4500, NULL,    '/images/indomie-kuah-soto.jpg',   TRUE,  TRUE,  2),
  ('mie_kari_telur',    'Indomie Kari Telur',     'mie',     15000, 6500, NULL,    '/images/indomie-kari-telur.jpg',  TRUE,  TRUE,  3),
  ('mie_rendang_dobel', 'Indomie Rendang Dobel',  'mie',     20000, 8500, NULL,    NULL,                              TRUE,  TRUE,  4),
  ('mie_tektek',        'Mie Tek-tek Spesial',    'mie',     16000, 7000, NULL,    NULL,                              FALSE, TRUE,  5),
  ('mie_seblak',        'Indomie Seblak',         'mie',     14000, 6000, NULL,    NULL,                              TRUE,  TRUE,  6),
  ('nasi_telur_kornet', 'Nasi Telur Kornet',      'nasi',    16000, 7200, 'baru',  '/images/nasi-telur-kornet.jpg',   TRUE,  FALSE, 7),
  ('nasi_ayam_geprek',  'Nasi Ayam Geprek',       'nasi',    18000, 8500, NULL,    NULL,                              TRUE,  FALSE, 8),
  ('nasi_telur_dadar',  'Nasi Telur Dadar',       'nasi',    10000, 4200, NULL,    NULL,                              TRUE,  FALSE, 9),
  ('nasi_sarden',       'Nasi Sarden',            'nasi',    13000, 6000, NULL,    NULL,                              FALSE, FALSE, 10),
  ('minum_es_teh',      'Es Teh Manis Jumbo',     'minum',    5000, 1500, NULL,    NULL,                              TRUE,  FALSE, 11),
  ('minum_nutrisari',   'Es Nutrisari Jeruk',     'minum',    6000, 2200, NULL,    NULL,                              FALSE, FALSE, 12),
  ('minum_susu_jahe',   'Susu Jahe Hangat',       'minum',    7000, 2800, NULL,    NULL,                              TRUE,  FALSE, 13),
  ('kopi_tubruk',       'Kopi Hitam Tubruk',      'kopi',     4000, 1200, NULL,    NULL,                              TRUE,  FALSE, 14),
  ('kopi_susu_aren',    'Kopi Susu Gula Aren',    'kopi',     8000, 3200, NULL,    NULL,                              TRUE,  FALSE, 15),
  ('camilan_bakwan',    'Gorengan Bakwan',        'camilan',  5000, 2000, NULL,    NULL,                              TRUE,  FALSE, 16),
  ('camilan_pisang_bakar', 'Pisang Bakar Keju',   'camilan', 14000, 5500, NULL,    NULL,                              TRUE,  FALSE, 17)
ON CONFLICT (id) DO NOTHING;

-- 5. Dining Tables (Kemang Outlet)
INSERT INTO dining_tables (id, outlet_id, table_number, name, capacity, status, guest_count)
VALUES
  ('tbl_1',  'kemang', '01', 'Meja 01 (Depan)',      4, 'eating',     3),
  ('tbl_2',  'kemang', '02', 'Meja 02 (Tengah)',     2, 'add_order',  2),
  ('tbl_3',  'kemang', '03', 'Meja 03 (Sudut TV)',   4, 'need_bill',  4),
  ('tbl_4',  'kemang', '04', 'Meja 04 (Bar Kasir)',  2, 'available',  0),
  ('tbl_5',  'kemang', '05', 'Lesehan Nobar Utama',  8, 'eating',     6),
  ('tbl_6',  'kemang', '06', 'Meja 06 (Outdoor)',    4, 'eating',     3),
  ('tbl_7',  'kemang', '07', 'Meja 07 (Outdoor)',    4, 'add_order',  2),
  ('tbl_8',  'kemang', '08', 'Meja 08 (Dalam)',      2, 'available',  0),
  ('tbl_9',  'kemang', '09', 'Meja 09 (Dalam)',      4, 'eating',     4),
  ('tbl_10', 'kemang', '10', 'Meja 10 (Depan Bar)',  3, 'need_bill',  3),
  ('tbl_11', 'kemang', '11', 'Meja 11 (Sudut Kiri)', 2, 'eating',     1),
  ('tbl_12', 'kemang', '12', 'Meja 12 (Pintu Masuk)',4, 'available',  0)
ON CONFLICT (id) DO NOTHING;

-- 6. Stock Items (Kemang Outlet)
INSERT INTO stock_items (id, outlet_id, name, stock_group, icon, current_stock, min_stock, capacity, unit, daily_use_estimate, unit_cost)
VALUES
  ('telur',          'kemang', 'Telur ayam',         'Protein',     'egg',       18, 20, 120, 'butir',   16.00, 2100),
  ('indomie-goreng', 'kemang', 'Indomie Goreng',     'Mie instan',  'package',   24, 40, 200, 'bungkus', 22.00, 3100),
  ('es-batu',        'kemang', 'Es batu kristal',    'Minuman',     'snowflake',  6, 10,  40, 'kg',       3.00, 2500),
  ('kornet',         'kemang', 'Kornet sapi',        'Topping',     'beef',       9,  8,  30, 'kaleng',    2.00, 28500),
  ('indomie-soto',   'kemang', 'Indomie Kuah Soto',  'Mie instan',  'package',   64, 40, 200, 'bungkus',  7.00, 3000),
  ('teh',            'kemang', 'Teh celup',          'Minuman',     'coffee',    14,  5,  30, 'box',       1.15, 6800),
  ('gula',           'kemang', 'Gula pasir',         'Bahan dapur', 'wheat',     22,  8,  40, 'kg',       1.45, 17000),
  ('kopi',           'kemang', 'Kopi bubuk',         'Minuman',     'coffee',    12,  4,  24, 'pack',      0.66, 9500)
ON CONFLICT (id) DO NOTHING;

-- 7. Sample Purchase Orders
INSERT INTO purchase_orders (id, outlet_id, supplier_name, items_summary, total_amount, status, eta_label, due_date)
VALUES
  ('PO-0921', 'kemang', 'Toko Sinar Jaya',         'Gula 20 kg, Teh celup 10 box', 408000,  'draft',    'Hari ini',   NULL),
  ('PO-0918', 'kemang', 'CV Sumber Makmur',        'Indomie 4 dus, Telur 5 tray',  1840000, 'ordered',  'Tiba besok', NULL),
  ('PO-0920', 'kemang', 'Agen Es Kristal',         'Es batu 40 kg',                100000,  'ordered',  'Tiba 23:00', NULL),
  ('PO-0915', 'kemang', 'Distributor Minuman Jkt', 'Nutrisari 10 pack, Kopi 12',   2450000, 'received', '',           CURRENT_DATE + INTERVAL '3 days'),
  ('PO-0912', 'kemang', 'Pasar Induk Kramat Jati', 'Cabai, bawang, sawi',          780000,  'received', '',           CURRENT_DATE + INTERVAL '7 days'),
  ('PO-0911', 'kemang', 'CV Sumber Makmur',        'Indomie 6 dus',                1420000, 'paid',     '20 Okt',     NULL),
  ('PO-0909', 'kemang', 'Toko Sinar Jaya',         'Minyak 18 L, gas 3 kg ×4',     690000,  'paid',     '18 Okt',     NULL)
ON CONFLICT (id) DO NOTHING;
