"use client";

import * as React from "react";
import type { Background, EducationEntry, VolunteerEntry, LanguageEntry } from "../lib/data";

export function BackgroundEditor() {
  const [background, setBackground] = React.useState<Background | null>(null);
  const [sha, setSha] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<{ kind: "idle" | "error" | "success"; message?: string }>({
    kind: "idle",
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/background")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load background");
        return res.json();
      })
      .then((data) => {
        setBackground(data.background as Background);
        setSha(data.sha);
      })
      .catch((err) => setStatus({ kind: "error", message: err.message }));
  }, []);

  const save = async () => {
    if (!background || sha === null) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/admin/background", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background, sha }),
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

  if (!background) {
    return <p className="text-sm text-muted-foreground">{status.message ?? "Loading background…"}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button onClick={save} disabled={saving} className="btn-neon text-sm">
          {saving ? "Publishing…" : "Save & Publish"}
        </button>
      </div>

      {status.kind !== "idle" && (
        <p className={`text-sm ${status.kind === "error" ? "text-red-400" : "text-emerald-400"}`}>
          {status.message}
        </p>
      )}

      <ListSection
        title="Education"
        items={background.education}
        onChange={(education) => setBackground({ ...background, education })}
        newItem={(): EducationEntry => ({ degree: "New Degree", institution: "", period: "" })}
        renderFields={(item, update) => (
          <>
            <Field label="Degree">
              <input className="input-glass" value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
            </Field>
            <Field label="Institution">
              <input className="input-glass" value={item.institution} onChange={(e) => update({ institution: e.target.value })} />
            </Field>
            <Field label="Period">
              <input className="input-glass" value={item.period} onChange={(e) => update({ period: e.target.value })} />
            </Field>
          </>
        )}
      />

      <ListSection
        title="Volunteering"
        items={background.volunteering}
        onChange={(volunteering) => setBackground({ ...background, volunteering })}
        newItem={(): VolunteerEntry => ({ role: "New Role", organization: "", period: "", note: "" })}
        renderFields={(item, update) => (
          <>
            <Field label="Role">
              <input className="input-glass" value={item.role} onChange={(e) => update({ role: e.target.value })} />
            </Field>
            <Field label="Organization">
              <input className="input-glass" value={item.organization} onChange={(e) => update({ organization: e.target.value })} />
            </Field>
            <Field label="Period">
              <input className="input-glass" value={item.period} onChange={(e) => update({ period: e.target.value })} />
            </Field>
            <Field label="Note">
              <input className="input-glass" value={item.note ?? ""} onChange={(e) => update({ note: e.target.value })} />
            </Field>
          </>
        )}
      />

      <ListSection
        title="Languages"
        items={background.languages}
        onChange={(languages) => setBackground({ ...background, languages })}
        newItem={(): LanguageEntry => ({ name: "New Language", level: "" })}
        renderFields={(item, update) => (
          <>
            <Field label="Language">
              <input className="input-glass" value={item.name} onChange={(e) => update({ name: e.target.value })} />
            </Field>
            <Field label="Proficiency">
              <input className="input-glass" value={item.level} onChange={(e) => update({ level: e.target.value })} />
            </Field>
          </>
        )}
      />
    </div>
  );
}

function ListSection<T>({
  title,
  items,
  onChange,
  newItem,
  renderFields,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const updateItem = (idx: number, patch: Partial<T>) => {
    onChange(items.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };
  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };
  const addItem = () => {
    onChange([...items, newItem()]);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-foreground">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderFields(item, (patch) => updateItem(idx, patch))}
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="btn-ghost-neon text-sm">
        + Add {title.slice(0, -1) || title}
      </button>
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
