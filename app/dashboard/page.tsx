import { getSession } from '@/lib/session'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Activity, Route, Timer, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, runs(*)')
    .eq('id', session.userId)
    .single()

  if (!profile) {
    return (
      <div className="px-12 py-24 text-center">
        <h1 className="font-heading text-4xl text-primary mb-4">Profile Not Found</h1>
        <p className="text-muted">Please connect Strava to create your profile.</p>
      </div>
    )
  }

  const totalDistance = profile.runs?.reduce((acc: number, run: any) => acc + Number(run.distance_km), 0) || 0
  const totalRuns = profile.runs?.length || 0

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-[clamp(36px,5vw,56px)] leading-tight tracking-tight text-foreground mb-1">
            Welcome back, <span className="text-primary">{profile.name.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-muted mt-2">Here&apos;s your latest training data.</p>
        </div>
        <div className="md:text-right flex flex-col items-start md:items-end">
          <div className="text-[10px] font-medium tracking-[2px] uppercase text-muted mb-1">Current Tier</div>
          <div className="font-heading text-3xl text-primary uppercase">{profile.tier || 'Jogger'}</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/[0.08] border border-foreground/[0.08] mb-16">
        {[
          { label: 'Total XP', value: profile.xp.toLocaleString(), icon: Zap },
          { label: 'Total Distance', value: `${totalDistance.toFixed(1)} km`, icon: Route },
          { label: 'Total Runs', value: String(totalRuns), icon: Activity },
          { label: 'Current Streak', value: `${profile.streak_weeks} wks`, icon: Timer },
        ].map((stat) => (
          <div key={stat.label} className="bg-background p-8 hover:bg-off transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium tracking-[2px] uppercase text-muted">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="font-heading text-4xl text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">Recent Activities</div>
      <h2 className="font-heading text-[clamp(28px,3vw,42px)] leading-none tracking-tight text-foreground mb-8 border-b border-foreground/[0.08] pb-4">Your Runs</h2>

      <div className="space-y-4">
        {profile.runs?.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).slice(0, 5).map((run: any) => (
          <div key={run.id} className="group grid grid-cols-2 md:grid-cols-[1fr_120px_120px] items-center py-5 border-b border-foreground/[0.05] relative hover:bg-off transition-colors px-4 -mx-4 gap-y-4 md:gap-y-0">
            <div className="flex items-center gap-4 col-span-2 md:col-span-1">
              <div className="bg-primary-pale p-3 rounded-full">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-[15px]">{new Date(run.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                <div className="text-[10px] tracking-[1.5px] uppercase text-muted mt-0.5">+{run.xp_earned} XP</div>
              </div>
            </div>
            <div className="pl-12 md:pl-0">
              <div className="text-[10px] tracking-[1.5px] uppercase text-muted">Distance</div>
              <div className="text-[15px] font-light">{Number(run.distance_km).toFixed(2)} km</div>
            </div>
            <div className="pl-4 md:pl-0">
              <div className="text-[10px] tracking-[1.5px] uppercase text-muted">Pace</div>
              <div className="text-[15px] font-light">{Math.floor(run.pace_per_km)}:{(Math.floor((run.pace_per_km % 1) * 60)).toString().padStart(2, '0')} /km</div>
            </div>
          </div>
        ))}
        {(!profile.runs || profile.runs.length === 0) && (
          <div className="text-center py-16 text-muted border border-dashed border-foreground/[0.12]">
            No runs recorded yet. Go out there and log your first activity!
          </div>
        )}
      </div>
    </div>
  )
}
