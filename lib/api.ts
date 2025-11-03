// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // 👈 will add in Vercel

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch { }
    throw new Error(msg);
  }
  return res.json();
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (API_KEY) headers["x-hah-key"] = API_KEY;

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    cache: "no-store",
  });
  return handle<T>(res);
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) headers["x-hah-key"] = API_KEY;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handle<T>(res);
}
