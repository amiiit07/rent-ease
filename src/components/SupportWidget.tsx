"use client";
import { useState } from "react";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="fixed right-4 bottom-6 z-50">
      {open && (
        <div className="w-72 bg-white shadow-lg rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-sm">Support</div>
            <button onClick={() => setOpen(false)} className="text-sm text-[color:var(--muted)]">Close</button>
          </div>
          <textarea
            rows={4}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full border rounded-md p-2 text-sm"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                // open mail client as fallback
                window.open(`mailto:support@rentmojo.com?subject=Support%20request&body=${encodeURIComponent(msg)}`);
              }}
              className="px-3 py-1 rounded bg-[color:var(--accent)] text-white text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[color:var(--accent-strong)] text-white rounded-full px-4 py-2 shadow-lg"
        aria-label="Open support"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        </svg>
        <span className="hidden sm:inline">Support</span>
      </button>
    </div>
  );
}
