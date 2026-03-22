import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Worker Conversation | bapX',
  description: 'Interactive Worker conversation powered by bapX',
  openGraph: {
    title: 'Worker Conversation | bapX',
    description: 'Interactive Worker conversation powered by bapX',
    type: 'website',
  },
};

export default async function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
