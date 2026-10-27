export type Category = 
  | 'all' 
  | 'kuah' 
  | 'goreng' 
  | 'minuman_dingin' 
  | 'kopi_panas' 
  | 'snack_topping';

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  categoryLabel: string;
  basePrice: number;
  description: string;
  badge?: string;
  badgeType?: 'popular' | 'spicy' | 'special';
  available: boolean;
  imageIcon: string;
}

export interface SelectedCustomization {
  doneness: 'Kenyal (Standar)' | 'Matang Lembut' | 'Kering / Tiris' | 'Nyemek Kental Gurih';
  egg?: string;
  eggPrice: number;
  toppings: Topping[];
  spicinessLevel: number; // 0 - 10
  notes: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customization?: SelectedCustomization;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName?: string;
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
  activeOrder?: CartItem[];
  elapsedSeconds?: number;
  totalBill?: number;
}

export interface PrinterConfig {
  name: string;
  macAddress: string;
  connected: boolean;
  paperSize: '58mm' | '80mm';
  printLogo: boolean;
  printAddress: boolean;
  printToppingDetails: boolean;
  footerText: string;
}
