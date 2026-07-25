"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from "recharts";
import { Activity, Cpu, Database, Server, Zap, AlertCircle } from "lucide-react";

const velocityData = [
  { month: "Aug 23", intensity: 85 },
  { month: "Sep 23", intensity: 45 },
  { month: "Oct 23", intensity: 120 },
  { month: "Nov 23", intensity: 60 },
  { month: "Dec 23", intensity: 145 },
  { month: "Jan 24", intensity: 190 },
  { month: "Feb 24", intensity: 165 },
  { month: "Mar 24", intensity: 210 },
];

const expertiseMetrics = [
  { name: 'Frontend Architecture', value: 91, fill: '#EEAF30' },
  { name: 'AI & Emerging Tech',    value: 85, fill: '#DE6B24' },
  { name: 'Backend Systems',       value: 81, fill: '#4E8E89' },
  { name: 'Cloud & DevOps',        value: 76, fill: '#C05D5D' },
];

export function MonitorHub() {
  const [expandedMetric, setExpandedMetric] = React.useState<string | null>(null);
  
  return (
    <section id="monitorhub" className="py-32 relative overflow-hidden bg-background">
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full orb-terracotta opacity-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full orb-sage opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-220px" }}
          className="mb-16 md:flex md:items-end justify-between"
        >
          <div>
            <span className="flex items-center gap-2 text-primary font-bold text-[10px] md:text-sm tracking-widest uppercase mb-4">
              <Activity className="w-4 h-4 animate-pulse" />
              Developer Ecosystem · Performance Metrics
            </span>
            <h2 className="font-display font-black text-foreground leading-none tracking-tighter"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
              Project <span className="gradient-text-terracotta-saffron">Velocity</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl text-sm md:text-base leading-relaxed">
              I track development momentum through architectural complexity and feature delivery. This dashboard visualizes the scale and intensity of my recent technical contributions.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex items-center gap-3 bg-card/60 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-foreground font-mono">ALL SYSTEMS ACTIVE</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Traffic Chart */}
          <motion.div
            layout
            onClick={() => setExpandedMetric(expandedMetric === "traffic" ? null : "traffic")}
            className="col-span-1 lg:col-span-2 bg-white/5 dark:bg-card/40 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-xl rounded-3xl p-6 relative cursor-pointer group hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" /> Development Momentum
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Activity and complexity score trends</p>
              </div>
              <Activity className="w-5 h-5 text-accent animate-pulse" />
            </div>
            
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DE6B24" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#DE6B24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--card))', borderColor: 'rgb(var(--border))', borderRadius: '12px', color: 'rgb(var(--foreground))' }}
                    itemStyle={{ color: '#DE6B24' }}
                  />
                  <Area type="monotone" dataKey="intensity" stroke="#DE6B24" strokeWidth={3} fillOpacity={1} fill="url(#colorIntensity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <AnimatePresence>
              {expandedMetric === "traffic" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                    <span className="text-primary text-[10px] font-bold font-mono">PROJECTS COMPLETED</span>
                    <h4 className="text-xl md:text-2xl font-black text-foreground mt-1">08+</h4>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl">
                    <span className="text-accent text-[10px] font-bold font-mono">TECH STACK DEPTH</span>
                    <h4 className="text-xl md:text-2xl font-black text-foreground mt-1">20+</h4>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                    <span className="text-emerald-500 text-[10px] font-bold font-mono">SCALABILITY FOCUS</span>
                    <h4 className="text-xl md:text-2xl font-black text-foreground mt-1">10k+</h4>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Resources Radial Chart */}
          <motion.div
            className="bg-white/5 dark:bg-card/40 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-xl rounded-3xl p-6 flex flex-col"
          >
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-accent" /> Skill Distribution
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Mastery across core specializations</p>
            
            <div className="flex-grow flex items-center justify-center -ml-6 -mt-6">
              <div className="relative w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={16} data={expertiseMetrics}>
                    <RadialBar
                      background={{ fill: 'rgb(var(--muted))' }}
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Tooltip cursor={false} 
                      contentStyle={{ backgroundColor: 'rgb(var(--card))', borderRadius: '8px', border: 'none' }}
                      itemStyle={{ color: 'rgb(var(--foreground))' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2 ml-6">
                  <span className="font-black text-3xl text-foreground">SKILL</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">MAP</span>
                </div>
              </div>
            </div>

            {/* Error logs mini feed */}
            <div className="mt-auto border-t border-border pt-4">
               <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-3">
                 <Database className="w-3.5 h-3.5" /> Recent Milestones
               </h4>
               <div className="space-y-2">
                 <div className="flex items-center gap-2 text-xs">
                   <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                   <span className="text-foreground/80 font-mono">AI SaaS Dashboard Launched</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs">
                   <Zap className="w-3.5 h-3.5 text-accent" />
                   <span className="text-foreground/80 font-mono">Mobile App Store release complete</span>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
