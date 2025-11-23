"use client";

import React from "react";
import { useTenant } from "@/components/contexts/TenantContext";
import { ThemeSettings } from "@/components/admin/ThemeSettings";

export default function ThemeSettingsPage() {
  const { tenant } = useTenant();

  return (
    <div className="max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Branding &amp; Theme</h1>
        <p className="text-sm text-gray-500">
          Update this tenant&apos;s logo and colours. Changes will apply across
          all tenant-facing pages.
        </p>
      </header>

      <ThemeSettings tenantId={tenant.id} />
    </div>
  );
}
