"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * GLOBAL SENTINEL (V2)
 * High-end persistent portrait with guaranteed cross-page movement.
 */
export function GlobalSentinel() {
  const { scrollY } = useScroll();

  // Scroll mapping for unified path
  const x       = useTransform(scrollY, [0, 800, 1600], [0, 0, 80]); 
  const y       = useTransform(scrollY, [0, 800, 1600], [0, 0, 20]);
  const scale   = useTransform(scrollY, [0, 800, 1500], [0.85, 1.1, 0.4]); 
  const opacity = useTransform(scrollY, [0, 300, 2200, 2600], [0, 1, 1, 0]);
  const rotate  = useTransform(scrollY, [0, 800], [-8, 0]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <motion.div
        className="absolute bottom-0 right-[-50px] md:right-0 pointer-events-none hidden md:block"
        style={{
          width: "40vw",
          height: "100vh",
          x,
          y,
          scale,
          rotate,
          opacity,
          transformOrigin: "bottom center",
        }}
      >
        <div className="relative w-full h-full">
          {/* Using a professional standing portrait placeholder */}
          <Image
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
            alt="Standing Portrait"
            fill
            className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(222,107,36,0.3)]"
            priority
          />

          {/* Orbiting Telemetry */}
          <div className="absolute top-1/3 left-10 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-white/90 tracking-[0.2em] uppercase font-bold text-shadow-md">ROB.DEV.SYS</span>
          </div>

          <motion.div 
            className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-[#DE6B24]"
            animate={{ x: [0, 30, 0], y: [0, -60, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="absolute top-1/2 left-8 whitespace-nowrap text-[8px] font-mono font-bold text-[#DE6B24] tracking-widest uppercase">Target.Identified</div>
            <div className="absolute inset-0 rounded-full bg-[#DE6B24]/40 animate-ping" />
          </motion.div>

          {/* Ground Fog to blend the cut-off feet area */}
          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-[#080605] via-[#080605]/80 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
