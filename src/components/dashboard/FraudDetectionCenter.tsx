import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FraudAlert } from '../../types.ts';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserX, 
  Sliders, 
  Search, 
  X, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const FraudDetectionCenter: React.FC = () => {
  const {
    fraudAlerts,
    updateFraudAlertStatus,
    currentUser,
    sales,
    showToast,
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'investigating' | 'approved_legitimate' | 'confirmed_fraud'>('all');
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // AI Rule Threshold Settings Simulator
  const [discountThreshold, setDiscountThreshold] = useState(25);
  const [voidThreshold, setVoidThreshold] = useState(3);
  const [autoFlagOffHours, setAutoFlagOffHours] = useState(true);

  const filteredAlerts = fraudAlerts.filter((a) => {
    const matchSev = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSev && matchStatus;
  });

  const criticalCount = fraudAlerts.filter((a) => a.severity === 'critical').length;
  const highCount = fraudAlerts.filter((a) => a.severity === 'high').length;
  const resolvedCount = fraudAlerts.filter((a) => a.status === 'approved_legitimate' || a.status === 'confirmed_fraud').length;

  const handleResolveAlert = (status: FraudAlert['status']) => {
    if (!selectedAlert) return;
    updateFraudAlertStatus(selectedAlert.id, status, resolutionNotes || 'Reviewed and finalized by manager');
    setSelectedAlert(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 rounded-2xl p-6 text-white border border-rose-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>AI Autonomous Fraud Radar & Shift Guard</span>
          </div>
          <h2 className="text-2xl font-bold mt-1 text-white">
            Retail Shrinkage & Loss Prevention Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time heuristic & behavioral machine learning engine scoring cashier sweethearting, unverified returns, off-cycle drawer opens, and unauthorized discount overrides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-rose-900/60 border border-rose-700/60 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-rose-300">{criticalCount}</div>
            <div className="text-[10px] text-rose-200 font-semibold uppercase">Critical Threats</div>
          </div>
          <div className="bg-amber-900/40 border border-amber-700/50 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-300">{highCount}</div>
            <div className="text-[10px] text-amber-200 font-semibold uppercase">High Priority</div>
          </div>
        </div>
      </div>

      {/* Threshold Rules Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <Sliders className="w-4 h-4 text-indigo-500" />
          <span>Active Heuristic Engine Thresholds</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Discount Alert:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">&gt; {discountThreshold}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Consecutive Voids:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">&ge; {voidThreshold} events</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Off-Hours Flagging:</span>
            <span className="text-emerald-600 font-bold">Enabled</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Model Accuracy:</span>
            <span className="text-indigo-600 font-bold">99.4% precision</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            All Severities ({fraudAlerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'critical' ? 'bg-white dark:bg-slate-900 text-rose-600 font-bold shadow-sm' : 'text-slate-500'
            }`}
          >
            Critical Only ({criticalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('high')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'high' ? 'bg-white dark:bg-slate-900 text-amber-600 font-bold shadow-sm' : 'text-slate-500'
            }`}
          >
            High Priority ({highCount})
          </button>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Review Only</option>
          <option value="investigating">Under Investigation</option>
          <option value="approved_legitimate">Approved Legitimate</option>
          <option value="confirmed_fraud">Confirmed Fraud Incidents</option>
        </select>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';
          const isPending = alert.status === 'pending';

          return (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
                isCritical
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                  : isHigh
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isCritical
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
                      : isHigh
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {alert.severity} • Risk {alert.riskScore}/100
                  </span>
                  
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alert.timestamp.slice(11, 19)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {alert.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {alert.description}
                </p>

                {/* Key indicators list */}
                <div className="mt-3 space-y-1">
                  {alert.indicators.slice(0, 2).map((ind, i) => (
                    <div key={i} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span className="truncate">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Cashier: <strong className="text-slate-800 dark:text-slate-200">{alert.cashierName}</strong>
                </div>

                <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Investigate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INVESTIGATION DRILLDOWN MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Loss Prevention Investigation #{selectedAlert.id}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedAlert(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              
              {/* Threat Banner */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-rose-900 dark:text-rose-200">{selectedAlert.title}</div>
                  <div className="mt-1 text-rose-700 dark:text-rose-300 leading-relaxed">{selectedAlert.description}</div>
                </div>
                <div className="text-center min-w-[70px]">
                  <div className="text-2xl font-black text-rose-600">{selectedAlert.riskScore}</div>
                  <div className="text-[10px] uppercase font-bold text-rose-500">Risk Score</div>
                </div>
              </div>

              {/* Cashier & Register Telemetry */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Cashier Operator</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedAlert.cashierName} (ID: {selectedAlert.cashierId})</div>
                  <div className="text-[10px] text-slate-400">Shift status: Active on POS Terminal 02</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Incident Timestamp</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedAlert.timestamp}</div>
                  <div className="text-[10px] text-slate-400">Associated Sale: {selectedAlert.transactionId || 'Register Drawer Sensor'}</div>
                </div>
              </div>

              {/* Behavioral Indicators Breakdown */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Detected Anomaly Indicators:</h4>
                <div className="space-y-1.5">
                  {selectedAlert.indicators.map((ind, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Notes Input */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manager Investigation Log & Resolution Notes
                </label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Verified with store manager that employee discount was authorized for floor demo..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleResolveAlert('approved_legitimate')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Legitimate Exception</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveAlert('escalated')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Escalate to Auditor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveAlert('confirmed_fraud')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Confirm Fraud & Lock Terminal</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
