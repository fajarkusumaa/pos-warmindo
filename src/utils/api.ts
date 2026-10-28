import { EggOption, MenuItem, Order, OrderType, TableInfo, Topping } from '../types';
import { BusinessProfile, Employee, PurchaseOrder, StockItem } from '../data/ownerData';

export interface BootstrapResponse {
  connected: boolean;
  menu?: MenuItem[];
  toppings?: Topping[];
  eggs?: EggOption[];
  tables?: TableInfo[];
  stock?: StockItem[];
  purchaseOrders?: PurchaseOrder[];
  employees?: Employee[];
  profile?: BusinessProfile | null;
  nextOrderNumber?: number;
}

export async function fetchBootstrapData(outletId: string): Promise<BootstrapResponse | null> {
  try {
    const res = await fetch(`/api/bootstrap?outletId=${encodeURIComponent(outletId)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveOrderToNeon(params: {
  outletId: string;
  order: Order;
  orderType: OrderType;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.saved);
  } catch {
    return false;
  }
}

export async function mutateNeon(
  action:
    | 'toggle_availability'
    | 'add_menu_item'
    | 'add_topping'
    | 'stock_in'
    | 'sync_purchase_orders'
    | 'add_employee'
    | 'save_profile',
  payload: Record<string, unknown>,
  outletId = 'kemang',
): Promise<boolean> {
  try {
    const res = await fetch('/api/mutations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, outletId, payload }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.ok);
  } catch {
    return false;
  }
}
