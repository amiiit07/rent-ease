export default function AdminLandingPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(17,17,17,0.95)] p-6 text-white shadow-[0_28px_100px_rgba(17,17,17,0.22)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-white/55">Admin panel</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Rent Mojo admin panel</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
          Manage inventory, users, rentals, disputes, and service areas from a separate dashboard.
          Open the login page below to access the protected panel.
        </p>

        <div className="mt-6">
          <a
            href="/admin/login"
            className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[#f3f3f3]"
          >
            Login as admin
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Inventory tracking across cities",
          "Damage claims and disputes",
          "Vendor and platform oversight",
        ].map((item) => (
          <div key={item} className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm text-sm leading-7 text-[color:var(--muted)]">
            {item}
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-sm text-[color:var(--muted)]">
          The protected dashboard is available after login at <span className="font-semibold text-[color:var(--foreground)]">/admin/dashboard</span>.
        </p>
      </section>
    </main>
  );
}