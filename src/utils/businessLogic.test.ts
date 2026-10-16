import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  calculateChangeDue,
  evaluateFraudRisk,
  calculateReorderMetrics,
  checkPermission,
} from './businessLogic.ts';

test('calculateCartTotals computes subtotal, discounts and tax accurately', () => {
  const items = [
    { price: 100, quantity: 2 }, // 200
    { price: 50, quantity: 1, discountPercent: 10 }, // 50 - 5 = 45
  ];
  // Subtotal = 250. Item discount = 5. Subtotal after item discount = 245.
  // 10% global discount on 245 = 24.5. Total discount = 29.5.
  // Taxable subtotal = 220.5. Tax @ 10% = 22.05. Grand total = 242.55.
  const totals = calculateCartTotals(items, 10, 0.10);

  assert.equal(totals.subtotal, 250);
  assert.equal(totals.discountTotal, 29.5);
  assert.equal(totals.taxableSubtotal, 220.5);
  assert.equal(totals.taxTotal, 22.05);
  assert.equal(totals.grandTotal, 242.55);
  assert.equal(totals.itemCount, 3);
});

test('calculateChangeDue calculates correct change for cash payments', () => {
  assert.equal(calculateChangeDue(50, 42.50), 7.50);
  assert.equal(calculateChangeDue(40, 42.50), 0);
  assert.equal(calculateChangeDue(100, 100), 0);
});

test('evaluateFraudRisk flags excessive discount and suspicious refund', () => {
  // Low risk normal transaction
  const cleanResult = evaluateFraudRisk({
    subtotal: 45,
    discountPercent: 5,
  });
  assert.equal(cleanResult.severity, 'low');
  assert.equal(cleanResult.isFlagged, false);

  // High risk transaction with extreme discount and rapid velocity
  const riskyResult = evaluateFraudRisk({
    subtotal: 500,
    discountPercent: 60,
    secondsSinceLastTransaction: 1,
    consecutiveVoidCount: 3,
  });
  assert.equal(riskyResult.isFlagged, true);
  assert.equal(riskyResult.severity, 'critical');
  assert.ok(riskyResult.riskScore >= 75);
  assert.ok(riskyResult.reasons.length >= 3);
});

test('calculateReorderMetrics flags low stock and calculates reorder quantity', () => {
  const restock = calculateReorderMetrics({
    currentStock: 5,
    avgDailySales: 10,
    leadTimeDays: 4,
  });

  assert.equal(restock.priority, 'critical');
  assert.equal(restock.projectedStockoutDays, 0.5);
  assert.ok(restock.reorderPoint > 5);
  assert.ok(restock.suggestedOrderQty > 0);
});

test('checkPermission enforces role-based access control accurately', () => {
  // Cashier can checkout but cannot adjust inventory or manage tenants
  assert.equal(checkPermission('cashier', 'pos:checkout'), true);
  assert.equal(checkPermission('cashier', 'inventory:adjust'), false);
  assert.equal(checkPermission('cashier', 'tenants:manage'), false);

  // Inventory staff can adjust inventory but cannot checkout on POS
  assert.equal(checkPermission('inventory_staff', 'inventory:adjust'), true);
  assert.equal(checkPermission('inventory_staff', 'pos:checkout'), false);

  // Super admin has full privileges
  assert.equal(checkPermission('super_admin', 'tenants:manage'), true);
  assert.equal(checkPermission('super_admin', 'pos:checkout'), true);
  assert.equal(checkPermission('super_admin', 'fraud:resolve'), true);
});
