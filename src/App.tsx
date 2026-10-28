import React, { useCallback, useEffect, useState } from 'react';
import { RegisterScreen } from './components/Register/RegisterScreen';
import { MobileRegister } from './components/Register/MobileRegister';
import { ToppingModal } from './components/Register/ToppingModal';
import { QrisModal } from './components/Register/QrisModal';
import { ChangeModal } from './components/Register/ChangeModal';
import { PrinterSettingsModal } from './components/Hardware/PrinterSettingsModal';
import { OwnerPanel, OwnerPage } from './components/Owner/OwnerPanel';
import { DashboardPage } from './components/Owner/pages/DashboardPage';
import { MenuPage } from './components/Owner/pages/MenuPage';
import { ReportsPage } from './components/Owner/pages/ReportsPage';
import { InventoryPage } from './components/Owner/pages/InventoryPage';
import { PurchasingPage } from './components/Owner/pages/PurchasingPage';
import { StaffPage } from './components/Owner/pages/StaffPage';
import { OutletsPage } from './components/Owner/pages/OutletsPage';
import { SettingsPage } from './components/Owner/pages/SettingsPage';
import { useCart } from './hooks/useCart';
import { useMediaQuery } from './hooks/useMediaQuery';
import { EggOption, MenuItem, Order, OrderType, PrinterConfig, TableInfo, Topping } from './types';
import { EGGS_AVAILABLE, INITIAL_TABLES, MENU_ITEMS, TOPPINGS_AVAILABLE } from './data/mockData';
import {
  EMPLOYEES,
  INITIAL_PROFILE,
  OUTLETS,
  PURCHASE_ORDERS,
  STOCK_ITEMS,
} from './data/ownerData';
import { fetchBootstrapData, mutateNeon, saveOrderToNeon } from './utils/api';

const CASHIER = { name: 'Budi Santoso', shift: 'Shift Malam' };

export const App: React.FC = () => {
  const [mode, setMode] = useState<'cashier' | 'owner'>('cashier');
  const [ownerPage, setOwnerPage] = useState<OwnerPage>('dasbor');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Menu & extras (owner toggles availability, register reads it)
  const [menu, setMenu] = useState<MenuItem[]>(MENU_ITEMS);
  const [eggs, setEggs] = useState<EggOption[]>(EGGS_AVAILABLE);
  const [toppings, setToppings] = useState<Topping[]>(TOPPINGS_AVAILABLE);

  // Register
  const cart = useCart();
  const [orderNumber, setOrderNumber] = useState(92);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState('Meja 04');
  const [tables, setTables] = useState<TableInfo[]>(INITIAL_TABLES);
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [printerOpen, setPrinterOpen] = useState(false);
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>({
    name: 'RPP02N Thermal 58',
    macAddress: '66:32:B1:4C:90:11',
    connected: true,
    battery: 82,
    paperSize: '58mm',
    printLogo: true,
    printAddress: true,
    printWhatsapp: true,
    printEmail: false,
    footerText: 'Terima kasih, mampir lagi ya!',
  });

  // Owner data
  const [stock, setStock] = useState(STOCK_ITEMS);
  const [purchaseOrders, setPurchaseOrders] = useState(PURCHASE_ORDERS);
  const [poDraftItems, setPoDraftItems] = useState<string | undefined>();
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [outletId, setOutletId] = useState(OUTLETS[0].id);
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  // Sinkronisasi data awal dari Neon (jika DATABASE_URL sudah diset di Vercel / .env.local)
  useEffect(() => {
    let active = true;
    fetchBootstrapData(outletId).then((data) => {
      if (!active || !data || !data.connected) return;
      if (data.menu?.length) setMenu(data.menu);
      if (data.toppings?.length) setToppings(data.toppings);
      if (data.eggs?.length) setEggs(data.eggs);
      if (data.tables?.length) setTables(data.tables);
      if (data.stock?.length) setStock(data.stock);
      if (data.purchaseOrders?.length) setPurchaseOrders(data.purchaseOrders);
      if (data.employees?.length) setEmployees(data.employees);
      if (data.profile) setProfile(data.profile);
      if (typeof data.nextOrderNumber === 'number') setOrderNumber(data.nextOrderNumber);
    });
    return () => {
      active = false;
    };
  }, [outletId]);

  const hotkeysEnabled = !customizing && !qrisOpen && !completedOrder && !printerOpen;

  const handleSelectItem = (item: MenuItem) => {
    if (!item.available) return;
    if (item.customizable) setCustomizing(item);
    else cart.addItem(item);
  };

  const completeOrder = useCallback(
    (method: 'cash' | 'qris', cashReceived?: number) => {
      const total = cart.total;
      const now = new Date();
      const label = orderType === 'takeaway' ? 'Bungkus' : tableNumber;
      const newOrder: Order = {
        id: `ord_${now.getTime()}`,
        orderNumber: `WMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(orderNumber).padStart(3, '0')}`,
        tableNumber: label,
        items: [...cart.items],
        subtotal: total,
        discount: 0,
        tax: 0,
        total,
        paymentMethod: method,
        cashReceived,
        change: cashReceived !== undefined ? cashReceived - total : undefined,
        cashierName: mode === 'owner' ? 'Fajar Kusuma' : CASHIER.name,
        timestamp: now.toISOString(),
      };
      setCompletedOrder(newOrder);
      if (orderType === 'dine_in') {
        setTables((prev) =>
          prev.map((t) =>
            `Meja ${t.number}` === tableNumber
              ? { ...t, status: 'eating', totalBill: (t.totalBill ?? 0) + total, guestCount: t.guestCount ?? 2 }
              : t,
          ),
        );
      }
      // Simpan ke Neon PostgreSQL di background (Serverless Function /api/orders)
      void saveOrderToNeon({ outletId, order: newOrder, orderType });
    },
    [cart.items, cart.total, mode, orderNumber, orderType, outletId, tableNumber],
  );

  const handlePayCash = useCallback((cashReceived: number) => completeOrder('cash', cashReceived), [completeOrder]);

  const handleNewTransaction = () => {
    cart.clear();
    setCompletedOrder(null);
    setOrderNumber((n) => n + 1);
  };

  const setAvailable = (kind: 'menu' | 'egg' | 'topping', id: string, available: boolean) => {
    if (kind === 'menu') setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, available } : m)));
    if (kind === 'egg') setEggs((prev) => prev.map((e) => (e.id === id ? { ...e, available } : e)));
    if (kind === 'topping') setToppings((prev) => prev.map((t) => (t.id === id ? { ...t, available } : t)));
    void mutateNeon('toggle_availability', { kind, id, available }, outletId);
  };

  const goOwner = (page: OwnerPage) => {
    setMode('owner');
    setOwnerPage(page);
  };

  const orderPanelProps = {
    cart,
    orderNumber,
    orderType,
    onOrderTypeChange: setOrderType,
    tableNumber,
    tables,
    onTableChange: setTableNumber,
    onPayCash: handlePayCash,
    onPayQris: () => setQrisOpen(true),
    hotkeysEnabled,
  };

  const renderOwnerPage = () => {
    switch (ownerPage) {
      case 'dasbor':
        return <DashboardPage onNavigate={setOwnerPage} />;
      case 'menu':
        return (
          <MenuPage
            menu={menu}
            eggs={eggs}
            toppings={toppings}
            onSetAvailable={setAvailable}
            onAddMenuItem={(item) => {
              setMenu((prev) => [...prev, item]);
              void mutateNeon('add_menu_item', { item }, outletId);
            }}
            onAddTopping={(t) => {
              setToppings((prev) => [...prev, t]);
              void mutateNeon('add_topping', { topping: t }, outletId);
            }}
          />
        );
      case 'laporan':
        return <ReportsPage />;
      case 'inventori':
        return (
          <InventoryPage
            items={stock}
            onStockIn={(id, qty) => {
              setStock((prev) => prev.map((s) => (s.id === id ? { ...s, stock: s.stock + qty } : s)));
              void mutateNeon('stock_in', { id, qty }, outletId);
            }}
            onCreatePo={(items) => {
              setPoDraftItems(items);
              setOwnerPage('pembelian');
            }}
          />
        );
      case 'pembelian':
        return (
          <PurchasingPage
            orders={purchaseOrders}
            onChange={(nextOrders) => {
              setPurchaseOrders(nextOrders);
              void mutateNeon('sync_purchase_orders', { orders: nextOrders }, outletId);
            }}
            draftItems={poDraftItems}
            onDraftHandled={() => setPoDraftItems(undefined)}
          />
        );
      case 'karyawan':
        return (
          <StaffPage
            employees={employees}
            onAddEmployee={(e) => {
              setEmployees((prev) => [...prev, e]);
              void mutateNeon('add_employee', { employee: e }, outletId);
            }}
          />
        );
      case 'outlet':
        return (
          <OutletsPage
            outlets={OUTLETS}
            onOpenOutlet={(id) => {
              setOutletId(id);
              setOwnerPage('dasbor');
            }}
          />
        );
      case 'pengaturan':
        return (
          <SettingsPage
            profile={profile}
            onSave={(nextProfile) => {
              setProfile(nextProfile);
              void mutateNeon('save_profile', { profile: nextProfile }, outletId);
            }}
            onOpenPrinter={() => setPrinterOpen(true)}
          />
        );
    }
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden select-none">
      {mode === 'owner' ? (
        <OwnerPanel
          active={ownerPage}
          onNavigate={setOwnerPage}
          outlets={OUTLETS}
          outletId={outletId}
          onOutletChange={setOutletId}
          onOpenCashier={() => setMode('cashier')}
        >
          {renderOwnerPage()}
        </OwnerPanel>
      ) : isDesktop ? (
        <RegisterScreen
          {...orderPanelProps}
          menu={menu}
          cashierName={CASHIER.name}
          shiftLabel={CASHIER.shift}
          printerConfig={printerConfig}
          onOpenPrinter={() => setPrinterOpen(true)}
          onOpenOwner={() => goOwner('dasbor')}
          onSelectItem={handleSelectItem}
        />
      ) : (
        <MobileRegister
          {...orderPanelProps}
          menu={menu}
          cashierName={CASHIER.name}
          shiftLabel={CASHIER.shift}
          onSelectItem={handleSelectItem}
        />
      )}

      {customizing && (
        <ToppingModal
          item={customizing}
          eggs={eggs.filter((e) => e.available !== false)}
          toppings={toppings.filter((t) => t.available !== false)}
          onClose={() => setCustomizing(null)}
          onConfirm={(customization, quantity) => {
            cart.addItem(customizing, customization, quantity);
            setCustomizing(null);
          }}
        />
      )}

      {qrisOpen && (
        <QrisModal
          total={cart.total}
          onClose={() => setQrisOpen(false)}
          onPaid={() => {
            setQrisOpen(false);
            completeOrder('qris');
          }}
        />
      )}

      {completedOrder && (
        <ChangeModal
          order={completedOrder}
          printerConfig={printerConfig}
          onNewTransaction={handleNewTransaction}
          onOpenPrinter={() => setPrinterOpen(true)}
        />
      )}

      {printerOpen && (
        <PrinterSettingsModal
          config={printerConfig}
          onSaveConfig={setPrinterConfig}
          onClose={() => setPrinterOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
