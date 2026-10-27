export type Category = 'mie' | 'nasi' | 'minum' | 'kopi' | 'camilan';

export interface Topping {
  id: string;
  name: string;
  price: number;
  available?: boolean;
}

export interface EggOption {
  id: string;
  name: string;
  /** Short label used on cart lines and receipts, e.g. "Telur ceplok". */
  shortName: string;
  price: number;
  available?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  basePrice: number;
  tag?: 'laris' | 'baru';
  /** Path under /public, e.g. "/images/indomie-goreng-aceh.jpg". */
  image?: string;
  available: boolean;
  /** Mie items open the "Racik pesanan" customizer before going into the cart. */
  customizable?: boolean;
}

export type Doneness = 'Kenyal' | 'Lembut' | 'Kering';

export interface SelectedCustomization {
  doneness: Doneness;
  egg?: EggOption;
  toppings: Topping[];
  spicinessLevel: number; // 0 - 5
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customization?: SelectedCustomization;
  unitPrice: number;
  subtotal: number;
}

export type OrderType = 'dine_in' | 'takeaway';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'qris';
  cashReceived?: number;
  change?: number;
  cashierName: string;
  timestamp: string;
}

export type TableStatus = 'available' | 'eating' | 'need_bill' | 'add_order';

export interface TableInfo {
  id: string;
  number: string;
  name: string;
  capacity: number;
  status: TableStatus;
  guestCount?: number;
  elapsedSeconds?: number;
  totalBill?: number;
}

export interface PrinterConfig {
  name: string;
  macAddress: string;
  connected: boolean;
  battery?: number;
  paperSize: '58mm' | '80mm';
  printLogo: boolean;
  printAddress: boolean;
  printWhatsapp: boolean;
  printEmail: boolean;
  footerText: string;
}
