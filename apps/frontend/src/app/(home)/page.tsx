'use client';

import { Navbar } from '@/components/home/navbar';
import { BackgroundAALChecker } from '@/components/auth/background-aal-checker';

export default function Home() {
  return (
    <BackgroundAALChecker>
      <div className="min-h-dvh bg-gradient-to-b from-background to-muted/20">
        {/* Use existing Navbar component - NO DUPLICATE */}
        <Navbar isAbsolute />

        {/* Hero Section */}
        <main className="container mx-auto px-4">
          <section className="py-20 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now in Public Beta
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Your Autonomous{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  AI Worker
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Built for complex tasks, designed for everything. The ultimate AI assistant that handles it all—from simple requests to mega-complex projects.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/auth"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Building Free
                </a>
                <a
                  href="/about"
                  className="w-full sm:w-auto px-8 py-4 bg-muted text-foreground rounded-xl text-lg font-semibold hover:bg-muted/80 transition-all hover:scale-105"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 pt-8 border-t">
                <p className="text-sm text-muted-foreground mb-6">Trusted by innovators at</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
                  <div className="text-2xl font-bold text-muted-foreground">Company A</div>
                  <div className="text-2xl font-bold text-muted-foreground">Company B</div>
                  <div className="text-2xl font-bold text-muted-foreground">Company C</div>
                  <div className="text-2xl font-bold text-muted-foreground">Company D</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 border-t">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From browser automation to complex workflows, bapX handles it all
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Browser Automation',
                  description: 'Navigate websites, extract data, and automate web workflows with intelligent agents',
                  icon: (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  )
                },
                {
                  title: 'File Management',
                  description: 'Create, edit, and organize documents, spreadsheets, and presentations automatically',
                  icon: (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  )
                },
                {
                  title: 'API Integrations',
                  description: 'Connect with 100+ services and automate cross-platform workflows seamlessly',
                  icon: (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                      <line x1="6" y1="6" x2="6.01" y2="6"/>
                      <line x1="6" y1="18" x2="6.01" y2="18"/>
                    </svg>
                  )
                },
                {
                  title: 'Code Execution',
                  description: 'Run Python code, execute commands, and perform complex data analysis',
                  icon: (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"/>
                      <polyline points="8 6 2 12 8 18"/>
                    </svg>
                  )
                },
                {
                  title: 'Multi-Modal AI',
                  description: 'Process text, images, audio, and video with state-of-the-art AI models',
                  icon: (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="8" y1="22" x2="16" y2="22"/>
                    </svg>
                  )
                },
                {
                  title: 'Custom Agents',
                  description: 'Build specialized agents tailored to your specific business needs',
                  icon: (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border bg-card hover:border-primary/50 transition-all hover:shadow-lg group"
                >
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 border-t">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How bapX Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes, scale to infinity
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: '01',
                  title: 'Describe Your Task',
                  description: 'Tell bapX what you need in natural language. No coding required.'
                },
                {
                  step: '02',
                  title: 'AI Plans & Executes',
                  description: 'bapX breaks down complex tasks and executes them step by step.'
                },
                {
                  step: '03',
                  title: 'Review & Iterate',
                  description: 'Review results, provide feedback, and let bapX refine the output.'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-6xl font-bold text-muted-foreground/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who are already building with bapX
              </p>
              <a
                href="/auth"
                className="inline-block px-8 py-4 bg-white text-primary rounded-xl text-lg font-semibold hover:bg-white/90 transition-all hover:scale-105"
              >
                Get Started for Free
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold">bapX</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your Autonomous AI Worker
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
                  <li><a href="/features" className="hover:text-foreground">Features</a></li>
                  <li><a href="/templates" className="hover:text-foreground">Templates</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
                  <li><a href="/tutorials" className="hover:text-foreground">Tutorials</a></li>
                  <li><a href="/docs" className="hover:text-foreground">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/about" className="hover:text-foreground">About</a></li>
                  <li><a href="/blog" className="hover:text-foreground">Blog</a></li>
                  <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 bapX. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </BackgroundAALChecker>
  );
}
