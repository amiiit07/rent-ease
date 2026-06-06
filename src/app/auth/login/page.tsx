"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("user@rentmojo.com");
  const [password, setPassword] = useState("Customer@1234");
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
        body: JSON.stringify({ email, password, tenantSlug, purpose: "user" }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Login failed");
      }

      if (payload.token) {
        window.localStorage.setItem("rent-mojo-token", payload.token);
      }

      setMessage(`Signed in as ${payload.user?.role ?? "user"}. Redirecting to rentals...`);
      router.push("/rentals");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Customer sign in</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Access your rentals, orders, and support.</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="email">Email</label>
            <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="tenantSlug">Tenant slug</label>
            <input id="tenantSlug" value={tenantSlug} onChange={(event) => setTenantSlug(event.target.value)} className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:bg-[#90897d]">
            {isLoading ? "Signing in..." : "Sign in as user"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p> : null}
      </section>
    </main>
  );
}