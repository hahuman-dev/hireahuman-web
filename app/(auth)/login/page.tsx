"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "admin@hireahuman.com";
const DEMO_PASS = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "letmein123";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASS) {
      localStorage.setItem("hah_auth", "ok");
      router.replace("/tenants"); // go to app
    } else {
      setErr("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-[#1a1c23]/90 backdrop-blur">
        <h1 className="text-2xl font-bold text-center mb-2">Hire A Human</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Sign in to access your workspace
        </p>

        {err && <div className="mb-4 text-sm text-red-400">{err}</div>}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={DEMO_EMAIL}
              className="w-full px-3 py-2 rounded-md bg-[#262933] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-[#262933] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition font-semibold"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          Demo creds: <span className="text-gray-300">{DEMO_EMAIL}</span> / <span className="text-gray-300">{DEMO_PASS}</span>
        </div>
      </div>
    </div>
  );
}
