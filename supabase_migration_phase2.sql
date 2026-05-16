-- ============================================================
-- Verve Run Club — Phase 2 Admin Migration
-- Safe to re-run: uses IF NOT EXISTS / DO $$ patterns
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_hidden'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Add index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_hidden ON profiles(is_hidden);
