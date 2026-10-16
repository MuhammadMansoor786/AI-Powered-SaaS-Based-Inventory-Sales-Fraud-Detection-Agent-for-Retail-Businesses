export type UserRole = 
  | 'super_admin'
  | 'store_owner'
  | 'store_manager'
  | 'cashier'
  | 'inventory_staff'
  | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  branchId: string;
  avatarUrl?: string;
  shiftStatus?: 'active' | 'inactive';
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'trial' | 'suspended';
  createdAt: string;
  currency: string;
  branchesCount: number;
  monthlyRevenue: number;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isMain: boolean;
  activeStaffCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  color: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  maxStock: number;
  supplierId: string;
  supplierName: string;
  leadTimeDays: number;
  avgDailySales: number;
  taxRate: number; // e.g. 0.08 for 8%
  imageUrl?: string;
  status: 'active' | 'discontinued' | 'draft';
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercent?: number;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costPrice: number;
}

export interface PaymentDetails {
  method: 'cash' | 'card' | 'digital_wallet' | 'split';
  amountTendered: number;
  changeDue: number;
  referenceNumber?: string;
}

export interface Sale {
  id: string;
  tenantId: string;
  branchId: string;
  receiptNumber: string;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  payment: PaymentDetails;
  status: 'completed' | 'refunded' | 'partially_refunded' | 'voided';
  refundedAmount?: number;
  timestamp: string;
  fraudScore?: number;
  notes?: string;
}

export interface Refund {
  id: string;
  saleId: string;
  receiptNumber: string;
  cashierId: string;
  cashierName: string;
  approvedBy?: string;
  reason: 'defective' | 'customer_changed_mind' | 'wrong_item' | 'duplicate_charge' | 'other';
  amount: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    refundAmount: number;
    returnedToInventory: boolean;
  }[];
  timestamp: string;
  riskFlag?: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  branchId: string;
  type: 'sale' | 'purchase_receipt' | 'adjustment_in' | 'adjustment_out' | 'transfer_in' | 'transfer_out' | 'return';
  quantityDelta: number;
  resultingBalance: number;
  reason: string;
  referenceId: string;
  performedBy: string;
  timestamp: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  previousStock: number;
  newStock: number;
  difference: number;
  reason: 'damaged' | 'theft_or_loss' | 'count_audit' | 'expired' | 'supplier_correction';
  authorizedBy: string;
  timestamp: string;
}

export interface StockTransfer {
  id: string;
  productId: string;
  productName: string;
  sourceBranchId: string;
  sourceBranchName: string;
  targetBranchId: string;
  targetBranchName: string;
  quantity: number;
  status: 'pending' | 'in_transit' | 'received' | 'cancelled';
  initiatedBy: string;
  receivedBy?: string;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  leadTimeDays: number;
  rating: number; // 1-5
  status: 'active' | 'preferred' | 'inactive';
  suppliedCategories: string[];
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  branchId: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  receivedDate?: string;
  createdBy: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  loyaltyPoints: number;
  totalSpend: number;
  visitCount: number;
  lastPurchaseDate: string;
}

export interface FraudAlert {
  id: string;
  tenantId: string;
  branchId: string;
  transactionId?: string;
  cashierId: string;
  cashierName: string;
  type: 
    | 'suspicious_refund'
    | 'repeated_void'
    | 'excessive_discount'
    | 'after_hours_sale'
    | 'rapid_transactions'
    | 'cash_discrepancy'
    | 'inventory_shrinkage';
  riskScore: number; // 0 - 100
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  indicators: string[];
  status: 'pending' | 'investigating' | 'approved_legitimate' | 'escalated' | 'confirmed_fraud';
  timestamp: string;
  investigatedBy?: string;
  resolutionNotes?: string;
}

export interface RestockRecommendation {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  safetyStock: number;
  avgDailySales: number;
  leadTimeDays: number;
  projectedStockoutDays: number;
  suggestedOrderQty: number;
  supplierId: string;
  supplierName: string;
  estimatedCost: number;
  priority: 'critical' | 'moderate' | 'healthy';
  status: 'pending' | 'po_created' | 'dismissed';
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  insights?: {
    type: 'metric' | 'table' | 'recommendation' | 'alert';
    data?: any;
  }[];
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'auth' | 'pos' | 'inventory' | 'fraud' | 'system' | 'billing';
  details: string;
  ipAddress: string;
  timestamp: string;
}
