"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProjectsEditor } from "./ProjectsEditor";
import { ExperiencesEditor } from "./ExperiencesEditor";

const TABS = ["Projects", "Experience"] as const;
type Tab = (typeof TABS)[number];

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("Projects");

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">Content Admin</h1>
          <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground underline">
            Log out
          </button>
        </div>

        <div className="flex gap-2 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Projects" ? <ProjectsEditor /> : <ExperiencesEditor />}
      </div>
    </div>
  );
}
