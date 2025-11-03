import "./globals.css";
import Link from "next/link";
import { TenantProvider } from "./(providers)/tenant-context";
import TenantSelect from "@/components/TenantSelect";

export const metadata = {
	title: "Hire A Human",
	description: "Multi-tenant human services platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<body className="h-full bg-slate-950 text-slate-50">
				<TenantProvider>
					<div className="flex h-screen">
						{/* Sidebar */}
						<aside className="w-64 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-4">
							<div className="mb-2">
								<div className="text-lg font-semibold tracking-tight">Hire A Human</div>
								<div className="text-xs text-slate-400">B2B Console</div>
							</div>

							<TenantSelect />

							<nav className="flex flex-col gap-2 text-sm">
								<Link href="/services" className="hover:bg-slate-800 rounded px-3 py-2">
									Services
								</Link>
								<Link href="/bookings" className="hover:bg-slate-800 rounded px-3 py-2">
									Bookings
								</Link>
							</nav>
							<nav className="flex flex-col gap-2 text-sm">
								<hr />
								<Link href="/tenants" className="hover:bg-slate-800 rounded px-3 py-2">
									Admin Tenant View
								</Link>
							</nav>

							<div className="mt-auto pt-4 text-xs text-slate-500">
								env: {process.env.NODE_ENV}
							</div>
						</aside>

						{/* Main */}
						<main className="flex-1 overflow-y-auto">{children}</main>
					</div>
				</TenantProvider>
			</body>
		</html>
	);
}
