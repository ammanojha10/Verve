-- Phase 3: Atomic XP Increments and Tier Recalculation

-- 1. Create the Tier Trigger Function
CREATE OR REPLACE FUNCTION update_tier_on_xp_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Re-calculate tier based on the exact same logic as lib/xp.ts
  IF NEW.xp >= 10000 THEN
    NEW.tier = 'Ultrarunner';
  ELSIF NEW.xp >= 5000 THEN
    NEW.tier = 'Racer';
  ELSIF NEW.xp >= 2000 THEN
    NEW.tier = 'Strider';
  ELSIF NEW.xp >= 500 THEN
    NEW.tier = 'Pacer';
  ELSE
    NEW.tier = 'Jogger';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the trigger to the profiles table
DROP TRIGGER IF EXISTS trg_profiles_update_tier ON profiles;
CREATE TRIGGER trg_profiles_update_tier
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.xp IS DISTINCT FROM NEW.xp)
EXECUTE FUNCTION update_tier_on_xp_change();

-- 3. Create the RPC function for atomic increments
CREATE OR REPLACE FUNCTION increment_xp(user_id UUID, xp_amount INT)
RETURNS void AS $$
BEGIN
  -- The trigger will automatically calculate the new tier during this update
  UPDATE profiles
  SET xp = xp + xp_amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
