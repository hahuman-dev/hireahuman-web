// components/contexts/TenantContext.tsx
"use client";

import React, { createContext, useContext } from "react";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  plan?: string;
};

type TenantContextValue = {
  tenant: Tenant;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within <TenantProvider />");
  }
  return ctx;
};

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={{ tenant }}>
      {children}
    </TenantContext.Provider>
  );
}
