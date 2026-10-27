# SCREENS.md — Screen Inventory for Pen.dev (POS Warmindo & Warkop)

This document specifies the exact screen blueprints, container hierarchy, layout parameters, and content for generating the POS Warmindo canvas in `pen.dev`.

---

## Screen 1: Kasir POS Register (Tablet Landscape / Desktop POS)
- **Frame Name**: `Screen / Kasir / Register`
- **Viewport**: `1280px × 800px` (Horizontal Split Layout)
- **Background**: `$--ground` (`#f8f8f8`)
- **Clip**: `true`

### 1.1 Top App Bar (Header)
- **Dimensions**: `1280px × 56px`, horizontal layout, `padding: 0 20px`, `fill: $--surface`, `borderBottom: 1px solid $--border`
- **Left Group**:
  - Store Logo / Brand: Text `"WARMINDO 88"`, `fs: 18px`, `weight: 700`, `fill: $--text`
  - Outlet Pill: `fill: $--raised`, `radius: 4px`, `padding: 4px 8px`, Text `"Outlet Kemang • Shift Pagi"`, `fs: 12px`, `fill: $--muted`
- **Right Group**:
  - Bluetooth Printer Badge: Icon `printer` (lucide, 16px), Text `"Thermal 58mm: Terhubung"`, `fill: $--positive`, `bg: $--positive-bg`, `radius: 4px`, `padding: 4px 10px`
  - Cashier Profile: Icon `user` (16px), Text `"Budi (Kasir)"`, `fs: 13px`, `weight: 500`
  - Lock / Logout Button: Icon `lock` (16px), `size: 36px × 36px`

### 1.2 Catalog Panel (Left / Center Column)
- **Dimensions**: `840px × 744px`, vertical layout, `padding: 16px 20px`, `gap: 16px`
- **Category Filter Chips (Horizontal Row)**:
  - Height `38px`, `gap: 8px`
  - Chips:
    - `"Semua Menu (38)"` -> Active (`bg: $--accent`, text: `#ffffff`, `radius: 6px`)
    - `"Indomie Kuah (10)"` -> Inactive (`bg: $--surface`, `border: 1px solid $--border`, text: `$--text`)
    - `"Indomie Goreng (8)"`
    - `"Minuman Dingin (12)"`
    - `"Kopi & Teh Panas (8)"`
    - `"Gorengan & Ekstra (10)"`
- **Product Grid**:
  - Layout: Grid 4 columns, `gap: 12px`
  - Item Cards (Height `140px`, `bg: $--surface`, `border: 1px solid $--border`, `radius: 8px`, `padding: 12px`):
    - Card 1: Title `"Indomie Goreng Aceh"`, Category `"Goreng"`, Price `"Rp 12.000"` (`weight: 700`, `tabular-nums`), Badge `"Populer"`
    - Card 2: Title `"Indomie Soto Spesial"`, Category `"Kuah"`, Price `"Rp 11.000"`, Badge `"Pedas"`
    - Card 3: Title `"Indomie Kari Ayam Telur"`, Category `"Kuah"`, Price `"Rp 15.000"`
    - Card 4: Title `"Es Teh Manis Jumbo"`, Category `"Minuman"`, Price `"Rp 5.000"`
    - Card 5: Title `"Kopi Hitam Tubruk"`, Category `"Minuman"`, Price `"Rp 4.000"`
    - Card 6: Title `"Es Nutrisari Jeruk Peras"`, Category `"Minuman"`, Price `"Rp 6.000"`
    - Card 7: Title `"Gorengan Bakwan (3 pcs)"`, Category `"Ekstra"`, Price `"Rp 5.000"`
    - Card 8: Title `"Pisang Bakar Coklat Keju"`, Category `"Snack"`, Price `"Rp 14.000"`

### 1.3 Active Order Cart (Right Column)
- **Dimensions**: `440px × 744px`, vertical layout, `bg: $--surface`, `borderLeft: 1px solid $--border`
- **Order Header**:
  - Title `"Pesanan Meja / Antrean"`, Dropdown `"Meja 04"`, Order Number `"#ORD-092"` (`font: Geist Mono`)
- **Cart Items List (Scrollable Area)**:
  - Row 1:
    - Title `"1x Indomie Goreng Aceh"`, Price `"Rp 12.000"`
    - Modifiers Subtext: `"+ Telur Ceplok ½ Matang (Rp 4.000), + Cabai Rawit (5)"`
    - Item Subtotal: `"Rp 16.000"`
    - Stepper: `[-] [1] [+]`
  - Row 2:
    - Title `"2x Es Teh Manis Jumbo"`, Price `"Rp 10.000"`
    - Modifiers Subtext: `"Kurang Manis, Es Banyak"`
    - Stepper: `[-] [2] [+]`
  - Row 3:
    - Title `"1x Gorengan Bakwan (3 pcs)"`, Price `"Rp 5.000"`
    - Stepper: `[-] [1] [+]`
- **Pricing & Payment Summary Box**:
  - Divider `1px solid $--rule`
  - Line: `"Subtotal"` -> `"Rp 31.000"`
  - Line: `"Diskon"` -> `"- Rp 0"`
  - Line: `"Total Tagihan"` -> `"Rp 31.000"` (`fs: 22px`, `weight: 700`, `fill: $--text`)
- **Quick Cash Amount Chips**:
  - Horizontal Grid 4 buttons: `["Uang Pas", "Rp 35.000", "Rp 50.000", "Rp 100.000"]`
- **Primary Action Buttons**:
  - Button Row (`gap: 10px`, height `48px`):
    - Button QRIS: Outlined, Icon `qr-code`, Text `"Bayar QRIS"`
    - Button Tunai: Solid near-black (`bg: $--accent`), Icon `receipt`, Text `"Bayar Tunai & Cetak"`

---

## Screen 2: Modal Fast-Order Customizer (Topping & Level Pedas)
- **Frame Name**: `Modal / Topping Customizer`
- **Viewport**: `480px × 620px` (Centered Dialog Card)
- **Background**: `$--surface`, `border: 1px solid $--border`, `radius: 10px`, `shadow: 0 20px 25px -5px rgba(0,0,0,0.1)`

### Structure
1. **Modal Header**:
   - Title `"Kustomisasi: Indomie Goreng"`, Subtitle `"Pilih kematangan, racikan telur, dan ekstra topping"`
   - Close Button (Icon `x`, 18px)
2. **Section 1: Tingkat Kematangan & Kuah**:
   - Segmented Radio Group: `[Kenyal (Standar)]`, `[Matang Lembut]`, `[Kering / Tanpa Kuah]`
3. **Section 2: Racikan Telur**:
   - Chips Multi-select with pricing:
     - `Telur Ceplok (+Rp 4.000)` (Selected)
     - `Telur Dadar (+Rp 4.000)`
     - `Telur Rebus Setengah Matang (+Rp 4.000)`
     - `Campur di Kuah (+Rp 4.000)`
4. **Section 3: Ekstra Topping**:
   - Checkbox items:
     - `[✓] Kornet Sapi Manis (+Rp 5.000)`
     - `[✓] Keju Parut Kraft (+Rp 3.000)`
     - `[ ] Sosis Sapi Bakar (+Rp 4.000)`
     - `[ ] Bakso Sapi 2 butir (+Rp 4.000)`
5. **Section 4: Tingkat Kepedasan (Cabai Rawit)**:
   - Stepper: `Cabai Rawit: [-] 5 Biji [+]` (Level Sedang)
6. **Footer Action**:
   - Total Line: `"Tambah ke Pesanan — Rp 24.000"` (Solid Black Button, height `44px`)

---

## Screen 3: Modal Pembayaran & Kembalian (Cash Completed)
- **Frame Name**: `Modal / Kasir / Kembalian Selesai`
- **Viewport**: `420px × 520px`
- **Background**: `$--surface`, `radius: 10px`, `border: 1px solid $--border`

### Structure
1. **Status Icon**:
   - Circle Badge `48px`, `bg: $--positive-bg`, Icon `check` (`fill: $--positive`, 24px)
   - Title `"Transaksi Berhasil!"`, `fs: 20px`, `weight: 700`
   - Subtitle `"No. Struk #WMD-20261027-042"` (`font: Geist Mono`)
2. **Kalkulasi Kembalian (Highlight Card)**:
   - `bg: $--ground`, `border: 1px solid $--border`, `radius: 8px`, `padding: 16px`
   - Label `"TOTAL TAGIHAN"`: `"Rp 31.000"`
   - Label `"UANG DITERIMA"`: `"Rp 50.000"` (Tunai)
   - Divider `1px dashed $--border`
   - Label `"UANG KEMBALIAN"`: `"Rp 19.000"` (`fs: 28px`, `weight: 700`, `fill: $--positive`, `tabular-nums`)
3. **Action List**:
   - Button `"Cetak Ulang Struk"` (Icon `printer`, outlined)
   - Button `"Kirim Bukti via WhatsApp"` (Icon `message-circle`, outlined)
   - Button Primary `"Transaksi Baru (Enter)"` (`bg: $--accent`, text: white, height `46px`)

---

## Screen 4: Owner Analytics Dashboard (Desktop Viewport)
- **Frame Name**: `Screen / Owner / Dashboard`
- **Viewport**: `1440px × 900px` (Sidebar + Main Content Layout)
- **Background**: `$--ground` (`#f8f8f8`)

### 4.1 Icon Rail Sidebar (Left)
- **Dimensions**: `64px × 900px`, vertical layout, `bg: $--surface`, `borderRight: 1px solid $--border`
- **Top Brand**: Box `40px × 40px`, `bg: $--accent`, Text `"W"`, white
- **Navigation Icons** (36px buttons, Lucide):
  - `layout-dashboard` -> Active (`fill: $--accent`, indicator bar 2px)
  - `shopping-cart` -> Register view
  - `book-open` -> Manajemen Menu
  - `bar-chart-2` -> Laporan Penjualan
  - `settings` -> Pengaturan Outlet & Lisensi
- **Bottom**: User avatar with initial `"O"` (Owner)

### 4.2 Main Analytics Canvas
- **Dimensions**: `1376px × 900px`, vertical layout, `padding: 24px 32px`, `gap: 20px`

#### Header Bar
- Title `"Dashboard Analitik Bisnis"`, Meta `"Ringkasan performa penjualan Warmindo 88"`
- Right Controls:
  - Time Range Selector: Segmented Button `[Hari Ini] [7 Hari] [Bulan Ini] [Tahun 2026]`
  - Button Export: Icon `download`, Text `"Ekspor Laporan (Excel / PDF)"`, Outlined

#### 4.3 KPI Cards Row (4 Cards across 1312px)
- `gap: 16px`, Height `104px`, Card: `bg: $--surface`, `border: 1px solid $--border`, `radius: 8px`, `padding: 16px`
  - Card 1: Label `"OMSET HARI INI"`, Value `"Rp 3.420.000"`, Indicator `"+14.2% vs kemarin"` (`fill: $--positive`)
  - Card 2: Label `"TOTAL TRANSAKSI"`, Value `"148 Struk"`, Indicator `"+8 struk vs rata-rata"`
  - Card 3: Label `"RATA-RATA TRANSAKSI"`, Value `"Rp 23.108"`, Indicator `"-2.1%"`
  - Card 4: Label `"MENU PALING LARIS"`, Value `"Indomie Gr. Spesial"`, Subtext `"54 porsi terjual"`

#### 4.4 Main Chart Card (Hourly Turnover Trend)
- `height: 320px`, `bg: $--surface`, `border: 1px solid $--border`, `radius: 8px`, `padding: 20px`
- Card Header: Title `"Tren Omset Penjualan Jam ke Jam"`, Legend `"— Hari Ini"` (Ink `#141414`), `"-- Kemarin"` (Muted `#8a8a8a`)
- Chart View:
  - 4 horizontal hairline gridlines (`#e6e6e6`) with Y-ticks: `0`, `500rb`, `1jt`, `1.5jt`
  - Highlighting peak hours at `12:00 - 14:00` (Makan Siang) and `20:00 - 00:00` (Nongkrong Malam)
  - Key focus dot at `21:00 (Rp 640.000)` highlighted with `$--chart-primary` (`#1d5fbf`)

#### 4.5 Bottom Split Section (2 Columns, 1:1)
- **Column Left: Tabel 5 Menu Terlaris (Best Seller)**:
  - Card `bg: $--surface`, `border: 1px solid $--border`, `radius: 8px`, `padding: 16px`
  - Header: `"5 Menu Terlaris (Qty & Omset)"`
  - Table Rows (`height: 40px` each, alternating light rule):
    1. `"Indomie Goreng Telur Kornet"` | `"Kuah/Goreng"` | `54 porsi` | `"Rp 1.080.000"`
    2. `"Es Teh Manis Jumbo"` | `"Minuman"` | `112 gelas` | `"Rp 560.000"`
    3. `"Indomie Kuah Kari Ayam"` | `"Kuah"` | `38 porsi` | `"Rp 570.000"`
    4. `"Gorengan Bakwan Aneka"` | `"Snack"` | `85 pcs` | `"Rp 170.000"`
    5. `"Kopi Hitam Tubruk"` | `"Minuman"` | `42 cangkir` | `"Rp 168.000"`
- **Column Right: Distribusi Pembayaran & Perangkat**:
  - Card `bg: $--surface`, `border: 1px solid $--border`, `radius: 8px`, `padding: 16px`
  - Header: `"Metode Pembayaran & Kasir Aktif"`
  - Summary Bars:
    - Tunai: `68% (Rp 2.325.600)` — bar ink `#141414`
    - QRIS: `32% (Rp 1.094.400)` — bar accent `#1d5fbf`
  - Shift Kasir:
    - `"Shift Pagi: Budi (Rp 1.450.000 / 62 struk)"`
    - `"Shift Malam: Anton (Rp 1.970.000 / 86 struk)"`

---

## Screen 5: Konfigurasi Printer Bluetooth Thermal (Hardware Settings)
- **Frame Name**: `Screen / Hardware / Printer Thermal`
- **Viewport**: `680px × 560px`
- **Background**: `$--surface`, `radius: 8px`, `border: 1px solid $--border`, `padding: 24px`

### Structure
1. Header: Icon `printer` (22px), Title `"Koneksi Printer Bluetooth Thermal"`, Subtitle `"Pilih dan uji coba printer cetak struk kasir"`
2. **Device Discovery List**:
   - Item 1 (Connected):
     - Name `"RPP02N-Thermal-58"`, MAC `"66:32:B1:4C:90:11"`, Status `"Terhubung"` (Pill green)
     - Action Button `"Putuskan"`
   - Item 2:
     - Name `"Zjiang-5805DD"`, MAC `"11:22:33:44:55:66"`, Status `"Tersedia"`
     - Action Button `"Pasangkan"`
3. **Paper Size Selection**:
   - Radio Option 1: `58mm (32 Karakter per baris)` -> Recommended
   - Radio Option 2: `80mm (48 Karakter per baris)`
4. **Struk Options**:
   - Toggle: `[✓] Cetak Logo Toko`
   - Toggle: `[✓] Cetak Alamat & Nomor Telepon`
   - Toggle: `[✓] Cetak Rincian Topping di Bawah Menu`
   - Input: Footer Note `"Terima Kasih, Ditunggu Kedatangannya Kembali!"`
5. **Footer Actions**:
   - Button Outlined `"Cetak Halaman Uji (Test Print)"`
   - Button Solid `"Simpan Konfigurasi"`

---

## Screen 6: Mobile Kasir Fast-Order (Smartphone Viewport)
- **Frame Name**: `Screen / Mobile / Kasir`
- **Viewport**: `390px × 844px` (iPhone 14 / Android Standard)
- **Background**: `$--ground` (`#f8f8f8`)
- **Clip**: `true`

### Structure
1. **Compact Top Bar (52px)**:
   - Left: Title `"WARMINDO 88"`, Subtitle `"Kasir"`
   - Right: Bluetooth Icon (Active dot), Shopping Bag Badge `[4 items]`
2. **Search & Category Horizontal Chips (44px)**:
   - Search input `"Cari menu..."`
   - Chips: `[Semua] [Goreng] [Kuah] [Minuman] [Topping]`
3. **Menu Item List (Cards, 2-Column)**:
   - Compact cards with Title, Price, and Quick Add `[+]` button
4. **Sticky Bottom Order Bar (64px)**:
   - Left: `"4 Items • Rp 46.000"` (`font: Geist Mono`, `weight: 700`)
   - Right: Primary Button `"Bayar (Tunai/QRIS) →"`, `bg: $--accent`, text: white
