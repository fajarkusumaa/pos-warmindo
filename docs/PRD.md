# PRD / Spec: Sistem Kasir & Manajemen Usaha Warmindo / Warkop (POS Warmindo)

## Problem Statement

Sektor usaha Warung Makan Indomie (Warmindo) dan Warung Kopi (Warkop) memiliki volume transaksi harian tinggi dengan variasi pesanan dinamis (custom racikan mie, aneka minuman kopi/teh, topping tambahan). Saat ini, pencatatan transaksi manual menyebabkan:
1. Antrean dan pencatatan kasir yang lambat saat jam ramai.
2. Kesulitan kalkulasi harga dan kembalian secara cepat dan akurat.
3. Ketidaksesuaian rekap kas dan inventaris/item terjual.
4. Pemilik (owner) kesulitan memantau omset, tren performa penjualan harian/bulanan/tahunan, dan produk terlaris secara realtime.
5. Ketiadaan batasan hak akses yang jelas antara kasir operasional dan pemilik usaha.

## Solution

Sistem Point of Sales (POS) multi-platform (Android & Web) yang terintegrasi, cepat, dan ringan:
1. Antarmuka fast-order kasir dengan katalog visual interaktif, dukungan pemilihan varian/topping, kalkulator kembalian otomatis, dan metode pembayaran fleksibel (Tunai & QRIS).
2. Cetak struk instan berbasis driver Bluetooth ESC/POS universal (58mm & 80mm).
3. Pemisahan peran yang tegas antara Kasir (hanya transaksi & cetak struk) dan Owner (akses laporan finansial, analitik, manajemen produk/harga, akun kasir).
4. Laporan periodik otomatis (Harian, Bulanan, Tahunan) dan analitik grafik visual dashboard, serta analisis item terlaris (Best Seller) yang dapat diekspor ke format Excel dan PDF.
5. Arsitektur lisensi yang mendukung skema langganan bulanan (SaaS) maupun pembelian hak pakai seumur hidup (Lifetime / Beli Putus).

## User Stories

### Modul Autentikasi & Otorisasi Peran
1. As an Owner, I want to log in with secure credentials, so that I can access operational analytics and system management securely.
2. As a Cashier, I want to log in with a dedicated cashier PIN or username/password, so that I can handle shift transactions without exposing managerial data.
3. As an Owner, I want to create, update, and deactivate Cashier accounts, so that I can control who has access to the POS cash register.
4. As an Owner, I want the system to restrict Cashiers from viewing profit margins, turnover analytics, and price configuration, so that sensitive business financials remain confidential.

### Modul Kasir & Fast-Order
5. As a Cashier, I want to see a visual grid/catalog of menu items with photos/icons and color coding, so that I can quickly select items during peak rush hours.
6. As a Cashier, I want to customize an item with toppings and add-ons (e.g., telur setengah matang/matang, kornet, keju, ekstra cabai/sawian) upon order entry, so that customer-specific Warmindo custom orders are accurately priced and recorded.
7. As a Cashier, I want to adjust quantities, remove items, or add notes per item directly in the active order cart, so that customer special requests are clearly captured.
8. As a Cashier, I want the system to calculate subtotal, discounts (if any), taxes (if configured), and grand total automatically in real-time, so that human calculation errors are eliminated.
9. As a Cashier, I want to select payment methods between Tunai (Cash) and QRIS, so that I can accommodate customer payment preferences.
10. As a Cashier, I want to input the cash received amount and have the system calculate change immediately, so that I can hand back exact change without mental math.
11. As a Cashier, I want to complete a transaction and immediately trigger a receipt print to a Bluetooth thermal printer, so that the customer receives their order slip promptly.
12. As a Cashier, I want the option to reprint the latest receipt, so that I can handle printer paper jams or customer reprint requests.
13. As a Cashier, I want to clear or void an active draft cart before checkout, so that accidental order entries do not pollute transactions.

### Modul Konektivitas Printer Thermal Bluetooth
14. As a Cashier or Owner, I want to scan and pair with nearby Bluetooth thermal printers directly within the app, so that the hardware setup is frictionless.
15. As an Owner, I want to configure printer paper sizes between 58mm and 80mm standard formats, so that receipt layouts adapt properly to various printer hardware models.
16. As a Cashier, I want the thermal receipt layout to include store header, receipt ID, cashier name, date/time, detailed item list with topping breakdown, payment breakdown, and thank you footer, so that receipts are clear and professional.

### Modul Manajemen Menu & Penetapan Harga
17. As an Owner, I want to create, edit, and categorize menu items (e.g., Mie Instan, Minuman Dingin/Panas, Gorengan, Nasi/Lauk), so that the catalog remains well-organized.
18. As an Owner, I want to set base prices and topping prices for each menu item, so that pricing updates are instantly reflected at the cash register.
19. As an Owner, I want to mark menu items as available or out-of-stock, so that cashiers do not sell unavailable items.

### Modul Laporan & Analitik Bisnis
20. As an Owner, I want to view a real-time executive dashboard summarizing daily turnover, total transaction count, and average order value, so that I have immediate visibility into today's performance.
21. As an Owner, I want to view visual interactive charts showing daily turnover trends, monthly fluctuations, and year-over-year sales performance, so that I can analyze growth patterns.
22. As an Owner, I want to view a Best Seller analysis ranking items sold by quantity and gross revenue across daily, monthly, and yearly intervals, so that I know which products drive the most revenue.
23. As an Owner, I want to filter and generate sales summary reports across custom date ranges, so that I can perform specific financial reconciliations.
24. As an Owner, I want to export periodic transaction and turnover reports to Excel (.xlsx) and PDF formats, so that I can archive or share records with accounting partners.

### Modul Lisensi & Multi-Tenancy (SaaS vs Beli Putus)
25. As a SaaS Subscriber Owner, I want my subscription status, automated cloud backups, and updates to be tracked and verified seamlessly, so that my outlet runs without disruption while staying current.
26. As a Lifetime Licensee Owner, I want the app to operate with full whitelabel/offline capability without requiring recurring monthly billing verifications, so that my one-time purchase investment is honored.

## Implementation Decisions

- **Client Application**: Cross-platform client supporting Android (tablets and handheld POS smartphones) and responsive Web browser.
- **Local Persistence & Offline Resilience**: Local database storage (e.g., SQLite / WatermelonDB / IndexedDB) for fast local operations, offline order recording, and seamless background sync with cloud backend.
- **Thermal Printing Protocol**: Universal ESC/POS command generator module decoupling receipt formatting from specific printer manufacturer SDKs, supporting both 58mm (32 chars/line) and 80mm (48 chars/line) standards.
- **Authentication & RBAC**: JWT-based or session-based authentication enforcing role boundaries (`owner` vs `cashier`) on both client UI routing and backend endpoints.
- **Reporting Engine**: Server/client aggregation pipeline for time-series sales summaries (daily, monthly, yearly) and tabular reporting with XLSX/PDF generation capabilities.
- **Topping & Modifiers Data Structure**: Hierarchical order item schema: each order item encapsulates parent item reference, base price, selected variant, list of selected add-on toppings with incremental costs, and item-level notes.
- **Licensing Engine**: Modular license entitlement module capable of toggling between SaaS heartbeat verification mode and standalone Lifetime offline verification mode.

## Testing Decisions

- **Testing Principle**: Tests must evaluate external behavior at the highest possible boundary rather than inspecting internal implementation details.
- **Primary Seam**: High-level application controller / use-case workflow seam (e.g., executing a checkout transaction from cart preparation to payment calculation, receipt generation payload, and inventory/sales log creation).
- **Secondary Seam**: Universal ESC/POS receipt generation engine tested against byte outputs for standard 58mm/80mm layouts.
- **Prior Art / Target Seams**: End-to-end integration tests using mock repositories / memory stores, verifying that role guards reject cashier attempts to access owner endpoints and reports.

## Out of Scope

- Kitchen Display System (KDS) hardware integrations.
- Multi-branch centralized franchise warehouse supply chain management (focus is single-outlet / Warmindo-Warkop branch).
- Online food delivery aggregator integrations (e.g., GoFood / GrabFood / ShopeeFood API direct sync).
- Direct EDC bank card processing integration (payments focus on Cash and dynamic/static QRIS).

## Further Notes

- Source reference: `docs/Proposal_Aplikasi_POS_Warmindo_Warkop.docx`.
- The system must prioritize high checkout speed: minimum taps required to execute an order during peak rush hours.
