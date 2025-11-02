// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
	title: "Hire A Human",
	description: "Multi-tenant human services platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<body className="h-full bg-slate-950 text-slate-50">
				<div className="flex h-screen">
					{/* Sidebar (server-rendered) */}
					<aside className="w-60 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col">
						<div className="mb-6">
							<div className="text-lg font-semibold tracking-tight">Hire A Human</div>
							<div className="text-xs text-slate-400">B2B Console</div>
						</div>
						<nav className="flex flex-col gap-2 text-sm">
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
						<div className="mt-auto pt-4 text-xs text-slate-500">
							env: {process.env.NODE_ENV}
						</div>
					</aside>

					<main className="flex-1 overflow-y-auto">{children}</main>
				</div>
			</body>
		</html>
	);
}
