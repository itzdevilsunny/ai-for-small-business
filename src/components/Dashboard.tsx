import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Package, 
  BarChart3, 
  BrainCircuit, 
  Settings,
  Bell,
  Search,
  Mic,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  Send,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { generateBusinessInsight, type AIResponse } from '../lib/gemini';

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 1, 
      role: 'assistant', 
      type: 'insight',
      text: 'Why is my profit low?',
      insight: {
        title: 'High expenses on supplies last week.',
        suggestions: [
          'Negotiate with supplier',
          'Reduce inventory costs'
        ],
        actions: ['Negotiate Costs', 'View Tips']
      }
    }
  ]);

  const [businessContext, setBusinessContext] = useState<any>(null);
  const [businessDetails, setBusinessDetails] = useState<{name: string; owner_name: string} | null>(null);
  const [kpis, setKpis] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  // Fetch initial context for AI and KPIs
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const { data: transactions } = await supabase.from('transactions').select('*').limit(50);
        const { data: inventory } = await supabase.from('inventory').select('*');
        const { data: businesses } = await supabase.from('businesses').select('name, owner_name').limit(1);

        if (businesses && businesses.length > 0) {
          setBusinessDetails(businesses[0]);
        }

        const txns = transactions || [];
        const invt = inventory || [];
        const totalIncome = txns.filter((t: any) => t.type === 'INCOME').reduce((s: number, t: any) => s + Number(t.amount), 0);
        const totalExpense = txns.filter((t: any) => t.type === 'EXPENSE').reduce((s: number, t: any) => s + Number(t.amount), 0);
        const netProfit = totalIncome - totalExpense;
        setKpis({ totalIncome, totalExpense, netProfit });
        setBusinessContext({ transactions: txns, inventory: invt });

        // Generate smart suggestions from real data
        const suggestions: string[] = [];
        const lowStock = invt.filter((i: any) => i.quantity <= i.threshold);
        lowStock.forEach((i: any) => suggestions.push(`Restock ${i.item_name} — only ${i.quantity} ${i.unit || 'units'} left`));
        if (netProfit < 0) suggestions.push('Review recent expenses — you are running at a loss');
        if (netProfit > 0) suggestions.push(`Profit is ₹${netProfit.toLocaleString()} — consider reinvesting`);
        const topExpense = txns.filter((t: any) => t.type === 'EXPENSE').sort((a: any, b: any) => b.amount - a.amount)[0];
        if (topExpense) suggestions.push(`Biggest expense: ${topExpense.description} (₹${Number(topExpense.amount).toLocaleString()})`);
        setSmartSuggestions(suggestions.slice(0, 4));
      } catch (e) {
        console.error("Context fetch failed:", e);
      }
    };
    fetchContext();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    const newUserMsg = { id: Date.now(), role: 'user', text: query, type: 'text' };
    setMessages(prev => [...prev, newUserMsg as any]);
    setChatInput('');
    setIsTyping(true);

    // Call Gemini
    const aiData: AIResponse = await generateBusinessInsight(query, language, businessContext);
    
    setIsTyping(false);
    
    // Add AI Response
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'assistant',
      ...aiData
    } as any]);
  };

  return (
    <div className="flex h-screen bg-navy-900 text-slate-300 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-navy-800 border-r border-navy-700 flex flex-col z-20">
        <div className="p-6 flex items-center justify-between border-b border-navy-700">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
               <span className="text-white font-bold text-xl tracking-tighter">B</span>
             </div>
             <span className="text-white font-bold text-xl tracking-wide">BoothIQ</span>
          </div>
          <button onClick={onBack} className="p-1.5 hover:bg-navy-700 rounded-lg text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'finance', icon: Wallet, label: 'Finance' },
            { id: 'inventory', icon: Package, label: 'Inventory' },
            { id: 'insights', icon: BarChart3, label: 'Insights' },
            { id: 'assistant', icon: BrainCircuit, label: 'AI Assistant', glow: true },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? item.glow 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                    : 'bg-navy-700 text-white shadow-lg shadow-black/20'
                  : 'hover:bg-navy-700/50 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id && item.glow ? 'animate-pulse text-indigo-400' : ''} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* AI Health Score */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-b from-navy-700 to-navy-800 border border-navy-600 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-emerald-400" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Business Health</h4>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black gradient-text">
              {businessContext
                ? Math.min(100, Math.max(0, Math.round((kpis.netProfit / Math.max(kpis.totalIncome, 1)) * 100 + 50)))
                : '--'}
            </span>
            <span className="text-sm text-slate-600 font-medium mb-1">/ 100</span>
          </div>
          <div className="w-full bg-navy-600 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: businessContext ? `${Math.min(100, Math.max(0, Math.round((kpis.netProfit / Math.max(kpis.totalIncome, 1)) * 100 + 50)))}%` : '0%' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            ></motion.div>
          </div>
          <div className={`text-[10px] mt-2 font-semibold flex items-center gap-1 ${kpis.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <div className={`w-1 h-1 rounded-full animate-pulse ${kpis.netProfit >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
            {kpis.netProfit >= 0 ? 'Profitable' : 'Running at Loss'}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-navy-900 relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-navy-700 bg-navy-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {businessDetails?.name || 'Loading...'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Updates</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-navy-800 rounded-lg p-1 border border-navy-700">
              <button 
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-colors ${language === 'EN' ? 'bg-navy-700 text-white' : 'text-slate-500 hover:text-white'}`}
              >EN</button>
              <button 
                onClick={() => setLanguage('HI')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-colors ${language === 'HI' ? 'bg-navy-700 text-white' : 'text-slate-500 hover:text-white'}`}
              >हिंदी</button>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              {kpis.netProfit < 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-navy-900"></span>}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-navy-700 cursor-pointer group">
              <div className="text-right">
                <p className="text-white font-bold text-sm tracking-tight">{businessDetails?.owner_name || '...'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Store Owner</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-navy-700 group-hover:border-indigo-500 transition-all duration-300 shadow-lg">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-glow-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '2s' }}></div>

          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
            <KPICard title="Total Revenue" value={businessContext ? `₹${kpis.totalIncome.toLocaleString()}` : '...'} glowColor="rgba(99,102,241,0.2)" gradient="from-indigo-400 to-indigo-600" change={businessContext ? `${businessContext.transactions.filter((t:any)=>t.type==='INCOME').length} txns` : '...'} isPositive={kpis.totalIncome > 0} />
            <KPICard title="Expenses" value={businessContext ? `₹${kpis.totalExpense.toLocaleString()}` : '...'} glowColor="rgba(244,63,94,0.15)" gradient="from-rose-400 to-rose-600" change={businessContext ? `${businessContext.transactions.filter((t:any)=>t.type==='EXPENSE').length} txns` : '...'} isNegative={kpis.totalExpense > 0} />
            <KPICard title="Net Profit" value={businessContext ? `₹${kpis.netProfit.toLocaleString()}` : '...'} glowColor="rgba(16,185,129,0.2)" gradient="from-emerald-400 to-emerald-600" change={businessContext ? (kpis.netProfit >= 0 ? 'Profitable' : 'Loss') : '...'} isPositive={kpis.netProfit > 0} isNegative={kpis.netProfit < 0} />
            <KPICard title="Inventory Items" value={businessContext ? `${businessContext.inventory.length}` : '...'} glowColor="rgba(245,158,11,0.15)" gradient="from-amber-400 to-amber-600" change={businessContext ? `${businessContext.inventory.filter((i:any)=>i.quantity<=i.threshold).length} low stock` : '...'} isNegative={businessContext ? businessContext.inventory.some((i:any)=>i.quantity<=i.threshold) : false} />
          </div>

          {/* Row 2 & 3 Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
            
            {/* LEFT COLUMN */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Sales Overview Chart */}
              <div className="bg-navy-800 border border-navy-700 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Sales & Forecast</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">AI Predicted growth based on seasonal trends</p>
                  </div>
                  <div className="flex bg-navy-700 p-1 rounded-xl border border-navy-600">
                    <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-navy-600 text-white shadow-lg">Weekly</button>
                    <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-slate-500 hover:text-white transition">Monthly</button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Custom SVG Chart */}
                  <div className="flex-1 relative h-[300px]">
                    <div className="absolute inset-0 flex flex-col justify-between py-2 border-b border-navy-700">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-full h-[1px] bg-navy-700/50"></div>
                      ))}
                    </div>
                    
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,80 L 0,80 Q 15,70 25,50 T 50,30 T 75,40 T 100,20 L 100,100 L 0,100 Z" 
                        fill="url(#areaGrad)" 
                        className="opacity-50"
                      />
                      <path 
                        d="M 0,80 Q 15,70 25,50 T 50,30 T 75,40 T 100,20" 
                        fill="none" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="animate-dash"
                        strokeDasharray="400"
                        strokeDashoffset="400"
                      />
                      {/* Predicted Line (Dashed) */}
                      <path 
                        d="M 50,30 Q 60,60 70,80 T 90,90 T 100,85" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        strokeDasharray="6 6"
                        className="opacity-60"
                      />
                      
                      {/* Data Points */}
                      {[
                        {x: 0, y: 80, c: '#6366f1'}, {x: 25, y: 50, c: '#6366f1'}, 
                        {x: 50, y: 30, c: '#818cf8'}, {x: 75, y: 40, c: '#a855f7'}, 
                        {x: 100, y: 20, c: '#c084fc'}
                      ].map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill={p.c} className="shadow-[0_0_10px_rgba(99,102,241,1)]" />
                      ))}
                    </svg>

                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    <div className="absolute top-4 left-4 bg-navy-900/80 backdrop-blur-md border border-navy-700 p-4 rounded-2xl shadow-2xl">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Peak Sales</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-black text-white tracking-tighter">₹24,500</span>
                         <span className="text-xs font-bold text-emerald-400">+15%</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Alerts Column */}
                  <div className="w-full lg:w-72 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                       <Sparkles size={14} className="text-indigo-400" /> AI Highlights
                    </h3>
                    
                    <AlertMiniCard 
                      icon={AlertTriangle} 
                      color="rose" 
                      title="Expense Alert" 
                      desc="Stock costs up by 20%" 
                    />
                    <AlertMiniCard 
                      icon={TrendingDown} 
                      color="amber" 
                      title="Profit Warning" 
                      desc="May drop next month" 
                    />
                    <AlertMiniCard 
                      icon={Lightbulb} 
                      color="indigo" 
                      title="Growth Tip" 
                      desc="Optimize pricing for Snacks" 
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Inventory & Top Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inventory Snapshot */}
                <div className="glass-card rounded-[32px] p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">Stock Alerts</h2>
                    <Package size={18} className="text-slate-500" />
                  </div>
                  <div className="space-y-4">
                    <StockItem name="Parle-G Biscuit" level={15} status="Critical" color="rose" />
                    <StockItem name="Amul Gold Milk" level={28} status="Low" color="amber" />
                    <StockItem name="Fortune Sunflower Oil" level={65} status="Healthy" color="emerald" />
                  </div>
                  <button className="w-full mt-6 py-3 rounded-xl bg-navy-700 hover:bg-navy-600 text-white text-xs font-bold transition-all border border-navy-600">
                    Manage Inventory
                  </button>
                </div>

                {/* Cash Flow */}
                <div className="glass-card rounded-[32px] p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">Cash Flow</h2>
                    <Activity size={18} className="text-slate-500" />
                  </div>
                  
                  <div className="flex-1 flex items-end gap-3 pb-4 min-h-[120px]">
                    {[
                      { in: 60, out: 40 }, { in: 80, out: 30 }, { in: 45, out: 55 }, 
                      { in: 95, out: 70 }, { in: 55, out: 35 }, { in: 75, out: 65 }
                    ].map((d, i) => (
                      <div key={i} className="flex-1 flex gap-1 h-full items-end">
                        <div className="w-2 bg-indigo-500 rounded-t-sm" style={{ height: `${d.in}%` }}></div>
                        <div className="w-2 bg-rose-400 rounded-t-sm" style={{ height: `${d.out}%` }}></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-navy-700/50 rounded-2xl p-4 border border-navy-600">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Net Cash Forecast</span>
                      <span className="text-[10px] text-emerald-400 font-bold">+₹12,400</span>
                    </div>
                    <p className="text-xs font-bold text-white">Rent Due: <span className="text-rose-400">₹8,000 in 3 days</span></p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: AI Assistant Chat */}
            <div className="bg-navy-800 border border-navy-700 rounded-[32px] shadow-2xl flex flex-col h-[600px] xl:h-auto overflow-hidden relative border-t-2 border-t-indigo-500">
              <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
              
              <div className="p-6 border-b border-navy-700 flex justify-between items-center bg-navy-800/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <BrainCircuit size={22} className="text-indigo-400" />
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-navy-800"></span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">AI Business Assistant</h2>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                      Status: Active / Learning
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-500 hover:text-white transition group relative focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
                    <Mic size={18} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-700 text-[10px] font-bold text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Voice</span>
                  </button>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <Search size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.role === 'user' ? (
                      <div className="bg-navy-700 border border-navy-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-xl">
                        <p className="text-sm font-medium">{msg.text}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-w-[95%]">
                        {msg.type === 'insight' ? (
                          <div className="bg-gradient-to-b from-navy-700 to-navy-800 border border-navy-600 rounded-2xl p-5 shadow-2xl">
                             <div className="flex items-start gap-3 mb-4">
                               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                 <ShieldCheck size={20} className="text-indigo-400" />
                               </div>
                               <div>
                                 <p className="text-white text-sm font-bold leading-relaxed">{msg.insight.title}</p>
                                 <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Suggested Steps:</p>
                               </div>
                             </div>
                             
                             <ul className="space-y-3 mb-5 ml-4">
                               {msg.insight.suggestions.map((s: string, i: number) => (
                                 <li key={i} className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                   {s}
                                 </li>
                               ))}
                             </ul>

                             <div className="flex gap-3">
                               <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] uppercase tracking-wider">
                                 {msg.insight.actions[0]}
                               </button>
                               <button className="flex-1 bg-navy-600 hover:bg-navy-700 border border-navy-500 text-white text-[10px] font-black py-2.5 rounded-lg transition-all uppercase tracking-wider">
                                 {msg.insight.actions[1]}
                               </button>
                             </div>
                          </div>
                        ) : (
                          <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700 text-slate-200 px-5 py-3 rounded-2xl rounded-tl-sm shadow-xl">
                            <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center gap-2 text-indigo-400 p-2 ml-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Smart Suggestions — dynamic from real data */}
              <div className="px-6 pb-2 pt-2 bg-navy-800 z-10 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
                {(smartSuggestions.length > 0 ? smartSuggestions : ['Ask about your sales trends', 'Check inventory status', 'Analyze recent expenses']).map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setChatInput(suggestion)}
                    className="shrink-0 text-[10px] font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full border border-indigo-500/30 transition-colors whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="px-6 py-4 bg-navy-800 border-t border-navy-700 z-10">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about sales, profits..."
                    className="w-full bg-navy-900 border border-navy-700 text-white text-sm rounded-2xl pl-5 pr-24 py-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-600 font-medium"
                  />
                  <div className="absolute right-3 flex items-center gap-1">
                    <button type="button" className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                      <Mic size={20} />
                    </button>
                    <button 
                      type="submit"
                      disabled={!chatInput.trim() || isTyping}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-navy-700 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
            </>
          )}

          {activeTab === 'finance' && <TabFinance transactions={businessContext?.transactions || []} />}
          {activeTab === 'inventory' && <TabInventory inventory={businessContext?.inventory || []} />}
          {activeTab === 'assistant' && (
            <div className="h-[75vh]">
              <div className="bg-navy-800 border border-navy-700 rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl relative">
                <div className="p-6 border-b border-navy-700 bg-navy-800/80 z-10 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <BrainCircuit size={24} className="text-indigo-400" />
                     <h2 className="text-xl font-bold text-white tracking-tight">AI Assistant Command Center</h2>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10 bg-navy-900/30">
                  {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.role === 'user' ? (
                        <div className="bg-navy-700 border border-navy-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-xl">
                          <p className="text-sm font-medium">{msg.text}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 max-w-[95%]">
                          {msg.type === 'insight' ? (
                            <div className="bg-gradient-to-b from-navy-700 to-navy-800 border border-navy-600 rounded-2xl p-5 shadow-2xl">
                               <div className="flex items-start gap-3 mb-4">
                                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                   <ShieldCheck size={20} className="text-indigo-400" />
                                 </div>
                                 <div>
                                   <p className="text-white text-sm font-bold leading-relaxed">{msg.insight.title}</p>
                                   <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Suggested Steps:</p>
                                 </div>
                               </div>
                               
                               <ul className="space-y-3 mb-5 ml-4">
                                 {msg.insight.suggestions.map((s: string, i: number) => (
                                   <li key={i} className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                     {s}
                                   </li>
                                 ))}
                               </ul>
                            </div>
                          ) : (
                            <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700 text-slate-200 px-5 py-3 rounded-2xl rounded-tl-sm shadow-xl">
                              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-indigo-400 p-2 ml-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="px-6 py-4 bg-navy-800 border-t border-navy-700 z-10">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your AI about sales, profits, or inventory..."
                      className="w-full bg-navy-900 border border-navy-700 text-white text-sm rounded-2xl pl-5 pr-16 py-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                    <button type="submit" disabled={!chatInput.trim() || isTyping} className="absolute right-3 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-navy-700 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg"><Send size={18} /></button>
                  </form>
                </div>
              </div>
            </div>
          )}
          {(activeTab === 'insights' || activeTab === 'settings') && (
            <EmptyState title={activeTab === 'insights' ? 'Insights Engine' : 'Settings'} icon={activeTab === 'insights' ? BarChart3 : Settings} />
          )}

        </div>

        {/* --- BOTTOM STATUS BAR --- */}
        <footer className="h-10 bg-navy-900 border-t border-navy-700 flex items-center justify-center gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest z-10">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
             Live Revenue Tracker
          </div>
          <div className="w-1 h-1 bg-navy-700 rounded-full"></div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
             Smart GST Engine Active
          </div>
          <div className="w-1 h-1 bg-navy-700 rounded-full"></div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
             Inventory Predictive AI: <span className="text-slate-300">Syncing...</span>
          </div>
        </footer>

      </main>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

// Helper Components

function KPICard({ title, value, glowColor, gradient, change, isPositive, isNegative }: any) {
  return (
    <div className="bg-navy-800 rounded-[28px] p-6 border border-navy-700 relative overflow-hidden group hover:border-navy-600 transition-all duration-300 shadow-xl">
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-700"
        style={{ backgroundColor: glowColor }}
      ></div>
      
      <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest relative z-10">{title}</p>
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{value}</h3>
        <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 
          isNegative ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : null}
          {change}
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${gradient} opacity-20`}></div>
    </div>
  );
}

function AlertMiniCard({ icon: Icon, color, title, desc }: any) {
  const colors: any = {
    rose: 'from-rose-500/20 to-rose-900/10 border-rose-500/30 text-rose-400',
    amber: 'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-400',
    indigo: 'from-indigo-500/20 to-indigo-900/10 border-indigo-500/30 text-indigo-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${color}-500/10 border border-${color}-500/20 shadow-inner`}>
           <Icon size={18} />
        </div>
        <div>
          <h4 className="font-bold text-xs text-white leading-none mb-1">{title}</h4>
          <p className="text-[10px] font-medium opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function StockItem({ name, level, status, color }: any) {
  const colors: any = {
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500'
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-900/50 border border-navy-700 group hover:border-navy-600 transition-colors">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{name}</span>
        <div className="flex items-center gap-2">
           <div className="w-20 bg-navy-700 h-1 rounded-full overflow-hidden">
              <div className={`${colors[color]} h-full rounded-full`} style={{ width: `${level}%` }}></div>
           </div>
           <span className="text-[10px] font-bold text-slate-500">{level}%</span>
        </div>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
        color === 'rose' ? 'bg-rose-500/10 text-rose-500' : 
        color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
      }`}>
        {status}
      </span>
    </div>
  );
}

function TabFinance({ transactions }: { transactions: any[] }) {
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6 z-10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Finance Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time data from Supabase Transactions</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Income</p>
          <p className="text-3xl font-black text-emerald-400">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Expenses</p>
          <p className="text-3xl font-black text-rose-400">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Net Profit</p>
          <p className={`text-3xl font-black ${netProfit >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
            ₹{netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-900/50 border-b border-navy-700 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <th className="p-4 pl-6">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4 pr-6 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx} className="border-b border-navy-700 hover:bg-navy-700/30 transition-colors">
                <td className="p-4 pl-6 text-slate-300 text-sm">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-white font-medium">{t.description}</td>
                <td className="p-4 text-slate-400 text-sm">{t.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                    t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className={`p-4 pr-6 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No transactions recorded</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabInventory({ inventory }: { inventory: any[] }) {
  return (
    <div className="space-y-6 z-10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Status</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time data from Supabase Inventory</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventory.map((item, idx) => {
          const isLow = item.quantity <= item.threshold;
          return (
            <div key={idx} className={`p-6 rounded-2xl border transition-all ${
              isLow ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.1)]' : 'bg-navy-800 border-navy-700 hover:border-navy-600'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-white text-lg">{item.item_name}</h3>
                {isLow && <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>}
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-indigo-400">{item.quantity}</span>
                <span className="text-sm font-bold text-slate-500 uppercase">{item.unit}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Threshold: {item.threshold}</span>
                <span className={`px-2 py-1 rounded uppercase tracking-wider ${
                  isLow ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {isLow ? 'Low Stock' : 'Good'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ title, icon: Icon }: { title: string, icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center z-10 relative">
      <div className="w-24 h-24 bg-navy-800 rounded-full flex items-center justify-center mb-6 border border-navy-700 shadow-xl">
        <Icon size={40} className="text-indigo-500 opacity-50" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 max-w-sm">This module is actively fetching connections. Available in next update with zero dummy data.</p>
    </div>
  );
}
