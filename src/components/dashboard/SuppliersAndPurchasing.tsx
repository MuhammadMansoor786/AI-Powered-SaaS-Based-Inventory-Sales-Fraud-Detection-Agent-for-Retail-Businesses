import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  Truck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Calendar, 
  DollarSign, 
  Search, 
  X,
  PackageCheck,
  Star
} from 'lucide-react';

export const SuppliersAndPurchasing: React.FC = () => {
  const {
    suppliers,
    purchaseOrders,
    products,
    createPurchaseOrder,
    receivePurchaseOrder,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  
  // Create PO Modal
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState<{ productId: string; quantity: number; unitCost: number }[]>([
    { productId: products[0]?.id || '', quantity: 20, unitCost: products[0]?.costPrice || 15 },
  ]);

  const handleAddLineItem = () => {
    setPoItems((prev) => [
      ...prev,
      { productId: products[0]?.id || '', quantity: 10, unitCost: products[0]?.costPrice || 20 },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    setPoItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) {
      showToast('Add at least one line item.');
      return;
    }

    createPurchaseOrder(selectedSupplierId, poItems);
    setPoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Suppliers & Purchase Orders</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Procurement logistics, goods receiving verification, and inventory replenishment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPoModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'suppliers'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Authorized Suppliers Directory ({suppliers.length})</span>
        </button>
      </div>

      {/* PO LIST TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">PO Number</th>
                  <th className="py-3 px-4 font-semibold">Supplier</th>
                  <th className="py-3 px-4 font-semibold">Date Ordered</th>
                  <th className="py-3 px-4 font-semibold">Expected Delivery</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total Cost</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Goods Receiving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {purchaseOrders.map((po) => {
                  const isReceived = po.status === 'received';
                  return (
                    <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {po.poNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {po.supplierName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{po.orderDate}</td>
                      <td className="py-3 px-4 text-slate-500">{po.expectedDeliveryDate}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {po.items.length} line items ({po.items.reduce((a, b) => a + b.orderedQuantity, 0)} units)
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        ${po.totalCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isReceived
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isReceived ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition-colors"
                          >
                            Receive & Stock Items
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {s.status}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{s.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                  {s.name}
                </h3>
                <div className="text-xs text-slate-500 mt-1">Contact: {s.contactPerson}</div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div>Email: {s.email}</div>
                  <div>Phone: {s.phone}</div>
                  <div>Lead Time: <strong className="text-slate-800 dark:text-slate-200">{s.leadTimeDays} business days</strong></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSupplierId(s.id);
                    setPoModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  Create PO for {s.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PO MODAL */}
      {poModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Draft Purchase Order</h3>
              <button type="button" onClick={() => setPoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePOSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.leadTimeDays}d lead time)</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Ordered Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {poItems.map((item, index) => (
                    <div key={index} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const prod = products.find((p) => p.id === e.target.value);
                          setPoItems((prev) =>
                            prev.map((pi, i) =>
                              i === index
                                ? { ...pi, productId: e.target.value, unitCost: prod?.costPrice || 10 }
                                : pi
                            )
                          );
                        }}
                        className="flex-2 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>

                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            setPoItems((prev) =>
                              prev.map((pi, i) => (i === index ? { ...pi, quantity: val } : pi))
                            );
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold"
                          placeholder="Qty"
                        />
                      </div>

                      <div className="flex-1 font-mono text-slate-500">
                        ${(item.quantity * item.unitCost).toFixed(2)}
                      </div>

                      {poItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(index)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                >
                  Authorize & Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
