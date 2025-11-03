// app/bookings/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useTenant } from "@/app/(providers)/tenant-context";

export default function BookingsPage() {
  const { selected, loading } = useTenant();
  const [bookings, setBookings] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const load = async () => {
    if (!selected) return;
    setState("loading");
    try {
      const r = await apiGet<{ data: any[] }>(`/tenants/${selected.id}/bookings`);
      setBookings(r.data);
      setState("idle");
    } catch { setState("error"); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [selected?.id]);

  async function createDemoBooking() {
    if (!selected) return;
    setCreating(true);
    try {
      await apiPost("/bookings", {
        tenant_id: selected.id,
        service_id: "s-yjc-deep",
        customer_name: "Demo Customer",
        customer_phone: "+44 7000 000000",
        customer_address: "London, UK",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });
      await load();
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div className="p-8 text-slate-400">Loading tenant…</div>;
  if (!selected) return <div className="p-8 text-slate-400">Select a tenant to view bookings.</div>;

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings · {selected.name}</h1>
        <button
          onClick={createDemoBooking}
          disabled={creating}
          className="bg-sky-500 hover:bg-sky-600 text-sm px-4 py-2 rounded text-white disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create demo booking"}
        </button>
      </div>

      {state === "error" && <div className="text-red-400 text-sm">Failed to load bookings.</div>}

      <div className="space-y-2">
        {bookings.map(b => (
          <div key={b.id} className="border border-slate-800 rounded p-3 bg-slate-900/30">
            <div className="font-medium">{b.customer_name}</div>
            <div className="text-xs text-slate-400">{b.status} · {b.start_time}</div>
            <div className="text-xs text-slate-500">service: {b.service_id}</div>
          </div>
        ))}
        {!bookings.length && state !== "loading" && (
          <div className="text-slate-500 text-sm">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
