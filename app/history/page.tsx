import HistoryView from "@/components/HistoryView";

export const metadata = {
  title: "History — Clarity",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <HistoryView />
    </main>
  );
}
