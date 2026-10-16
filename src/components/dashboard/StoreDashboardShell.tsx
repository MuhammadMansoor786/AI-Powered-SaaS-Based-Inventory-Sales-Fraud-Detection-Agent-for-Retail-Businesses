import React from 'react';
import { useApp, DashboardSubView } from '../../context/AppContext.tsx';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layers, 
  Truck, 
  Receipt, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  Settings, 
  History,
  Menu,
  ChevronRight
} from 'lucide-react';

import { DashboardHome } from './DashboardHome.tsx';
import { PointOfSale } from './PointOfSale.tsx';
import { ProductsCatalog } from './ProductsCatalog.tsx';
import { InventoryManager } from './InventoryManager.tsx';
import { SuppliersAndPurchasing } from './SuppliersAndPurchasing.tsx';
import { SalesAndRefunds } from './SalesAndRefunds.tsx';
import { CustomersDirectory } from './CustomersDirectory.tsx';
import { ReportsAnalytics } from './ReportsAnalytics.tsx';
import { FraudDetectionCenter } from './FraudDetectionCenter.tsx';
import { RestockingRecommendations } from './RestockingRecommendations.tsx';
import { AIBusinessAssistant } from './AIBusinessAssistant.tsx';
import { StaffAndBranches } from './StaffAndBranches.tsx';
import { SettingsAndAudit } from './SettingsAndAudit.tsx';

export const StoreDashboardShell: React.FC = () => {
  const { dashboardSubView, setDashboardSubView, fraudAlerts, restockRecommendations } = useApp();

  const pendingFraud = fraudAlerts.filter((f) => f.status === 'pending').length;
  const criticalRestock = restockRecommendations.filter((r) => r.priority === 'critical').length;

  const navItems: { id: DashboardSubView; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale (POS)', icon: ShoppingCart },
    { id: 'products', label: 'Products & SKUs', icon: Package },
    { id: 'inventory', label: 'Inventory & Transfers', icon: Layers },
    { id: 'suppliers', label: 'Suppliers & POs', icon: Truck },
    { id: 'sales_history', label: 'Sales & Refunds', icon: Receipt },
    { id: 'customers', label: 'Customers & Loyalty', icon: Users },
    { id: 'reports', label: 'Reports & P&L', icon: BarChart3 },
    { id: 'fraud_center', label: 'AI Fraud Radar', icon: ShieldAlert, badge: pendingFraud, badgeColor: 'bg-rose-500 text-white' },
    { id: 'restocking', label: 'AI Restock Forecast', icon: TrendingUp, badge: criticalRestock, badgeColor: 'bg-amber-500 text-white' },
    { id: 'ai_assistant', label: 'AI Business Copilot', icon: Sparkles },
    { id: 'staff', label: 'Staff & RBAC Matrix', icon: Users },
    { id: 'settings', label: 'Settings & Audit Logs', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Store Operations
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = dashboardSubView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDashboardSubView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${item.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {dashboardSubView === 'overview' && <DashboardHome />}
          {dashboardSubView === 'pos' && <PointOfSale />}
          {dashboardSubView === 'products' && <ProductsCatalog />}
          {dashboardSubView === 'inventory' && <InventoryManager />}
          {dashboardSubView === 'suppliers' && <SuppliersAndPurchasing />}
          {dashboardSubView === 'purchase_orders' && <SuppliersAndPurchasing />}
          {dashboardSubView === 'sales_history' && <SalesAndRefunds />}
          {dashboardSubView === 'returns_refunds' && <SalesAndRefunds />}
          {dashboardSubView === 'customers' && <CustomersDirectory />}
          {dashboardSubView === 'reports' && <ReportsAnalytics />}
          {dashboardSubView === 'fraud_center' && <FraudDetectionCenter />}
          {dashboardSubView === 'restocking' && <RestockingRecommendations />}
          {dashboardSubView === 'ai_assistant' && <AIBusinessAssistant />}
          {dashboardSubView === 'staff' && <StaffAndBranches />}
          {dashboardSubView === 'branches' && <StaffAndBranches />}
          {dashboardSubView === 'settings' && <SettingsAndAudit />}
          {dashboardSubView === 'audit_logs' && <SettingsAndAudit />}
          {dashboardSubView === 'billing' && <SettingsAndAudit />}
        </main>

      </div>
    </div>
  );
};
