"use client";

import * as React from "react";
import type { Experience } from "../lib/data";

type Row = Experience & { _techText: string; _achievementsText: string };

function toRow(e: Experience): Row {
  return { ...e, _techText: e.technologies.join(", "), _achievementsText: e.achievements.join("\n") };
}

function newExperience(order: number): Row {
  return toRow({
    id: crypto.randomUUID(),
    company: "New Company",
    role: "Role",
    startDate: "",
    endDate: "Present",
    description: "",
    technologies: [],
    achievements: [],
    order,
  });
}

export function ExperiencesEditor() {
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [sha, setSha] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<{ kind: "idle" | "error" | "success"; message?: string }>({
    kind: "idle",
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/experiences")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load experiences");
        return res.json();
      })
      .then((data) => {
        setRows((data.experiences as Experience[]).map(toRow));
        setSha(data.sha);
      })
      .catch((err) => setStatus({ kind: "error", message: err.message }));
  }, []);

  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((prev) => prev && prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev && prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    setRows((prev) => {
      const order = (prev?.reduce((max, r) => Math.max(max, r.order), 0) ?? 0) + 1;
      return [...(prev ?? []), newExperience(order)];
    });
  };

  const move = (id: string, dir: -1 | 1) => {
    setRows((prev) => {
      if (!prev) return prev;
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((r) => r.id === id);
      const swapIdx = idx + dir;
      if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      const aOrder = a.order;
      a.order = b.order;
      b.order = aOrder;
      return sorted.map((r) => ({ ...r }));
    });
  };

  const save = async () => {
    if (!rows || sha === null) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const experiences: Experience[] = rows.map(({ _techText, _achievementsText, ...rest }) => ({
        ...rest,
        technologies: _techText.split(",").map((t) => t.trim()).filter(Boolean),
        achievements: _achievementsText.split("\n").map((a) => a.trim()).filter(Boolean),
      }));

      const res = await fetch("/api/admin/experiences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiences, sha }),
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

  if (!rows) {
    return <p className="text-sm text-muted-foreground">{status.message ?? "Loading experience…"}</p>;
  }

  const sorted = [...rows].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={addRow} className="btn-ghost-neon text-sm">
          + Add Experience
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
        {sorted.map((row) => (
          <div key={row.id} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Company">
                  <input className="input-glass" value={row.company} onChange={(e) => updateRow(row.id, { company: e.target.value })} />
                </Field>
                <Field label="Role">
                  <input className="input-glass" value={row.role} onChange={(e) => updateRow(row.id, { role: e.target.value })} />
                </Field>
                <Field label="Start Date">
                  <input className="input-glass" value={row.startDate} onChange={(e) => updateRow(row.id, { startDate: e.target.value })} />
                </Field>
                <Field label="End Date">
                  <input className="input-glass" value={row.endDate} onChange={(e) => updateRow(row.id, { endDate: e.target.value })} />
                </Field>
                <Field label="Location">
                  <input className="input-glass" value={row.location ?? ""} onChange={(e) => updateRow(row.id, { location: e.target.value })} />
                </Field>
                <Field label="Accent Color">
                  <input className="input-glass" value={row.accentColor ?? ""} onChange={(e) => updateRow(row.id, { accentColor: e.target.value })} />
                </Field>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => move(row.id, -1)} className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70">↑</button>
                <button onClick={() => move(row.id, 1)} className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70">↓</button>
                <button onClick={() => removeRow(row.id)} className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30">✕</button>
              </div>
            </div>

            <Field label="Description">
              <textarea
                className="input-glass min-h-[70px]"
                value={row.description}
                onChange={(e) => updateRow(row.id, { description: e.target.value })}
              />
            </Field>

            <Field label="Achievements (one per line)">
              <textarea
                className="input-glass min-h-[100px]"
                value={row._achievementsText}
                onChange={(e) => updateRow(row.id, { _achievementsText: e.target.value })}
              />
            </Field>

            <Field label="Technologies (comma-separated)">
              <input className="input-glass" value={row._techText} onChange={(e) => updateRow(row.id, { _techText: e.target.value })} />
            </Field>
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
