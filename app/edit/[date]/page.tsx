import CheckInForm from "@/components/CheckInForm";

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  return { title: `Edit ${date} — Clarity` };
}

export default async function EditPage({ params }: Props) {
  const { date } = await params;

  return (
    <main className="min-h-screen bg-background">
      <CheckInForm date={date} />
    </main>
  );
}
