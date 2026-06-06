"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@rentmojo.com");
  const [password, setPassword] = useState("Admin@1234");
  const [tenantSlug, setTenantSlug] = useState("rent-mojo");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenantSlug, purpose: "admin" }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Admin login failed");
      }

      if (payload.token) {
        window.localStorage.setItem("rent-mojo-token", payload.token);
      }

      setMessage("Admin signed in. Opening panel...");
      router.push("/admin/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Admin login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(17,17,17,0.95)] p-6 text-white shadow-[0_24px_80px_rgba(17,17,17,0.18)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-white/55">Admin sign in</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Open the admin panel.</h1>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Use this page only for vendor or platform admin access.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-white/65" htmlFor="email">Admin email</label>
            <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/65" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/65" htmlFor="tenantSlug">Tenant slug</label>
            <input id="tenantSlug" value={tenantSlug} onChange={(event) => setTenantSlug(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:bg-white/50">
            {isLoading ? "Signing in..." : "Sign in as admin"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-white/70">{message}</p> : null}
      </section>
    </main>
  );
}