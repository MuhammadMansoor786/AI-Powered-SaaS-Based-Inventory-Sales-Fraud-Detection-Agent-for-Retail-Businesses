import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Sale } from '../../types.ts';
import { 
  Receipt, 
  RotateCcw, 
  Search, 
  Filter, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  CreditCard,
  User,
  Calendar
} from 'lucide-react';

export const SalesAndRefunds: React.FC = () => {
  const { sales, refunds, processRefund, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  // Refund modal state
  const [refundModalSale, setRefundModalSale] = useState<Sale | null>(null);
  const [refundReason, setRefundReason] = useState<'defective' | 'customer_changed_mind' | 'wrong_item' | 'duplicate_charge'>('customer_changed_mind');
  const [returnToInventory, setReturnToInventory] = useState(true);

  const filteredSales = sales.filter((s) => {
    return (
      s.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.cashierName.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleProcessRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalSale) return;

    const itemsToRefund = refundModalSale.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      amount: it.totalPrice,
      returnToStock: returnToInventory,
    }));

    processRefund(refundModalSale.id, itemsToRefund, refundReason);
    setRefundModalSale(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales History & Returns</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit transactions, review thermal receipts, and authorize customer refunds.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipt #, cashier or customer..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing <strong>{filteredSales.length}</strong> logged sales
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Receipt Number</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Cashier</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Grand Total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.map((sale) => {
                const isRefunded = sale.status === 'refunded';
                return (
                  <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {sale.receiptNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{sale.timestamp}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{sale.cashierName}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{sale.customerName || 'Walk-in'}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {sale.items.length} items
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-600 dark:text-slate-400">
                      {sale.payment.method}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isRefunded
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSale(sale)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                          View Receipt
                        </button>
                        {!isRefunded && (
                          <button
                            type="button"
                            onClick={() => setRefundModalSale(sale)}
                            className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW RECEIPT MODAL */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs">Receipt Inspection</span>
              <button type="button" onClick={() => setSelectedSale(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-[11px] space-y-2 border border-slate-200 dark:border-slate-800">
              <div className="text-center font-bold text-sm">APEX RETAIL ENTERPRISES</div>
              <div className="text-center text-[10px] text-slate-400">{selectedSale.receiptNumber}</div>
              <div className="text-center text-[10px] text-slate-400">{selectedSale.timestamp}</div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                {selectedSale.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>${it.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${selectedSale.subtotal.toFixed(2)}</span>
                </div>
                {selectedSale.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-${selectedSale.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL:</span>
                  <span>${selectedSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                <div>Cashier: {selectedSale.cashierName}</div>
                <div>Payment Method: {selectedSale.payment.method.toUpperCase()}</div>
                <div>Status: {selectedSale.status.toUpperCase()}</div>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSelectedSale(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {refundModalSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Authorize Refund for {refundModalSale.receiptNumber}
              </h3>
              <button type="button" onClick={() => setRefundModalSale(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefundSubmit} className="mt-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200">
                Total Refund Payout: <strong>${refundModalSale.total.toFixed(2)}</strong> via original tender ({refundModalSale.payment.method}).
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Return Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="customer_changed_mind">Customer changed mind</option>
                  <option value="defective">Defective or damaged merchandise</option>
                  <option value="wrong_item">Wrong item purchased</option>
                  <option value="duplicate_charge">Duplicate transaction charge</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="returnStock"
                  checked={returnToInventory}
                  onChange={(e) => setReturnToInventory(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label htmlFor="returnStock" className="font-semibold text-slate-700 dark:text-slate-300">
                  Return undamaged items to active store inventory
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRefundModalSale(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md"
                >
                  Confirm & Issue Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
