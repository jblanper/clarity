import ManageView from "@/components/ManageView";

export const metadata = {
  title: "Manage — Clarity",
};

export default function ManagePage() {
  return (
    <main className="min-h-screen bg-background">
      <ManageView />
    </main>
  );
}
