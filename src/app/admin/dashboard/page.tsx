const kpis = [
  { label: "Active rentals", value: "48" },
  { label: "Open tickets", value: "12" },
  { label: "Open claims", value: "7" },
  { label: "Utilization", value: "82%" },
];

const inventoryRows = [
  { product: "Cloud Bed", stock: 18, reserved: 11, city: "Bengaluru", status: "Healthy" },
  { product: "Chill Fridge", stock: 14, reserved: 9, city: "Hyderabad", status: "Needs cleaning" },
  { product: "Spin Washer", stock: 9, reserved: 5, city: "Pune", status: "Service due" },
  { product: "ViewMax TV", stock: 22, reserved: 13, city: "Noida", status: "Healthy" },
];

const serviceAreas = ["Bengaluru - Central", "Hyderabad - Tech Corridor", "Pune - Student Belt", "Noida - Residential", "Chennai - Co-living"];

const disputes = [
  { title: "Damaged drawer rail", status: "Under review", age: "2h" },
  { title: "Return pickup reschedule", status: "Pending logistics", age: "6h" },
  { title: "Missing HDMI cable", status: "Assigned", age: "Today" },
];

export default function AdminDashboardPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(17,17,17,0.95)] p-6 text-white shadow-[0_28px_100px_rgba(17,17,17,0.22)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/55">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Manage inventory, users, rentals, disputes, and service areas.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              This is the protected admin dashboard shown only after admin login.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-white/75">
            <span className="rounded-full bg-white/10 px-4 py-2">Multi-city ready</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Damage claims</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Reporting</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/55">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Inventory and pricing</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Product availability and city-wise stock</h2>
            </div>
            <a href="/api/admin/products" className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white">
              API data
            </a>
          </div>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white">
            <div className="grid grid-cols-5 gap-3 border-b border-[color:var(--border)] bg-[#faf7f0] px-4 py-3 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              <span>Product</span>
              <span>Stock</span>
              <span>Reserved</span>
              <span>City</span>
              <span>Status</span>
            </div>

            {inventoryRows.map((row) => (
              <div key={row.product} className="grid grid-cols-5 gap-3 border-b border-[color:var(--border)] px-4 py-4 text-sm last:border-b-0">
                <span className="font-medium text-[color:var(--foreground)]">{row.product}</span>
                <span className="text-[color:var(--muted)]">{row.stock}</span>
                <span className="text-[color:var(--muted)]">{row.reserved}</span>
                <span className="text-[color:var(--muted)]">{row.city}</span>
                <span className="text-[color:var(--muted)]">{row.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Service areas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span key={area} className="rounded-full bg-[#f7efe5] px-3 py-2 text-sm text-[color:var(--muted)]">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Disputes and damage claims</p>
            <div className="mt-4 space-y-3">
              {disputes.map((claim) => (
                <div key={claim.title} className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">{claim.title}</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{claim.status}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{claim.age}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Operational notes</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "Monitor active rentals and pickup flow from the dashboard KPIs.",
            "Use the admin API endpoints for products and KPI overview.",
            "Expand the same tenant-scoped model to new cities without changing the route surface.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-4 text-sm leading-7 text-[color:var(--muted)]">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}