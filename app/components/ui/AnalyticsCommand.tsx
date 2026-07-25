"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code2, GitMerge, Activity, ServerCrash, X } from "lucide-react";

export function AnalyticsCommand() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 m-auto mt-32 w-full max-w-lg h-fit bg-[#1A1615] border border-border shadow-[0_0_50px_rgba(222,107,36,0.15)] rounded-2xl z-[101] overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest text-primary/80">Personal Analytics</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-mono text-muted-foreground">{'>'} Initializing telemetry diagnostics...</p>
                <p className="text-xs font-mono text-accent">{'>'} Fetching live career stats...</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 border-l-primary hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Code2 className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">CODE VOLUME</span>
                  </div>
                  <h4 className="text-2xl font-black text-foreground">14,285</h4>
                  <p className="text-[10px] text-muted-foreground uppercase">Lines analyzed & optimized</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 border-l-accent hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <GitMerge className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">PROJECTS MONITORED</span>
                  </div>
                  <h4 className="text-2xl font-black text-foreground">27+</h4>
                  <p className="text-[10px] text-muted-foreground uppercase">Production environments</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 border-l-emerald-500 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-500 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">AVG PERF GAIN</span>
                  </div>
                  <h4 className="text-2xl font-black text-foreground">35%</h4>
                  <p className="text-[10px] text-muted-foreground uppercase">Reduction in latency</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 border-l-destructive hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    <ServerCrash className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">CRITICAL OUTAGES PREVENTED</span>
                  </div>
                  <h4 className="text-2xl font-black text-foreground">12</h4>
                  <p className="text-[10px] text-muted-foreground uppercase">Proactive incident resolution</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-muted-foreground/50 font-mono">Press Esc to close • Data refreshed 2ms ago</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
