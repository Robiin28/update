"use client";

import * as React from "react";
import type { Project } from "../lib/data";

type Row = Project & { _techText: string };

function toRow(p: Project): Row {
  return { ...p, _techText: p.technologies.join(", ") };
}

function newProject(order: number): Row {
  return toRow({
    id: crypto.randomUUID(),
    title: "New Project",
    slug: "new-project",
    description: "",
    category: "Web",
    technologies: [],
    imageUrl: "",
    featured: true,
    dateCompleted: new Date().toISOString().slice(0, 10),
    order,
  });
}

export function ProjectsEditor() {
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [sha, setSha] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<{ kind: "idle" | "error" | "success"; message?: string }>({
    kind: "idle",
  });
  const [saving, setSaving] = React.useState(false);
  const [uploadingId, setUploadingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/projects")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load projects");
        return res.json();
      })
      .then((data) => {
        setRows((data.projects as Project[]).map(toRow));
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
      return [...(prev ?? []), newProject(order)];
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

  const onUploadImage = async (row: Row, file: File) => {
    setUploadingId(row.id);
    setStatus({ kind: "idle" });
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: row.slug, dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      updateRow(row.id, { imageUrl: data.path });
      setStatus({ kind: "success", message: "Image uploaded — click Save & Publish to link it." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setUploadingId(null);
    }
  };

  const save = async () => {
    if (!rows || sha === null) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const projects: Project[] = rows.map(({ _techText, ...rest }) => ({
        ...rest,
        technologies: _techText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }));

      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, sha }),
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
    return <p className="text-sm text-muted-foreground">{status.message ?? "Loading projects…"}</p>;
  }

  const sorted = [...rows].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={addRow} className="btn-ghost-neon text-sm">
          + Add Project
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
              {row.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.imageUrl} alt="" className="w-24 h-16 object-cover rounded-lg border border-border shrink-0" />
              )}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title">
                  <input className="input-glass" value={row.title} onChange={(e) => updateRow(row.id, { title: e.target.value })} />
                </Field>
                <Field label="Slug">
                  <input className="input-glass" value={row.slug} onChange={(e) => updateRow(row.id, { slug: e.target.value })} />
                </Field>
                <Field label="Category">
                  <input className="input-glass" value={row.category} onChange={(e) => updateRow(row.id, { category: e.target.value })} />
                </Field>
                <Field label="Date Completed">
                  <input className="input-glass" value={row.dateCompleted} onChange={(e) => updateRow(row.id, { dateCompleted: e.target.value })} />
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
                className="input-glass min-h-[80px]"
                value={row.description}
                onChange={(e) => updateRow(row.id, { description: e.target.value })}
              />
            </Field>

            <Field label="Technologies (comma-separated)">
              <input className="input-glass" value={row._techText} onChange={(e) => updateRow(row.id, { _techText: e.target.value })} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="GitHub URL">
                <input className="input-glass" value={row.githubUrl ?? ""} onChange={(e) => updateRow(row.id, { githubUrl: e.target.value })} />
              </Field>
              <Field label="Live URL">
                <input className="input-glass" value={row.liveUrl ?? ""} onChange={(e) => updateRow(row.id, { liveUrl: e.target.value })} />
              </Field>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={row.featured} onChange={(e) => updateRow(row.id, { featured: e.target.checked })} />
                Featured
              </label>

              <label className="text-xs font-semibold text-primary cursor-pointer">
                {uploadingId === row.id ? "Uploading…" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingId === row.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUploadImage(row, file);
                    e.target.value = "";
                  }}
                />
              </label>
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
