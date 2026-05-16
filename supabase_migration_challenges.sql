-- Migration for Challenges Feature

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('distance', 'runs', 'streak', 'pace')),
    target NUMERIC NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(challenge_id, user_id)
);

-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for challenges (anyone can read, authenticated users can insert)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view challenges' AND tablename = 'challenges'
    ) THEN
        CREATE POLICY "Anyone can view challenges" ON challenges FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create challenges' AND tablename = 'challenges'
    ) THEN
        CREATE POLICY "Authenticated users can create challenges" ON challenges FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
END $$;

-- Create policies for challenge_participants (anyone can read, users can insert their own participation)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view participants' AND tablename = 'challenge_participants'
    ) THEN
        CREATE POLICY "Anyone can view participants" ON challenge_participants FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can join challenges' AND tablename = 'challenge_participants'
    ) THEN
        CREATE POLICY "Users can join challenges" ON challenge_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can leave challenges' AND tablename = 'challenge_participants'
    ) THEN
        CREATE POLICY "Users can leave challenges" ON challenge_participants FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;
