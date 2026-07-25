"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GraduationCap, HeartHandshake, Languages as LanguagesIcon } from "lucide-react";
import type { Background as BackgroundData } from "../../lib/data";

function PanelCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-220px" }}
      className="bg-white/80 dark:bg-card/60 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl dark:shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

export function Background({ data }: { data: BackgroundData }) {
  return (
    <section id="background" className="py-32 relative overflow-hidden">
      <div className="orb orb-terracotta w-[500px] h-[500px] -top-20 -left-40 opacity-15" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-220px" }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span className="section-label">
            <GraduationCap className="w-3 h-3" />
            Background
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Education &amp; <span className="gradient-text">Beyond</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <PanelCard icon={GraduationCap} title="Education">
            {data.education.map((e) => (
              <div key={e.degree} className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm font-semibold text-foreground">{e.degree}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{e.institution}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{e.period}</p>
              </div>
            ))}
          </PanelCard>

          <PanelCard icon={HeartHandshake} title="Volunteering">
            {data.volunteering.map((v) => (
              <div key={v.role} className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm font-semibold text-foreground">{v.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{v.organization} · {v.period}</p>
                {v.note && (
                  <p className="text-[11px] text-muted-foreground/70 mt-1 leading-relaxed">{v.note}</p>
                )}
              </div>
            ))}
          </PanelCard>

          <PanelCard icon={LanguagesIcon} title="Languages">
            {data.languages.map((l) => (
              <div key={l.name} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{l.name}</span>
                <span className="text-xs text-muted-foreground">{l.level}</span>
              </div>
            ))}
          </PanelCard>
        </div>
      </div>
    </section>
  );
}
