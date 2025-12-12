'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface UsageData {
  current: number
  limit: number
  tier: string
}

export default function UsageCounter() {
  const [usage, setUsage] = useState<UsageData>({ current: 0, limit: 10, tier: 'free' })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadUsage() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('posts_this_month, tier')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching usage:', error)
          setLoading(false)
          return
        }

        setUsage({
          current: data?.posts_this_month || 0,
          limit: data?.tier === 'free' ? 10 : Number.MAX_SAFE_INTEGER,
          tier: data?.tier || 'free',
        })
      } catch (error) {
        console.error('Error loading usage:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsage()
  }, [supabase])

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
        <div className="h-2 bg-white/10 rounded w-full"></div>
      </div>
    )
  }

  const percentage = usage.limit === Number.MAX_SAFE_INTEGER ? 0 : (usage.current / usage.limit) * 100
  const isNearLimit = percentage > 80
  const isAtLimit = usage.current >= usage.limit && usage.tier === 'free'

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">Posts This Month</span>
        <span
          className={`text-sm font-medium ${
            isAtLimit
              ? 'text-red-400'
              : isNearLimit
              ? 'text-yellow-400'
              : 'text-slate-400'
          }`}
        >
          {usage.current} / {usage.limit === Number.MAX_SAFE_INTEGER ? '∞' : usage.limit}
        </span>
      </div>

      {/* Progress bar */}
      {usage.tier === 'free' && (
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              isAtLimit
                ? 'bg-red-400'
                : isNearLimit
                ? 'bg-yellow-400'
                : 'bg-primary-light'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      {/* Pro badge */}
      {usage.tier !== 'free' && (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gradient-to-r from-primary-light to-secondary rounded-full">
            <span className="text-xs font-semibold text-white">PRO</span>
          </div>
          <span className="text-xs text-slate-400">Unlimited posts</span>
        </div>
      )}

      {/* Warning messages for free tier */}
      {usage.tier === 'free' && isAtLimit && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400 mb-2">
            You've reached your monthly limit of {usage.limit} posts.
          </p>
          <Link
            href="/pricing"
            className="text-xs text-red-300 underline hover:text-red-200 transition-colors"
          >
            Upgrade to Pro for unlimited posts
          </Link>
        </div>
      )}

      {usage.tier === 'free' && isNearLimit && !isAtLimit && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400 mb-2">
            You're close to your limit ({usage.current}/{usage.limit} posts used).
          </p>
          <Link
            href="/pricing"
            className="text-xs text-yellow-300 underline hover:text-yellow-200 transition-colors"
          >
            Upgrade to Pro for unlimited posts
          </Link>
        </div>
      )}
    </div>
  )
}
