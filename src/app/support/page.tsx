const supportItems = [
  "Raise maintenance tickets for active rentals.",
  "Track open issues, response ETA, and resolution status.",
  "Escalate damage claims through the admin panel.",
];

export default function SupportPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Support</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Maintenance requests and support routing.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          Use this route for a support landing page while the live request form stays on the main experience.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {supportItems.map((item) => (
          <div key={item} className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm text-sm leading-7 text-[color:var(--muted)]">
            {item}
          </div>
        ))}
      </section>
    </main>
  );
}