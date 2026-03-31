import { useState, useEffect, type ReactNode } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Smartphone, 
  Mic, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Store, 
  LineChart, 
  Zap,
  Globe2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-100">
      {/* ... NAVIGATION ... */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-card shadow-sm py-3' : 'bg-transparent py-4 md:py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg shadow-indigo-600/20">
              B
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">BoothIQ</span>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDashboard(true)}
            className="bg-slate-900 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold text-sm md:text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
          >
            Try Demo
          </motion.button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
        {/* Background Blobs */}
        <div className="blob bg-indigo-300 w-64 md:w-96 h-64 md:h-96 rounded-full top-0 left-[-10%] animate-pulse-soft"></div>
        <div className="blob bg-purple-300 w-64 md:w-96 h-64 md:h-96 rounded-full bottom-[-10%] right-[-10%] animate-pulse-soft" style={{animationDelay: '2s'}}></div>

        <div className="flex-1 relative z-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs md:text-sm mb-5 md:mb-8 animate-float-delayed"
          >
            <Zap size={14} fill="currentColor" /> Empowering 6+ Crore Indian SMBs
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.1] mb-5 md:mb-8 tracking-tight"
          >
            Stop Guessing. <br />
            Start <span className="gradient-text">Growing.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-600 mb-7 md:mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium"
          >
            We are not building a feature, we are building an <strong className="text-slate-900">AI growth partner</strong> for every small business in India.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <button 
              onClick={() => setShowDashboard(true)}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg md:text-xl hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Connect via Paytm <ArrowRight size={20} strokeWidth={3} />
            </button>
            <p className="text-sm md:text-base text-slate-500 font-semibold">Takes 30 seconds</p>
          </motion.div>
        </div>

        {/* Floating App Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative z-10 w-full max-w-sm md:max-w-md animate-float"
        >
          <div className="glass-card rounded-[32px] md:rounded-[40px] p-5 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-white/60 relative">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-3 md:-top-5 md:-right-5 bg-emerald-500 text-white text-xs md:text-sm font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-xl flex items-center gap-1.5 z-20"
            >
              <TrendingUp size={14} strokeWidth={3} /> +24% Profit this week
            </motion.div>
            
            <div className="flex justify-between items-center mb-5 md:mb-8">
              <div>
                <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Today's Revenue</p>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">₹4,250</h3>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <BarChart3 size={26} />
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="bg-white/90 rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-600 mt-0.5">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-slate-900">Restock Alert</h4>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 leading-snug">Milk & Sugar running low. Buy before 4 PM.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 mt-0.5">
                    <Mic size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-slate-900">Voice Assistant</h4>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 leading-snug">"Ramesh bhai, aaj pakode ka stock badha lijiye."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- REAL LIFE EXAMPLE (BEFORE / AFTER) --- */}
      <section className="py-16 md:py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight">Meet Ramesh. He runs a tea stall.</h2>
            <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">See how BoothIQ transforms daily struggles into smart, data-driven success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
            {/* Before Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-red-50/50 rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-red-100 relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 bg-red-500 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-bl-2xl md:rounded-bl-3xl font-black text-xs md:text-sm uppercase tracking-widest">
                Without AI
              </div>
              <div className="aspect-video w-full rounded-2xl md:rounded-3xl mb-5 md:mb-8 overflow-hidden bg-slate-100 shadow-inner">
                <img 
                  src="/assets/without_ai.png" 
                  alt="Stressed Shop Owner (Without AI)" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 flex items-center gap-3">
                <XCircle className="text-red-500" size={26} /> The Guesswork Era
              </h3>
              <ul className="space-y-3 md:space-y-5">
                <li className="flex gap-3 text-slate-700 text-sm md:text-lg font-medium">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p>Relies on a messy manual diary for bookkeeping.</p>
                </li>
                <li className="flex gap-3 text-slate-700 text-sm md:text-lg font-medium">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p>Doesn't know exactly how much profit he makes daily.</p>
                </li>
                <li className="flex gap-3 text-slate-700 text-sm md:text-lg font-medium">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p>Runs out of milk during peak evening hours, losing customers.</p>
                </li>
              </ul>
            </motion.div>

            {/* After Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-emerald-50/50 rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-emerald-100 relative overflow-hidden group transition-all shadow-xl shadow-emerald-500/5"
            >
               <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-bl-2xl md:rounded-bl-3xl font-black text-xs md:text-sm uppercase tracking-widest">
                With BoothIQ
              </div>
              <div className="aspect-video w-full rounded-2xl md:rounded-3xl mb-5 md:mb-8 overflow-hidden bg-navy-800 shadow-2xl shadow-indigo-500/10">
                <img 
                  src="/assets/with_ai.png" 
                  alt="Happy Shop Owner with AI Assistant" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" size={26} /> The Growth Era
              </h3>
              <ul className="space-y-3 md:space-y-5">
                <li className="flex gap-3 text-slate-700 text-sm md:text-lg font-semibold">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <p><span className="text-emerald-700">Auto-Tracking:</span> Connects Paytm; every rupee is tracked automatically.</p>
                </li>
                <li className="flex gap-3 text-slate-700 text-sm md:text-lg font-semibold">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <p><span className="text-emerald-700">Predictive Restock:</span> AI alerts him: <em>"Stock up milk for evening rush."</em></p>
                </li>
                <li className="flex gap-3 text-slate-700 text-sm md:text-lg font-semibold">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <p><span className="text-emerald-700">Smart Promos:</span> Suggested "Chai + Bun" combo, increasing daily sales by 15%.</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-16 md:py-32 bg-slate-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight">How It Works</h2>
            <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">Four simple steps to transform raw transaction data into actionable business growth.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 relative">
            <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-0 opacity-20"></div>

            {[
              { step: 1, title: "Connect Account", desc: "Link your Paytm account securely.", icon: <Smartphone size={28} /> },
              { step: 2, title: "AI Analyzes", desc: "Processes transactions & sales patterns.", icon: <Zap size={28} /> },
              { step: 3, title: "Get Insights", desc: "Clear profit trends & cash flow.", icon: <LineChart size={28} /> },
              { step: 4, title: "Take Action", desc: "AI suggests pricing & promotions.", icon: <TrendingUp size={28} /> }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-slate-800 border-4 md:border-8 border-slate-900 flex items-center justify-center mb-4 md:mb-8 shadow-2xl group-hover:-translate-y-3 transition-all duration-500 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  <div className="text-indigo-400 group-hover:text-white transition-colors z-10">
                    {item.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center font-black text-xs md:text-base border-2 md:border-4 border-slate-900">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-base md:text-2xl font-black mb-1 md:mb-3">{item.title}</h3>
                <p className="text-slate-400 text-xs md:text-base font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORE FEATURES --- */}
      <section className="py-16 md:py-32 bg-slate-50 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50 rounded-l-[200px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="mb-10 md:mb-20 md:w-1/2 md:pr-8">
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-8 tracking-tight">Your Financial Advisor & Strategist.</h2>
            <p className="text-lg md:text-2xl text-slate-600 font-medium">Built specifically for India. Speaking your language, solving your ground-level hurdles.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: <AlertTriangle className="text-orange-500" />, title: "Risk Prediction", desc: "AI predicts 'Next month loss risk' based on current burn rate and seasonal shifts." },
              { icon: <Store className="text-indigo-500" />, title: "Smart Restocking", desc: "Never run out of bestsellers. Get notified on the exact 'Best time to restock' inventory." },
              { icon: <LineChart className="text-emerald-500" />, title: "Personalized Insights", desc: "Uses your transaction data to auto-categorize expenses and show true net profit." },
              { icon: <Zap className="text-purple-500" />, title: "Smart Recommendations", desc: "Dynamic suggestions on optimal pricing, discount timing, and high-margin combos." },
              { icon: <Mic className="text-blue-500" />, title: "Local Voice Assistant", desc: "Talk to BoothIQ in Hindi, Marathi, Bengali, or Tamil. Get daily briefings via voice." },
              { icon: <TrendingUp className="text-rose-500" />, title: "Cash Flow Predictor", desc: "Anticipates future cash crunches so you can arrange capital or cut costs proactively." }
            ].map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* --- IMPACT & SCALABILITY --- */}
      <section className="py-16 md:py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 md:p-6 bg-indigo-50 rounded-[30px] md:rounded-[40px] mb-6 md:mb-8"
          >
            <Globe2 className="text-indigo-600 w-10 h-10 md:w-16 md:h-16" />
          </motion.div>
          <h2 className="text-3xl md:text-7xl font-black mb-8 md:mb-16 tracking-tight">Impact & Scalability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 text-left">
            <div className="bg-slate-50 p-6 md:p-12 rounded-[32px] md:rounded-[50px] border border-slate-100 flex flex-col justify-center">
              <h3 className="text-xl md:text-3xl font-black mb-5 md:mb-8 text-indigo-900 uppercase tracking-wider">🌍 The Impact</h3>
              <ul className="space-y-4 md:space-y-6">
                <li className="flex items-center gap-3 text-sm md:text-xl font-bold text-slate-700 italic"><CheckCircle2 className="text-indigo-500 flex-shrink-0" size={22} /> Helps millions of small businesses grow</li>
                <li className="flex items-center gap-3 text-sm md:text-xl font-bold text-slate-700 italic"><CheckCircle2 className="text-indigo-500 flex-shrink-0" size={22} /> Increases financial literacy daily</li>
                <li className="flex items-center gap-3 text-sm md:text-xl font-bold text-slate-700 italic"><CheckCircle2 className="text-indigo-500 flex-shrink-0" size={22} /> Reduces business failure risk by 40%</li>
              </ul>
            </div>
            
            <div className="bg-slate-900 p-6 md:p-12 rounded-[32px] md:rounded-[50px] text-white flex flex-col justify-center shadow-2xl">
              <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-8 text-purple-400 uppercase tracking-wider">📈 Built to Scale</h3>
              <p className="text-sm md:text-xl text-slate-300 mb-6 md:mb-10 font-medium leading-relaxed">Designed to be the daily companion for every vendor in India 🇮🇳.</p>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {["🏪 Kirana Stores", "☕ Street Vendors", "🚀 Small Startups", "✂️ Salons", "🥛 Dairy Shops"].map((tag, i) => (
                  <span key={i} className="px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-xs md:text-base border border-white/10 hover:bg-white/20 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA / FOOTER --- */}
      <footer className="bg-slate-900 pt-20 md:pt-32 pb-12 md:pb-16 text-center relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-8xl font-black mb-8 md:mb-12 tracking-tighter"
          >
            Ready to <span className="text-indigo-400">transform?</span>
          </motion.h2>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 rounded-full bg-white text-slate-900 font-black text-lg md:text-2xl shadow-2xl transition-all"
          >
            Join the BoothIQ Beta
          </motion.button>
          
          <div className="mt-16 md:mt-32 pt-8 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-500 font-bold text-xs md:text-sm uppercase tracking-widest">
            <p>© 2026 BoothIQ AI. Empowering India.</p>
            <div className="flex gap-6 md:gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="bg-white p-6 md:p-10 rounded-[28px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-2xl transition-all duration-500"
    >
      <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center mb-5 md:mb-8 border border-slate-100 shadow-inner group-hover:bg-indigo-50 transition-colors">
        <div className="scale-110 md:scale-125">{icon}</div>
      </div>
      <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-lg">{desc}</p>
    </motion.div>
  );
}
