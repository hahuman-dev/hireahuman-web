"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  plan?: string;
};

type TenantCtx = {
  tenants: Tenant[];
  selected?: Tenant;
  setSelectedId: (id: string | undefined) => void;
  loading: boolean;
  error?: string;
};

const Ctx = createContext<TenantCtx | undefined>(undefined);

const STORAGE_KEY = "hah.selectedTenantId";

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedId, setSelectedIdState] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | undefined>(undefined);

  // load tenants once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet<{ data: Tenant[] }>("/tenants");
        if (!mounted) return;
        setTenants(res.data);

        // initial selection from localStorage or first tenant
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) || undefined : undefined;
        const exists = res.data.find(t => t.id === saved);
        const initial = exists?.id ?? res.data[0]?.id;
        setSelectedIdState(initial);
        if (initial && saved !== initial) {
          localStorage.setItem(STORAGE_KEY, initial);
        }
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load tenants");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const setSelectedId = (id: string | undefined) => {
    setSelectedIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    }
  };

  const selected = useMemo(() => tenants.find(t => t.id === selectedId), [tenants, selectedId]);

  const value = useMemo(() => ({
    tenants, selected, setSelectedId, loading, error: error
  }), [tenants, selected, loading, error]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTenant() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
