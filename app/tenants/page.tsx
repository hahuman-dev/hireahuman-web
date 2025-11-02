"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  plan: string;
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: Tenant[] }>("/tenants")
      .then((res) => setTenants(res.data))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      loaded
    </div>
  )
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Tenants</h1>
      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {tenants.map((t) => (
            <Link
              key={t.id}
              href={`/tenants/${t.id}`}
              className="rounded border border-slate-800 bg-slate-900/30 p-4 hover:border-sky-500 transition"
            >
              <div className="text-base font-medium">{t.name}</div>
              <div className="text-xs text-slate-400 mb-2">{t.slug}</div>
              <div className="text-xs text-slate-300">
                {t.industry} · {t.plan}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
