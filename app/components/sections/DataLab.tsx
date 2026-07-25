"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { Database, Filter, Layers, PlayCircle, BarChart3, TrendingUp, CheckCircle2 } from "lucide-react";

const optimizationData = [
  { name: 'Initial Load', value: 850, optimized: 320 },
  { name: 'TTFB', value: 420, optimized: 110 },
  { name: 'LCP', value: 1200, optimized: 450 },
  { name: 'CLS', value: 0.25, optimized: 0.05 },
];

const CaseStudyCard = ({ title, desc, tag, storyMode }: any) => {
  const [active, setActive] = React.useState(false);

  return (
    <motion.div 
      layout
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setActive(!active)}
      className={`bg-white/80 dark:bg-card/40 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 cursor-pointer relative overflow-hidden transition-colors ${active || storyMode ? "shadow-2xl ring-1 ring-primary/20" : "shadow-lg hover:shadow-xl"}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2 block">{tag}</span>
          <h3 className="font-bold text-2xl text-foreground">{title}</h3>
        </div>
        {!active && !storyMode && <BarChart3 className="w-6 h-6 text-muted-foreground mr-2 mt-2" />}
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">{desc}</p>

      <AnimatePresence>
        {(active || storyMode) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Chart Area */}
            <div className="h-[200px] w-full">
              <h4 className="text-xs font-bold font-mono text-muted-foreground mb-4">LATENCY DELTAS (ms)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={optimizationData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <RechartsTooltip cursor={{fill: 'rgb(var(--foreground)/0.05)'}} contentStyle={{ backgroundColor: 'rgb(var(--card))', borderRadius: '8px', border: '1px solid rgb(var(--border))' }}/>
                  <Bar dataKey="value" name="Before" fill="rgb(var(--muted))" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="optimized" name="After" fill="rgb(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insights Panel */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h5 className="text-sm font-bold text-foreground">Discovered 40% query bottleneck</h5>
                  <p className="text-xs text-muted-foreground mt-1">Refactored the core aggregation pipeline, introducing Redis caching layers.</p>
                </div>
              </div>
              <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl flex gap-3 items-start">
                <TrendingUp className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <h5 className="text-sm font-bold text-foreground">Improved LCP by 62%</h5>
                  <p className="text-xs text-muted-foreground mt-1">Optimized asset delivery via edge CDN configuration.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function DataLab() {
  const [storyMode, setStoryMode] = React.useState(false);

  return (
    <section id="datalab" className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-220px" }}>
            <span className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-4">
              <Database className="w-4 h-4" />
              Insights Gallery
            </span>
            <h2 className="font-display font-black text-foreground leading-none tracking-tighter" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
              Data Analysis <span className="gradient-text-terracotta-saffron">Lab</span>
            </h2>
          </motion.div>

          {/* Controls */}
          <div className="mt-8 md:mt-0 flex items-center gap-4">
            <button 
              onClick={() => setStoryMode(!storyMode)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${storyMode ? 'bg-primary text-white shadow-[0_0_15px_rgba(222,107,36,0.4)]' : 'bg-card text-foreground border border-border shadow-sm hover:shadow-md'}`}
            >
              <PlayCircle className={`w-4 h-4 ${storyMode ? 'animate-pulse' : ''}`} />
              Story Mode
            </button>
            <div className="p-2.5 rounded-full bg-card border border-border cursor-not-allowed opacity-50">
              <Filter className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <CaseStudyCard 
            title="E-Commerce API Optimization" 
            desc="A monolithic REST architecture was causing massive drop-offs during high-traffic flash sales."
            tag="SYSTEM ARCHITECTURE"
            storyMode={storyMode}
          />
          <CaseStudyCard 
            title="SaaS User Behavior Tracking" 
            desc="Implemented highly granular telemetry to track user journey drop-offs without impacting client-side performance."
            tag="DATA ANALYSIS"
            storyMode={storyMode}
          />
        </div>
      </div>
    </section>
  );
}
