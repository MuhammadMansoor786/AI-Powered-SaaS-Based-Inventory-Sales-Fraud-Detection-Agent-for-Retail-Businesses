import React, { useState } from 'react';
import { useApp, ActiveAppView } from '../context/AppContext.tsx';
import { UserRole } from '../types.ts';
import { 
  ShieldAlert, 
  Store, 
  Globe, 
  Shield, 
  UserCheck, 
  ChevronDown, 
  ShoppingCart, 
  MapPin, 
  Sparkles,
  Sun,
  Moon,
  Search,
  CheckCircle2
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setDashboardSubView,
    currentUser,
    setCurrentUserRole,
    currentTenant,
    branches,
    currentBranch,
    setCurrentBranch,
    fraudAlerts,
    cart,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const pendingFraudCount = fraudAlerts.filter((f) => f.status === 'pending').length;

  const rolesList: { role: UserRole; label: string; desc: string; badge: string }[] = [
    { role: 'store_owner', label: 'Store Owner', desc: 'Full business & staff authority', badge: 'bg-purple-100 text-purple-700' },
    { role: 'store_manager', label: 'Store Manager', desc: 'POS, inventory & fraud investigations', badge: 'bg-blue-100 text-blue-700' },
    { role: 'cashier', label: 'Cashier', desc: 'POS checkout & customer lookup', badge: 'bg-emerald-100 text-emerald-700' },
    { role: 'inventory_staff', label: 'Inventory Staff', desc: 'Stock movements, POs & receiving', badge: 'bg-amber-100 text-amber-700' },
    { role: 'accountant', label: 'Accountant', desc: 'Reports, P&L & audit logs', badge: 'bg-cyan-100 text-cyan-700' },
    { role: 'super_admin', label: 'Super Admin', desc: 'Platform multi-tenant governance', badge: 'bg-rose-100 text-rose-700' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & View Switcher */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    OmniFlow<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Live SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Inventory • POS • AI Fraud Radar
                </p>
              </div>
            </div>

            {/* View navigation pill */}
            <div className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveView('public')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'public'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Store Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('superadmin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'superadmin'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {/* Right Tools & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Quick POS Launch Button */}
            {activeView !== 'public' && (
              <button
                type="button"
                onClick={() => {
                  setActiveView('dashboard');
                  setDashboardSubView('pos');
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all relative"
                title="Launch Point of Sale Terminal"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Launch POS</span>
                {cart.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            )}

            {/* Live Fraud Alert Badge */}
            {activeView !== 'public' && (
              <button
                type="button"
                onClick={() => {
                  setActiveView('dashboard');
                  setDashboardSubView('fraud_center');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  pendingFraudCount > 0
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="AI Fraud Detection Alerts"
              >
                <ShieldAlert className={`w-3.5 h-3.5 ${pendingFraudCount > 0 ? 'text-rose-600 animate-pulse' : ''}`} />
                <span className="hidden md:inline">Fraud Radar:</span>
                <span className="font-bold">{pendingFraudCount}</span>
              </button>
            )}

            {/* Branch Selector Dropdown */}
            {activeView === 'dashboard' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setBranchDropdownOpen(!branchDropdownOpen);
                    setRoleDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="max-w-[110px] truncate">{currentBranch.name.split('(')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {branchDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-scale-in">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Store Branch
                    </div>
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setCurrentBranch(b);
                          setBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          currentBranch.id === b.id ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <div>{b.name}</div>
                          <div className="text-[10px] text-slate-400">{b.address}</div>
                        </div>
                        {currentBranch.id === b.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setBranchDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                title="Switch active user role to demo granular RBAC permissions"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                  {currentUser.role[0].toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 leading-none">Role Switcher</div>
                  <div className="capitalize font-semibold leading-tight">{currentUser.role.replace('_', ' ')}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-scale-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Interactive Role Switcher</p>
                    <p className="text-[11px] text-slate-400">Experience granular RBAC views instantly</p>
                  </div>
                  <div className="py-1">
                    {rolesList.map((r) => {
                      const isActive = currentUser.role === r.role;
                      return (
                        <button
                          key={r.role}
                          type="button"
                          onClick={() => {
                            setCurrentUserRole(r.role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                            isActive ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold">{r.label}</span>
                              {isActive && <span className="text-[10px] text-emerald-600 font-bold">• Active</span>}
                            </div>
                            <div className="text-[11px] text-slate-400">{r.desc}</div>
                          </div>
                          {isActive && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
