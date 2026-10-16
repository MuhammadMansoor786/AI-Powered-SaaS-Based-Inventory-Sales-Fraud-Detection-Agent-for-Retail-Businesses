import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { User, UserRole, Branch } from '../../types.ts';
import { checkPermission, AppPermission } from '../../utils/businessLogic.ts';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  Plus, 
  Lock, 
  Check, 
  X, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StaffAndBranches: React.FC = () => {
  const {
    users,
    branches,
    currentBranch,
    currentUser,
    setCurrentUserRole,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'staff' | 'branches' | 'rbac'>('staff');

  const permissionsList: { key: AppPermission; label: string; desc: string }[] = [
    { key: 'pos:checkout', label: 'POS Checkout & Tender', desc: 'Scan items, tender cash/card payments' },
    { key: 'pos:discount', label: 'Manual Discount Override', desc: 'Apply discretionary percentage/amount off' },
    { key: 'pos:void', label: 'Void Registered Orders', desc: 'Cancel active or recorded shopping carts' },
    { key: 'pos:refund', label: 'Authorize Customer Refunds', desc: 'Issue cash/card payout returns' },
    { key: 'inventory:view', label: 'View Inventory Balances', desc: 'Read master SKU balances and stock' },
    { key: 'inventory:adjust', label: 'Cycle Count Adjustments', desc: 'Adjust physical on-hand shrinkage' },
    { key: 'inventory:transfer', label: 'Inter-Branch Stock Transit', desc: 'Move inventory between locations' },
    { key: 'purchase:create', label: 'Create Purchase Orders', desc: 'Draft POs to external suppliers' },
    { key: 'purchase:receive', label: 'Receive Inbound Shipments', desc: 'Check in goods & increment stock' },
    { key: 'fraud:view', label: 'View AI Fraud Telemetry', desc: 'Inspect fraud radar incident flags' },
    { key: 'fraud:resolve', label: 'Resolve & Freeze Terminals', desc: 'Mark exceptions or lock cashier accounts' },
    { key: 'reports:view', label: 'Access P&L Analytics', desc: 'View revenue, margin, and audit logs' },
    { key: 'staff:manage', label: 'Manage Staff & Roles', desc: 'Assign privileges and user access' },
    { key: 'tenants:manage', label: 'Multi-Tenant Governance', desc: 'Super admin platform configuration' },
  ];

  const roles: UserRole[] = [
    'cashier',
    'inventory_staff',
    'accountant',
    'store_manager',
    'store_owner',
    'super_admin',
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Staff, Branches & RBAC Security</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enforce role-based access control, branch data isolation, and cashier terminal shifts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'staff'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Directory ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'rbac'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>RBAC Permission Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branches')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'branches'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Store Branches ({branches.length})</span>
        </button>
      </div>

      {/* STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const isCurrent = currentUser.id === u.id;
            return (
              <div 
                key={u.id} 
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${
                  isCurrent ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {u.role.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.shiftStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.shiftStatus === 'active' ? '● On Shift' : 'Off Duty'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                    {u.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">{u.email}</div>

                  <div className="mt-4 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div>Assigned Branch: <strong>{branches.find(b => b.id === u.branchId)?.name || 'Manhattan'}</strong></div>
                    <div>User ID: <span className="font-mono text-slate-400">{u.id}</span></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {isCurrent ? (
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Persona
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentUserRole(u.role)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Switch Persona to {u.name.split(' ')[0]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RBAC PERMISSION MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Role Security Permission Matrix</h3>
            <p className="text-xs text-slate-500">Fine-grained operational enforcement across system capabilities</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-4 font-bold min-w-[200px]">Permission Capability</th>
                  {roles.map((r) => (
                    <th key={r} className="py-3 px-3 font-bold text-center capitalize">
                      {r.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {permissionsList.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{perm.label}</div>
                      <div className="text-[10px] text-slate-400">{perm.desc}</div>
                    </td>

                    {roles.map((role) => {
                      const allowed = checkPermission(role, perm.key);
                      return (
                        <td key={role} className="py-3 px-3 text-center">
                          {allowed ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BRANCHES LIST */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-400">{b.code}</span>
                  {b.isMain && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      Primary Flagship
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                  {b.name}
                </h3>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{b.activeStaffCount} active staff</span>
                <span className="text-emerald-600 font-bold">Online</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
