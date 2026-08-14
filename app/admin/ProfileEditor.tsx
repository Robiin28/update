"use client";

import * as React from "react";
import type { Profile } from "../lib/data";

export function ProfileEditor() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [sha, setSha] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<{ kind: "idle" | "error" | "success"; message?: string }>({
    kind: "idle",
  });
  const [saving, setSaving] = React.useState(false);
  const [uploadingField, setUploadingField] = React.useState<keyof Profile | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data.profile as Profile);
        setSha(data.sha);
      })
      .catch((err) => setStatus({ kind: "error", message: err.message }));
  }, []);

  const update = (patch: Partial<Profile>) => {
    setProfile((prev) => prev && { ...prev, ...patch });
  };

  const onUploadFile = async (
    field: "aboutPortraitUrl" | "sentinelPortraitUrl" | "resumeUrl",
    file: File,
    label: string
  ) => {
    setUploadingField(field);
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
        body: JSON.stringify({ slug: field, dataUrl, folder: "profile" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      update({ [field]: data.path });
      setStatus({ kind: "success", message: `${label} uploaded — click Save & Publish to link it.` });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setUploadingField(null);
    }
  };

  const save = async () => {
    if (!profile || sha === null) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, sha }),
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

  if (!profile) {
    return <p className="text-sm text-muted-foreground">{status.message ?? "Loading profile…"}</p>;
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

      <div className="glass-card rounded-2xl p-5 space-y-3">
        <Field label="Years of Experience">
          <input
            type="number"
            min={0}
            className="input-glass"
            value={profile.yearsExperience}
            onChange={(e) => update({ yearsExperience: Number(e.target.value) })}
          />
        </Field>
      </div>

      <div className="glass-card rounded-2xl p-5 space-y-3">
        <Field label="Who I Am (bio — separate paragraphs with a blank line)">
          <textarea
            className="input-glass min-h-[160px]"
            value={profile.bio}
            onChange={(e) => update({ bio: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Location">
            <input
              className="input-glass"
              value={profile.location}
              onChange={(e) => update({ location: e.target.value })}
            />
          </Field>
          <Field label="Availability Badge Text">
            <input
              className="input-glass"
              value={profile.availabilityText}
              onChange={(e) => update({ availabilityText: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <PortraitField
        label="About Section Portrait"
        value={profile.aboutPortraitUrl}
        uploading={uploadingField === "aboutPortraitUrl"}
        onUpload={(file) => onUploadFile("aboutPortraitUrl", file, "Portrait")}
      />

      <PortraitField
        label="Scroll-Following Portrait (Global Sentinel)"
        value={profile.sentinelPortraitUrl}
        uploading={uploadingField === "sentinelPortraitUrl"}
        onUpload={(file) => onUploadFile("sentinelPortraitUrl", file, "Portrait")}
      />

      <FileField
        label="Resume / CV (PDF)"
        value={profile.resumeUrl}
        uploading={uploadingField === "resumeUrl"}
        accept="application/pdf"
        onUpload={(file) => onUploadFile("resumeUrl", file, "Resume")}
      />
    </div>
  );
}

function FileField({
  label,
  value,
  uploading,
  accept,
  onUpload,
}: {
  label: string;
  value: string;
  uploading: boolean;
  accept: string;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2">
          <Field label={label}>
            {value ? (
              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary underline break-all">
                {value}
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">No file set</p>
            )}
          </Field>
          <label className="inline-block text-xs font-semibold text-primary cursor-pointer">
            {uploading ? "Uploading…" : "Upload New File"}
            <input
              type="file"
              accept={accept}
              hidden
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function PortraitField({
  label,
  value,
  uploading,
  onUpload,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex items-start gap-4">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-20 h-20 object-cover rounded-xl border border-border shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <Field label={label}>
            <p className="text-xs text-muted-foreground break-all">{value || "No image set"}</p>
          </Field>
          <label className="inline-block text-xs font-semibold text-primary cursor-pointer">
            {uploading ? "Uploading…" : "Upload New Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
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
