"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code, Play } from "lucide-react";
import { Project } from "../../lib/data";

/* ── Color palettes per project ─────────────────────────── */
const palettes = [
  { accent: "#EEAF30", bg: "rgba(238,175,48,0.06)",  border: "rgba(238,175,48,0.15)",  text: "#EEAF30" }, // Saffron Gold
  { accent: "#DE6B24", bg: "rgba(222,107,36,0.06)",  border: "rgba(222,107,36,0.15)",  text: "#DE6B24" }, // Spiced Terracotta
  { accent: "#4E8E89", bg: "rgba(78,142,137,0.06)",  border: "rgba(78,142,137,0.15)",  text: "#4E8E89" }, // Nile Teal / Sage
  { accent: "#C05D5D", bg: "rgba(192,93,93,0.06)",   border: "rgba(192,93,93,0.15)",   text: "#C05D5D" }, // Muted Coral
  { accent: "#B36A34", bg: "rgba(179,106,52,0.06)",  border: "rgba(179,106,52,0.15)",  text: "#B36A34" }, // Deep Ochre
  { accent: "#8B8C7A", bg: "rgba(139,140,122,0.06)", border: "rgba(139,140,122,0.15)", text: "#8B8C7A" }, // Frankincense Ash
];

/* Clip-path shapes for organic feel */
const shapes = [
  "polygon(0 0, 100% 0, 100% 88%, 94% 100%, 0 100%)",
  "polygon(0 0, 96% 0, 100% 6%, 100% 100%, 4% 100%, 0 94%)",
  "polygon(6% 0, 100% 0, 100% 100%, 0 100%, 0 6%)",
  "polygon(0 0, 100% 0, 100% 94%, 96% 100%, 0 100%)",
  "polygon(0 6%, 6% 0, 100% 0, 100% 100%, 0 100%)",
  "polygon(0 0, 94% 0, 100% 6%, 100% 100%, 6% 100%, 0 94%)",
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = React.useState(false);
  const palette = palettes[index % palettes.length];
  const shape   = shapes[index % shapes.length];
  const large   = index % 5 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-200px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-card/40 border border-black/5 dark:border-white/5 shadow-xl hover:shadow-2xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 ${large ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{
        clipPath: shape,
        ...(hovered ? {
          background: palette.bg,
          borderColor: palette.border,
          boxShadow: `0 0 40px ${palette.accent}15, 0 20px 60px rgba(0,0,0,0.15)`,
        } : {}),
        minHeight: large ? "420px" : "280px",
      }}
    >
      {/* Number watermark */}
      <span className="absolute top-5 right-6 font-display font-black text-5xl opacity-[0.04] pointer-events-none select-none"
            style={{ color: palette.accent }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Glow on top */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)` }}
      />

      <div className="relative z-10 p-7 h-full flex flex-col">
        {/* Category */}
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: palette.text }}>
          {project.category}
        </span>

        {/* Title */}
        <h3 className={`font-display font-black text-foreground leading-tight mb-3 ${large ? "text-3xl" : "text-xl"}`}>
          {project.title}
        </h3>

        {/* Description — shown on hover */}
        <motion.p
          animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.3 }}
          className="text-sm leading-relaxed flex-grow"
          style={{ color: "rgb(var(--muted-foreground))" }}
        >
          {project.description}
        </motion.p>

        {/* Tech tags */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-2 my-4"
        >
          {project.technologies.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}>
              {t}
            </span>
          ))}
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-auto">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-foreground"
               style={{ color: "rgb(var(--muted-foreground))" }}
               onClick={(e) => e.stopPropagation()}>
              <Code className="w-3.5 h-3.5" /> Source
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
               style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}
               onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="w-3.5 h-3.5" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = React.useState("All");
  const cats     = ["All", ...Array.from(new Set(initialProjects.map((p) => p.category)))];
  const filtered = filter === "All" ? initialProjects : initialProjects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-160px" }}
          className="mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "rgb(var(--primary))" }}>
            Selected Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="font-display font-black text-foreground leading-none tracking-tighter"
                style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}>
              Things I've<br />
              <span className="gradient-text-terracotta-saffron">Built</span>
            </h2>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: "rgb(var(--muted-foreground))" }}>
              A curated selection of projects spanning web apps, tools, and experiences I'm proud of.
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border shadow-md ${filter === c ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "bg-white dark:bg-card/50 text-muted-foreground border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:shadow-lg dark:hover:shadow-none"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Organic asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
