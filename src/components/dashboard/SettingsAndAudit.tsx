import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  Settings, 
  Shield, 
  CreditCard, 
  History, 
  Receipt, 
  Check, 
  CheckCircle2, 
  DollarSign, 
  Lock 
} from 'lucide-react';

export const SettingsAndAudit: React.FC = () => {
  const { currentTenant, auditLogs, currentBranch, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'settings' | 'billing' | 'audit'>('settings');

  // Business settings state
  const [storeName, setStoreName] = useState(currentTenant.name);
  const [currency, setCurrency] = useState(currentTenant.currency);
  const [taxRate, setTaxRate] = useState('8.875');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for shopping with us! Returns accepted within 30 days with receipt.');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store settings saved successfully.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Store Settings, Billing & Security Audits</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure register rules, thermal receipt branding, and inspect immutable audit logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Operational Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('billing')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'billing'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Subscription & SaaS Plan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Immutable Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* OPERATIONAL SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 max-w-2xl text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency Code</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="USD">USD ($ - United States Dollar)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="CAD">CAD ($ - Canadian Dollar)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.001"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Thermal Receipt Footer Message</label>
            <textarea
              rows={2}
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* BILLING TAB */}
      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm max-w-2xl text-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400">Current SaaS Tier</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">{currentTenant.plan} Plan</h3>
              <p className="text-slate-500">Renews on 1st of every month via Stripe corporate billing</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              Active Subscription
            </span>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Included Store Branches:</span>
              <strong className="text-slate-900 dark:text-white">{currentTenant.branchesCount} / Unlimited</strong>
            </div>
            <div className="flex justify-between">
              <span>Machine Learning AI Invocations:</span>
              <strong className="text-slate-900 dark:text-white">Unlimited Autonomous Inference</strong>
            </div>
            <div className="flex justify-between">
              <span>Data Retention & Backup:</span>
              <strong className="text-slate-900 dark:text-white">7-Year Immutable Financial Audit Trail</strong>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Actor / User</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Action Triggered</th>
                  <th className="py-3 px-4 font-semibold">Details</th>
                  <th className="py-3 px-4 font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.userName}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-semibold text-slate-500">{log.userRole}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-sm truncate">{log.details}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
