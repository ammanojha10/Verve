export interface Profile {
  id: string
  name: string
  strava_id?: number
  strava_access_token?: string
  strava_refresh_token?: string
  strava_token_expires_at?: number
  xp: number
  tier: string
  streak_weeks: number
  avatar_url?: string
  role?: 'user' | 'moderator' | 'admin' | 'super_admin'
  created_at?: string
}

export interface Run {
  id: string
  user_id: string
  strava_activity_id: number
  distance_km: number
  duration_seconds: number
  pace_per_km: number
  elevation_m: number
  start_time: string
  is_group_run: boolean
  xp_earned: number
  created_at: string
}

export interface StravaActivity {
  id: number
  distance: number
  moving_time: number
  total_elevation_gain: number
  start_date: string
  workout_type: number
}

export interface Challenge {
  id: string
  name: string
  description?: string
  type: 'distance' | 'runs' | 'streak' | 'pace'
  target: number
  start_date: string
  end_date: string
  created_by?: string
  created_at: string
  challenge_participants?: ChallengeParticipant[]
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  joined_at: string
  profiles?: Partial<Profile>
}

export interface AuditLog {
  id: string
  admin_id: string
  admin_name: string
  action: string
  target_type: 'user' | 'run' | 'challenge' | 'system'
  target_id?: string
  metadata?: any
  severity: 'info' | 'warning' | 'critical'
  created_at: string
}
