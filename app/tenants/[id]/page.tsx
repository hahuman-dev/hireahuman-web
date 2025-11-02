"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet } from "@/lib/api";

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = params?.id as string;

  const [tenant, setTenant] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    (async () => {
      setLoading(true);
      const [t, u, s, b] = await Promise.all([
        apiGet<{ data: any }>(`/tenants/${tenantId}`),
        apiGet<{ data: any[] }>(`/tenants/${tenantId}/users`),
        apiGet<{ data: any[] }>(`/tenants/${tenantId}/services`),
        apiGet<{ data: any[] }>(`/tenants/${tenantId}/bookings`),
      ]);
      setTenant(t.data);
      setUsers(u.data);
      setServices(s.data);
      setBookings(b.data);
      setLoading(false);
    })().catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [tenantId]);

  if (loading) return <div className="p-8 text-slate-400">Loading…</div>;
  if (!tenant) return <div className="p-8 text-red-400">Tenant not found</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{tenant.name}</h1>
        <p className="text-slate-400 text-sm">
          {tenant.slug} · {tenant.industry} · {tenant.plan}
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Users */}
        <div className="bg-slate-900/40 border border-slate-800 rounded p-4">
          <h2 className="font-medium mb-3">Users</h2>
          <ul className="space-y-2 text-sm">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between">
                <div>
                  <div>{u.name}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </div>
                <span className="text-xs rounded bg-slate-800 px-2 py-1">{u.role}</span>
              </li>
            ))}
            {!users.length && <li className="text-slate-500 text-xs">No users.</li>}
          </ul>
        </div>

        {/* Services */}
        <div className="bg-slate-900/40 border border-slate-800 rounded p-4">
          <h2 className="font-medium mb-3">Services</h2>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-slate-400">{s.category}</div>
              </li>
            ))}
            {!services.length && <li className="text-slate-500 text-xs">No services.</li>}
          </ul>
        </div>

        {/* Bookings */}
        <div className="bg-slate-900/40 border border-slate-800 rounded p-4">
          <h2 className="font-medium mb-3">Bookings</h2>
          <ul className="space-y-2 text-sm">
            {bookings.map((b) => (
              <li key={b.id} className="border border-slate-800/50 rounded p-2">
                <div className="font-medium">{b.customer_name}</div>
                <div className="text-xs text-slate-400">
                  {b.status} · {b.start_time}
                </div>
              </li>
            ))}
            {!bookings.length && <li className="text-slate-500 text-xs">No bookings.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
