import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Calendar, 
  ShoppingCart, 
  DollarSign, 
  Check, 
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const RestockingRecommendations: React.FC = () => {
  const {
    restockRecommendations,
    createPOFromRestockRecommendation,
    setDashboardSubView,
    purchaseOrders,
  } = useApp();

  const criticalItems = restockRecommendations.filter((r) => r.priority === 'critical');
  const moderateItems = restockRecommendations.filter((r) => r.priority === 'moderate');
  const totalSuggestedCost = restockRecommendations.reduce((acc, r) => acc + r.estimatedCost, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Autonomous Supply Chain & Demand Forecasting</span>
          </div>
          <h2 className="text-2xl font-bold mt-1 text-white">
            AI Predictive Restocking Recommendations
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Forecasts stockouts by correlating rolling 30-day velocity, seasonal variance, and supplier transit lead times. Automate purchase order draft creation before shelves empty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-400">{criticalItems.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">&lt; 48h Stockout</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-emerald-400">
              ${totalSuggestedCost.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Reorder Budget</div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restockRecommendations.map((rec) => {
          const isCritical = rec.priority === 'critical';
          const isPoCreated = rec.status === 'po_created';

          return (
            <div
              key={rec.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isCritical
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {rec.projectedStockoutDays <= 1 ? 'Depletes Today' : `${rec.projectedStockoutDays} Days Left`}
                  </span>

                  <span className="font-mono text-slate-400">{rec.sku}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {rec.productName}
                </h3>

                {/* Metrics Breakdown */}
                <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">On Hand</div>
                    <div className="text-base font-black text-rose-600 mt-0.5">{rec.currentStock} units</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Daily Burn</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">{rec.avgDailySales} /day</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Reorder Point</div>
                    <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{rec.reorderPoint} units</div>
                  </div>
                </div>

                {/* Supplier & Buffer info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Supplier: <strong>{rec.supplierName}</strong></span>
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.leadTimeDays}d lead time</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Statistical Safety Stock:</span>
                    <span className="font-semibold">{rec.safetyStock} buffer units</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Suggested Order Quantity</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {rec.suggestedOrderQty} units <span className="text-xs font-semibold text-slate-500">(${rec.estimatedCost.toFixed(2)})</span>
                  </div>
                </div>

                {isPoCreated ? (
                  <button
                    type="button"
                    onClick={() => setDashboardSubView('purchase_orders')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PO Generated →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => createPOFromRestockRecommendation(rec.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>1-Click PO Draft</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
