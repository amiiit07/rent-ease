"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@rentmojo.local");
  const [password, setPassword] = useState("password123");
  const [tenantSlug, setTenantSlug] = useState("rent-mojo");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, tenantSlug }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Registration failed");
      }

      if (payload.token) {
        window.localStorage.setItem("rent-mojo-token", payload.token);
      }

      setMessage("Account created. You can sign in now.");
      router.push("/auth/login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Create account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Register for a renter workspace.</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none" />
          </div>
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p> : null}
      </section>
    </main>
  );
}