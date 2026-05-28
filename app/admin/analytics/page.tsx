import { requireAdminRoute } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'
import { BarChart, Users, Activity, Target } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminAnalyticsPage() {
  await requireAdminRoute()
  const supabase = createAdminClient()

  // Fetch basic stats
  const [
    { count: totalUsers },
    { count: totalRuns },
    { data: runsData },
    { data: activeChallenges }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('runs').select('*', { count: 'exact', head: true }),
    supabase.from('runs').select('distance_km, duration_seconds'),
    supabase.from('challenges').select('*').gte('end_date', new Date().toISOString())
  ])

  const totalDistance = runsData?.reduce((acc, run) => acc + (Number(run.distance_km) || 0), 0) || 0
  const totalDurationSeconds = runsData?.reduce((acc, run) => acc + (Number(run.duration_seconds) || 0), 0) || 0
  const totalHours = Math.floor(totalDurationSeconds / 3600)

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bebas tracking-wider">Platform Analytics</h1>
        <p className="text-white/50 text-sm mt-1">High-level metrics for Verve Run Club.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium">Total Athletes</h3>
          </div>
          <div className="text-4xl font-light">{totalUsers || 0}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <Activity className="w-5 h-5 text-verve-red" />
            <h3 className="font-medium">Total Runs Logged</h3>
          </div>
          <div className="text-4xl font-light">{totalRuns || 0}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <Target className="w-5 h-5 text-green-400" />
            <h3 className="font-medium">Total Distance (km)</h3>
          </div>
          <div className="text-4xl font-light">{Math.round(totalDistance).toLocaleString()}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <BarChart className="w-5 h-5 text-yellow-400" />
            <h3 className="font-medium">Total Time (Hours)</h3>
          </div>
          <div className="text-4xl font-light">{totalHours.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bebas tracking-wider mb-4">Active Challenges</h3>
          {activeChallenges && activeChallenges.length > 0 ? (
            <ul className="space-y-4">
              {activeChallenges.map(c => (
                <li key={c.id} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm">{c.title}</span>
                  <span className="text-xs text-white/50 uppercase">{c.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/40">No active challenges.</p>
          )}
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center justify-center">
          <p className="text-white/40 text-sm">More detailed charts coming soon.</p>
        </div>
      </div>
    </div>
  )
}
