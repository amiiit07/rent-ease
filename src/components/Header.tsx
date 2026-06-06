"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur border-b" aria-label="Site header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-semibold text-[color:var(--accent-strong)]">
              Rent Mojo
            </Link>
            <nav className="hidden sm:flex gap-4 text-sm text-[color:var(--muted)]">
              <Link href="/" className="hover:text-[color:var(--foreground)]">Home</Link>
              <Link href="/catalog" className="hover:text-[color:var(--foreground)]">Catalog</Link>
              <Link href="/rentals" className="hover:text-[color:var(--foreground)]">My Rentals</Link>
              <Link href="/support" className="hover:text-[color:var(--foreground)]">Support</Link>
              <Link href="/admin" className="hover:text-[color:var(--foreground)]">Admin</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-[color:var(--surface)] border rounded-lg px-3 py-1 text-sm text-[color:var(--foreground)]">
              <svg className="w-4 h-4 mr-2 text-[color:var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input placeholder="Search products" className="bg-transparent outline-none w-40" />
            </div>

            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-sm px-3 py-1 rounded-md bg-[color:var(--accent)] text-white">Sign in</Link>
              <button
                className="sm:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="Toggle menu"
                onClick={() => setOpen(!open)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="sm:hidden py-2">
            <nav className="flex flex-col gap-2">
              <Link href="/">Home</Link>
              <Link href="/catalog">Catalog</Link>
              <Link href="/rentals">My Rentals</Link>
              <Link href="/support">Support</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
