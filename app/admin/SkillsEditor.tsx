"use client";

import * as React from "react";
import type { SkillCategory } from "../lib/data";

function newCategory(): SkillCategory {
  return { name: "New Category", skills: [] };
}

function newSkill() {
  return { name: "New Skill", level: 70, icon: "" };
}

export function SkillsEditor() {
  const [categories, setCategories] = React.useState<SkillCategory[] | null>(null);
  const [sha, setSha] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<{ kind: "idle" | "error" | "success"; message?: string }>({
    kind: "idle",
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/skills")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load skills");
        return res.json();
      })
      .then((data) => {
        setCategories(data.skills.categories as SkillCategory[]);
        setSha(data.sha);
      })
      .catch((err) => setStatus({ kind: "error", message: err.message }));
  }, []);

  const updateCategory = (catIdx: number, patch: Partial<SkillCategory>) => {
    setCategories((prev) => prev && prev.map((c, i) => (i === catIdx ? { ...c, ...patch } : c)));
  };

  const removeCategory = (catIdx: number) => {
    setCategories((prev) => prev && prev.filter((_, i) => i !== catIdx));
  };

  const addCategory = () => {
    setCategories((prev) => [...(prev ?? []), newCategory()]);
  };

  const moveCategory = (catIdx: number, dir: -1 | 1) => {
    setCategories((prev) => {
      if (!prev) return prev;
      const swapIdx = catIdx + dir;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[catIdx], next[swapIdx]] = [next[swapIdx], next[catIdx]];
      return next;
    });
  };

  const updateSkill = (catIdx: number, skillIdx: number, patch: Partial<SkillCategory["skills"][number]>) => {
    setCategories((prev) =>
      prev &&
      prev.map((c, i) =>
        i === catIdx ? { ...c, skills: c.skills.map((s, j) => (j === skillIdx ? { ...s, ...patch } : s)) } : c
      )
    );
  };

  const removeSkill = (catIdx: number, skillIdx: number) => {
    setCategories((prev) =>
      prev && prev.map((c, i) => (i === catIdx ? { ...c, skills: c.skills.filter((_, j) => j !== skillIdx) } : c))
    );
  };

  const addSkill = (catIdx: number) => {
    setCategories((prev) => prev && prev.map((c, i) => (i === catIdx ? { ...c, skills: [...c.skills, newSkill()] } : c)));
  };

  const save = async () => {
    if (!categories || sha === null) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: { categories }, sha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      setSha(data.sha);
      setStatus({ kind: "success", message: "Committed — Vercel is redeploying, live in ~1-2 min." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (!categories) {
    return <p className="text-sm text-muted-foreground">{status.message ?? "Loading skills…"}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={addCategory} className="btn-ghost-neon text-sm">
          + Add Category
        </button>
        <button onClick={save} disabled={saving} className="btn-neon text-sm">
          {saving ? "Publishing…" : "Save & Publish"}
        </button>
      </div>

      {status.kind !== "idle" && (
        <p className={`text-sm ${status.kind === "error" ? "text-red-400" : "text-emerald-400"}`}>
          {status.message}
        </p>
      )}

      <div className="space-y-4">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Field label="Category Name">
                  <input
                    className="input-glass"
                    value={cat.name}
                    onChange={(e) => updateCategory(catIdx, { name: e.target.value })}
                  />
                </Field>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => moveCategory(catIdx, -1)} className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70">↑</button>
                <button onClick={() => moveCategory(catIdx, 1)} className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70">↓</button>
                <button onClick={() => removeCategory(catIdx)} className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30">✕</button>
              </div>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-border">
              {cat.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="flex items-center gap-2">
                  <input
                    className="input-glass flex-1"
                    value={skill.name}
                    onChange={(e) => updateSkill(catIdx, skillIdx, { name: e.target.value })}
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-glass w-20"
                    value={skill.level}
                    onChange={(e) => updateSkill(catIdx, skillIdx, { level: Number(e.target.value) })}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  <button
                    onClick={() => removeSkill(catIdx, skillIdx)}
                    className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={() => addSkill(catIdx)} className="text-xs font-semibold text-primary">
                + Add Skill
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
