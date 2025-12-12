'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { translations, type Locale } from '@/lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

type Props = {
  locale: Locale
}

export default function Hero({ locale }: Props) {
  const t = translations[locale].hero
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing_hero' }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage(data.message || t.emailSuccess)
        setEmail('') // Clear input on success
      } else {
        setMessage(data.error || t.emailError)
      }
    } catch (error) {
      setMessage(t.emailError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-dark">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-6 z-40">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-dark/20 via-bg-dark to-secondary/20" />

      {/* Bottom fade to dark - stronger */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-0 bg-gradient-to-b from-transparent via-bg-dark/50 to-bg-dark" />

      {/* Floating blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 z-0 bg-primary-light/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 z-0 bg-secondary/30 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-40 right-40 w-64 h-64 z-0 bg-accent-pink/20 rounded-full blur-3xl animate-float" />

      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-300">{t.badge}</span>
        </div>

        {/* Main heading with gradient */}
        <h1 className="text-5xl md:text-7xl xl:text-8xl font-display font-bold mb-6">
          <span className="bg-gradient-to-r from-primary-light via-white to-secondary bg-clip-text text-transparent">
            {t.headline1}
          </span>
          <br />
          <span className="text-white">{t.headline2}</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-body">
          {t.subheadline}
        </p>

        {/* Email Capture Form - Main CTA */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-6">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              disabled={loading}
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary-light hover:bg-cyan-400 text-bg-dark text-base font-bold rounded-full transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap shadow-lg shadow-primary-light/30"
            >
              {loading ? t.emailLoading : t.emailCTA}
            </button>
          </div>

          {message && (
            <p
              className={`mt-3 text-sm text-center ${
                message.includes('success') || message.includes('Successfully') || message.includes('Already')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {/* Alternative signup link */}
        <p className="text-sm text-slate-400 mb-8">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-light hover:text-cyan-400 underline">
            Sign in
          </Link>
        </p>

        {/* Trust badges */}
        <div className="mt-8 mb-20 flex flex-wrap gap-4 sm:gap-6 justify-center text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t.trustBadge1}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t.trustBadge2}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t.trustBadge3}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-30">
        <ChevronDown className="text-white/80" size={32} />
      </div>
    </section>
  )
}
