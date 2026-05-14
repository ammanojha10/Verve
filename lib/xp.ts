import { Profile, StravaActivity } from './types'

export function calculateXP(activity: StravaActivity, profile: Profile): number {
  const distanceKm = activity.distance / 1000
  const elevationBonus = Math.floor(activity.total_elevation_gain / 10)
  // Strava workout_type 1 usually means a race, but prompt specified group run. We'll use the prompt's logic.
  const groupBonus = activity.workout_type === 1 ? distanceKm : 0
  const streakMultiplier = Math.min(1 + (profile.streak_weeks * 0.08), 1.5)
  const base = Math.floor((distanceKm + groupBonus + elevationBonus) * streakMultiplier)
  return base
}

export function getTier(xp: number): string {
  if (xp >= 10000) return 'Ultrarunner'
  if (xp >= 5000)  return 'Racer'
  if (xp >= 2000)  return 'Strider'
  if (xp >= 500)   return 'Pacer'
  return 'Jogger'
}
