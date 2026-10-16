import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  ShieldAlert, 
  ShoppingCart, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Zap, 
  Check, 
  ArrowRight, 
  Lock, 
  Server, 
  Activity, 
  Building2, 
  BarChart3, 
  Mail, 
  Phone, 
  CheckCircle2, 
  X,
  PlayCircle
} from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const { setActiveView, setDashboardSubView, setCurrentUserRole, showToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | 'forgot' | 'privacy' | 'terms' | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [storeCount, setStoreCount] = useState('1-3');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Auth form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      showToast('Please provide your name and work email.');
      return;
    }
    setContactSubmitted(true);
    showToast('Demo request received! Our enterprise specialist will reach out shortly.');
  };

  const quickLoginAs = (role: 'store_owner' | 'store_manager' | 'cashier' | 'super_admin') => {
    setCurrentUserRole(role);
    setActiveModal(null);
    if (role === 'super_admin') {
      setActiveView('superadmin');
    } else {
      setActiveView('dashboard');
    }
    showToast(`Signed in successfully as ${role.replace('_', ' ').toUpperCase()}!`);
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 animate-fade-in shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>OmniFlow 3.0 • Autonomous Fraud Radar & Predictive Restocking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            The Multi-Tenant Retail Engine <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
              Defended by Predictive AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate cashier shrinkage, automate supplier restocking, and accelerate checkout with our all-in-one POS, multi-branch inventory, and machine learning fraud defense.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveView('dashboard');
                setDashboardSubView('pos');
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Launch Live POS Demo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('dashboard');
                setDashboardSubView('fraud_center');
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl font-semibold border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Inspect AI Fraud Radar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('login')}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
            >
              <span>Sign In / Demo Presets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Key metrics ticker */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">99.4%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Shrinkage Detection Rate</div>
            </div>
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 0.3s</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">POS Barcode Scan-to-Cart</div>
            </div>
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">38%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Stockout Reduction</div>
            </div>
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">6 Roles</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Granular RBAC Security</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6 Core Pillars Section */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Enterprise Architecture
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Engineered for Modern High-Volume Retail Chains
            </p>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Each module works seamlessly as a unified system or standalone operational unit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. POS */}
            <div className="bg-slate-50 dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Point of Sale (POS)</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Barcode scanner input, keyboard shortcuts, held/parked carts, tax calculations, thermal receipt generation, and cash/card split payments.
              </p>
              <button 
                type="button"
                onClick={() => { setActiveView('dashboard'); setDashboardSubView('pos'); }}
                className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                Try POS Terminal <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. AI Fraud Radar */}
            <div className="bg-slate-50 dark:bg-slate-900 p-7 rounded-2xl border border-rose-200/60 dark:border-rose-900/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                PATENT-PENDING AI
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Fraud Radar</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Autonomous heuristic engine flagging excessive cashier discounts, repetitive cart voids, sweethearting, and receipt-less cash refunds.
              </p>
              <button 
                type="button"
                onClick={() => { setActiveView('dashboard'); setDashboardSubView('fraud_center'); }}
                className="mt-4 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
              >
                Inspect Alerts <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Predictive Restocking */}
            <div className="bg-slate-50 dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Predictive Restocking</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates daily velocity, supplier lead-time buffers, and z-score safety stocks. Generates purchase orders in 1-click before stockouts occur.
              </p>
              <button 
                type="button"
                onClick={() => { setActiveView('dashboard'); setDashboardSubView('restocking'); }}
                className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                View Reorder Forecasts <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Multi-Branch Inventory */}
            <div className="bg-slate-50 dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Multi-Location Inventory</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralized SKU balances, inter-branch stock transfers, cycle count adjustments, supplier purchasing, and full goods receiving reconciliation.
              </p>
              <button 
                type="button"
                onClick={() => { setActiveView('dashboard'); setDashboardSubView('inventory'); }}
                className="mt-4 text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline"
              >
                Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5. Role-Based Permissions */}
            <div className="bg-slate-50 dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Strict RBAC Security</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Isolated user privileges for Cashiers, Inventory Staff, Store Managers, Accountants, Store Owners, and Super Admins with full audit trails.
              </p>
              <button 
                type="button"
                onClick={() => { setActiveView('dashboard'); setDashboardSubView('staff'); }}
                className="mt-4 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
              >
                Review RBAC Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6. AI Business Assistant */}
            <div className="bg-slate-50 dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Business Copilot</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Conversational assistant querying profit margins, hourly foot traffic velocity, cashier performance, and high-margin supplier trends.
              </p>
              <button 
                type="button"
                onClick={() => { setActiveView('dashboard'); setDashboardSubView('ai_assistant'); }}
                className="mt-4 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
              >
                Chat with Copilot <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Transparent SaaS Pricing
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Predictable Plans for Growing Chains
          </p>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
            Scale from single-store boutique to national retail network with zero hidden transaction surcharges.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="mt-6 inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Starter Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">Single Store</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ${billingCycle === 'annual' ? '69' : '89'}
                </span>
                <span className="text-slate-500 text-sm ml-1.5">/month</span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Ideal for independent boutiques, artisan cafes, and emerging storefronts.
              </p>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Physical Store Location</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 3 Cashier Registers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic POS & Inventory Catalog</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard Fraud Risk Alerts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Email Support</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('Starter plan selected for demo.');
                setActiveView('dashboard');
              }}
              className="mt-8 w-full py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Select Starter
            </button>
          </div>

          {/* Growth Plan - Highlighted */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-indigo-600 dark:border-indigo-500 shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold tracking-wide uppercase">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Growth</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">Multi-Store Chain</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ${billingCycle === 'annual' ? '159' : '199'}
                </span>
                <span className="text-slate-500 text-sm ml-1.5">/month</span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Designed for expanding retailers requiring real-time multi-branch sync and predictive AI.
              </p>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Up to 5 Branch Locations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Unlimited POS Registers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> AI Fraud Radar & Shift Guard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Predictive Stockout Forecasting</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Inter-Branch Stock Transfers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Priority 24/7 Phone & Chat</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('Growth plan selected.');
                setActiveView('dashboard');
              }}
              className="mt-8 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-colors"
            >
              Get Started with Growth
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Enterprise</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">National Retailer</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ${billingCycle === 'annual' ? '399' : '499'}
                </span>
                <span className="text-slate-500 text-sm ml-1.5">/month</span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Custom SLAs, dedicated AI models, ERP integrations, and enterprise compliance.
              </p>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Locations & Branches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Machine Learning Engine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom ERP / SAP Webhooks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> SOC2 Type II Security Package</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Account Architect</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('signup')}
              className="mt-8 w-full py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Contact Enterprise Sales
            </button>
          </div>

        </div>
      </section>

      {/* About Us & Security */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                About OmniFlow Retail
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 sm:text-4xl">
                Built by Retail Veterans & ML Engineers
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Traditional retail systems were built thirty years ago for simple receipt printing and inventory counts. They miss 85% of internal shrinkage, leave managers blind to sudden stockout risks, and lock store data into antiquated siloes.
              </p>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                OmniFlow AI unites real-time transaction telemetry, edge-ready POS speed, and automated replenishment logic to protect margins and accelerate frontline retail workflows.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">SOC 2 Type II</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Independently audited tenant data isolation</div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">99.99% Uptime SLA</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fault-tolerant distributed edge mesh</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Request an Enterprise Live Demo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Speak with our retail solutions team and test OmniFlow in your staging environment.
              </p>

              {contactSubmitted ? (
                <div className="mt-6 p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Demo Scheduled!</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    An enterprise architect will email you within 15 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@retailgroup.com"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Number of Store Locations
                    </label>
                    <select
                      value={storeCount}
                      onChange={(e) => setStoreCount(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1-3">1 - 3 Locations (Starter/Growth)</option>
                      <option value="4-10">4 - 10 Locations (Growth)</option>
                      <option value="11-50">11 - 50 Locations (Enterprise)</option>
                      <option value="50+">50+ Locations (Custom Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Key Operational Challenges
                    </label>
                    <textarea
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="e.g. High cashier voids, supplier stockouts on weekly deliveries..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all"
                  >
                    Schedule 1-on-1 Architecture Walkthrough
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>OmniFlow AI Enterprise Systems</span>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" onClick={() => setActiveModal('privacy')} className="hover:underline">Privacy Policy</button>
            <button type="button" onClick={() => setActiveModal('terms')} className="hover:underline">Terms of Service</button>
            <button type="button" onClick={() => setActiveModal('login')} className="hover:underline">Sign In</button>
            <button type="button" onClick={() => setActiveModal('signup')} className="hover:underline">Create Account</button>
          </div>

          <div>
            © 2026 OmniFlow Technologies Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Login Modal */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Sign In to OmniFlow</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveModal(null)} 
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Select a quick demo persona to explore with instant role permissions:
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => quickLoginAs('store_owner')}
                  className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/30 text-left hover:bg-purple-100/60 transition-colors"
                >
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-300">Elena Vance</div>
                  <div className="text-[10px] text-slate-500">Store Owner (Apex)</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs('store_manager')}
                  className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/30 text-left hover:bg-blue-100/60 transition-colors"
                >
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-300">Marcus Chen</div>
                  <div className="text-[10px] text-slate-500">Store Manager</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs('cashier')}
                  className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-left hover:bg-emerald-100/60 transition-colors"
                >
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Chloe Rivera</div>
                  <div className="text-[10px] text-slate-500">Cashier (Register 02)</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs('super_admin')}
                  className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/30 text-left hover:bg-rose-100/60 transition-colors"
                >
                  <div className="text-xs font-bold text-rose-700 dark:text-rose-300">Alex Sterling</div>
                  <div className="text-[10px] text-slate-500">SaaS Super Admin</div>
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
                <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or standard login</span></div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  quickLoginAs('store_owner');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@retailcompany.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <button type="button" onClick={() => setActiveModal('forgot')} className="text-[10px] text-indigo-600 hover:underline">Forgot?</button>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Sign In to Store Workspace
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {activeModal === 'signup' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Start 14-Day Free Trial</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Trial organization provisioned! Welcome to OmniFlow.');
                setActiveModal(null);
                setActiveView('dashboard');
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Store Name</label>
                <input required placeholder="Apex Retail Labs" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Owner Email</label>
                <input type="email" required placeholder="owner@apexretail.com" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Choose Password</label>
                <input type="password" required placeholder="Minimum 8 characters" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Create Tenant & Launch Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {activeModal === 'forgot' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Reset Password</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your email to receive recovery instructions.</p>
            <input type="email" placeholder="you@company.com" className="w-full mt-4 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700">Cancel</button>
              <button type="button" onClick={() => { showToast('Password reset link sent.'); setActiveModal(null); }} className="flex-1 py-2 rounded-xl text-xs bg-indigo-600 text-white font-semibold">Send Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Privacy Policy</h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 mt-3 leading-relaxed">
              <p>OmniFlow AI adheres to strict data isolation across all tenant workspaces. Customer credit card information is never stored unencrypted on local POS terminals or database rows.</p>
              <p>Fraud detection telemetry processes anonymized transaction values, item count velocities, and supervisor overrides solely for organizational shrinkage prevention.</p>
              <p>We do not sell, rent, or cross-monetize store transaction catalogs to third-party ad networks.</p>
            </div>
            <button type="button" onClick={() => setActiveModal(null)} className="mt-5 w-full py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl">Close</button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Terms of Service</h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 mt-3 leading-relaxed">
              <p>OmniFlow provides retail point-of-sale, inventory tracking, and autonomous fraud detection software on a multi-tenant SaaS basis.</p>
              <p>Subscribers maintain full ownership of product catalogs, customer databases, and sales reports. OmniFlow provides 99.99% core API availability under Enterprise SLAs.</p>
            </div>
            <button type="button" onClick={() => setActiveModal(null)} className="mt-5 w-full py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl">Close</button>
          </div>
        </div>
      )}

    </div>
  );
};
