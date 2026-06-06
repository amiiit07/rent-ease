const categories = [
  { name: "Furniture", items: ["Bed", "Sofa", "Desk", "Dining table"] },
  { name: "Appliances", items: ["Fridge", "Washing machine", "TV", "Microwave"] },
];

export default function CatalogPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Catalog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Furniture and appliances for short-stay and city living.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          This route keeps the catalog link working while the main product browsing experience still lives on the home page.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.name} className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span key={item} className="rounded-full bg-[#f7efe5] px-3 py-2 text-sm text-[color:var(--muted)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <p className="text-sm text-[color:var(--muted)]">
          Browse the full interactive product flow on the home page, then return here once you want route-based navigation.
        </p>
      </section>
    </main>
  );
}