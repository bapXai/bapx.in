import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Keys | bapX',
  description: 'Manage your API keys for programmatic access to bapX',
  openGraph: {
    title: 'API Keys | bapX',
    description: 'Manage your API keys for programmatic access to bapX',
    type: 'website',
  },
};

export default async function APIKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
