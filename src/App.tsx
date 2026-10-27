import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Register/Catalog';
import { OrderCart } from './components/Register/OrderCart';
import { ToppingModal } from './components/Register/ToppingModal';
import { PaymentModal } from './components/Register/PaymentModal';
import { ReceiptModal } from './components/Register/ReceiptModal';
import { TableTracker } from './components/Tables/TableTracker';
import { OwnerDashboard } from './components/Dashboard/OwnerDashboard';
import { PrinterSettingsModal } from './components/Hardware/PrinterSettingsModal';
import { 
  CartItem, 
  MenuItem, 
  Order, 
  PrinterConfig, 
  SelectedCustomization, 
  TableInfo 
} from './types';
import { INITIAL_TABLES } from './data/mockData';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'tables' | 'dashboard'>('register');
  const [userRole, setUserRole] = useState<'cashier' | 'owner'>('cashier');

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('Meja 04');
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [printerModalOpen, setPrinterModalOpen] = useState<boolean>(false);

  // Hardware Printer Configuration
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>({
    name: 'RPP02N-Thermal-58',
    macAddress: '66:32:B1:4C:90:11',
    connected: true,
    paperSize: '58mm',
    printLogo: true,
    printAddress: true,
    printToppingDetails: true,
    footerText: 'Matur Nuwun! Ditunggu rawuhnya lagi.',
  });

  // Table status data
  const [tables, setTables] = useState<TableInfo[]>(INITIAL_TABLES);

  // Handle Item selection in Catalog
  const handleSelectItem = (item: MenuItem) => {
    // If it's Indomie (kuah or goreng), open customization modal
    if (item.category === 'kuah' || item.category === 'goreng') {
      setSelectedItemForCustomization(item);
    } else {
      // Add directly
      addItemToCart(item);
    }
  };

  const addItemToCart = (item: MenuItem, customization?: SelectedCustomization) => {
    const unitPrice = item.basePrice + (customization ? customization.eggPrice + customization.toppings.reduce((s, t) => s + t.price, 0) : 0);
    
    // Check if duplicate standard item exists
    if (!customization) {
      const existing = cartItems.find((i) => i.menuItem.id === item.id && !i.customization);
      if (existing) {
        setCartItems((prev) =>
          prev.map((i) =>
            i.cartItemId === existing.cartItemId
              ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
              : i
          )
        );
        return;
      }
    }

    const newItem: CartItem = {
      cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      menuItem: item,
      quantity: 1,
      customization,
      unitPrice,
      subtotal: unitPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Open Payment
  const handleOpenPayment = (method: 'cash' | 'qris') => {
    setPaymentMethod(method);
    setPaymentModalOpen(true);
  };

  // Handle Payment Success
  const handlePaymentSuccess = (method: 'cash' | 'qris', cashReceived?: number, change?: number) => {
    const subtotal = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
    const orderNumber = `WMD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      tableNumber,
      items: [...cartItems],
      subtotal,
      discount: 0,
      tax: 0,
      total: subtotal,
      paymentMethod: method,
      cashReceived,
      change,
      cashierName: userRole === 'owner' ? 'Owner (Fajar)' : 'Budi Santoso',
      timestamp: new Date().toISOString(),
    };

    setLastCompletedOrder(newOrder);
    setPaymentModalOpen(false);
    setReceiptModalOpen(true);

    // Update table status if matched
    setTables((prev) =>
      prev.map((t) => {
        if (tableNumber.includes(t.number)) {
          return {
            ...t,
            status: 'eating',
            totalBill: (t.totalBill || 0) + subtotal,
            guestCount: t.guestCount || 2,
            elapsedSeconds: t.elapsedSeconds || 60,
          };
        }
        return t;
      })
    );
  };

  // Start new transaction
  const handleNewTransaction = () => {
    setCartItems([]);
    setReceiptModalOpen(false);
    setLastCompletedOrder(null);
  };

  // Select Table from Tracker
  const handleSelectTableFromTracker = (table: TableInfo) => {
    setTableNumber(`Meja ${table.number}`);
    setActiveTab('register');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-ground select-none">
      {/* Universal Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        printerConfig={printerConfig}
        onOpenPrinterModal={() => setPrinterModalOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'register' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Catalog Grid */}
            <Catalog onSelectItem={handleSelectItem} />

            {/* Live Order Cart */}
            <OrderCart
              items={cartItems}
              tableNumber={tableNumber}
              setTableNumber={setTableNumber}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onOpenPaymentModal={handleOpenPayment}
            />
          </div>
        )}

        {activeTab === 'tables' && (
          <TableTracker
            tables={tables}
            onSelectTable={handleSelectTableFromTracker}
          />
        )}

        {activeTab === 'dashboard' && (
          <OwnerDashboard />
        )}
      </main>

      {/* Modals */}
      {selectedItemForCustomization && (
        <ToppingModal
          item={selectedItemForCustomization}
          onClose={() => setSelectedItemForCustomization(null)}
          onConfirm={(customization) => {
            addItemToCart(selectedItemForCustomization, customization);
            setSelectedItemForCustomization(null);
          }}
        />
      )}

      {paymentModalOpen && (
        <PaymentModal
          totalAmount={cartItems.reduce((s, i) => s + i.subtotal, 0)}
          tableNumber={tableNumber}
          initialMethod={paymentMethod}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {receiptModalOpen && lastCompletedOrder && (
        <ReceiptModal
          order={lastCompletedOrder}
          printerConfig={printerConfig}
          onNewTransaction={handleNewTransaction}
          onClose={() => setReceiptModalOpen(false)}
        />
      )}

      {printerModalOpen && (
        <PrinterSettingsModal
          config={printerConfig}
          onSaveConfig={(cfg) => setPrinterConfig(cfg)}
          onClose={() => setPrinterModalOpen(false)}
        />
      )}
    </div>
  );
};
export default App;
