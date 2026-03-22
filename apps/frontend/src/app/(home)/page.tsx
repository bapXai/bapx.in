'use client';

import { BackgroundAALChecker } from '@/components/auth/background-aal-checker';

export default function Home() {
  // Removed auto-redirect to dashboard - show landing page instead

  return (
    <BackgroundAALChecker>
      <div className="min-h-dvh">
        {/* TODO: Add proper landing page content here */}
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Welcome to bapX</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your Autonomous AI Worker - Built for complex tasks, designed for everything.
          </p>
          <div className="flex gap-4">
            <a href="/auth" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Get Started
            </a>
            <a href="/about" className="px-6 py-3 border rounded-lg hover:bg-accent transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </BackgroundAALChecker>
  );
}
