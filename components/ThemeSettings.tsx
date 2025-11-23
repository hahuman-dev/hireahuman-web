// src/components/ThemeSettings.tsx
import React, { useEffect, useState } from "react";

type Theme = {
  logo?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
};

type ThemeSettingsProps = {
  tenantId: string;
};

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ tenantId }) => {
  const [theme, setTheme] = useState<Theme>({
    logo: "",
    primary: "#f97316", // sensible defaults
    secondary: "#111827",
    accent: "#fbbf24",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/tenants/${tenantId}/theme`);
        if (!res.ok) throw new Error("Failed to load theme");
        const json = await res.json();
        if (cancelled) return;
        setTheme((prev) => ({ ...prev, ...(json.data || {}) }));
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Error loading theme");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const handleChange =
    (field: keyof Theme) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTheme((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
        setError(null);
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/tenants/${tenantId}/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(theme),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save theme");
      }

      setTheme((prev) => ({ ...prev, ...(json.data || {}) }));
      setSaved(true);
    } catch (e: any) {
      setError(e.message || "Error saving theme");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading theme…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Branding & Theme</h1>
      <p className="text-sm text-gray-500">
        Update your logo and colours. These will be used across your tenant
        workspace and public-facing pages.
      </p>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && !error && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          Theme saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Logo URL / Path
            </label>
            <input
              type="text"
              value={theme.logo ?? ""}
              onChange={handleChange("logo")}
              placeholder="/logos/justcall.svg"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              You can use a relative path (served by your CDN) or a full URL.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primary ?? "#f97316"}
                  onChange={handleChange("primary")}
                  className="h-9 w-12 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.primary ?? "#f97316"}
                  onChange={handleChange("primary")}
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Secondary colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondary ?? "#111827"}
                  onChange={handleChange("secondary")}
                  className="h-9 w-12 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.secondary ?? "#111827"}
                  onChange={handleChange("secondary")}
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Accent colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accent ?? "#fbbf24"}
                  onChange={handleChange("accent")}
                  className="h-9 w-12 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.accent ?? "#fbbf24"}
                  onChange={handleChange("accent")}
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        {/* Live Preview */}
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-gray-500">
            Live preview
          </p>
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: theme.secondary || "#111827",
              color: "#ffffff",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {theme.logo ? (
                <img
                  src={theme.logo}
                  alt="Logo preview"
                  className="h-10 w-10 rounded-md bg-white object-contain p-1"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-700">
                  LOGO
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">Your Brand</div>
                <div className="text-xs text-gray-300">
                  This is how your header might look.
                </div>
              </div>
            </div>

            <button
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: theme.primary || "#f97316",
                color: "#ffffff",
              }}
            >
              Primary Action
            </button>
            <button
              className="ml-2 rounded-md px-3 py-2 text-sm font-medium border"
              style={{
                borderColor: theme.accent || "#fbbf24",
                color: theme.accent || "#fbbf24",
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
};
