"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";

export type Tenant = { id: string; name: string; slug: string; industry?: string; plan?: string };

type TenantCtx = {
  tenants: Tenant[];
  selected?: Tenant;
  setSelectedId: (id: string | undefined) => void;
  loading: boolean;
  error?: string;
};

const Ctx = createContext<TenantCtx | null>(null);

const STORAGE_KEY = "hah.selectedTenantId";

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string>();

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet<{ data: Tenant[] }>("/tenants");
        if (!on) return;
        setTenants(res.data);
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) || undefined : undefined;
        const initial = res.data.find(t => t.id === saved)?.id ?? res.data[0]?.id;
        setSelectedId(initial);
        if (initial && saved !== initial) localStorage.setItem(STORAGE_KEY, initial);
      } catch (e: any) {
        if (on) setErr(e?.message || "Failed to load tenants");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  const ctx: TenantCtx = useMemo(() => ({
    tenants,
    selected: tenants.find(t => t.id === selectedId),
    setSelectedId: (id) => {
      setSelectedId(id);
      if (typeof window !== "undefined") {
        if (id) localStorage.setItem(STORAGE_KEY, id);
        else localStorage.removeItem(STORAGE_KEY);
      }
    },
    loading,
    error
  }), [tenants, selectedId, loading, error]);

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useTenant(): TenantCtx {
  // instead of throwing, return a safe fallback (prevents build/prerender crashes)
  return useContext(Ctx) ?? {
    tenants: [],
    selected: undefined,
    setSelectedId: () => { },
    loading: true,
    error: undefined,
  };
}
