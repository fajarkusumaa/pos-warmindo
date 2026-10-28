import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, isDbConfigured } from './_db.js';

const ROLE_DB_MAP: Record<string, string> = {
  Kasir: 'kasir',
  'Juru masak': 'juru_masak',
  Pelayan: 'pelayan',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isDbConfigured()) {
    return res.status(200).json({ ok: false, reason: 'local_only' });
  }

  try {
    const sql = getSql();
    const { action, outletId = 'kemang', payload } = req.body || {};

    switch (action) {
      case 'toggle_availability': {
        const { kind, id, available } = payload;
        if (kind === 'menu') {
          await sql`UPDATE menu_items SET available = ${available}, updated_at = NOW() WHERE id = ${id}`;
        } else if (kind === 'egg') {
          await sql`UPDATE egg_options SET available = ${available} WHERE id = ${id}`;
        } else if (kind === 'topping') {
          await sql`UPDATE toppings SET available = ${available} WHERE id = ${id}`;
        }
        break;
      }

      case 'add_menu_item': {
        const { item } = payload;
        await sql`
          INSERT INTO menu_items (id, name, category, base_price, available, customizable, tag, image_url)
          VALUES (
            ${item.id},
            ${item.name},
            ${item.category},
            ${item.basePrice},
            ${item.available ?? true},
            ${Boolean(item.customizable || item.category === 'mie')},
            ${item.tag ?? null},
            ${item.image ?? null}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            base_price = EXCLUDED.base_price,
            available = EXCLUDED.available,
            updated_at = NOW()
        `;
        break;
      }

      case 'add_topping': {
        const { topping } = payload;
        await sql`
          INSERT INTO toppings (id, name, price, available)
          VALUES (${topping.id}, ${topping.name}, ${topping.price}, ${topping.available ?? true})
          ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price
        `;
        break;
      }

      case 'stock_in': {
        const { id, qty } = payload;
        const updated = await sql`
          UPDATE stock_items
          SET current_stock = current_stock + ${qty}, updated_at = NOW()
          WHERE id = ${id} AND outlet_id = ${outletId}
          RETURNING current_stock
        `;
        if (updated[0]) {
          await sql`
            INSERT INTO stock_movements (outlet_id, stock_item_id, movement_type, quantity_delta, stock_after, notes)
            VALUES (${outletId}, ${id}, 'purchase_in', ${qty}, ${updated[0].current_stock}, 'Stok masuk via panel Owner')
          `;
        }
        break;
      }

      case 'sync_purchase_orders': {
        const { orders } = payload;
        if (Array.isArray(orders)) {
          for (const po of orders) {
            await sql`
              INSERT INTO purchase_orders (id, outlet_id, supplier_name, items_summary, total_amount, status, eta_label)
              VALUES (${po.id}, ${outletId}, ${po.supplier}, ${po.items}, ${po.total}, ${po.status}, ${po.when || ''})
              ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                eta_label = EXCLUDED.eta_label,
                updated_at = NOW()
            `;
          }
        }
        break;
      }

      case 'add_employee': {
        const { employee } = payload;
        const dbRole = ROLE_DB_MAP[employee.role] || 'kasir';
        await sql`
          INSERT INTO employees (id, outlet_id, name, role, default_shift)
          VALUES (${employee.id}, ${outletId}, ${employee.name}, ${dbRole}, ${employee.shift})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            default_shift = EXCLUDED.default_shift
        `;
        break;
      }

      case 'save_profile': {
        const { profile } = payload;
        await sql`
          UPDATE outlets
          SET
            name = ${profile.name},
            whatsapp = ${profile.whatsapp},
            email = ${profile.email},
            address = ${profile.address},
            timezone = ${profile.timezone},
            opening_hours = ${profile.hours},
            receipt_config = jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(receipt_config, '{printLogo}', to_jsonb(${Boolean(profile.receipt?.logo)}::boolean)),
                  '{printAddress}', to_jsonb(${Boolean(profile.receipt?.address)}::boolean)
                ),
                '{printWhatsapp}', to_jsonb(${Boolean(profile.receipt?.whatsapp)}::boolean)
              ),
              '{printEmail}', to_jsonb(${Boolean(profile.receipt?.email)}::boolean)
            ),
            updated_at = NOW()
          WHERE id = ${outletId}
        `;
        break;
      }

      default:
        return res.status(400).json({ error: `Action tidak dikenal: ${action}` });
    }

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('[POST /api/mutations] Neon error:', error);
    return res.status(500).json({ ok: false, error: error?.message || 'Gagal memperbarui data di Neon' });
  }
}
