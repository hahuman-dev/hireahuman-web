import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

  console.log("AdminLayout params (id):", id);

  const res = await fetch(`${apiBase}/tenants/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Failed to load tenant", res.status, body);
    throw new Error(`Failed to load tenant (status ${res.status})`);
  }

  const json = await res.json();
  const tenant = json.data;

  return <AdminShell tenant={tenant}>{children}</AdminShell>;
}
