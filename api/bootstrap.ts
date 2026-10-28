import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, isDbConfigured } from './_db.js';

const ROLE_UI_MAP: Record<string, 'Kasir' | 'Juru masak' | 'Pelayan'> = {
  kasir: 'Kasir',
  juru_masak: 'Juru masak',
  pelayan: 'Pelayan',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isDbConfigured()) {
    return res.status(200).json({ connected: false, message: 'DATABASE_URL belum diset, menggunakan mode lokal.' });
  }

  const outletId = typeof req.query.outletId === 'string' ? req.query.outletId : 'kemang';

  try {
    const sql = getSql();

    const [
      menuRows,
      toppingRows,
      eggRows,
      tableRows,
      stockRows,
      poRows,
      employeeRows,
      outletRows,
      orderCountRows,
    ] = await Promise.all([
      sql`
        SELECT
          m.id,
          m.name,
          m.category,
          COALESCE(o.price_override, m.base_price) AS "basePrice",
          m.tag,
          m.image_url AS image,
          COALESCE(o.available, m.available) AS available,
          m.customizable
        FROM menu_items m
        LEFT JOIN outlet_menu_overrides o
          ON o.menu_item_id = m.id AND o.outlet_id = ${outletId}
        ORDER BY m.sort_order ASC, m.name ASC
      `,
      sql`
        SELECT id, name, price, available
        FROM toppings
        ORDER BY sort_order ASC, name ASC
      `,
      sql`
        SELECT id, name, short_name AS "shortName", price, available
        FROM egg_options
        ORDER BY sort_order ASC, name ASC
      `,
      sql`
        SELECT
          id,
          table_number AS number,
          name,
          capacity,
          status,
          guest_count AS "guestCount",
          CASE
            WHEN occupied_since IS NOT NULL
            THEN EXTRACT(EPOCH FROM (NOW() - occupied_since))::int
            ELSE NULL
          END AS "elapsedSeconds"
        FROM dining_tables
        WHERE outlet_id = ${outletId} AND is_active = TRUE
        ORDER BY table_number ASC
      `,
      sql`
        SELECT
          id,
          name,
          stock_group AS "group",
          icon,
          current_stock::float AS stock,
          min_stock::float AS min,
          capacity::float AS capacity,
          unit,
          daily_use_estimate::float AS "dailyUse",
          unit_cost AS price
        FROM stock_items
        WHERE outlet_id = ${outletId}
        ORDER BY name ASC
      `,
      sql`
        SELECT
          id,
          supplier_name AS supplier,
          items_summary AS items,
          total_amount AS total,
          status,
          COALESCE(eta_label, '') AS "when",
          CASE
            WHEN due_date IS NOT NULL
            THEN GREATEST(0, (due_date - CURRENT_DATE))::int
            ELSE NULL
          END AS "dueInDays"
        FROM purchase_orders
        WHERE outlet_id = ${outletId} AND status != 'cancelled'
        ORDER BY created_at DESC
      `,
      sql`
        SELECT id, name, role, default_shift AS shift
        FROM employees
        WHERE outlet_id = ${outletId} AND is_active = TRUE
          AND role IN ('kasir', 'juru_masak', 'pelayan')
        ORDER BY name ASC
      `,
      sql`
        SELECT name, whatsapp, email, address, timezone, opening_hours AS hours, logo_url AS "logoUrl", receipt_config
        FROM outlets
        WHERE id = ${outletId}
        LIMIT 1
      `,
      sql`
        SELECT COUNT(*)::int AS count
        FROM orders
        WHERE outlet_id = ${outletId}
          AND created_at >= CURRENT_DATE
      `,
    ]);

    const outlet = outletRows[0];
    const receiptCfg = outlet?.receipt_config || {};

    return res.status(200).json({
      connected: true,
      menu: menuRows.map((m) => ({
        ...m,
        tag: m.tag ?? undefined,
        image: m.image ?? undefined,
      })),
      toppings: toppingRows,
      eggs: eggRows,
      tables: tableRows.map((t) => ({
        ...t,
        guestCount: t.guestCount || undefined,
        elapsedSeconds: t.elapsedSeconds || undefined,
      })),
      stock: stockRows,
      purchaseOrders: poRows.map((po) => ({
        ...po,
        dueInDays: po.dueInDays ?? undefined,
      })),
      employees: employeeRows.map((e) => ({
        id: e.id,
        name: e.name,
        role: ROLE_UI_MAP[e.role] || 'Kasir',
        shift: e.shift,
      })),
      profile: outlet
        ? {
            name: outlet.name,
            whatsapp: outlet.whatsapp || '',
            email: outlet.email || '',
            address: outlet.address,
            timezone: outlet.timezone,
            hours: outlet.hours,
            logoUrl: outlet.logoUrl ?? undefined,
            receipt: {
              logo: receiptCfg.printLogo ?? true,
              address: receiptCfg.printAddress ?? true,
              whatsapp: receiptCfg.printWhatsapp ?? true,
              email: receiptCfg.printEmail ?? false,
            },
          }
        : null,
      nextOrderNumber: (orderCountRows[0]?.count ?? 0) + 1,
    });
  } catch (error: any) {
    console.error('[GET /api/bootstrap] Neon error:', error);
    return res.status(500).json({
      connected: false,
      error: error?.message || 'Gagal memuat data dari Neon',
    });
  }
}
