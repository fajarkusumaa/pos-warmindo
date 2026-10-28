-- ============================================================================
-- POS WARMINDO - NEON POSTGRESQL PRODUCTION SCHEMA
-- Scalable Multi-Outlet Point of Sale, Inventory & Owner Dashboard Schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE menu_category AS ENUM ('mie', 'nasi', 'minum', 'kopi', 'camilan');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE menu_tag AS ENUM ('laris', 'baru');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE doneness_level AS ENUM ('Kenyal', 'Lembut', 'Kering');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('open', 'paid', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'qris');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE table_status AS ENUM ('available', 'eating', 'need_bill', 'add_order');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE employee_role AS ENUM ('owner', 'manager', 'kasir', 'juru_masak', 'pelayan');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE shift_type AS ENUM ('pagi', 'sore', 'malam', 'izin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE stock_group AS ENUM ('Protein', 'Mie instan', 'Minuman', 'Topping', 'Bahan dapur');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE stock_movement_type AS ENUM ('purchase_in', 'sale_out', 'waste', 'opname_adjustment', 'transfer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE po_status AS ENUM ('draft', 'ordered', 'received', 'paid', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 2. OUTLETS & BUSINESS PROFILE (Multi-Cabang Ready)
-- ============================================================================
CREATE TABLE IF NOT EXISTS outlets (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'kemang', 'tebet', 'cipete'
    name VARCHAR(120) NOT NULL,                    -- e.g. 'Warmindo 88 — Kemang'
    code VARCHAR(16) UNIQUE NOT NULL,              -- e.g. 'KMG', 'TBT', 'CPT' (for receipt numbering)
    address TEXT NOT NULL,
    whatsapp VARCHAR(32),
    email VARCHAR(120),
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Jakarta',
    opening_hours VARCHAR(64) NOT NULL DEFAULT '24 jam',
    logo_url TEXT,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00, -- PB1 / Pajak Restoran (%)
    receipt_config JSONB NOT NULL DEFAULT '{
        "paperSize": "58mm",
        "printLogo": true,
        "printAddress": true,
        "printWhatsapp": true,
        "printEmail": false,
        "footerText": "Terima kasih sudah mampir di Warmindo 88!"
    }'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. EMPLOYEES, USERS & CASHIER SHIFTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'emp_bs' or UUID
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    name VARCHAR(120) NOT NULL,
    role employee_role NOT NULL DEFAULT 'kasir',
    default_shift shift_type NOT NULL DEFAULT 'pagi',
    pin_hash VARCHAR(255),                         -- Hashed PIN for quick POS login
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(32),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_outlet ON employees(outlet_id) WHERE is_active = TRUE;

-- Tracks cash drawer per shift & cashier performance metrics
CREATE TABLE IF NOT EXISTS cashier_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    employee_id VARCHAR(64) NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    shift shift_type NOT NULL,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    opening_cash INTEGER NOT NULL DEFAULT 0,       -- Modal awal laci kasir (Rp)
    expected_cash INTEGER NOT NULL DEFAULT 0,      -- Perhitungan sistem dari transaksi tunai (Rp)
    actual_cash INTEGER,                           -- Uang fisik saat tutup shift (Rp)
    cash_difference INTEGER GENERATED ALWAYS AS (
        CASE WHEN actual_cash IS NOT NULL THEN actual_cash - expected_cash ELSE NULL END
    ) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shifts_outlet_opened ON cashier_shifts(outlet_id, opened_at DESC);

-- ============================================================================
-- 4. DINING TABLES (Meja Pelanggan)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dining_tables (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'tbl_1'
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    table_number VARCHAR(16) NOT NULL,             -- e.g. '01', '02'
    name VARCHAR(120) NOT NULL,                    -- e.g. 'Meja 01 (Depan)'
    capacity SMALLINT NOT NULL DEFAULT 4,
    status table_status NOT NULL DEFAULT 'available',
    guest_count SMALLINT DEFAULT 0,
    occupied_since TIMESTAMPTZ,                    -- Replaces static elapsedSeconds with accurate timestamp
    active_order_id UUID,                          -- Points to current unpaid dine-in tab if any
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (outlet_id, table_number)
);

CREATE INDEX IF NOT EXISTS idx_tables_outlet_status ON dining_tables(outlet_id, status);

-- ============================================================================
-- 5. MENU CATALOG & CUSTOMIZATIONS (Menu, Topping, Telur)
-- ============================================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'mie_goreng_aceh'
    name VARCHAR(120) NOT NULL,
    category menu_category NOT NULL,
    base_price INTEGER NOT NULL CHECK (base_price >= 0),
    cogs_estimate INTEGER NOT NULL DEFAULT 0,      -- HPP per porsi untuk laporan Laba Rugi akurat
    tag menu_tag,
    image_url TEXT,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    customizable BOOLEAN NOT NULL DEFAULT FALSE,   -- True for 'mie' ("Racik pesanan")
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_category_available ON menu_items(category, available);

-- Per-outlet price or availability override (for scaling to multiple branches)
CREATE TABLE IF NOT EXISTS outlet_menu_overrides (
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(64) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    price_override INTEGER CHECK (price_override >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (outlet_id, menu_item_id)
);

CREATE TABLE IF NOT EXISTS toppings (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'top_kornet'
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS egg_options (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'egg_ceplok_half'
    name VARCHAR(100) NOT NULL,                    -- e.g. 'Ceplok ½ matang'
    short_name VARCHAR(64) NOT NULL,               -- e.g. 'Telur ceplok'
    price INTEGER NOT NULL CHECK (price >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. ORDERS & TRANSACTIONS (Pesanan & Detail Item)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_order_id VARCHAR(64) UNIQUE,            -- Idempotency key for offline-first POS sync
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    shift_id UUID REFERENCES cashier_shifts(id) ON DELETE SET NULL,
    cashier_id VARCHAR(64) REFERENCES employees(id) ON DELETE SET NULL,
    cashier_name_snapshot VARCHAR(120) NOT NULL,   -- Preserved even if employee record changes
    order_number VARCHAR(32) NOT NULL,             -- e.g. 'KMG-20261028-0148'
    order_type order_type NOT NULL DEFAULT 'dine_in',
    table_id VARCHAR(64) REFERENCES dining_tables(id) ON DELETE SET NULL,
    table_number_snapshot VARCHAR(16) NOT NULL,    -- e.g. '01' or 'TA' (Takeaway)
    status order_status NOT NULL DEFAULT 'paid',
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
    tax INTEGER NOT NULL DEFAULT 0 CHECK (tax >= 0),
    total INTEGER NOT NULL CHECK (total >= 0),
    payment_method payment_method NOT NULL,
    cash_received INTEGER,
    change_amount INTEGER,
    checkout_duration_seconds SMALLINT,            -- Tracks cashier speed (e.g. avg 38s in owner panel)
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (outlet_id, order_number)
);

-- High-performance composite indexes for Owner Dashboard & Reports
CREATE INDEX IF NOT EXISTS idx_orders_outlet_created ON orders(outlet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_outlet_status_paid ON orders(outlet_id, status, paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_cashier_created ON orders(cashier_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(64) REFERENCES menu_items(id) ON DELETE SET NULL,
    menu_item_name_snapshot VARCHAR(120) NOT NULL, -- Snapshot so historical receipts never break
    category_snapshot menu_category NOT NULL,
    base_price_snapshot INTEGER NOT NULL,
    quantity SMALLINT NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0), -- Base + Egg + Toppings
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),     -- unit_price * quantity
    -- Customization fields ("Racik Pesanan")
    doneness doneness_level,
    spiciness_level SMALLINT CHECK (spiciness_level BETWEEN 0 AND 5),
    egg_option_id VARCHAR(64) REFERENCES egg_options(id) ON DELETE SET NULL,
    egg_name_snapshot VARCHAR(64),
    egg_price_snapshot INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item ON order_items(menu_item_id);

CREATE TABLE IF NOT EXISTS order_item_toppings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    topping_id VARCHAR(64) REFERENCES toppings(id) ON DELETE SET NULL,
    topping_name_snapshot VARCHAR(100) NOT NULL,
    price_snapshot INTEGER NOT NULL CHECK (price_snapshot >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_item_toppings_item ON order_item_toppings(order_item_id);

-- ============================================================================
-- 7. INVENTORY, STOCK MOVEMENTS & PURCHASE ORDERS (Inventori & Pembelian)
-- ============================================================================
CREATE TABLE IF NOT EXISTS stock_items (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'telur', 'indomie-goreng'
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    stock_group stock_group NOT NULL,
    icon VARCHAR(32) NOT NULL DEFAULT 'package',   -- 'egg' | 'package' | 'snowflake' | 'beef' | 'coffee' | 'wheat'
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    min_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    capacity NUMERIC(10, 2) NOT NULL DEFAULT 100,
    unit VARCHAR(32) NOT NULL,                     -- 'butir', 'bungkus', 'kg', 'kaleng', 'box', 'pack'
    daily_use_estimate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit_cost INTEGER NOT NULL DEFAULT 0,          -- Harga beli per unit (Rp)
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_items_outlet_group ON stock_items(outlet_id, stock_group);

-- Resep / Bill of Materials (Optional auto-deduct stock when menu/topping is sold)
CREATE TABLE IF NOT EXISTS menu_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id VARCHAR(64) REFERENCES menu_items(id) ON DELETE CASCADE,
    topping_id VARCHAR(64) REFERENCES toppings(id) ON DELETE CASCADE,
    egg_option_id VARCHAR(64) REFERENCES egg_options(id) ON DELETE CASCADE,
    stock_item_id VARCHAR(64) NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
    quantity_used NUMERIC(10, 3) NOT NULL CHECK (quantity_used > 0),
    CHECK (
        (menu_item_id IS NOT NULL)::int +
        (topping_id IS NOT NULL)::int +
        (egg_option_id IS NOT NULL)::int = 1
    )
);

-- Audit log for every stock change (prevents fraud / unexplained shrinkage)
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    stock_item_id VARCHAR(64) NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
    movement_type stock_movement_type NOT NULL,
    quantity_delta NUMERIC(10, 2) NOT NULL,        -- Positive for IN, Negative for OUT
    stock_after NUMERIC(10, 2) NOT NULL,
    reference_id VARCHAR(64),                      -- Order ID or PO ID
    performed_by VARCHAR(64) REFERENCES employees(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_item_created ON stock_movements(stock_item_id, created_at DESC);

-- Purchase Orders (Pembelian Bahan ke Supplier)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id VARCHAR(32) PRIMARY KEY,                    -- e.g. 'PO-0921'
    outlet_id VARCHAR(64) NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    supplier_name VARCHAR(160) NOT NULL,
    items_summary TEXT NOT NULL,                   -- e.g. 'Indomie 4 dus, Telur 5 tray'
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    status po_status NOT NULL DEFAULT 'draft',
    eta_label VARCHAR(64),                         -- e.g. 'Hari ini', 'Tiba besok'
    due_date DATE,                                 -- For 'received' orders with payment terms (hutang jatuh tempo)
    ordered_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_by VARCHAR(64) REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_po_outlet_status ON purchase_orders(outlet_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id VARCHAR(32) NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    stock_item_id VARCHAR(64) REFERENCES stock_items(id) ON DELETE SET NULL,
    item_name VARCHAR(120) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(32) NOT NULL,
    unit_cost INTEGER NOT NULL CHECK (unit_cost >= 0),
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0)
);
