// app/layout.tsx
import "./globals.css";

export const metadata = {
	title: "Hire A Human",
	description: "B2B Console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-slate-950 text-slate-50 min-h-screen">
				{children}
			</body>
		</html>
	);
}
