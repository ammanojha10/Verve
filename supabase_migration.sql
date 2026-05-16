-- Migration to ensure idempotency when syncing Strava activities
-- Safe to re-run — uses IF NOT EXISTS patterns.

-- 1. Add unique constraint on strava_activity_id (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'runs_strava_activity_id_key'
  ) THEN
    ALTER TABLE runs ADD CONSTRAINT runs_strava_activity_id_key UNIQUE (strava_activity_id);
  END IF;
END $$;

-- 2. Add index on strava_id in the profiles table for faster lookups during webhooks
CREATE INDEX IF NOT EXISTS idx_profiles_strava_id ON profiles(strava_id);
