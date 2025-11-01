import MysteryBoxDetailScreen from "@/screens/mystery-box-detail-screen";

interface PageProps {
  params: {
    id: string;
  };
}

export default function MysteryBoxDetailPage({ params }: PageProps) {
  return <MysteryBoxDetailScreen boxId={params.id} />;
}
