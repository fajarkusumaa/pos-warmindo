import { Order } from '../types';
import { formatRupiah, formatReceiptTime } from './format';

export interface EscPosResult {
  textPreview: string;
  bytes: Uint8Array;
}

export const generateEscPosReceipt = (order: Order, paperWidth: '58mm' | '80mm' = '58mm'): EscPosResult => {
  const maxChars = paperWidth === '58mm' ? 32 : 48;
  const lineSeparator = '-'.repeat(maxChars);
  const doubleSeparator = '='.repeat(maxChars);

  const padBetween = (left: string, right: string, width: number): string => {
    const space = width - left.length - right.length;
    if (space > 0) {
      return left + ' '.repeat(space) + right;
    }
    return left.slice(0, width - right.length - 1) + ' ' + right;
  };

  const centerText = (text: string, width: number): string => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  const lines: string[] = [];
  lines.push(centerText('WARMINDO & WARKOP 88', maxChars));
  lines.push(centerText('Jl. Kemang Raya No. 88, Jaksel', maxChars));
  lines.push(centerText('Telp / WA: 0812-8888-9999', maxChars));
  lines.push(doubleSeparator);
  lines.push(padBetween(`No: ${order.orderNumber}`, order.tableNumber, maxChars));
  lines.push(padBetween(`Tgl: ${formatReceiptTime(new Date(order.timestamp))}`, `Kasir: ${order.cashierName}`, maxChars));
  lines.push(lineSeparator);

  order.items.forEach((item) => {
    const itemTitle = `${item.quantity}x ${item.menuItem.name}`;
    const itemPrice = formatRupiah(item.subtotal);
    lines.push(padBetween(itemTitle, itemPrice, maxChars));

    if (item.customization) {
      const { egg, toppings, spicinessLevel, doneness, notes } = item.customization;
      if (doneness && doneness !== 'Kenyal (Standar)') {
        lines.push(`  * ${doneness}`);
      }
      if (spicinessLevel > 0) {
        lines.push(`  * Pedas: ${spicinessLevel} rawit`);
      }
      if (egg) {
        lines.push(`  * +${egg}`);
      }
      toppings.forEach((t) => {
        lines.push(`  * +${t.name}`);
      });
      if (notes) {
        lines.push(`  * Note: ${notes}`);
      }
    }
  });

  lines.push(lineSeparator);
  lines.push(padBetween('Subtotal:', formatRupiah(order.subtotal), maxChars));
  if (order.discount > 0) {
    lines.push(padBetween('Diskon:', `-${formatRupiah(order.discount)}`, maxChars));
  }
  lines.push(padBetween('TOTAL:', formatRupiah(order.total), maxChars));
  lines.push(lineSeparator);

  if (order.paymentMethod === 'cash') {
    lines.push(padBetween('Bayar Tunai:', formatRupiah(order.cashReceived || order.total), maxChars));
    lines.push(padBetween('Kembalian:', formatRupiah(order.change || 0), maxChars));
  } else {
    lines.push(padBetween('Metode:', 'QRIS (LUNAS)', maxChars));
  }

  lines.push(doubleSeparator);
  lines.push(centerText('Koneksi Wifi Warkop:', maxChars));
  lines.push(centerText('SSID: W88_KEMANG / Pass: indomiegoreng', maxChars));
  lines.push(centerText('Matur Nuwun! Ditunggu rawuhnya lagi.', maxChars));
  lines.push('\n\n');

  const textPreview = lines.join('\n');
  const encoder = new TextEncoder();
  const bytes = encoder.encode(textPreview);

  return { textPreview, bytes };
};
