export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/60 backdrop-blur mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[color:var(--muted)]">© {new Date().getFullYear()} Rent Mojo — Rent furniture with ease.</div>
        <div className="flex gap-4 text-sm text-[color:var(--muted)]">
          <a href="/about" className="hover:text-[color:var(--foreground)]">About</a>
          <a href="/terms" className="hover:text-[color:var(--foreground)]">Terms</a>
          <a href="/privacy" className="hover:text-[color:var(--foreground)]">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
