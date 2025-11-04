// app/services/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useTenant } from "@/app/(providers)/tenant-context";

export default function ServicesPage() {
  const { selected, loading } = useTenant();
  const [services, setServices] = useState<any[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!selected) return;
    setState("loading");
    apiGet<{ data: any[] }>(`/tenants/${selected.id}/services`)
      .then(r => { setServices(r.data); setState("idle"); })
      .catch(() => setState("error"));
  }, [selected?.id]);

  if (loading) return <div className="p-8 text-slate-400">Loading tenant…</div>;
  if (!selected) return <div className="p-8 text-slate-400">Select a tenant to view services.</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Services · {selected.name}</h1>
      {state === "error" && <div className="text-red-400 text-sm">Failed to load services.</div>}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {services.map(s => (
          <div key={s.id} className="border border-slate-800 bg-slate-900/30 rounded p-4">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-slate-400">{s.category}</div>
            <pre className="text-xs bg-slate-950/40 p-2 rounded mt-2 overflow-x-auto">
              {JSON.stringify(s.pricing_json, null, 2)}
            </pre>
          </div>
        ))}
        {!services.length && state !== "loading" && (
          <div className="text-slate-500 text-sm">No services for this tenant.</div>
        )}
      </div>
    </div>
  );
}
