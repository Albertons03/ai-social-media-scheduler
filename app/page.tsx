import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SocialScheduler</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            AI-Powered Social Media{' '}
            <span className="text-primary">Scheduling</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule posts across TikTok, LinkedIn, and Twitter with AI-generated
            content. Save time and boost engagement.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="border border-border px-8 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">AI Content Generation</h3>
            <p className="text-muted-foreground">
              Generate engaging captions and content ideas with GPT-4. Perfect for
              when creativity runs dry.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Schedule posts in advance across multiple platforms. Set it and
              forget it with automated publishing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Track views, likes, and engagement across all your social accounts
              in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Supported Platforms</h2>
          <p className="text-muted-foreground">
            Connect and manage all your social media accounts in one place
          </p>
        </div>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 mx-auto bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
              TT
            </div>
            <p className="font-medium">TikTok</p>
          </div>
          <div className="text-center space-y-2">
            <div className="h-16 w-16 mx-auto bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              in
            </div>
            <p className="font-medium">LinkedIn</p>
          </div>
          <div className="text-center space-y-2">
            <div className="h-16 w-16 mx-auto bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
              𝕏
            </div>
            <p className="font-medium">Twitter / X</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SocialScheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
