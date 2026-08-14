"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Experience, SkillCategory } from "../../lib/data";
import { Calendar, MapPin, CheckCircle2, Zap, Building2 } from "lucide-react";

/* ── Skill category block ───────────────────────────────── */
function SkillGroup({ category }: { category: SkillCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-220px" }}
      className="bg-white/80 dark:bg-card/60 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl dark:shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-foreground">{category.name}</h3>
      </div>
      <div className="space-y-4">
        {category.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-muted-foreground">{skill.name}</span>
              <span className="text-xs font-mono text-primary">{skill.level}%</span>
            </div>
            <div className="skill-bar">
              <motion.div
                className="skill-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Experience card ────────────────────────────────────── */
function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const [logoError, setLogoError] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const accent = exp.accentColor ?? "rgb(var(--primary))";
  const isPresent = exp.endDate === "Present";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-220px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Timeline dot */}
      <div
        className="absolute -left-[9px] top-8 w-[18px] h-[18px] rounded-full flex items-center justify-center z-10"
        style={{ background: accent, boxShadow: `0 0 14px ${accent}70` }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>

      {/* Card wrapper — layout animation handles smooth size change */}
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="ml-6 rounded-3xl border bg-white dark:bg-card/50 backdrop-blur-xl transition-shadow duration-300"
        style={{
          borderColor: expanded ? `${accent}35` : "rgb(var(--border))",
          boxShadow: expanded
            ? `0 16px 48px ${accent}20, 0 4px 20px rgba(0,0,0,0.1)`
            : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[3px] rounded-t-3xl w-full"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}60, transparent)` }}
        />

        {/* ── Clickable Header ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-6 pt-5 pb-5 focus:outline-none"
        >
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div
              className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-white dark:bg-muted border border-black/8 dark:border-white/10"
              style={{ boxShadow: `0 4px 14px ${accent}25` }}
            >
              {exp.logoUrl && !logoError ? (
                <Image
                  src={exp.logoUrl}
                  alt={`${exp.company} logo`}
                  width={40} height={40}
                  onError={() => setLogoError(true)}
                  className="object-contain w-8 h-8"
                />
              ) : (
                <span className="text-lg font-black" style={{ color: accent }}>
                  {exp.logoFallback ?? exp.company.charAt(0)}
                </span>
              )}
            </div>

            {/* Title & meta */}
            <div className="flex-grow min-w-0">
              <h3 className="font-display text-base font-black text-foreground leading-snug pr-2">
                {exp.role}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                <span className="flex items-center gap-1 text-xs font-bold" style={{ color: accent }}>
                  <Building2 className="w-3 h-3 shrink-0" />
                  {exp.company}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {exp.location}
                  </span>
                )}
              </div>
              {/* Date + active on same row as meta on small screens */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                  style={{ color: accent, borderColor: `${accent}45`, background: `${accent}10` }}
                >
                  <Calendar className="w-3 h-3" />
                  {exp.startDate} — {exp.endDate}
                </span>
                {isPresent && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 mt-1 text-muted-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </button>

        {/* ── Smooth Expandable Body ── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="exp-body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-6 pb-6 space-y-5">
                <div className="border-t pt-5" style={{ borderColor: `${accent}20` }} />

                {/* Narrative */}
                {exp.narrative && (
                  <blockquote
                    className="text-sm leading-relaxed text-foreground/75 italic pl-4 border-l-[3px]"
                    style={{ borderColor: accent }}
                  >
                    {exp.narrative}
                  </blockquote>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>

                {/* Key Contributions */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Key Contributions
                  </p>
                  <ul className="space-y-2.5">
                    {exp.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/75">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="pt-4 border-t flex flex-wrap gap-2" style={{ borderColor: `${accent}15` }}>
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-lg font-semibold border"
                      style={{ background: `${accent}10`, color: accent, borderColor: `${accent}30` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}



/* ── Animated Portrait ──────────────────────────────────── */
function AnimatedPortrait({ portraitUrl }: { portraitUrl: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center center"],
  });

  // Unique dramatic entrance: starts left/up, small, heavily clipped, rotated
  const x = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [-80, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 4]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(15% 45% 20% 10% round 40px)", "inset(0% 0% 0% 0% round 24px)"]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);

  // A subtle opposite movement for the glass frame to create parallax depth
  const frameX = useTransform(scrollYProgress, [0, 1], [-10, 8]);
  const frameY = useTransform(scrollYProgress, [0, 1], [-5, 12]);
  const frameRotate = useTransform(scrollYProgress, [0, 1], [-2, -3]);

  return (
    <div ref={ref} className="relative w-full h-[400px] mb-8 flex items-center justify-center max-w-sm mx-auto">

      {/* Decorative Parallax Glass Frame */}
      <motion.div
        style={{ x: frameX, y: frameY, rotate: frameRotate, opacity }}
        className="absolute inset-0 w-[240px] h-[340px] m-auto rounded-3xl border border-black/10 dark:border-white/10 bg-white/30 dark:bg-card/30 backdrop-blur-2xl shadow-xl z-0"
      />

      {/* Main Image */}
      <motion.div
        style={{ x, y, scale, rotate, clipPath, opacity }}
        className="relative w-[280px] h-[360px] md:w-[320px] md:h-[400px] z-10 shadow-2xl"
      >
        <Image
          src={portraitUrl}
          alt="My portrait"
          fill
          unoptimized
          className="object-cover rounded-3xl"
        />

        {/* Data/Monitoring Sci-Fi Overlay */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 dark:border-white/10 pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(222,107,36,0.3)] pointer-events-none" />
        
        {/* Soft Glowing nodes */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#DE6B24]/30 blur-[40px] mix-blend-screen rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/20 blur-[30px] mix-blend-screen rounded-full" />

        {/* Telemetry Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] sm:text-[10px] font-mono text-white/90 tracking-widest uppercase truncate shadow-black drop-shadow-md">
            SYS.OP.ONLINE
          </span>
        </div>
      </motion.div>
    </div>
  );
}


/* ── About / Experience / Skills ────────────────────────── */
export function About({
  experiences,
  skills,
  portraitUrl,
}: {
  experiences: Experience[];
  skills: SkillCategory[];
  portraitUrl: string;
}) {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="orb orb-sage w-[500px] h-[500px] top-0 -right-40 opacity-20" />

      <div className="container mx-auto relative z-10">
        {/* ── Experience ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-220px" }}
          className="flex flex-col items-center text-center gap-4 mb-16"
          id="experience"
        >
          <span className="section-label">
            <Calendar className="w-3 h-3" />
            Work History
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            My <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
            A timeline of my professional journey and the impact I've made.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-32">
          {/* Timeline */}
          <div className="relative order-2 lg:order-1">
            <div className="timeline-line" />
            <div className="space-y-6 md:space-y-8">
              {experiences.map((exp, i) => (
                <ExperienceCard key={exp.id} exp={exp} index={i} />
              ))}
            </div>
          </div>

          {/* Right Column: Portrait + About blurb */}
          <div className="flex flex-col gap-6 md:gap-8 order-1 lg:order-2">
            <div className="scale-90 md:scale-100">
              <AnimatedPortrait portraitUrl={portraitUrl} />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-220px" }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-card/60 backdrop-blur-xl shadow-2xl dark:shadow-none rounded-3xl p-6 md:p-8 gradient-border border border-black/5 dark:border-transparent">
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                  Who I Am
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-xs md:text-sm">
                  <p>
                    I'm a backend and platform engineer who owns problems end to end —
                    from system design to production operations. I currently build and
                    run Kifiya's loan platform solo, working across Go, Node.js, Kafka,
                    and PostgreSQL in event-driven microservice architectures.
                  </p>
                  <p>
                    I use AI-assisted, agentic engineering workflows for delivery speed
                    while keeping architecture and correctness decisions my own — and I
                    build personal projects on the side, from RAG experiments to a
                    recommendation-driven news feed, to keep deepening my systems thinking.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-xs md:text-sm text-muted-foreground">Addis Ababa</span>
                  </div>
                  <span className="ml-auto text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Open to select opportunities
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Skills ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-220px" }}
          id="skills"
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span className="section-label">
            <Zap className="w-3 h-3" />
            Technical Arsenal
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Skills &amp; <span className="gradient-text">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-220px" }}
              transition={{ delay: i * 0.1 }}
            >
              <SkillGroup category={cat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
