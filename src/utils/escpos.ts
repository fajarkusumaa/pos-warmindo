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
  lines.push(centerText('WARMINDO 88', maxChars));
  lines.push(centerText('Jl. Kemang Raya No. 88', maxChars));
  lines.push(centerText('WA 0812-8008-0088', maxChars));
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
      if (doneness && doneness !== 'Kenyal') {
        lines.push(`  * Mie ${doneness.toLowerCase()}`);
      }
      if (spicinessLevel > 0) {
        lines.push(`  * Pedas lv ${spicinessLevel}`);
      }
      if (egg) {
        lines.push(`  * +${egg.shortName}`);
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
  lines.push(centerText('Terima kasih, mampir lagi ya!', maxChars));
  lines.push('\n\n');

  const textPreview = lines.join('\n');
  const encoder = new TextEncoder();
  const bytes = encoder.encode(textPreview);

  return { textPreview, bytes };
};

export interface ShiftSummaryData {
  cashierName: string;
  shiftLabel: string;
  orders: Order[];
  outletName?: string;
}

export const generateEscPosShiftSummary = (
  data: ShiftSummaryData,
  paperWidth: '58mm' | '80mm' = '58mm',
): EscPosResult => {
  const maxChars = paperWidth === '58mm' ? 32 : 48;
  const lineSeparator = '-'.repeat(maxChars);
  const doubleSeparator = '='.repeat(maxChars);

  const padBetween = (left: string, right: string, width: number): string => {
    const space = width - left.length - right.length;
    if (space > 0) return left + ' '.repeat(space) + right;
    return left.slice(0, width - right.length - 1) + ' ' + right;
  };

  const centerText = (text: string, width: number): string => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  const cashOrders = data.orders.filter((o) => o.paymentMethod === 'cash');
  const qrisOrders = data.orders.filter((o) => o.paymentMethod === 'qris');
  const totalCash = cashOrders.reduce((sum, o) => sum + o.total, 0);
  const totalQris = qrisOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = totalCash + totalQris;

  const lines: string[] = [];
  lines.push(centerText(data.outletName || 'WARMINDO 88', maxChars));
  lines.push(centerText('LAPORAN REKAP TRANSAKSI KASIR', maxChars));
  lines.push(doubleSeparator);
  lines.push(padBetween(`Kasir: ${data.cashierName}`, `Shift: ${data.shiftLabel}`, maxChars));
  lines.push(padBetween(`Dicetak: ${formatReceiptTime(new Date())}`, '', maxChars));
  lines.push(lineSeparator);
  lines.push(padBetween('Total Transaksi:', `${data.orders.length} struk`, maxChars));
  lines.push(padBetween(`Tunai (${cashOrders.length}x):`, formatRupiah(totalCash), maxChars));
  lines.push(padBetween(`QRIS (${qrisOrders.length}x):`, formatRupiah(totalQris), maxChars));
  lines.push(doubleSeparator);
  lines.push(padBetween('TOTAL OMZET:', formatRupiah(totalRevenue), maxChars));
  lines.push(lineSeparator);
  lines.push(centerText('--- RINCIAN NOTA ---', maxChars));

  data.orders.forEach((o) => {
    const timeStr = new Date(o.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const lineLeft = `${timeStr} #${o.orderNumber.slice(-4)} (${o.paymentMethod.toUpperCase()})`;
    lines.push(padBetween(lineLeft, formatRupiah(o.total), maxChars));
  });

  lines.push(doubleSeparator);
  lines.push(centerText('Tutup Shift Kasir Selesai', maxChars));
  lines.push('\n\n');

  const textPreview = lines.join('\n');
  const encoder = new TextEncoder();
  const bytes = encoder.encode(textPreview);

  return { textPreview, bytes };
};
