import { SupabaseClient } from '@supabase/supabase-js'
import { Profile, Run } from './types'

const BADGE_CHECKS = [
  { slug: 'early-bird',    check: (r: Run) => new Date(r.start_time).getHours() < 6 },
  { slug: 'night-owl',     check: (r: Run) => new Date(r.start_time).getHours() >= 21 },
  { slug: 'hill-crusher',  check: (r: Run) => r.elevation_m >= 300 },
  { slug: 'sub-30-5k',     check: (r: Run) => r.distance_km >= 5 && r.pace_per_km <= 6.0 },
]

export async function checkBadges(profile: Profile, run: Run, supabase: SupabaseClient) {
  const { data: allBadges } = await supabase.from('badges').select('*')
  if (!allBadges) return

  const { data: earned } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', profile.id)
    
  const earnedIds = new Set(earned?.map(b => b.badge_id) || [])

  for (const check of BADGE_CHECKS) {
    if (!check.check(run)) continue
    
    const badge = allBadges.find(b => b.slug === check.slug)
    if (!badge || earnedIds.has(badge.id)) continue
    
    // Award badge
    await supabase.from('user_badges').insert({ user_id: profile.id, badge_id: badge.id })
    // Award bonus XP for earning a badge
    await supabase.from('profiles').update({ xp: profile.xp + 25 }).eq('id', profile.id)
  }
}
