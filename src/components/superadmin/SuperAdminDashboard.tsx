import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Tenant } from '../../types.ts';
import { 
  Shield, 
  Building2, 
  Activity, 
  Cpu, 
  Database, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Search, 
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    tenants,
    currentTenant,
    setCurrentTenant,
    setActiveView,
    auditLogs,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'ai_monitoring' | 'health'>('overview');
  const [tenantSearch, setTenantSearch] = useState('');

  const totalMRR = tenants.reduce((acc, t) => acc + t.monthlyRevenue, 0);
  const totalStores = tenants.reduce((acc, t) => acc + t.branchesCount, 0);

  const handleImpersonateTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setActiveView('dashboard');
    showToast(`Now managing organization: ${tenant.name}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Super Admin Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-950 text-white rounded-2xl p-6 border border-rose-900/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Platform Governance & Multi-Tenant Control Plane</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">
            Super Administrator Operations
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Managing global tenant organizations, subscription tier entitlements, distributed ML inference cluster health, and database connection pooling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
            <div className="text-2xl font-black text-rose-400">142</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Tenants</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
            <div className="text-2xl font-black text-emerald-400">$265,100</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Monthly MRR</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'tenants'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tenant Management ({tenants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai_monitoring')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ai_monitoring'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Service Health & Accuracy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('health')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'health'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Cloud Infrastructure & DB</span>
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Annualized ARR</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                $3.18 Million
              </div>
              <div className="text-xs text-emerald-600 font-bold mt-1">+28% quarterly expansion</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Daily POS Transactions</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                184,920
              </div>
              <div className="text-xs text-slate-500 mt-1">Avg 0.22s API round-trip</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Fraud Events Thwarted</span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                $412,850
              </div>
              <div className="text-xs text-slate-500 mt-1">Saved across 142 clients</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Core API Uptime</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                99.992%
              </div>
              <div className="text-xs text-slate-500 mt-1">Zero Sev-1 incidents</div>
            </div>
          </div>

          {/* Tenants quick table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Tenant Organizations</h3>
              <button
                type="button"
                onClick={() => setActiveTab('tenants')}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Manage All →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {tenants.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{t.name}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-indigo-100 text-indigo-700">
                        {t.plan}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5">
                      {t.branchesCount} Branches • Tenant ID: {t.id} • Joined {t.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ${t.monthlyRevenue.toLocaleString()}/mo GMV
                    </span>
                    <button
                      type="button"
                      onClick={() => handleImpersonateTenant(t)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors"
                    >
                      Impersonate Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TENANTS TAB */}
      {activeTab === 'tenants' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                placeholder="Search organizations..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tenant Organization</th>
                  <th className="py-3 px-4 font-semibold">Plan Tier</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Locations</th>
                  <th className="py-3 px-4 font-semibold">Monthly GMV</th>
                  <th className="py-3 px-4 font-semibold">Member Since</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tenants
                  .filter((t) => t.name.toLowerCase().includes(tenantSearch.toLowerCase()))
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {t.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                          {t.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {t.branchesCount} branches
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        ${t.monthlyRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{t.createdAt}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleImpersonateTenant(t)}
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px]"
                        >
                          Impersonate
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI MONITORING TAB */}
      {activeTab === 'ai_monitoring' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fraud Radar Precision</h3>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">99.4%</div>
            <p className="text-xs text-slate-500 mt-1">False positive rate: <strong>0.38%</strong></p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Validated against 2.4M synthetic and real retail void/refund edge cases.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Restock Forecast Variance</h3>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">&plusmn; 2.1%</div>
            <p className="text-xs text-slate-500 mt-1">Lead-time delivery error buffer</p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Continuously retrained with daily inventory cycle count reconciliation.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inference Latency</h3>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">48 ms</div>
            <p className="text-xs text-slate-500 mt-1">P99 response time on checkout</p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Edge heuristic filtering guarantees zero POS checkout terminal lag.
            </div>
          </div>
        </div>
      )}

      {/* HEALTH TAB */}
      {activeTab === 'health' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">System Infrastructure Health</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Managed PostgreSQL Multi-Region</div>
                <div className="text-slate-500 text-[11px]">Primary + 2 Read Replicas (0ms lag)</div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">HEALTHY</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Redis Cache & BullMQ Cluster</div>
                <div className="text-slate-500 text-[11px]">Cache hit rate: 98.7%</div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">OPTIMAL</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
