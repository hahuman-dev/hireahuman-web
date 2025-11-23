"use client";

import React, { useEffect, useState } from "react";

type Theme = {
  logo?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
};

export function ThemeSettings({ tenantId }: { tenantId: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

  const [theme, setTheme] = useState<Theme>({
    logo: "",
    primary: "#f97316",
    secondary: "#111827",
    accent: "#fbbf24",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load existing theme
  useEffect(() => {
    let cancelled = false;

    async function loadTheme() {
      try {
        const res = await fetch(`${apiBase}/tenants/${tenantId}/theme`, {
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load theme");
        }

        if (!cancelled) {
          setTheme((prev) => ({ ...prev, ...(json.data || {}) }));
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load theme");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTheme();
    return () => {
      cancelled = true;
    };
  }, [apiBase, tenantId]);

  // Helpers
  const updateField =
    (field: keyof Theme) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setTheme((prev) => ({ ...prev, [field]: e.target.value }));
      setSaved(false);
      setError(null);
    };

  // Save
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`${apiBase}/api/tenants/${tenantId}/theme`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save theme");
      }

      setTheme(json.data);
      setSaved(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to save theme");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading theme…</p>;

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          Theme saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={theme.logo || ""}
              onChange={updateField("logo")}
              placeholder="/logos/mybrand.svg"
            />
          </div>

          {/* Colours */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Primary */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 rounded"
                  value={theme.primary}
                  onChange={updateField("primary")}
                />
                <input
                  type="text"
                  className="flex-1 rounded-md border px-2 py-1 text-sm"
                  value={theme.primary}
                  onChange={updateField("primary")}
                />
              </div>
            </div>

            {/* Secondary */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Secondary colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 rounded"
                  value={theme.secondary}
                  onChange={updateField("secondary")}
                />
                <input
                  type="text"
                  className="flex-1 rounded-md border px-2 py-1 text-sm"
                  value={theme.secondary}
                  onChange={updateField("secondary")}
                />
              </div>
            </div>

            {/* Accent */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Accent colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 rounded"
                  value={theme.accent}
                  onChange={updateField("accent")}
                />
                <input
                  type="text"
                  className="flex-1 rounded-md border px-2 py-1 text-sm"
                  value={theme.accent}
                  onChange={updateField("accent")}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        {/* Live preview */}
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500 mb-4">Live preview</p>

          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: theme.secondary,
              color: "#fff",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {theme.logo ? (
                <img
                  src={theme.logo}
                  alt="Logo preview"
                  className="h-10 w-10 bg-white rounded p-1 object-contain"
                />
              ) : (
                <div className="h-10 w-10 bg-white rounded flex items-center justify-center text-xs text-gray-600">
                  LOGO
                </div>
              )}

              <div>
                <div className="font-semibold">Your Brand</div>
                <div className="text-xs text-gray-300">
                  This is how your header may look.
                </div>
              </div>
            </div>

            <button
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: theme.primary,
                color: "#fff",
              }}
            >
              Primary Action
            </button>

            <button
              className="ml-2 rounded-md px-3 py-2 text-sm font-medium border"
              style={{
                borderColor: theme.accent,
                color: theme.accent,
                backgroundColor: "transparent",
              }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
