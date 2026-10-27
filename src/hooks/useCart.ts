import { useMemo, useState } from 'react';
import { CartItem, MenuItem, SelectedCustomization } from '../types';

const unitPriceOf = (item: MenuItem, customization?: SelectedCustomization) =>
  item.basePrice +
  (customization ? (customization.egg?.price ?? 0) + customization.toppings.reduce((s, t) => s + t.price, 0) : 0);

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (menuItem: MenuItem, customization?: SelectedCustomization, quantity = 1) => {
    const unitPrice = unitPriceOf(menuItem, customization);
    setItems((prev) => {
      // Plain items stack on one line; customized bowls always get their own line.
      if (!customization) {
        const existing = prev.find((i) => i.menuItem.id === menuItem.id && !i.customization);
        if (existing) {
          return prev.map((i) =>
            i.cartItemId === existing.cartItemId
              ? { ...i, quantity: i.quantity + quantity, subtotal: (i.quantity + quantity) * i.unitPrice }
              : i,
          );
        }
      }
      return [
        ...prev,
        {
          cartItemId: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          menuItem,
          quantity,
          customization,
          unitPrice,
          subtotal: unitPrice * quantity,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + delta, subtotal: (i.quantity + delta) * i.unitPrice }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  /** Removes one portion of a menu item, starting from its most recent cart line. */
  const decrementMenuItem = (menuItemId: string) => {
    const line = [...items].reverse().find((i) => i.menuItem.id === menuItemId);
    if (line) updateQuantity(line.cartItemId, -1);
  };

  const clear = () => setItems([]);

  const { total, count, qtyByMenuItem } = useMemo(() => {
    const qtyByMenuItem: Record<string, number> = {};
    let total = 0;
    let count = 0;
    for (const i of items) {
      total += i.subtotal;
      count += i.quantity;
      qtyByMenuItem[i.menuItem.id] = (qtyByMenuItem[i.menuItem.id] ?? 0) + i.quantity;
    }
    return { total, count, qtyByMenuItem };
  }, [items]);

  return { items, total, count, qtyByMenuItem, addItem, updateQuantity, decrementMenuItem, clear };
};

export type Cart = ReturnType<typeof useCart>;
