'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundAALChecker } from '@/components/auth/background-aal-checker';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <BackgroundAALChecker>
      <div className="h-dvh flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading bapX...
        </div>
      </div>
    </BackgroundAALChecker>
  );
}
