import {
  pgTable,
  pgEnum,
  varchar,
  text,
  integer,
  smallint,
  boolean,
  numeric,
  timestamp,
  date,
  uuid,
  jsonb,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// ============================================================================
// 1. ENUMS
// ============================================================================
export const menuCategoryEnum = pgEnum('menu_category', ['mie', 'nasi', 'minum', 'kopi', 'camilan']);
export const menuTagEnum = pgEnum('menu_tag', ['laris', 'baru']);
export const donenessLevelEnum = pgEnum('doneness_level', ['Kenyal', 'Lembut', 'Kering']);
export const orderTypeEnum = pgEnum('order_type', ['dine_in', 'takeaway']);
export const orderStatusEnum = pgEnum('order_status', ['open', 'paid', 'cancelled', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'qris']);
export const tableStatusEnum = pgEnum('table_status', ['available', 'eating', 'need_bill', 'add_order']);
export const employeeRoleEnum = pgEnum('employee_role', ['owner', 'manager', 'kasir', 'juru_masak', 'pelayan']);
export const shiftTypeEnum = pgEnum('shift_type', ['pagi', 'sore', 'malam', 'izin']);
export const stockGroupEnum = pgEnum('stock_group', ['Protein', 'Mie instan', 'Minuman', 'Topping', 'Bahan dapur']);
export const stockMovementTypeEnum = pgEnum('stock_movement_type', [
  'purchase_in',
  'sale_out',
  'waste',
  'opname_adjustment',
  'transfer',
]);
export const poStatusEnum = pgEnum('po_status', ['draft', 'ordered', 'received', 'paid', 'cancelled']);

// ============================================================================
// 2. OUTLETS & BUSINESS PROFILE
// ============================================================================
export const outlets = pgTable('outlets', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  code: varchar('code', { length: 16 }).notNull().unique(),
  address: text('address').notNull(),
  whatsapp: varchar('whatsapp', { length: 32 }),
  email: varchar('email', { length: 120 }),
  timezone: varchar('timezone', { length: 64 }).notNull().default('Asia/Jakarta'),
  openingHours: varchar('opening_hours', { length: 64 }).notNull().default('24 jam'),
  logoUrl: text('logo_url'),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).notNull().default('10.00'),
  receiptConfig: jsonb('receipt_config')
    .notNull()
    .default({
      paperSize: '58mm',
      printLogo: true,
      printAddress: true,
      printWhatsapp: true,
      printEmail: false,
      footerText: 'Terima kasih sudah mampir di Warmindo 88!',
    }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// 3. EMPLOYEES & CASHIER SHIFTS
// ============================================================================
export const employees = pgTable(
  'employees',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 120 }).notNull(),
    role: employeeRoleEnum('role').notNull().default('kasir'),
    defaultShift: shiftTypeEnum('default_shift').notNull().default('pagi'),
    pinHash: varchar('pin_hash', { length: 255 }),
    email: varchar('email', { length: 120 }).unique(),
    phone: varchar('phone', { length: 32 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_employees_outlet').on(table.outletId)],
);

export const cashierShifts = pgTable(
  'cashier_shifts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'restrict' }),
    employeeId: varchar('employee_id', { length: 64 })
      .notNull()
      .references(() => employees.id, { onDelete: 'restrict' }),
    shift: shiftTypeEnum('shift').notNull(),
    openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    openingCash: integer('opening_cash').notNull().default(0),
    expectedCash: integer('expected_cash').notNull().default(0),
    actualCash: integer('actual_cash'),
    cashDifference: integer('cash_difference'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_shifts_outlet_opened').on(table.outletId, table.openedAt)],
);

// ============================================================================
// 4. DINING TABLES
// ============================================================================
export const diningTables = pgTable(
  'dining_tables',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'cascade' }),
    tableNumber: varchar('table_number', { length: 16 }).notNull(),
    name: varchar('name', { length: 120 }).notNull(),
    capacity: smallint('capacity').notNull().default(4),
    status: tableStatusEnum('status').notNull().default('available'),
    guestCount: smallint('guest_count').default(0),
    occupiedSince: timestamp('occupied_since', { withTimezone: true }),
    activeOrderId: uuid('active_order_id'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_tables_outlet_number').on(table.outletId, table.tableNumber),
    index('idx_tables_outlet_status').on(table.outletId, table.status),
  ],
);

// ============================================================================
// 5. MENU CATALOG & CUSTOMIZATIONS
// ============================================================================
export const menuItems = pgTable(
  'menu_items',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    category: menuCategoryEnum('category').notNull(),
    basePrice: integer('base_price').notNull(),
    cogsEstimate: integer('cogs_estimate').notNull().default(0),
    tag: menuTagEnum('tag'),
    imageUrl: text('image_url'),
    available: boolean('available').notNull().default(true),
    customizable: boolean('customizable').notNull().default(false),
    sortOrder: smallint('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_menu_category_available').on(table.category, table.available)],
);

export const outletMenuOverrides = pgTable(
  'outlet_menu_overrides',
  {
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'cascade' }),
    menuItemId: varchar('menu_item_id', { length: 64 })
      .notNull()
      .references(() => menuItems.id, { onDelete: 'cascade' }),
    priceOverride: integer('price_override'),
    available: boolean('available').notNull().default(true),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.outletId, table.menuItemId] })],
);

export const toppings = pgTable('toppings', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  price: integer('price').notNull(),
  available: boolean('available').notNull().default(true),
  sortOrder: smallint('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const eggOptions = pgTable('egg_options', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  shortName: varchar('short_name', { length: 64 }).notNull(),
  price: integer('price').notNull(),
  available: boolean('available').notNull().default(true),
  sortOrder: smallint('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// 6. ORDERS & TRANSACTIONS
// ============================================================================
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clientOrderId: varchar('client_order_id', { length: 64 }).unique(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'restrict' }),
    shiftId: uuid('shift_id').references(() => cashierShifts.id, { onDelete: 'set null' }),
    cashierId: varchar('cashier_id', { length: 64 }).references(() => employees.id, { onDelete: 'set null' }),
    cashierNameSnapshot: varchar('cashier_name_snapshot', { length: 120 }).notNull(),
    orderNumber: varchar('order_number', { length: 32 }).notNull(),
    orderType: orderTypeEnum('order_type').notNull().default('dine_in'),
    tableId: varchar('table_id', { length: 64 }).references(() => diningTables.id, { onDelete: 'set null' }),
    tableNumberSnapshot: varchar('table_number_snapshot', { length: 16 }).notNull(),
    status: orderStatusEnum('status').notNull().default('paid'),
    subtotal: integer('subtotal').notNull(),
    discount: integer('discount').notNull().default(0),
    tax: integer('tax').notNull().default(0),
    total: integer('total').notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    cashReceived: integer('cash_received'),
    changeAmount: integer('change_amount'),
    checkoutDurationSeconds: smallint('checkout_duration_seconds'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp('paid_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_orders_outlet_number').on(table.outletId, table.orderNumber),
    index('idx_orders_outlet_created').on(table.outletId, table.createdAt),
    index('idx_orders_outlet_status_paid').on(table.outletId, table.status, table.paidAt),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    menuItemId: varchar('menu_item_id', { length: 64 }).references(() => menuItems.id, { onDelete: 'set null' }),
    menuItemNameSnapshot: varchar('menu_item_name_snapshot', { length: 120 }).notNull(),
    categorySnapshot: menuCategoryEnum('category_snapshot').notNull(),
    basePriceSnapshot: integer('base_price_snapshot').notNull(),
    quantity: smallint('quantity').notNull(),
    unitPrice: integer('unit_price').notNull(),
    subtotal: integer('subtotal').notNull(),
    doneness: donenessLevelEnum('doneness'),
    spicinessLevel: smallint('spiciness_level'),
    eggOptionId: varchar('egg_option_id', { length: 64 }).references(() => eggOptions.id, { onDelete: 'set null' }),
    eggNameSnapshot: varchar('egg_name_snapshot', { length: 64 }),
    eggPriceSnapshot: integer('egg_price_snapshot').default(0),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_order_items_order').on(table.orderId),
    index('idx_order_items_menu_item').on(table.menuItemId),
  ],
);

export const orderItemToppings = pgTable(
  'order_item_toppings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderItemId: uuid('order_item_id')
      .notNull()
      .references(() => orderItems.id, { onDelete: 'cascade' }),
    toppingId: varchar('topping_id', { length: 64 }).references(() => toppings.id, { onDelete: 'set null' }),
    toppingNameSnapshot: varchar('topping_name_snapshot', { length: 100 }).notNull(),
    priceSnapshot: integer('price_snapshot').notNull(),
  },
  (table) => [index('idx_order_item_toppings_item').on(table.orderItemId)],
);

// ============================================================================
// 7. INVENTORY, STOCK MOVEMENTS & PURCHASE ORDERS
// ============================================================================
export const stockItems = pgTable(
  'stock_items',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 120 }).notNull(),
    stockGroup: stockGroupEnum('stock_group').notNull(),
    icon: varchar('icon', { length: 32 }).notNull().default('package'),
    currentStock: numeric('current_stock', { precision: 10, scale: 2 }).notNull().default('0'),
    minStock: numeric('min_stock', { precision: 10, scale: 2 }).notNull().default('0'),
    capacity: numeric('capacity', { precision: 10, scale: 2 }).notNull().default('100'),
    unit: varchar('unit', { length: 32 }).notNull(),
    dailyUseEstimate: numeric('daily_use_estimate', { precision: 10, scale: 2 }).notNull().default('0'),
    unitCost: integer('unit_cost').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_stock_items_outlet_group').on(table.outletId, table.stockGroup)],
);

export const menuRecipes = pgTable('menu_recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  menuItemId: varchar('menu_item_id', { length: 64 }).references(() => menuItems.id, { onDelete: 'cascade' }),
  toppingId: varchar('topping_id', { length: 64 }).references(() => toppings.id, { onDelete: 'cascade' }),
  eggOptionId: varchar('egg_option_id', { length: 64 }).references(() => eggOptions.id, { onDelete: 'cascade' }),
  stockItemId: varchar('stock_item_id', { length: 64 })
    .notNull()
    .references(() => stockItems.id, { onDelete: 'cascade' }),
  quantityUsed: numeric('quantity_used', { precision: 10, scale: 3 }).notNull(),
});

export const stockMovements = pgTable(
  'stock_movements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'cascade' }),
    stockItemId: varchar('stock_item_id', { length: 64 })
      .notNull()
      .references(() => stockItems.id, { onDelete: 'cascade' }),
    movementType: stockMovementTypeEnum('movement_type').notNull(),
    quantityDelta: numeric('quantity_delta', { precision: 10, scale: 2 }).notNull(),
    stockAfter: numeric('stock_after', { precision: 10, scale: 2 }).notNull(),
    referenceId: varchar('reference_id', { length: 64 }),
    performedBy: varchar('performed_by', { length: 64 }).references(() => employees.id, { onDelete: 'set null' }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_stock_movements_item_created').on(table.stockItemId, table.createdAt)],
);

export const purchaseOrders = pgTable(
  'purchase_orders',
  {
    id: varchar('id', { length: 32 }).primaryKey(),
    outletId: varchar('outlet_id', { length: 64 })
      .notNull()
      .references(() => outlets.id, { onDelete: 'restrict' }),
    supplierName: varchar('supplier_name', { length: 160 }).notNull(),
    itemsSummary: text('items_summary').notNull(),
    totalAmount: integer('total_amount').notNull(),
    status: poStatusEnum('status').notNull().default('draft'),
    etaLabel: varchar('eta_label', { length: 64 }),
    dueDate: date('due_date'),
    orderedAt: timestamp('ordered_at', { withTimezone: true }),
    receivedAt: timestamp('received_at', { withTimezone: true }),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdBy: varchar('created_by', { length: 64 }).references(() => employees.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_po_outlet_status').on(table.outletId, table.status, table.createdAt)],
);

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseOrderId: varchar('purchase_order_id', { length: 32 })
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  stockItemId: varchar('stock_item_id', { length: 64 }).references(() => stockItems.id, { onDelete: 'set null' }),
  itemName: varchar('item_name', { length: 120 }).notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 32 }).notNull(),
  unitCost: integer('unit_cost').notNull(),
  subtotal: integer('subtotal').notNull(),
});
