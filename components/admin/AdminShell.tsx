"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tenant, TenantProvider } from "@/components/contexts/TenantContext";

export default function AdminShell({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/tenants/${tenant.id}/admin`;

  const link = (href: string) =>
    `block rounded-md px-3 py-2 text-sm ${pathname === href
      ? "bg-gray-900 text-white"
      : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <TenantProvider tenant={tenant}>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="w-64 border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="text-xs uppercase text-gray-400">Tenant</div>
            <div className="font-semibold text-gray-900">{tenant.name}</div>
            <div className="text-xs text-gray-400">{tenant.slug}</div>
          </div>

          <nav className="mt-4 space-y-1 px-3">
            <Link href={base} className={link(base)}>
              Dashboard
            </Link>
            <Link
              href={`${base}/settings/theme`}
              className={link(`${base}/settings/theme`)}
            >
              Branding &amp; Theme
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </TenantProvider>
  );
}
