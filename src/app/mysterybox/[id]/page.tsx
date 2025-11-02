import MysteryBoxDetailScreen from "@/screens/mystery-box-detail-screen";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MysteryBoxDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <MysteryBoxDetailScreen boxId={id} />;
}
