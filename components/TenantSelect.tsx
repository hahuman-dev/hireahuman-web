"use client";

import { useTenant } from "@/app/(providers)/tenant-context";
import { useRouter, usePathname } from "next/navigation";

export default function TenantSelect() {
  const { tenants, selected, setSelectedId, loading, error } = useTenant();
  const router = useRouter();
  const pathname = usePathname();

  // handles tenant change and optional auto-redirect
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value || undefined;
    setSelectedId(id);

    // optional: auto-navigate to tenant details if currently on tenants list
    if (id && pathname.startsWith("/tenants")) {
      router.push(`/tenants/${id}`);
    }
  };

  // states
  if (loading) return <span className="text-xs text-slate-400">Loading tenants…</span>;
  if (error) return <span className="text-xs text-red-400">Failed: {error}</span>;
  if (!tenants.length) return <span className="text-xs text-slate-400">No tenants</span>;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="tenantSelect" className="text-xs text-slate-400">
        Tenant
      </label>
      <select
        id="tenantSelect"
        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
        value={selected?.id ?? ""}
        onChange={handleChange}
      >
        {tenants.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.slug})
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-1 text-[10px] text-slate-500">
          Active: <span className="text-slate-300">{selected.slug}</span>
        </div>
      )}
    </div>
  );
}
