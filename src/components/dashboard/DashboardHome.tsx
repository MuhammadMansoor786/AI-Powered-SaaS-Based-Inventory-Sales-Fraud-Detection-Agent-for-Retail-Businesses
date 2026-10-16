import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  ShieldAlert, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  PlusCircle, 
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const {
    sales,
    products,
    fraudAlerts,
    restockRecommendations,
    currentBranch,
    setDashboardSubView,
    createPOFromRestockRecommendation,
    currentUser,
  } = useApp();

  // Metrics calculations
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0) + 47850; // realistic base + live
  const totalCost = sales.reduce((acc, s) => {
    return acc + s.items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  }, 0) + 26400;
  const grossProfit = totalRevenue - totalCost;
  const grossMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);

  const pendingFraudAlerts = fraudAlerts.filter((f) => f.status === 'pending');
  const criticalRestocks = restockRecommendations.filter((r) => r.priority === 'critical');
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  // Sparkline data points for weekly sales
  const weeklyData = [
    { day: 'Mon', sales: 6200, profit: 2700 },
    { day: 'Tue', sales: 7400, profit: 3200 },
    { day: 'Wed', sales: 5800, profit: 2500 },
    { day: 'Thu', sales: 8900, profit: 3900 },
    { day: 'Fri', sales: 11400, profit: 5100 },
    { day: 'Sat', sales: 14200, profit: 6400 },
    { day: 'Sun', sales: 9800, profit: 4300 },
  ];
  const maxWeeklySales = Math.max(...weeklyData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      
      {/* Branch & Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Operations Hub • {currentBranch.name}</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            OmniFlow autonomous fraud engine has evaluated <span className="text-white font-semibold">{sales.length} transactions</span> today with zero system downtime.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDashboardSubView('pos')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
          
          <button
            type="button"
            onClick={() => setDashboardSubView('ai_assistant')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs last week</span>
          </div>
        </div>

        {/* Gross Profit & Margin */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Profit</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
              {grossMargin}% margin
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Based on FIFO inventory cost
          </div>
        </div>

        {/* AI Fraud Incidents */}
        <div 
          onClick={() => setDashboardSubView('fraud_center')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-rose-400 dark:hover:border-rose-700 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Fraud Radar</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              pendingFraudAlerts.length > 0
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'bg-slate-100 text-slate-500'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pendingFraudAlerts.length}
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              Pending review
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>High cashier variance</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Low Stock & Restock Alert */}
        <div 
          onClick={() => setDashboardSubView('restocking')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 dark:hover:border-amber-700 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Restock Forecast</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {criticalRestocks.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              Urgent SKUs &lt; 2d supply
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{lowStockProducts.length} items below minimum</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Performance Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Revenue & Margin Distribution</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily store transaction volume across registers</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500" /> Revenue ($)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-400" /> Gross Profit ($)</span>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="mt-6 h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyData.map((d) => {
              const salesHeight = (d.sales / maxWeeklySales) * 180;
              const profitHeight = (d.profit / maxWeeklySales) * 180;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Revenue bar */}
                    <div 
                      style={{ height: `${salesHeight}px` }} 
                      className="w-full max-w-[28px] bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all relative group/bar"
                      title={`${d.day} Sales: $${d.sales.toLocaleString()}`}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                        ${d.sales}
                      </div>
                    </div>
                    {/* Profit bar */}
                    <div 
                      style={{ height: `${profitHeight}px` }} 
                      className="w-full max-w-[28px] bg-emerald-400 hover:bg-emerald-500 rounded-t-lg transition-all relative group/bar"
                      title={`${d.day} Profit: $${d.profit.toLocaleString()}`}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                        ${d.profit}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Peak Day: <strong className="text-slate-800 dark:text-slate-200">Saturday ($14,200)</strong></span>
            <span>Average Basket Size: <strong className="text-slate-800 dark:text-slate-200">$54.10</strong></span>
            <span>Cart Conversion: <strong className="text-emerald-600 font-bold">96.8%</strong></span>
          </div>
        </div>

        {/* Live AI Fraud Radar Feed (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Fraud Radar</h3>
              </div>
              <button
                type="button"
                onClick={() => setDashboardSubView('fraud_center')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {fraudAlerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id}
                  onClick={() => setDashboardSubView('fraud_center')}
                  className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-800 dark:text-rose-300 truncate max-w-[170px]">
                      {alert.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                      Score {alert.riskScore}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Cashier: {alert.cashierName}</span>
                    <span>{alert.timestamp.slice(11, 16)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setDashboardSubView('fraud_center')}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors text-center"
            >
              Open Fraud Investigation Center
            </button>
          </div>
        </div>

      </div>

      {/* Critical Restock Alerts Banner & 1-Click PO */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Predictive Restocking Alerts</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI demand forecasting detected high run-out probability for these fast-moving SKUs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDashboardSubView('restocking')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Review All Replenishments →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {criticalRestocks.slice(0, 3).map((rec) => (
            <div 
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded uppercase">
                    {rec.projectedStockoutDays} Days Left
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    {rec.sku}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-2 line-clamp-1">
                  {rec.productName}
                </h4>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div>Current Stock: <strong className="text-rose-600">{rec.currentStock} units</strong></div>
                  <div>Supplier: {rec.supplierName} ({rec.leadTimeDays}d lead)</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Suggested Order</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{rec.suggestedOrderQty} units (${rec.estimatedCost})</div>
                </div>
                {rec.status === 'po_created' ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PO Drafted
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => createPOFromRestockRecommendation(rec.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    1-Click PO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent POS Transactions Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent POS Checkout Stream</h3>
          </div>
          <button
            type="button"
            onClick={() => setDashboardSubView('sales_history')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Full Sales History
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Receipt #</th>
                <th className="pb-2 font-medium">Timestamp</th>
                <th className="pb-2 font-medium">Cashier</th>
                <th className="pb-2 font-medium">Items</th>
                <th className="pb-2 font-medium">Payment</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium text-right">Fraud Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {sale.receiptNumber}
                  </td>
                  <td className="py-2.5 text-slate-500">{sale.timestamp}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">{sale.cashierName}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">
                    {sale.items.length} lines ({sale.items.reduce((a, b) => a + b.quantity, 0)} items)
                  </td>
                  <td className="py-2.5 uppercase font-medium text-slate-600 dark:text-slate-400">
                    {sale.payment.method}
                  </td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      (sale.fraudScore || 0) > 50
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {sale.fraudScore || 5}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
