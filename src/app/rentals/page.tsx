const rentalStages = [
  "Schedule delivery after checkout",
  "Track active tenure and return date",
  "Request extension, pickup, or maintenance",
];

export default function RentalsPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">My rentals</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Track active rentals, returns, and rental history.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          This page exists so the header route does not break. The main interactive rental demo remains on the homepage.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {rentalStages.map((item, index) => (
          <div key={item} className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[color:var(--muted)]">Step {index + 1}</p>
            <p className="mt-3 text-lg font-medium text-[color:var(--foreground)]">{item}</p>
          </div>
        ))}
      </section>
    </main>
  );
}