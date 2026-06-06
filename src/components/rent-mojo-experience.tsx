"use client";

import { useMemo, useState } from "react";

type ProductCategory = "Furniture" | "Appliances";

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  monthlyRent: number;
  securityDeposit: number;
  tenureOptions: number[];
  description: string;
  feature: string;
  availability: number;
  turnaround: string;
  accent: string;
};

type CartItem = {
  productId: string;
  tenure: number;
  deliveryDate: string;
  city: string;
};

type ActiveRental = {
  id: string;
  productId: string;
  tenure: number;
  city: string;
  deliveryDate: string;
  returnDate: string;
  status: "Scheduled" | "Active" | "Return in progress";
};

type SupportTicket = {
  id: string;
  rentalId: string;
  issue: string;
  status: "Open" | "In review" | "Resolved";
  eta: string;
};

const products: Product[] = [
  {
    id: "cloud-bed",
    name: "Cloud Bed",
    category: "Furniture",
    monthlyRent: 1499,
    securityDeposit: 2999,
    tenureOptions: [3, 6, 12],
    description:
      "Padded queen bed with storage-ready frame and fast assembly for compact city homes.",
    feature: "Quick install in 48 hours",
    availability: 18,
    turnaround: "48h delivery",
    accent: "from-[#f7a35c] to-[#f27f2f]",
  },
  {
    id: "horizon-sofa",
    name: "Horizon Sofa",
    category: "Furniture",
    monthlyRent: 1899,
    securityDeposit: 3499,
    tenureOptions: [3, 6, 12],
    description:
      "Three-seater sofa with anti-stain fabric, ideal for shared apartments and lounge corners.",
    feature: "Easy-care upholstery",
    availability: 11,
    turnaround: "72h delivery",
    accent: "from-[#295d74] to-[#1e4156]",
  },
  {
    id: "pivot-desk",
    name: "Pivot Desk",
    category: "Furniture",
    monthlyRent: 899,
    securityDeposit: 1499,
    tenureOptions: [1, 3, 6],
    description:
      "Work-from-home desk with cable channeling and a clean footprint for compact rooms.",
    feature: "Built for hybrid work",
    availability: 31,
    turnaround: "24h delivery",
    accent: "from-[#b0a5ff] to-[#6b5bf0]",
  },
  {
    id: "chill-fridge",
    name: "Chill Fridge",
    category: "Appliances",
    monthlyRent: 2199,
    securityDeposit: 4999,
    tenureOptions: [6, 12, 18],
    description:
      "Energy-efficient refrigerator sized for student housing, studio apartments, and shared flats.",
    feature: "Low energy consumption",
    availability: 14,
    turnaround: "48h delivery",
    accent: "from-[#6dd8c0] to-[#2c8e7d]",
  },
  {
    id: "spin-washer",
    name: "Spin Washer",
    category: "Appliances",
    monthlyRent: 1799,
    securityDeposit: 3999,
    tenureOptions: [6, 12, 18],
    description:
      "Front-load washing machine with maintenance cover and pickup-safe relocation support.",
    feature: "Service support included",
    availability: 9,
    turnaround: "72h delivery",
    accent: "from-[#f5b76c] to-[#db7a1e]",
  },
  {
    id: "view-max-tv",
    name: "ViewMax TV",
    category: "Appliances",
    monthlyRent: 1399,
    securityDeposit: 2999,
    tenureOptions: [3, 6, 12],
    description:
      "43-inch smart TV with streaming-ready setup and optional wall-mount installation.",
    feature: "Streaming-ready out of the box",
    availability: 22,
    turnaround: "24h delivery",
    accent: "from-[#f0cb7a] to-[#b98a1f]",
  },
];

const cityOptions = ["Bengaluru", "Hyderabad", "Pune", "Noida", "Gurugram", "Chennai"];

const inventoryRows = [
  { product: "Cloud Bed", stock: 18, reserved: 11, service: "Assembly queue", rating: "4.9/5" },
  { product: "Chill Fridge", stock: 14, reserved: 9, service: "Cooling check", rating: "4.8/5" },
  { product: "Spin Washer", stock: 9, reserved: 5, service: "Preventive service", rating: "4.7/5" },
  { product: "ViewMax TV", stock: 22, reserved: 13, service: "Firmware refresh", rating: "4.8/5" },
];

const serviceAreas = ["Central city", "Tech parks", "Student housing", "Peripheral suburbs", "Co-living clusters"];

const openClaims = [
  { title: "Damaged drawer rail", status: "Under inspection", age: "2h" },
  { title: "Return pickup reschedule", status: "Pending logistics", age: "6h" },
  { title: "Missing HDMI cable", status: "Assigned", age: "Today" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function toDateInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);

  next.setDate(next.getDate() + days);

  return next;
}

export function RentMojoExperience() {
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [selectedTenure, setSelectedTenure] = useState(products[0].tenureOptions[1]);
  const [deliveryDate, setDeliveryDate] = useState(() => toDateInputValue(addDays(new Date(), 3)));
  const [city, setCity] = useState(cityOptions[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRentals, setActiveRentals] = useState<ActiveRental[]>([
    {
      id: "RM-204",
      productId: "cloud-bed",
      tenure: 6,
      city: "Bengaluru",
      deliveryDate: "2026-05-21",
      returnDate: "2026-11-21",
      status: "Active",
    },
    {
      id: "RM-211",
      productId: "view-max-tv",
      tenure: 3,
      city: "Hyderabad",
      deliveryDate: "2026-05-24",
      returnDate: "2026-08-24",
      status: "Scheduled",
    },
  ]);
  const [supportRentalId, setSupportRentalId] = useState(activeRentals[0]?.id ?? "");
  const [supportIssue, setSupportIssue] = useState("Filter replacement request");
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: "SR-18",
      rentalId: "RM-204",
      issue: "Need cable management clip",
      status: "In review",
      eta: "3h",
    },
  ]);

  const filteredProducts = useMemo(() => {
    if (category === "All") {
      return products;
    }

    return products.filter((product) => product.category === category);
  }, [category]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? products[0],
    [selectedProductId],
  );

  const selectedCard = useMemo(() => {
    return cart.find((item) => item.productId === selectedProduct.id);
  }, [cart, selectedProduct.id]);

  const checkoutTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        return sum;
      }

      return sum + product.monthlyRent * item.tenure + product.securityDeposit;
    }, 0);
  }, [cart]);

  const monthlyRecurringRevenue = useMemo(() => {
    return activeRentals.reduce((sum, rental) => {
      const product = products.find((entry) => entry.id === rental.productId);

      return sum + (product?.monthlyRent ?? 0);
    }, 0);
  }, [activeRentals]);

  const utilizationRate = Math.round((activeRentals.length / 9) * 100);

  const effectiveTenure = selectedProduct.tenureOptions.includes(selectedTenure)
    ? selectedTenure
    : selectedProduct.tenureOptions[0];

  const effectiveSupportRentalId = supportRentalId || activeRentals[0]?.id || "";

  function addToCart() {
    const nextItem: CartItem = {
      productId: selectedProduct.id,
      tenure: effectiveTenure,
      deliveryDate,
      city,
    };

    setCart((current) => {
      const withoutCurrent = current.filter((item) => item.productId !== nextItem.productId);

      return [...withoutCurrent, nextItem];
    });
  }

  function checkoutCart() {
    if (!cart.length) {
      return;
    }

    setActiveRentals((current) => {
      const nextRentals = cart.map((item, index) => {
        const product = products.find((entry) => entry.id === item.productId) ?? products[0];
        const delivery = new Date(item.deliveryDate);

        return {
          id: `RM-${current.length + index + 301}`,
          productId: product.id,
          tenure: item.tenure,
          city: item.city,
          deliveryDate: item.deliveryDate,
          returnDate: toDateInputValue(addDays(delivery, item.tenure * 30)),
          status: "Scheduled" as const,
        };
      });

      return [...nextRentals, ...current];
    });

    setCart([]);
  }

  function submitSupportRequest() {
    if (!effectiveSupportRentalId || !supportIssue.trim()) {
      return;
    }

    setSupportTickets((current) => [
      {
        id: `SR-${current.length + 19}`,
        rentalId: effectiveSupportRentalId,
        issue: supportIssue.trim(),
        status: "Open",
        eta: "4h",
      },
      ...current,
    ]);

    setSupportIssue("");
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(circle_at_top,_rgba(239,125,50,0.2),_transparent_38%),radial-gradient(circle_at_80%_15%,_rgba(41,93,116,0.18),_transparent_28%)]" />

      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[rgba(245,239,228,0.74)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[color:var(--muted)]">Unified Mentor</p>
            <p className="text-xl font-semibold tracking-tight">Rent Mojo</p>
          </div>

          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            <a href="#catalog" className="rounded-full px-4 py-2 text-[color:var(--muted)] transition hover:bg-white/70 hover:text-[color:var(--foreground)]">
              Catalog
            </a>
            <a href="#checkout" className="rounded-full px-4 py-2 text-[color:var(--muted)] transition hover:bg-white/70 hover:text-[color:var(--foreground)]">
              Checkout
            </a>
            <a href="#operations" className="rounded-full px-4 py-2 text-[color:var(--muted)] transition hover:bg-white/70 hover:text-[color:var(--foreground)]">
              Operations
            </a>
          </nav>

          <a
            href="/admin"
            className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Admin dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_24px_90px_rgba(21,21,21,0.08)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f2c9a8] bg-[#fff3e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#c76524]">
              Monthly furniture and appliance rentals
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              Rent everything you need for the city, without the cost or relocation headache.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              Rent Mojo lets students and working professionals browse furniture and appliances, choose a monthly plan,
              schedule delivery, and manage returns from one responsive web app.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#222]"
              >
                Browse catalog
              </a>
              <a
                href="#checkout"
                className="rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Plan delivery
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Active rentals", value: `${activeRentals.length}` },
                { label: "Cities live", value: "6" },
                { label: "Support SLA", value: "4 hrs" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-4">
                  <p className="text-sm text-[color:var(--muted)]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[#111111] p-6 text-white shadow-[0_20px_80px_rgba(17,17,17,0.2)]">
              <p className="text-xs uppercase tracking-[0.32em] text-white/60">Live platform snapshot</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/60">Monthly recurring revenue</p>
                  <p className="mt-2 text-3xl font-semibold">{formatCurrency(monthlyRecurringRevenue)}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/60">Product utilization</p>
                  <p className="mt-2 text-3xl font-semibold">{utilizationRate}%</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Inventory tracked across furniture and appliances",
                  "Delivery, pickup, and return scheduling tied to each order",
                  "Maintenance requests stay linked to an active rental",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 text-sm text-white/80">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#ef7d32]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--border)] bg-white/80 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Primary objectives</p>
              <div className="mt-5 grid gap-3">
                {[
                  "Affordable monthly rentals with clear deposits",
                  "Flexible tenure plans from 1 to 18 months",
                  "Easy delivery, pickup, and maintenance support",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--muted)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_24px_90px_rgba(21,21,21,0.06)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Product catalog</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Furniture and appliances built for short stays and move-ready living.</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", "Furniture", "Appliances"] as const).map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCategory(entry)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    category === entry
                      ? "bg-[color:var(--foreground)] text-white"
                      : "border border-[color:var(--border)] bg-white/80 text-[color:var(--muted)] hover:bg-white"
                  }`}
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const active = selectedProduct.id === product.id;

              return (
                <article
                  key={product.id}
                  className={`rounded-[28px] border p-5 transition ${
                    active
                      ? "border-[rgba(239,125,50,0.5)] bg-white shadow-[0_20px_60px_rgba(239,125,50,0.12)]"
                      : "border-[color:var(--border)] bg-white/90 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(21,21,21,0.08)]"
                  }`}
                >
                  <div className={`h-32 rounded-[24px] bg-gradient-to-br ${product.accent} p-4 text-white`}>
                    <div className="flex h-full flex-col justify-between">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/70">{product.category}</p>
                      <div>
                        <p className="text-2xl font-semibold">{product.name}</p>
                        <p className="mt-1 text-sm text-white/75">{product.feature}</p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{product.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f7efe5] px-3 py-1 text-xs font-semibold text-[#9f5924]">{formatCurrency(product.monthlyRent)} / mo</span>
                    <span className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#2d6f62]">Deposit {formatCurrency(product.securityDeposit)}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-[#faf7f0] p-3">
                      <p className="text-[color:var(--muted)]">Tenures</p>
                      <p className="mt-1 font-semibold">{product.tenureOptions.join(" / ")} months</p>
                    </div>
                    <div className="rounded-2xl bg-[#faf7f0] p-3">
                      <p className="text-[color:var(--muted)]">Availability</p>
                      <p className="mt-1 font-semibold">{product.availability} units</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[#faf7f0]"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setSelectedTenure(product.tenureOptions[0]);
                      }}
                      className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#222]"
                    >
                      Quick add
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="checkout" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Checkout builder</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Choose a product, tenure, delivery date, and city.</h2>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-white p-5">
                <p className="text-sm font-semibold text-[color:var(--muted)]">Selected item</p>
                <h3 className="mt-2 text-2xl font-semibold">{selectedProduct.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{selectedProduct.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="tenure-select">
                      Rental tenure
                    </label>
                    <select
                      id="tenure-select"
                      value={effectiveTenure}
                      onChange={(event) => setSelectedTenure(Number(event.target.value))}
                      className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none transition focus:border-[rgba(239,125,50,0.5)]"
                    >
                      {selectedProduct.tenureOptions.map((option) => (
                        <option key={option} value={option}>
                          {option} months
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="delivery-date">
                      Delivery date
                    </label>
                    <input
                      id="delivery-date"
                      type="date"
                      value={deliveryDate}
                      onChange={(event) => setDeliveryDate(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none transition focus:border-[rgba(239,125,50,0.5)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-[color:var(--muted)]" htmlFor="location-select">
                      Delivery location
                    </label>
                    <select
                      id="location-select"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none transition focus:border-[rgba(239,125,50,0.5)]"
                    >
                      {cityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addToCart}
                    className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222]"
                  >
                    {selectedCard ? "Update cart item" : "Add to cart"}
                  </button>
                  <div className="rounded-full bg-[#f7efe5] px-4 py-3 text-sm text-[color:var(--muted)]">
                    Quick install and pickup available in selected city
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[color:var(--border)] bg-[#111111] p-5 text-white">
                <p className="text-sm font-semibold text-white/65">Selected product snapshot</p>
                <div className="mt-4 space-y-4 text-sm text-white/80">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 p-4">
                    <span>Monthly rent</span>
                    <span className="font-semibold text-white">{formatCurrency(selectedProduct.monthlyRent)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 p-4">
                    <span>Security deposit</span>
                    <span className="font-semibold text-white">{formatCurrency(selectedProduct.securityDeposit)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 p-4">
                    <span>Estimated return</span>
                    <span className="font-semibold text-white">
                      {toDateInputValue(addDays(new Date(deliveryDate), selectedTenure * 30))}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-4 leading-7 text-white/75">
                    Every rental includes maintenance routing, move-friendly pickup support, and inventory tracking across cities.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6" id="operations">
            <div className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.78)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Cart summary</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{cart.length} item{cart.length === 1 ? "" : "s"} ready for checkout</h3>
                </div>

                <div className="rounded-full bg-[#f7efe5] px-4 py-2 text-sm font-semibold text-[#9f5924]">
                  {formatCurrency(checkoutTotal)} total
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {cart.length ? (
                  cart.map((item) => {
                    const product = products.find((entry) => entry.id === item.productId) ?? products[0];

                    return (
                      <div key={item.productId} className="rounded-3xl border border-[color:var(--border)] bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="mt-1 text-sm text-[color:var(--muted)]">{item.city} · {item.tenure} months</p>
                          </div>
                          <p className="font-semibold text-[color:var(--foreground)]">{formatCurrency(product.monthlyRent * item.tenure + product.securityDeposit)}</p>
                        </div>
                        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Delivery on {item.deliveryDate}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-dashed border-[color:var(--border)] bg-[#faf7f0] p-6 text-center text-sm text-[color:var(--muted)]">
                    Add a product to the cart to calculate the monthly cost, deposit, and delivery schedule.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={checkoutCart}
                className="mt-5 w-full rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:bg-[#90897d]"
                disabled={!cart.length}
              >
                Confirm rental schedule
              </button>
            </div>

            <div className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.78)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Active rentals</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">Monitor current orders and pickups</h3>
                </div>

                <p className="rounded-full bg-[#eef6f4] px-4 py-2 text-sm font-semibold text-[#2d6f62]">
                  {activeRentals.length} rentals live
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {activeRentals.map((rental) => {
                  const product = products.find((entry) => entry.id === rental.productId) ?? products[0];

                  return (
                    <div key={rental.id} className="rounded-3xl border border-[color:var(--border)] bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="mt-1 text-sm text-[color:var(--muted)]">{rental.city} · {rental.tenure} months · {rental.status}</p>
                        </div>
                        <span className="rounded-full bg-[#faf7f0] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">{rental.id}</span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                        <div className="rounded-2xl bg-[#faf7f0] p-3">
                          <p className="text-[color:var(--muted)]">Delivery</p>
                          <p className="mt-1 font-semibold">{rental.deliveryDate}</p>
                        </div>
                        <div className="rounded-2xl bg-[#faf7f0] p-3">
                          <p className="text-[color:var(--muted)]">Return</p>
                          <p className="mt-1 font-semibold">{rental.returnDate}</p>
                        </div>
                        <div className="rounded-2xl bg-[#faf7f0] p-3">
                          <p className="text-[color:var(--muted)]">Monthly rent</p>
                          <p className="mt-1 font-semibold">{formatCurrency(product.monthlyRent)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.78)] p-6 shadow-[0_24px_80px_rgba(21,21,21,0.07)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Maintenance support</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">Raise a service request for an active rental</h3>
                </div>

                <p className="rounded-full bg-[#fff3e8] px-4 py-2 text-sm font-semibold text-[#c76524]">
                  {supportTickets.length} requests
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[0.85fr_1.15fr_auto]">
                <select
                  value={effectiveSupportRentalId}
                  onChange={(event) => setSupportRentalId(event.target.value)}
                  className="rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none transition focus:border-[rgba(239,125,50,0.5)]"
                >
                  {activeRentals.map((rental) => (
                    <option key={rental.id} value={rental.id}>
                      {rental.id} · {rental.city}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={supportIssue}
                  onChange={(event) => setSupportIssue(event.target.value)}
                  placeholder="Describe the issue"
                  className="rounded-2xl border border-[color:var(--border)] bg-[#fbf8f2] px-4 py-3 outline-none transition focus:border-[rgba(239,125,50,0.5)]"
                />

                <button
                  type="button"
                  onClick={submitSupportRequest}
                  className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222]"
                >
                  Create ticket
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-3xl border border-[color:var(--border)] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{ticket.issue}</p>
                        <p className="mt-1 text-sm text-[color:var(--muted)]">Rental {ticket.rentalId}</p>
                      </div>
                      <div className="text-right">
                        <p className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#2d6f62]">{ticket.status}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">ETA {ticket.eta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="admin" className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(17,17,17,0.94)] p-6 text-white shadow-[0_28px_100px_rgba(17,17,17,0.22)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/55">Admin dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Monitor inventory, disputes, and service areas from one panel.</h2>
              <div className="mt-4">
                <a
                  href="/admin/login"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[#f3f3f3]"
                >
                  Sign in as admin
                </a>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                  Open the separate admin login page to access the dashboard securely.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-white/75">
              <span className="rounded-full bg-white/10 px-4 py-2">Multi-city ready</span>
              <span className="rounded-full bg-white/10 px-4 py-2">Damage claims</span>
              <span className="rounded-full bg-white/10 px-4 py-2">Reporting</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Inventory items", value: "84" },
              { label: "Open rentals", value: `${activeRentals.length}` },
              { label: "Open claims", value: "12" },
              { label: "Avg. resolution", value: "4.3 hrs" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-sm text-white/55">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white/70">Inventory and pricing</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Live stock</span>
              </div>

              <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10">
                <div className="grid grid-cols-4 gap-3 border-b border-white/10 bg-white/6 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/45">
                  <span>Product</span>
                  <span>Stock</span>
                  <span>Reserved</span>
                  <span>Service</span>
                </div>

                {inventoryRows.map((row) => (
                  <div key={row.product} className="grid grid-cols-4 gap-3 border-b border-white/8 px-4 py-4 text-sm last:border-b-0">
                    <span className="font-medium text-white">{row.product}</span>
                    <span className="text-white/70">{row.stock}</span>
                    <span className="text-white/70">{row.reserved}</span>
                    <span className="text-white/70">{row.service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white/70">Service area coverage</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <span key={area} className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/75">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white/70">Damage and dispute queue</p>
                <div className="mt-4 space-y-3">
                  {openClaims.map((claim) => (
                    <div key={claim.title} className="rounded-2xl bg-white/8 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{claim.title}</p>
                          <p className="mt-1 text-sm text-white/55">{claim.status}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.24em] text-white/45">{claim.age}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-6 text-center text-sm text-[color:var(--muted)]">
          Built for monthly furniture and appliance rentals, delivery scheduling, maintenance support, and admin oversight.
        </footer>
      </div>
    </main>
  );
}