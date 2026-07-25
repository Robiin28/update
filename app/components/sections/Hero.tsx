"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import dynamic from "next/dynamic";
import { siteConfig } from "../../lib/siteConfig";

const NetworkScene = dynamic(
  () => import("../three/NetworkScene").then((mod) => mod.NetworkScene),
  { ssr: false }
);

/* ─────────────────────────────────────────────────────────────
   FLOATING DATA NODES
   Small pulsing telemetry dots that reinforce the data/monitoring theme.
───────────────────────────────────────────────────────────── */
const DATA_NODES = [
  { id: "01A", x: "14%",  y: "28%", color: "#DE6B24", size: 6,  delay: 0,   label: "SYS.ONLINE" },
  { id: "02B", x: "8%",   y: "62%", color: "#EEaf30", size: 4,  delay: 1.2, label: "NODE 02B"   },
  { id: "04D", x: "38%",  y: "15%", color: "#EEaf30", size: 3,  delay: 2.1, label: null        },
];

function DataNode({ node }: { node: typeof DATA_NODES[0] }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: node.x, top: node.y }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4 + node.delay, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
    >
      <motion.span
        className="absolute rounded-full"
        style={{ width: node.size * 4, height: node.size * 4, top: -node.size, left: -node.size, background: node.color, opacity: 0.15 }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: node.delay }}
      />
      <div
        className="rounded-full shadow-lg"
        style={{ width: node.size, height: node.size, background: node.color, boxShadow: `0 0 ${node.size * 3}px ${node.color}` }}
      />
      {node.label && (
        <span
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold tracking-[0.2em] whitespace-nowrap opacity-70"
          style={{ color: node.color }}
        >
          {node.label}
        </span>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────────────────── */
function MagneticButton({
  children, onClick, className, style, variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "ghost";
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 250, damping: 18 });
  const smy = useSpring(my, { stiffness: 250, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }
  function onLeave() { mx.set(0); my.set(0); }

  const primaryStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #DE6B24 0%, #EEaf30 100%)",
    boxShadow: "0 8px 32px rgba(222,107,36,0.25)",
  };
  const ghostStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: smx, y: smy, ...(variant === "primary" ? primaryStyle : ghostStyle), ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`relative px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide cursor-pointer overflow-hidden ${className ?? ""}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const triggered = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([ent]) => {
      if (ent.isIntersecting && !triggered.current) {
        triggered.current = true;
        let start = 0;
        const tick = setInterval(() => {
          start += target / 30;
          if (start >= target) { setCount(target); clearInterval(tick); }
          else setCount(Math.floor(start));
        }, 30);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const ROLES = ["Backend & Platform Engineer", "Microservices Architect", "Distributed Systems Engineer", "Fintech Systems Developer"];

/* ─────────────────────────────────────────────────────────────
   MAIN HERO COMPONENT
───────────────────────────────────────────────────────────── */
export function Hero() {
  const [roleIdx, setRoleIdx] = React.useState(0);
  const { scrollY } = useScroll();

  /* ───── 1. PARALLAX MOUNTAIN BACKGROUND ───── */
  const bgY = useTransform(scrollY, [0, 800], [0, 180]);
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.1]);
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080605] selection:bg-[#DE6B24]/30 selection:text-white">

      {/* ───── LAYER 0: PARALLAX BACKDROP — 3D MICROSERVICES NETWORK ───── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: bgScale }}>
        <div className="absolute inset-0 bg-[#080605]" />
        <NetworkScene />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080605] via-[#080605]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-transparent to-transparent opacity-60" />
      </motion.div>

      {/* ───── LAYER 1: DATA NODES ───── */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        {DATA_NODES.map((node) => <DataNode key={node.id} node={node} />) }
      </div>

      {/* ───── LAYER 2: CONTENT ───── */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center py-32 md:py-0">
        <div className="w-full container mx-auto px-6 sm:px-10 lg:px-20 flex flex-col items-center justify-center text-center lg:text-left lg:flex-row lg:justify-between h-full">
          
          {/* LEFT: Identity Panel */}
          <div className="w-full lg:w-3/5 text-center lg:text-left flex flex-col items-center lg:items-start gap-8 lg:gap-10">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase"> Addis Ababa · Active Status </span>
            </motion.div>

            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display font-black tracking-tighter leading-[0.9] text-white" style={{ fontSize: "clamp(3.5rem, 15vw, 10rem)" }}>
                <span className="block italic opacity-40 text-xl md:text-4xl mb-2 md:mb-4 font-normal tracking-wide">I am</span>
                <span className="block">{siteConfig.author.name.split(" ")[0]}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EEaf30] to-[#DE6B24]">
                  {siteConfig.author.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </motion.div>

            <div className="h-6 md:h-8 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={roleIdx}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs md:text-xl font-mono font-bold tracking-[0.15em] text-[#EEaf30]/80 uppercase"
                >
                  {ROLES[roleIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm md:text-base text-white/50 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              I build and operate <span className="text-white">backend services and distributed systems</span> for
              production fintech platforms — owning architecture, data integrity, and reliability end to end.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-row items-center justify-center lg:justify-start gap-3 md:gap-6 mt-4 md:mt-6 w-full flex-wrap"
            >
              <MagneticButton onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="text-white py-3.5 md:py-4 px-6 md:px-10 text-sm md:text-base">
                Explore Core System →
              </MagneticButton>
              <MagneticButton variant="ghost" className="text-white/60 py-3.5 md:py-4 px-6 md:px-10 text-sm md:text-base border-white/10">
                Download CV
              </MagneticButton>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-3 pt-8 border-t border-white/10 w-full"
            >
              <div className="group flex flex-col items-center lg:items-start">
                <p className="font-display text-lg md:text-3xl font-black text-[#DE6B24]"><Counter target={3} suffix="+" /></p>
                <p className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] text-white/30 mt-1">Years Experience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SCROLL CUE */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 pointer-events-none">
        <span className="text-[8px] tracking-[0.4em] uppercase font-mono text-white">Engage</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}
