// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

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
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  return handle<T>(res);
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<T>(res);
}
