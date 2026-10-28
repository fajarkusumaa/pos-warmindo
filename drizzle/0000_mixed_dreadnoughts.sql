CREATE TYPE "public"."doneness_level" AS ENUM('Kenyal', 'Lembut', 'Kering');--> statement-breakpoint
CREATE TYPE "public"."employee_role" AS ENUM('owner', 'manager', 'kasir', 'juru_masak', 'pelayan');--> statement-breakpoint
CREATE TYPE "public"."menu_category" AS ENUM('mie', 'nasi', 'minum', 'kopi', 'camilan');--> statement-breakpoint
CREATE TYPE "public"."menu_tag" AS ENUM('laris', 'baru');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('open', 'paid', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('dine_in', 'takeaway');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'qris');--> statement-breakpoint
CREATE TYPE "public"."po_status" AS ENUM('draft', 'ordered', 'received', 'paid', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."shift_type" AS ENUM('pagi', 'sore', 'malam', 'izin');--> statement-breakpoint
CREATE TYPE "public"."stock_group" AS ENUM('Protein', 'Mie instan', 'Minuman', 'Topping', 'Bahan dapur');--> statement-breakpoint
CREATE TYPE "public"."stock_movement_type" AS ENUM('purchase_in', 'sale_out', 'waste', 'opname_adjustment', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."table_status" AS ENUM('available', 'eating', 'need_bill', 'add_order');--> statement-breakpoint
CREATE TABLE "cashier_shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" varchar(64) NOT NULL,
	"employee_id" varchar(64) NOT NULL,
	"shift" "shift_type" NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	"opening_cash" integer DEFAULT 0 NOT NULL,
	"expected_cash" integer DEFAULT 0 NOT NULL,
	"actual_cash" integer,
	"cash_difference" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dining_tables" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"outlet_id" varchar(64) NOT NULL,
	"table_number" varchar(16) NOT NULL,
	"name" varchar(120) NOT NULL,
	"capacity" smallint DEFAULT 4 NOT NULL,
	"status" "table_status" DEFAULT 'available' NOT NULL,
	"guest_count" smallint DEFAULT 0,
	"occupied_since" timestamp with time zone,
	"active_order_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "egg_options" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"short_name" varchar(64) NOT NULL,
	"price" integer NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"outlet_id" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" "employee_role" DEFAULT 'kasir' NOT NULL,
	"default_shift" "shift_type" DEFAULT 'pagi' NOT NULL,
	"pin_hash" varchar(255),
	"email" varchar(120),
	"phone" varchar(32),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"category" "menu_category" NOT NULL,
	"base_price" integer NOT NULL,
	"cogs_estimate" integer DEFAULT 0 NOT NULL,
	"tag" "menu_tag",
	"image_url" text,
	"available" boolean DEFAULT true NOT NULL,
	"customizable" boolean DEFAULT false NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_item_id" varchar(64),
	"topping_id" varchar(64),
	"egg_option_id" varchar(64),
	"stock_item_id" varchar(64) NOT NULL,
	"quantity_used" numeric(10, 3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item_toppings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_item_id" uuid NOT NULL,
	"topping_id" varchar(64),
	"topping_name_snapshot" varchar(100) NOT NULL,
	"price_snapshot" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"menu_item_id" varchar(64),
	"menu_item_name_snapshot" varchar(120) NOT NULL,
	"category_snapshot" "menu_category" NOT NULL,
	"base_price_snapshot" integer NOT NULL,
	"quantity" smallint NOT NULL,
	"unit_price" integer NOT NULL,
	"subtotal" integer NOT NULL,
	"doneness" "doneness_level",
	"spiciness_level" smallint,
	"egg_option_id" varchar(64),
	"egg_name_snapshot" varchar(64),
	"egg_price_snapshot" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_order_id" varchar(64),
	"outlet_id" varchar(64) NOT NULL,
	"shift_id" uuid,
	"cashier_id" varchar(64),
	"cashier_name_snapshot" varchar(120) NOT NULL,
	"order_number" varchar(32) NOT NULL,
	"order_type" "order_type" DEFAULT 'dine_in' NOT NULL,
	"table_id" varchar(64),
	"table_number_snapshot" varchar(16) NOT NULL,
	"status" "order_status" DEFAULT 'paid' NOT NULL,
	"subtotal" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"cash_received" integer,
	"change_amount" integer,
	"checkout_duration_seconds" smallint,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "orders_client_order_id_unique" UNIQUE("client_order_id")
);
--> statement-breakpoint
CREATE TABLE "outlet_menu_overrides" (
	"outlet_id" varchar(64) NOT NULL,
	"menu_item_id" varchar(64) NOT NULL,
	"price_override" integer,
	"available" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outlet_menu_overrides_outlet_id_menu_item_id_pk" PRIMARY KEY("outlet_id","menu_item_id")
);
--> statement-breakpoint
CREATE TABLE "outlets" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"code" varchar(16) NOT NULL,
	"address" text NOT NULL,
	"whatsapp" varchar(32),
	"email" varchar(120),
	"timezone" varchar(64) DEFAULT 'Asia/Jakarta' NOT NULL,
	"opening_hours" varchar(64) DEFAULT '24 jam' NOT NULL,
	"logo_url" text,
	"tax_rate" numeric(5, 2) DEFAULT '10.00' NOT NULL,
	"receipt_config" jsonb DEFAULT '{"paperSize":"58mm","printLogo":true,"printAddress":true,"printWhatsapp":true,"printEmail":false,"footerText":"Terima kasih sudah mampir di Warmindo 88!"}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outlets_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "purchase_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_order_id" varchar(32) NOT NULL,
	"stock_item_id" varchar(64),
	"item_name" varchar(120) NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unit" varchar(32) NOT NULL,
	"unit_cost" integer NOT NULL,
	"subtotal" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"outlet_id" varchar(64) NOT NULL,
	"supplier_name" varchar(160) NOT NULL,
	"items_summary" text NOT NULL,
	"total_amount" integer NOT NULL,
	"status" "po_status" DEFAULT 'draft' NOT NULL,
	"eta_label" varchar(64),
	"due_date" date,
	"ordered_at" timestamp with time zone,
	"received_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"created_by" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_items" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"outlet_id" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"stock_group" "stock_group" NOT NULL,
	"icon" varchar(32) DEFAULT 'package' NOT NULL,
	"current_stock" numeric(10, 2) DEFAULT '0' NOT NULL,
	"min_stock" numeric(10, 2) DEFAULT '0' NOT NULL,
	"capacity" numeric(10, 2) DEFAULT '100' NOT NULL,
	"unit" varchar(32) NOT NULL,
	"daily_use_estimate" numeric(10, 2) DEFAULT '0' NOT NULL,
	"unit_cost" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" varchar(64) NOT NULL,
	"stock_item_id" varchar(64) NOT NULL,
	"movement_type" "stock_movement_type" NOT NULL,
	"quantity_delta" numeric(10, 2) NOT NULL,
	"stock_after" numeric(10, 2) NOT NULL,
	"reference_id" varchar(64),
	"performed_by" varchar(64),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "toppings" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cashier_shifts" ADD CONSTRAINT "cashier_shifts_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cashier_shifts" ADD CONSTRAINT "cashier_shifts_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dining_tables" ADD CONSTRAINT "dining_tables_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_recipes" ADD CONSTRAINT "menu_recipes_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_recipes" ADD CONSTRAINT "menu_recipes_topping_id_toppings_id_fk" FOREIGN KEY ("topping_id") REFERENCES "public"."toppings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_recipes" ADD CONSTRAINT "menu_recipes_egg_option_id_egg_options_id_fk" FOREIGN KEY ("egg_option_id") REFERENCES "public"."egg_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_recipes" ADD CONSTRAINT "menu_recipes_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item_toppings" ADD CONSTRAINT "order_item_toppings_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item_toppings" ADD CONSTRAINT "order_item_toppings_topping_id_toppings_id_fk" FOREIGN KEY ("topping_id") REFERENCES "public"."toppings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_egg_option_id_egg_options_id_fk" FOREIGN KEY ("egg_option_id") REFERENCES "public"."egg_options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shift_id_cashier_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."cashier_shifts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashier_id_employees_id_fk" FOREIGN KEY ("cashier_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_dining_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."dining_tables"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlet_menu_overrides" ADD CONSTRAINT "outlet_menu_overrides_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlet_menu_overrides" ADD CONSTRAINT "outlet_menu_overrides_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_employees_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_performed_by_employees_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_shifts_outlet_opened" ON "cashier_shifts" USING btree ("outlet_id","opened_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_tables_outlet_number" ON "dining_tables" USING btree ("outlet_id","table_number");--> statement-breakpoint
CREATE INDEX "idx_tables_outlet_status" ON "dining_tables" USING btree ("outlet_id","status");--> statement-breakpoint
CREATE INDEX "idx_employees_outlet" ON "employees" USING btree ("outlet_id");--> statement-breakpoint
CREATE INDEX "idx_menu_category_available" ON "menu_items" USING btree ("category","available");--> statement-breakpoint
CREATE INDEX "idx_order_item_toppings_item" ON "order_item_toppings" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_order" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_menu_item" ON "order_items" USING btree ("menu_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_orders_outlet_number" ON "orders" USING btree ("outlet_id","order_number");--> statement-breakpoint
CREATE INDEX "idx_orders_outlet_created" ON "orders" USING btree ("outlet_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_orders_outlet_status_paid" ON "orders" USING btree ("outlet_id","status","paid_at");--> statement-breakpoint
CREATE INDEX "idx_po_outlet_status" ON "purchase_orders" USING btree ("outlet_id","status","created_at");--> statement-breakpoint
CREATE INDEX "idx_stock_items_outlet_group" ON "stock_items" USING btree ("outlet_id","stock_group");--> statement-breakpoint
CREATE INDEX "idx_stock_movements_item_created" ON "stock_movements" USING btree ("stock_item_id","created_at");