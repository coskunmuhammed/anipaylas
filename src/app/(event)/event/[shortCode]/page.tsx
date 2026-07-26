import { permanentRedirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function LegacyEventRedirectPage({ params }: PageProps) {
  const { shortCode } = await params;
  permanentRedirect(`/etkinlik/${shortCode}`);
}
