-- ============================================================
-- Verve Run Club — Admin System Migration
-- Safe to re-run: uses IF NOT EXISTS / DO $$ patterns
-- ============================================================

-- 1. Add role column to profiles (defaults to 'user')
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
      CHECK (role IN ('user', 'moderator', 'admin', 'super_admin'));
  END IF;
END $$;

-- 2. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  admin_name    TEXT,
  action        TEXT NOT NULL,
  target_type   TEXT,                        -- 'user' | 'run' | 'challenge' | 'system'
  target_id     TEXT,                        -- affected entity id (flexible)
  metadata      JSONB DEFAULT '{}',          -- additional structured data
  severity      TEXT NOT NULL DEFAULT 'info' -- 'info' | 'warning' | 'critical'
    CHECK (severity IN ('info', 'warning', 'critical')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- 3. Index for fast admin queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id   ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_profiles_role         ON profiles(role);

-- 4. Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for audit_logs (admins only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view audit logs' AND tablename = 'audit_logs'
  ) THEN
    CREATE POLICY "Admins can view audit logs" ON audit_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('admin', 'super_admin')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert audit logs' AND tablename = 'audit_logs'
  ) THEN
    CREATE POLICY "Admins can insert audit logs" ON audit_logs
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('admin', 'super_admin')
        )
      );
  END IF;
END $$;

-- 6. RLS Policy: only admins can update profile roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update profile roles' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Admins can update profile roles" ON profiles
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM profiles AS p
          WHERE p.id = auth.uid()
          AND p.role IN ('admin', 'super_admin')
        )
      );
  END IF;
END $$;
