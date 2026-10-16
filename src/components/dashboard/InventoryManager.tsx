import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  Layers, 
  ArrowLeftRight, 
  RotateCcw, 
  History, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  MapPin, 
  Search, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const {
    products,
    branches,
    currentBranch,
    stockMovements,
    transferStock,
    adjustStock,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'balances' | 'movements' | 'transfers' | 'adjustments'>('balances');
  const [search, setSearch] = useState('');
  
  // Transfer modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferProductId, setTransferProductId] = useState(products[0]?.id || '');
  const [targetBranchId, setTargetBranchId] = useState(branches.find((b) => b.id !== currentBranch.id)?.id || branches[1]?.id || '');
  const [transferQuantity, setTransferQuantity] = useState('5');

  // Total inventory valuation calculation
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuationCost = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);
  const totalRetailValue = products.reduce((acc, p) => acc + (p.stock * p.sellingPrice), 0);

  const selectedTransferProduct = products.find((p) => p.id === transferProductId);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransferProduct) return;
    const qty = Number(transferQuantity) || 0;
    if (qty <= 0) {
      showToast('Quantity must be greater than zero.');
      return;
    }
    if (qty > selectedTransferProduct.stock) {
      showToast(`Cannot transfer ${qty} units. Current stock is only ${selectedTransferProduct.stock}.`);
      return;
    }

    transferStock(selectedTransferProduct.id, currentBranch.id, targetBranchId, qty);
    setTransferModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inventory Balances & Ledger</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-branch tracking, double-entry stock movement logs, and inter-store transit.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTransferModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Transfer Stock to Branch</span>
        </button>
      </div>

      {/* Valuation Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Units on Hand</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalUnits.toLocaleString()} units
          </div>
          <div className="text-xs text-slate-500 mt-1">Across {products.length} master SKUs</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cost Valuation (COGS)</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ${totalValuationCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">FIFO landed acquisition cost</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Retail Value</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalRetailValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">Projected gross retail turnover</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('balances')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'balances'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Current Balances</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('movements')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'movements'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movement Ledger ({stockMovements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transfers')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'transfers'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Inter-Branch Transfers</span>
        </button>
      </div>

      {/* BALANCES TAB */}
      {activeTab === 'balances' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Product Name</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">On-Hand Stock</th>
                  <th className="py-3 px-4 font-semibold">Min / Max</th>
                  <th className="py-3 px-4 font-semibold">Cost Valuation</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products
                  .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
                  .map((p) => {
                    const isLow = p.stock <= p.minStockAlert && p.stock > 0;
                    const isOut = p.stock === 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{p.sku}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-3 px-4 text-slate-500">{currentBranch.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.stock} units</td>
                        <td className="py-3 px-4 text-slate-500">{p.minStockAlert} / {p.maxStock}</td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                          ${(p.stock * p.costPrice).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOut
                              ? 'bg-rose-100 text-rose-700'
                              : isLow
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOVEMENTS TAB */}
      {activeTab === 'movements' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Movement Type</th>
                  <th className="py-3 px-4 font-semibold">Quantity Delta</th>
                  <th className="py-3 px-4 font-semibold">Resulting Balance</th>
                  <th className="py-3 px-4 font-semibold">Reason & Ref</th>
                  <th className="py-3 px-4 font-semibold">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stockMovements.map((mov) => {
                  const isPositive = mov.quantityDelta > 0;
                  return (
                    <tr key={mov.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{mov.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{mov.productName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {mov.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold font-mono">
                        <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                          {isPositive ? `+${mov.quantityDelta}` : mov.quantityDelta}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold font-mono text-slate-800 dark:text-slate-200">
                        {mov.resultingBalance} units
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{mov.reason}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{mov.performedBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRANSFERS TAB */}
      {activeTab === 'transfers' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Branch Transit Logistics</h3>
              <p className="text-xs text-slate-500">Inter-store balance balancing and inventory replenishment</p>
            </div>
            <button
              type="button"
              onClick={() => setTransferModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Initiate Transfer
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">AcousticPro ANC Wireless Headphones</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">IN TRANSIT</span>
                </div>
                <div className="text-slate-500 mt-1 flex items-center gap-2">
                  <span>NYC Flagship ({currentBranch.code})</span>
                  <span>→</span>
                  <span>Austin Downtown (TX-02)</span>
                  <span>• 5 units</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">ETA: Tomorrow 14:00</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[10px]">Tracked #TR-9901</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFER MODAL */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Initiate Inter-Branch Stock Transfer</h3>
              <button type="button" onClick={() => setTransferModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Product</label>
                <select
                  value={transferProductId}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (In stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Source Origin</label>
                <input
                  type="text"
                  disabled
                  value={currentBranch.name}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination Branch</label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {branches.filter((b) => b.id !== currentBranch.id).map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.address})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTransferProduct?.stock || 10}
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(e.target.value)}
                  className="w-full px-3 py-2 font-bold text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
