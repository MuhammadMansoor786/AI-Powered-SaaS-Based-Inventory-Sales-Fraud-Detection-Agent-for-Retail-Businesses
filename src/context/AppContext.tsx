import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Tenant,
  Branch,
  Product,
  Category,
  Supplier,
  Sale,
  Refund,
  FraudAlert,
  RestockRecommendation,
  PurchaseOrder,
  Customer,
  StockMovement,
  AuditLog,
  CartItem,
} from '../types.ts';
import {
  INITIAL_USERS,
  INITIAL_TENANTS,
  INITIAL_BRANCHES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_FRAUD_ALERTS,
  INITIAL_RESTOCK_RECOMMENDATIONS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_AUDIT_LOGS,
} from '../mockData.ts';
import {
  calculateCartTotals,
  evaluateFraudRisk,
  checkPermission,
  AppPermission,
} from '../utils/businessLogic.ts';

export type ActiveAppView = 'public' | 'dashboard' | 'superadmin';

export type DashboardSubView =
  | 'overview'
  | 'pos'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'suppliers'
  | 'purchase_orders'
  | 'sales_history'
  | 'returns_refunds'
  | 'customers'
  | 'reports'
  | 'fraud_center'
  | 'restocking'
  | 'ai_assistant'
  | 'staff'
  | 'branches'
  | 'notifications'
  | 'billing'
  | 'settings'
  | 'audit_logs';

export type SuperAdminSubView =
  | 'platform_overview'
  | 'tenants'
  | 'subscription_plans'
  | 'ai_monitoring'
  | 'system_health'
  | 'global_audits';

interface AppContextType {
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  dashboardSubView: DashboardSubView;
  setDashboardSubView: (subView: DashboardSubView) => void;
  superAdminSubView: SuperAdminSubView;
  setSuperAdminSubView: (subView: SuperAdminSubView) => void;
  
  // Auth & RBAC
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  hasPermission: (permission: AppPermission) => boolean;

  // Multi-tenant & Branches
  tenants: Tenant[];
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  branches: Branch[];
  currentBranch: Branch;
  setCurrentBranch: (branch: Branch) => void;
  users: User[];

  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, newStock: number, reason: string) => void;
  transferStock: (productId: string, sourceBranchId: string, targetBranchId: string, quantity: number) => void;

  // POS & Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  globalDiscountPercent: number;
  setGlobalDiscountPercent: (pct: number) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  heldCarts: { id: string; name: string; timestamp: string; items: CartItem[]; discount: number; customer: Customer | null }[];
  holdCurrentCart: (name?: string) => void;
  restoreHeldCart: (id: string) => void;
  deleteHeldCart: (id: string) => void;
  completeCheckout: (payment: { method: 'cash' | 'card' | 'digital_wallet'; amountTendered: number; reference?: string }) => Sale;

  // Sales & Refunds
  sales: Sale[];
  refunds: Refund[];
  processRefund: (saleId: string, itemRefunds: { productId: string; quantity: number; amount: number; returnToStock: boolean }[], reason: any) => void;

  // Suppliers & Purchasing
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  createPurchaseOrder: (supplierId: string, items: { productId: string; quantity: number; unitCost: number }[]) => PurchaseOrder;
  receivePurchaseOrder: (poId: string) => void;

  // AI & Fraud
  fraudAlerts: FraudAlert[];
  updateFraudAlertStatus: (alertId: string, status: FraudAlert['status'], resolutionNotes?: string) => void;
  restockRecommendations: RestockRecommendation[];
  createPOFromRestockRecommendation: (recommendationId: string) => void;

  // Customers, Movements, Audits
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpend' | 'visitCount' | 'lastPurchaseDate'>) => Customer;
  stockMovements: StockMovement[];
  auditLogs: AuditLog[];
  logAudit: (action: string, category: AuditLog['category'], details: string) => void;

  // System notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveAppView>('dashboard');
  const [dashboardSubView, setDashboardSubView] = useState<DashboardSubView>('overview');
  const [superAdminSubView, setSuperAdminSubView] = useState<SuperAdminSubView>('platform_overview');

  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<Branch>(INITIAL_BRANCHES[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Elena Vance (Store Owner)

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(INITIAL_FRAUD_ALERTS);
  const [restockRecommendations, setRestockRecommendations] = useState<RestockRecommendation[]>(INITIAL_RESTOCK_RECOMMENDATIONS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [heldCarts, setHeldCarts] = useState<{ id: string; name: string; timestamp: string; items: CartItem[]; discount: number; customer: Customer | null }[]>([]);

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const setCurrentUserRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || {
      id: `usr-${role}`,
      name: `${role.replace('_', ' ').toUpperCase()} User`,
      email: `${role}@omniflow.io`,
      role,
      tenantId: currentTenant.id,
      branchId: currentBranch.id,
      shiftStatus: 'active',
    };
    setCurrentUser(matched);
    showToast(`Switched active role to: ${matched.role.replace('_', ' ').toUpperCase()}`);
    logAudit('ROLE_SWITCH', 'auth', `Switched active preview role to ${matched.role}`);
  };

  const hasPermission = (permission: AppPermission): boolean => {
    return checkPermission(currentUser.role, permission);
  };

  const logAudit = (action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      category,
      details,
      ipAddress: '192.168.1.102',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Products
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added successfully.`);
    logAudit('PRODUCT_CREATED', 'inventory', `Created product ${newProd.name} (${newProd.sku})`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated.');
    logAudit('PRODUCT_UPDATED', 'inventory', `Updated product ID: ${id}`);
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
    showToast(`Product "${p?.name || id}" removed.`);
    logAudit('PRODUCT_DELETED', 'inventory', `Deleted product ${p?.name || id}`);
  };

  const adjustStock = (productId: string, newStock: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const diff = newStock - prod.stock;
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)));

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: prod.name,
      sku: prod.sku,
      branchId: currentBranch.id,
      type: diff >= 0 ? 'adjustment_in' : 'adjustment_out',
      quantityDelta: diff,
      resultingBalance: newStock,
      reason: `Adjustment: ${reason}`,
      referenceId: `adj-${Date.now()}`,
      performedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setStockMovements((prev) => [movement, ...prev]);
    showToast(`Stock updated for ${prod.name} (${diff > 0 ? `+${diff}` : diff} units).`);
    logAudit('STOCK_ADJUSTMENT', 'inventory', `Adjusted stock for ${prod.name} to ${newStock} (${reason})`);
  };

  const transferStock = (productId: string, sourceBranchId: string, targetBranchId: string, quantity: number) => {
    const prod = products.find((p) => p.id === productId);
    const targetBranch = branches.find((b) => b.id === targetBranchId);
    if (!prod || !targetBranch) return;

    const newStock = Math.max(0, prod.stock - quantity);
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)));

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: prod.name,
      sku: prod.sku,
      branchId: sourceBranchId,
      type: 'transfer_out',
      quantityDelta: -quantity,
      resultingBalance: newStock,
      reason: `Transfer to ${targetBranch.name}`,
      referenceId: `trf-${Date.now()}`,
      performedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setStockMovements((prev) => [movement, ...prev]);
    showToast(`Transferred ${quantity} units of ${prod.name} to ${targetBranch.name}.`);
    logAudit('STOCK_TRANSFER', 'inventory', `Transferred ${quantity}x ${prod.name} to ${targetBranch.name}`);
  };

  // Cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setGlobalDiscountPercent(0);
    setSelectedCustomer(null);
  };

  const holdCurrentCart = (name?: string) => {
    if (cart.length === 0) return;
    const label = name || `Held Cart #${heldCarts.length + 1} (${cart.length} items)`;
    const newHeld = {
      id: `held-${Date.now()}`,
      name: label,
      timestamp: new Date().toLocaleTimeString(),
      items: [...cart],
      discount: globalDiscountPercent,
      customer: selectedCustomer,
    };
    setHeldCarts((prev) => [newHeld, ...prev]);
    clearCart();
    showToast(`Cart suspended and parked as "${label}".`);
  };

  const restoreHeldCart = (id: string) => {
    const target = heldCarts.find((h) => h.id === id);
    if (!target) return;
    setCart(target.items);
    setGlobalDiscountPercent(target.discount);
    setSelectedCustomer(target.customer);
    setHeldCarts((prev) => prev.filter((h) => h.id !== id));
    showToast(`Restored held cart "${target.name}".`);
  };

  const deleteHeldCart = (id: string) => {
    setHeldCarts((prev) => prev.filter((h) => h.id !== id));
    showToast('Held cart cleared.');
  };

  // POS Checkout
  const completeCheckout = (payment: {
    method: 'cash' | 'card' | 'digital_wallet';
    amountTendered: number;
    reference?: string;
  }): Sale => {
    const inputItems = cart.map((c) => ({
      price: c.product.sellingPrice,
      quantity: c.quantity,
      discountPercent: c.discountPercent,
    }));
    const totals = calculateCartTotals(inputItems, globalDiscountPercent, 0.08875);

    const saleItems = cart.map((c) => ({
      productId: c.product.id,
      productName: c.product.name,
      sku: c.product.sku,
      quantity: c.quantity,
      unitPrice: c.product.sellingPrice,
      totalPrice: Number((c.product.sellingPrice * c.quantity).toFixed(2)),
      costPrice: c.product.costPrice,
    }));

    // Evaluate AI fraud risk
    const fraudEval = evaluateFraudRisk({
      subtotal: totals.subtotal,
      discountPercent: globalDiscountPercent,
      secondsSinceLastTransaction: 45,
    });

    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      tenantId: currentTenant.id,
      branchId: currentBranch.id,
      receiptNumber: receiptNum,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      items: saleItems,
      subtotal: totals.subtotal,
      discountAmount: totals.discountTotal,
      taxAmount: totals.taxTotal,
      total: totals.grandTotal,
      payment: {
        method: payment.method,
        amountTendered: payment.amountTendered,
        changeDue: Math.max(0, Number((payment.amountTendered - totals.grandTotal).toFixed(2))),
        referenceNumber: payment.reference,
      },
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      fraudScore: fraudEval.riskScore,
    };

    // Update product stock counts
    setProducts((prev) =>
      prev.map((p) => {
        const bought = cart.find((c) => c.product.id === p.id);
        if (!bought) return p;
        return {
          ...p,
          stock: Math.max(0, p.stock - bought.quantity),
        };
      })
    );

    // Record stock movements
    for (const c of cart) {
      const prod = products.find((p) => p.id === c.product.id);
      const newBalance = Math.max(0, (prod?.stock ?? 0) - c.quantity);
      const mov: StockMovement = {
        id: `mov-${Date.now()}-${c.product.id}`,
        productId: c.product.id,
        productName: c.product.name,
        sku: c.product.sku,
        branchId: currentBranch.id,
        type: 'sale',
        quantityDelta: -c.quantity,
        resultingBalance: newBalance,
        reason: `POS Checkout ${receiptNum}`,
        referenceId: newSale.id,
        performedBy: currentUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setStockMovements((prev) => [mov, ...prev]);
    }

    // Flag fraud alert if triggered
    if (fraudEval.isFlagged) {
      const newAlert: FraudAlert = {
        id: `frd-${Date.now()}`,
        tenantId: currentTenant.id,
        branchId: currentBranch.id,
        transactionId: newSale.id,
        cashierId: currentUser.id,
        cashierName: currentUser.name,
        type: 'excessive_discount',
        riskScore: fraudEval.riskScore,
        severity: fraudEval.severity,
        title: `High Risk Transaction Flagged (${receiptNum})`,
        description: fraudEval.reasons.join('. '),
        indicators: fraudEval.reasons,
        status: 'pending',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setFraudAlerts((prev) => [newAlert, ...prev]);
    }

    // Update customer spend & loyalty points if customer attached
    if (selectedCustomer) {
      const addedPoints = Math.floor(totals.grandTotal);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                totalSpend: Number((c.totalSpend + totals.grandTotal).toFixed(2)),
                loyaltyPoints: c.loyaltyPoints + addedPoints,
                visitCount: c.visitCount + 1,
                lastPurchaseDate: new Date().toISOString().slice(0, 10),
              }
            : c
        )
      );
    }

    setSales((prev) => [newSale, ...prev]);
    logAudit('POS_CHECKOUT', 'pos', `Completed sale ${receiptNum} for $${totals.grandTotal}`);
    clearCart();
    return newSale;
  };

  // Refunds
  const processRefund = (
    saleId: string,
    itemRefunds: { productId: string; quantity: number; amount: number; returnToStock: boolean }[],
    reason: any
  ) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return;

    const totalRefundAmt = itemRefunds.reduce((acc, curr) => acc + curr.amount, 0);

    const newRefund: Refund = {
      id: `ref-${Date.now()}`,
      saleId,
      receiptNumber: sale.receiptNumber,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      reason,
      amount: totalRefundAmt,
      items: itemRefunds.map((i) => {
        const itemInfo = sale.items.find((si) => si.productId === i.productId);
        return {
          productId: i.productId,
          productName: itemInfo?.productName || 'Item',
          quantity: i.quantity,
          refundAmount: i.amount,
          returnedToInventory: i.returnToStock,
        };
      }),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    // Return to inventory if selected
    itemRefunds.forEach((ir) => {
      if (ir.returnToStock) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === ir.productId ? { ...p, stock: p.stock + ir.quantity } : p
          )
        );
      }
    });

    setRefunds((prev) => [newRefund, ...prev]);
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: 'refunded', refundedAmount: totalRefundAmt } : s))
    );

    showToast(`Refund of $${totalRefundAmt.toFixed(2)} processed for ${sale.receiptNumber}.`);
    logAudit('REFUND_PROCESSED', 'pos', `Processed refund for ${sale.receiptNumber} ($${totalRefundAmt})`);
  };

  // Suppliers & POs
  const createPurchaseOrder = (
    supplierId: string,
    items: { productId: string; quantity: number; unitCost: number }[]
  ): PurchaseOrder => {
    const sup = suppliers.find((s) => s.id === supplierId);
    const poItems = items.map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      return {
        productId: i.productId,
        productName: prod?.name || 'Product',
        sku: prod?.sku || 'SKU',
        orderedQuantity: i.quantity,
        receivedQuantity: 0,
        unitCost: i.unitCost,
        totalCost: Number((i.quantity * i.unitCost).toFixed(2)),
      };
    });

    const totalCost = poItems.reduce((acc, curr) => acc + curr.totalCost, 0);
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId,
      supplierName: sup?.name || 'Supplier',
      branchId: currentBranch.id,
      items: poItems,
      totalCost,
      status: 'ordered',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
      createdBy: currentUser.name,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    showToast(`Purchase Order ${newPO.poNumber} created and sent to ${newPO.supplierName}.`);
    logAudit('PO_CREATED', 'inventory', `Created purchase order ${newPO.poNumber} ($${totalCost})`);
    return newPO;
  };

  const receivePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    // Check in products into inventory
    po.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId ? { ...p, stock: p.stock + item.orderedQuantity } : p
        )
      );

      const mov: StockMovement = {
        id: `mov-${Date.now()}-${item.productId}`,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        branchId: currentBranch.id,
        type: 'purchase_receipt',
        quantityDelta: item.orderedQuantity,
        resultingBalance: (products.find((p) => p.id === item.productId)?.stock || 0) + item.orderedQuantity,
        reason: `Goods Received: ${po.poNumber}`,
        referenceId: po.id,
        performedBy: currentUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setStockMovements((prev) => [mov, ...prev]);
    });

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'received',
              receivedDate: new Date().toISOString().slice(0, 10),
              items: p.items.map((i) => ({ ...i, receivedQuantity: i.orderedQuantity })),
            }
          : p
      )
    );

    showToast(`Goods checked in! ${po.items.length} product lines received into stock.`);
    logAudit('GOODS_RECEIVED', 'inventory', `Checked in goods for ${po.poNumber}`);
  };

  // Fraud alerts
  const updateFraudAlertStatus = (
    alertId: string,
    status: FraudAlert['status'],
    resolutionNotes?: string
  ) => {
    setFraudAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status,
              resolutionNotes: resolutionNotes || a.resolutionNotes,
              investigatedBy: currentUser.name,
            }
          : a
      )
    );
    showToast(`Fraud alert marked as "${status.replace('_', ' ').toUpperCase()}".`);
    logAudit('FRAUD_ALERT_RESOLVED', 'fraud', `Updated fraud alert ${alertId} to ${status}`);
  };

  // Restock 1-click PO generator
  const createPOFromRestockRecommendation = (recommendationId: string) => {
    const rec = restockRecommendations.find((r) => r.id === recommendationId);
    if (!rec) return;

    const prod = products.find((p) => p.id === rec.productId);
    const unitCost = prod?.costPrice || 25;

    const po = createPurchaseOrder(rec.supplierId, [
      {
        productId: rec.productId,
        quantity: rec.suggestedOrderQty,
        unitCost,
      },
    ]);

    setRestockRecommendations((prev) =>
      prev.map((r) => (r.id === recommendationId ? { ...r, status: 'po_created' } : r))
    );

    showToast(`Automated PO ${po.poNumber} created for ${rec.productName}!`);
  };

  // Customers
  const addCustomer = (
    c: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpend' | 'visitCount' | 'lastPurchaseDate'>
  ): Customer => {
    const newCust: Customer = {
      ...c,
      id: `cust-${Date.now()}`,
      loyaltyPoints: 50, // welcome bonus
      totalSpend: 0,
      visitCount: 1,
      lastPurchaseDate: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Customer ${newCust.name} added.`);
    logAudit('CUSTOMER_CREATED', 'pos', `Added customer ${newCust.name}`);
    return newCust;
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        dashboardSubView,
        setDashboardSubView,
        superAdminSubView,
        setSuperAdminSubView,
        currentUser,
        setCurrentUserRole,
        hasPermission,
        tenants,
        currentTenant,
        setCurrentTenant,
        branches,
        currentBranch,
        setCurrentBranch,
        users,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        transferStock,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        globalDiscountPercent,
        setGlobalDiscountPercent,
        selectedCustomer,
        setSelectedCustomer,
        heldCarts,
        holdCurrentCart,
        restoreHeldCart,
        deleteHeldCart,
        completeCheckout,
        sales,
        refunds,
        processRefund,
        suppliers,
        purchaseOrders,
        createPurchaseOrder,
        receivePurchaseOrder,
        fraudAlerts,
        updateFraudAlertStatus,
        restockRecommendations,
        createPOFromRestockRecommendation,
        customers,
        addCustomer,
        stockMovements,
        auditLogs,
        logAudit,
        toastMessage,
        showToast,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      <div className={isDarkMode ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
        {children}
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-slide-up text-sm font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
