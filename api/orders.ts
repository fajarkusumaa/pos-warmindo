import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, isDbConfigured } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isDbConfigured()) {
    return res.status(200).json({ saved: false, reason: 'local_only' });
  }

  try {
    const sql = getSql();
    const {
      outletId = 'kemang',
      order,
      orderType = 'dine_in',
    } = req.body || {};

    if (!order || !order.orderNumber || !Array.isArray(order.items)) {
      return res.status(400).json({ error: 'Payload pesanan tidak valid' });
    }

    const tableNumMatch = String(order.tableNumber || '').match(/\d+/);
    const cleanTableNumber = tableNumMatch ? tableNumMatch[0].padStart(2, '0') : 'TA';

    // 1. Cari table_id jika dine_in
    let tableId: string | null = null;
    if (orderType === 'dine_in' && cleanTableNumber !== 'TA') {
      const tbl = await sql`
        SELECT id FROM dining_tables
        WHERE outlet_id = ${outletId} AND table_number = ${cleanTableNumber}
        LIMIT 1
      `;
      tableId = tbl[0]?.id ?? null;
    }

    // 2. Simpan header pesanan (idempotent via client_order_id)
    const insertedOrders = await sql`
      INSERT INTO orders (
        client_order_id,
        outlet_id,
        cashier_name_snapshot,
        order_number,
        order_type,
        table_id,
        table_number_snapshot,
        status,
        subtotal,
        discount,
        tax,
        total,
        payment_method,
        cash_received,
        change_amount
      ) VALUES (
        ${order.id},
        ${outletId},
        ${order.cashierName || 'Kasir'},
        ${order.orderNumber},
        ${orderType},
        ${tableId},
        ${cleanTableNumber},
        'paid',
        ${order.subtotal},
        ${order.discount || 0},
        ${order.tax || 0},
        ${order.total},
        ${order.paymentMethod},
        ${order.cashReceived ?? null},
        ${order.change ?? null}
      )
      ON CONFLICT (client_order_id) DO UPDATE
        SET paid_at = NOW()
      RETURNING id
    `;

    const dbOrderId = insertedOrders[0].id;

    // 3. Simpan setiap baris item & topping
    for (const item of order.items) {
      const cust = item.customization;
      const egg = cust?.egg;

      const insertedItem = await sql`
        INSERT INTO order_items (
          order_id,
          menu_item_id,
          menu_item_name_snapshot,
          category_snapshot,
          base_price_snapshot,
          quantity,
          unit_price,
          subtotal,
          doneness,
          spiciness_level,
          egg_option_id,
          egg_name_snapshot,
          egg_price_snapshot,
          notes
        ) VALUES (
          ${dbOrderId},
          ${item.menuItem.id},
          ${item.menuItem.name},
          ${item.menuItem.category},
          ${item.menuItem.basePrice},
          ${item.quantity},
          ${item.unitPrice},
          ${item.subtotal},
          ${cust?.doneness ?? null},
          ${cust?.spicinessLevel ?? null},
          ${egg?.id ?? null},
          ${egg?.shortName ?? null},
          ${egg?.price ?? 0},
          ${cust?.notes ?? null}
        )
        RETURNING id
      `;

      const dbOrderItemId = insertedItem[0].id;

      if (cust?.toppings && cust.toppings.length > 0) {
        for (const top of cust.toppings) {
          await sql`
            INSERT INTO order_item_toppings (
              order_item_id,
              topping_id,
              topping_name_snapshot,
              price_snapshot
            ) VALUES (
              ${dbOrderItemId},
              ${top.id},
              ${top.name},
              ${top.price}
            )
          `;
        }
      }
    }

    // 4. Update status meja jika dine_in
    if (tableId) {
      await sql`
        UPDATE dining_tables
        SET
          status = 'eating',
          guest_count = COALESCE(NULLIF(guest_count, 0), 2),
          occupied_since = COALESCE(occupied_since, NOW()),
          active_order_id = ${dbOrderId},
          updated_at = NOW()
        WHERE id = ${tableId}
      `;
    }

    return res.status(201).json({ saved: true, orderId: dbOrderId });
  } catch (error: any) {
    console.error('[POST /api/orders] Neon error:', error);
    return res.status(500).json({
      saved: false,
      error: error?.message || 'Gagal menyimpan transaksi ke Neon',
    });
  }
}
