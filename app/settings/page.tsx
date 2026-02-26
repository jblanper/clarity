import SettingsView from "@/components/SettingsView";

export const metadata = {
  title: "Settings — Clarity",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <SettingsView />
    </main>
  );
}
