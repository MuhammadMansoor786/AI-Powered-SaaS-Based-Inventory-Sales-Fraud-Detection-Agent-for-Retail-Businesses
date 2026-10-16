import type { UserRole } from '../types.ts';

export interface CartCalculationInputItem {
  price: number;
  quantity: number;
  discountPercent?: number;
}

export interface CartTotalsResult {
  subtotal: number;
  discountTotal: number;
  taxableSubtotal: number;
  taxTotal: number;
  grandTotal: number;
  itemCount: number;
}

/**
 * Calculates item totals, percentage or fixed discounts, and sales tax.
 */
export function calculateCartTotals(
  items: CartCalculationInputItem[],
  globalDiscountPercent: number = 0,
  taxRate: number = 0.08
): CartTotalsResult {
  let subtotal = 0;
  let itemLevelDiscount = 0;
  let totalItems = 0;

  for (const item of items) {
    const itemSub = item.price * item.quantity;
    subtotal += itemSub;
    totalItems += item.quantity;

    if (item.discountPercent && item.discountPercent > 0) {
      const discount = itemSub * (Math.min(100, item.discountPercent) / 100);
      itemLevelDiscount += discount;
    }
  }

  const subtotalAfterItemDiscounts = Math.max(0, subtotal - itemLevelDiscount);
  const orderDiscount = subtotalAfterItemDiscounts * (Math.min(100, Math.max(0, globalDiscountPercent)) / 100);
  const totalDiscount = Number((itemLevelDiscount + orderDiscount).toFixed(2));
  
  const taxableSubtotal = Math.max(0, subtotal - totalDiscount);
  const taxTotal = Number((taxableSubtotal * Math.max(0, taxRate)).toFixed(2));
  const grandTotal = Number((taxableSubtotal + taxTotal).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountTotal: totalDiscount,
    taxableSubtotal: Number(taxableSubtotal.toFixed(2)),
    taxTotal,
    grandTotal,
    itemCount: totalItems,
  };
}

/**
 * Calculates change due for cash or split payments.
 */
export function calculateChangeDue(tendered: number, total: number): number {
  if (tendered <= total) return 0;
  return Number((tendered - total).toFixed(2));
}

export interface FraudEvaluationInput {
  subtotal: number;
  discountPercent: number;
  isRefund?: boolean;
  refundHasReceipt?: boolean;
  consecutiveVoidCount?: number;
  isAfterHours?: boolean; // after 22:00 or before 07:00
  secondsSinceLastTransaction?: number;
  cashierMismatchAmount?: number;
}

export interface FraudEvaluationResult {
  riskScore: number; // 0 to 100
  severity: 'low' | 'medium' | 'high' | 'critical';
  isFlagged: boolean;
  reasons: string[];
}

/**
 * Evaluates risk score using multi-factor heuristic fraud rules.
 */
export function evaluateFraudRisk(input: FraudEvaluationInput): FraudEvaluationResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Unusual or excessive discount
  if (input.discountPercent >= 50) {
    score += 45;
    reasons.push(`Extreme discount applied (${input.discountPercent}% exceeds 50% limit)`);
  } else if (input.discountPercent >= 25) {
    score += 20;
    reasons.push(`High discount applied (${input.discountPercent}%)`);
  }

  // 2. Suspicious refund without receipt
  if (input.isRefund) {
    score += 15;
    if (!input.refundHasReceipt) {
      score += 40;
      reasons.push('Refund initiated without verifiable original receipt barcode');
    }
    if (input.subtotal > 200) {
      score += 20;
      reasons.push(`High value refund ($${input.subtotal}) requires manager authorization`);
    }
  }

  // 3. Repeated void pattern in cashier shift
  if (input.consecutiveVoidCount && input.consecutiveVoidCount >= 3) {
    const voidRisk = Math.min(45, input.consecutiveVoidCount * 12);
    score += voidRisk;
    reasons.push(`${input.consecutiveVoidCount} consecutive voided orders detected on terminal`);
  }

  // 4. Abnormal velocity / rapid consecutive checkouts
  if (input.secondsSinceLastTransaction !== undefined && input.secondsSinceLastTransaction < 3) {
    score += 25;
    reasons.push(`Abnormal transaction velocity (${input.secondsSinceLastTransaction}s gap)`);
  }

  // 5. After hours transactions
  if (input.isAfterHours) {
    score += 25;
    reasons.push('Transaction executed outside authorized operating hours');
  }

  // 6. Cash drawer discrepancy
  if (input.cashierMismatchAmount && Math.abs(input.cashierMismatchAmount) > 20) {
    score += 30;
    reasons.push(`Cash drawer variance ($${Math.abs(input.cashierMismatchAmount)} mismatch)`);
  }

  const boundedScore = Math.min(100, Math.max(0, score));

  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (boundedScore >= 75) severity = 'critical';
  else if (boundedScore >= 50) severity = 'high';
  else if (boundedScore >= 25) severity = 'medium';

  return {
    riskScore: boundedScore,
    severity,
    isFlagged: boundedScore >= 35,
    reasons,
  };
}

export interface ReorderCalculationInput {
  currentStock: number;
  avgDailySales: number;
  leadTimeDays: number;
  safetyStockFactor?: number; // default 1.5 (safety buffer factor)
  maxStockCapacity?: number;
}

export interface ReorderMetricsResult {
  leadTimeDemand: number;
  safetyStock: number;
  reorderPoint: number;
  projectedStockoutDays: number;
  suggestedOrderQty: number;
  priority: 'critical' | 'moderate' | 'healthy';
}

/**
 * Calculates predictive inventory replenishment metrics based on lead time & demand.
 */
export function calculateReorderMetrics(input: ReorderCalculationInput): ReorderMetricsResult {
  const avgSales = Math.max(0.1, input.avgDailySales);
  const leadTime = Math.max(1, input.leadTimeDays);
  const safetyFactor = input.safetyStockFactor ?? 1.5;

  const leadTimeDemand = Math.round(avgSales * leadTime);
  const safetyStock = Math.round(avgSales * Math.sqrt(leadTime) * safetyFactor);
  const reorderPoint = leadTimeDemand + safetyStock;

  const projectedStockoutDays = Number((input.currentStock / avgSales).toFixed(1));

  let suggestedOrderQty = 0;
  if (input.currentStock <= reorderPoint) {
    const targetBuffer = input.maxStockCapacity ?? (reorderPoint * 2.5);
    suggestedOrderQty = Math.max(10, Math.round(targetBuffer - input.currentStock));
  }

  let priority: 'critical' | 'moderate' | 'healthy' = 'healthy';
  if (projectedStockoutDays <= 3 || input.currentStock === 0) {
    priority = 'critical';
  } else if (projectedStockoutDays <= leadTime + 2 || input.currentStock <= reorderPoint) {
    priority = 'moderate';
  }

  return {
    leadTimeDemand,
    safetyStock,
    reorderPoint,
    projectedStockoutDays,
    suggestedOrderQty,
    priority,
  };
}

export type AppPermission =
  | 'pos:checkout'
  | 'pos:discount'
  | 'pos:void'
  | 'pos:refund'
  | 'inventory:view'
  | 'inventory:adjust'
  | 'inventory:transfer'
  | 'purchase:create'
  | 'purchase:receive'
  | 'fraud:view'
  | 'fraud:resolve'
  | 'reports:view'
  | 'staff:manage'
  | 'tenants:manage';

const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  super_admin: [
    'pos:checkout',
    'pos:discount',
    'pos:void',
    'pos:refund',
    'inventory:view',
    'inventory:adjust',
    'inventory:transfer',
    'purchase:create',
    'purchase:receive',
    'fraud:view',
    'fraud:resolve',
    'reports:view',
    'staff:manage',
    'tenants:manage',
  ],
  store_owner: [
    'pos:checkout',
    'pos:discount',
    'pos:void',
    'pos:refund',
    'inventory:view',
    'inventory:adjust',
    'inventory:transfer',
    'purchase:create',
    'purchase:receive',
    'fraud:view',
    'fraud:resolve',
    'reports:view',
    'staff:manage',
  ],
  store_manager: [
    'pos:checkout',
    'pos:discount',
    'pos:void',
    'pos:refund',
    'inventory:view',
    'inventory:adjust',
    'inventory:transfer',
    'purchase:create',
    'purchase:receive',
    'fraud:view',
    'fraud:resolve',
    'reports:view',
  ],
  cashier: [
    'pos:checkout',
    'inventory:view',
  ],
  inventory_staff: [
    'inventory:view',
    'inventory:adjust',
    'inventory:transfer',
    'purchase:create',
    'purchase:receive',
  ],
  accountant: [
    'inventory:view',
    'reports:view',
    'fraud:view',
  ],
};

/**
 * Validates role-based permission access.
 */
export function checkPermission(role: UserRole, permission: AppPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}
