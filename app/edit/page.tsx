"use client";

import { useState, useEffect, startTransition } from "react";
import CheckInForm from "@/components/CheckInForm";

export default function EditPage() {
  const [date, setDate] = useState<string | null>(null);

  // Read the date from ?date= query param on the client — avoids a dynamic
  // route, which is incompatible with Next.js static export.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    startTransition(() => setDate(params.get("date")));
  }, []);

  // Render nothing until the date is resolved to avoid a brief flash in
  // today-mode before the edit-mode form is ready.
  if (!date) return <main className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen bg-background">
      <CheckInForm date={date} />
    </main>
  );
}
