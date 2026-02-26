"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today" },
  { href: "/history", label: "History" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  // Hide the nav on Settings and Edit pages — those have their own back navigation
  if (pathname === "/settings" || pathname.startsWith("/edit/")) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 dark:border-stone-800 bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-5">
        {TABS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                isActive
                  ? "font-medium text-stone-900 dark:text-stone-100"
                  : "text-stone-400"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
