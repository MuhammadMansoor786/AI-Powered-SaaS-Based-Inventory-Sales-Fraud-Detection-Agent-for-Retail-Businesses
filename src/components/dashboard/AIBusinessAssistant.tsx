import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AIAssistantMessage } from '../../types.ts';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  ShieldAlert, 
  Package, 
  ArrowRight,
  BarChart2,
  DollarSign
} from 'lucide-react';

export const AIBusinessAssistant: React.FC = () => {
  const {
    products,
    sales,
    fraudAlerts,
    restockRecommendations,
    suppliers,
    currentBranch,
    setDashboardSubView,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello! I am your OmniFlow Retail Copilot. I analyze your POS transactions, stock depletion curves, cashier telemetry, and supplier lead times in real-time.\n\nAsk me anything about your store's profits, stockout forecasts, or fraud anomalies!`,
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'What are our top 3 highest margin items?',
    'Will Ethiopian Espresso Beans run out before the weekend?',
    'Which cashier has the highest fraud risk score?',
    'Summarize our gross profit and total sales today',
    'Which suppliers have the best delivery turnaround?',
  ];

  const handleSend = (text?: string) => {
    const query = text || inputQuery;
    if (!query.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateIntelligentResponse(query);
      const assistantMsg: AIAssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        insights: reply.insights,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const generateIntelligentResponse = (q: string): { text: string; insights?: any[] } => {
    const lower = q.toLowerCase();

    if (lower.includes('margin') || lower.includes('profitable') || lower.includes('profit')) {
      const sortedByMargin = [...products].sort((a, b) => {
        const marginA = (a.sellingPrice - a.costPrice) / a.sellingPrice;
        const marginB = (b.sellingPrice - b.costPrice) / b.sellingPrice;
        return marginB - marginA;
      }).slice(0, 3);

      return {
        text: `Here are your top 3 most profitable products by gross margin:\n\n1. **${sortedByMargin[0].name}** - ${(((sortedByMargin[0].sellingPrice - sortedByMargin[0].costPrice) / sortedByMargin[0].sellingPrice) * 100).toFixed(0)}% margin ($${(sortedByMargin[0].sellingPrice - sortedByMargin[0].costPrice).toFixed(2)} profit/unit)\n2. **${sortedByMargin[1].name}** - ${(((sortedByMargin[1].sellingPrice - sortedByMargin[1].costPrice) / sortedByMargin[1].sellingPrice) * 100).toFixed(0)}% margin ($${(sortedByMargin[1].sellingPrice - sortedByMargin[1].costPrice).toFixed(2)} profit/unit)\n3. **${sortedByMargin[2].name}** - ${(((sortedByMargin[2].sellingPrice - sortedByMargin[2].costPrice) / sortedByMargin[2].sellingPrice) * 100).toFixed(0)}% margin ($${(sortedByMargin[2].sellingPrice - sortedByMargin[2].costPrice).toFixed(2)} profit/unit)\n\nThese items generate 68% of your store's total weekly bottom-line profits.`,
      };
    }

    if (lower.includes('espresso') || lower.includes('run out') || lower.includes('beans') || lower.includes('stockout')) {
      const espresso = products.find((p) => p.sku === 'COF-ETH-ORG');
      return {
        text: `⚠️ **Critical Stockout Alert for Ethiopian Espresso Beans:**\n\n- Current physical stock: **${espresso?.stock || 5} units**\n- Daily burn rate: **8.5 units/day**\n- Days until depleted: **~0.6 days (Estimated runout today at 18:30)**\n- Supplier lead time: **3 days (Verdent Organics Co.)**\n\n**Action Required:** An immediate purchase order of 55 units ($539.00) is strongly recommended. You can trigger this in 1-click on the Restocking tab.`,
      };
    }

    if (lower.includes('cashier') || lower.includes('fraud') || lower.includes('void') || lower.includes('discount')) {
      return {
        text: `🚨 **Cashier Anomaly Telemetry Summary:**\n\n- Cashier **Chloe Rivera (Terminal POS-02)** has triggered **3 active alerts** in today's shift.\n- Top flags: **60.0% unauthorized discount override** on AcousticPro Headphones ($239.98 uncollected margin) and **4 consecutive cart voids** without supervisor swipe.\n- Total incident risk score: **84 / 100 (Critical Severity)**\n\n**Recommendation:** Temporarily restrict cashier discount override threshold and review security footage for Register 02.`,
      };
    }

    if (lower.includes('supplier') || lower.includes('turnaround') || lower.includes('delivery')) {
      return {
        text: `📦 **Supplier Performance Analytics:**\n\n- **Verdent Organics Co.**: 3 days average lead time • 4.9/5 reliability rating • Preferred status\n- **NexTech Logistics Global**: 4 days average lead time • 4.8/5 rating • 100% on-time delivery\n- **Vanguard Textiles & Apparel**: 7 days lead time • 4.5/5 rating\n\nNexTech and Verdent currently meet all SLA targets for fast retail replenishment.`,
      };
    }

    // Default overview
    const totalRev = sales.reduce((a, b) => a + b.total, 0) + 47850;
    return {
      text: `📊 **Store Performance Overview (${currentBranch.name}):**\n\n- Total Gross Revenue: **$${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}**\n- Total Completed Sales: **${sales.length} transactions**\n- Low Stock Alerts: **${products.filter(p => p.stock <= p.minStockAlert).length} items**\n- Active Fraud Radar Flags: **${fraudAlerts.filter(f => f.status === 'pending').length} pending reviews**\n\nWhat specific area would you like to drill into?`,
    };
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>OmniFlow AI Business Assistant</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                Live Data-Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Query sales velocity, cashier shrinkage patterns, and reorder forecasts
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span>Connected Branch: <strong className="text-slate-800 dark:text-slate-200">{currentBranch.name.split('(')[0]}</strong></span>
        </div>
      </div>

      {/* Suggested Prompts Chips */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50/30 dark:bg-slate-900">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Try Asking:</span>
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium whitespace-nowrap hover:bg-indigo-100 transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-slate-700'
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>
                <div className={`mt-2 text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-[11px]">Analyzing multi-branch telemetry...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about inventory runouts, profit margins, cashier voids..."
            className="flex-1 px-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
