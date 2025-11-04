// app/(app)/layout.tsx
"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { TenantProvider } from "@/app/(providers)/tenant-context";
import TenantSelect from "@/components/TenantSelect";

function SignOut() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("hah_auth");
        window.location.href = "/login";
      }}
      className="text-left text-sm text-slate-400 hover:text-slate-200"
    >
      Sign out
    </button>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <TenantProvider>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-4">
            <div className="mb-2">
              <div className="text-lg font-semibold tracking-tight">Hire A Human</div>
              <div className="text-xs text-slate-400">B2B Console</div>
            </div>

            <TenantSelect />

            <nav className="flex flex-col gap-2 text-sm mt-2">
              <Link href="/tenants" className="hover:bg-slate-800 rounded px-3 py-2">
                Tenants
              </Link>
              <Link href="/services" className="hover:bg-slate-800 rounded px-3 py-2">
                Services
              </Link>
              <Link href="/bookings" className="hover:bg-slate-800 rounded px-3 py-2">
                Bookings
              </Link>
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-2">
              <SignOut />
              <div className="text-xs text-slate-500">env: {process.env.NODE_ENV}</div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </TenantProvider>
    </RequireAuth>
  );
}
