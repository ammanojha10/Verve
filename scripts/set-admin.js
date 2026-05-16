/**
 * run-admin-setup.js
 * 
 * Run this script to:
 * 1. Check your profile exists in the DB
 * 2. See your current role
 * 3. Promote yourself to super_admin
 *
 * Usage:
 *   node scripts/set-admin.js YOUR_USER_ID
 *   node scripts/set-admin.js (lists all profiles)
 */

const { createClient } = require('@supabase/supabase-js')
require('fs')

// Load .env.local manually
const fs = require('fs')
const path = require('path')
const envPath = path.join(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

async function main() {
  const targetUserId = process.argv[2]

  console.log('\n📋  Fetching profiles from Supabase...\n')

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, strava_id, xp, tier, role, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    if (error.message.includes('column "role" does not exist')) {
      console.error('❌  The "role" column does not exist yet.')
      console.error('    Please run the supabase_migration_admin.sql in your Supabase SQL Editor first.\n')
    } else {
      console.error('❌  Error fetching profiles:', error.message)
    }
    process.exit(1)
  }

  if (!profiles || profiles.length === 0) {
    console.log('⚠️   No profiles found in the database.')
    process.exit(0)
  }

  if (!targetUserId) {
    console.log('📄  Found profiles (pass an ID to promote to super_admin):\n')
    console.log('  ID                                    | Name           | Role       | XP')
    console.log('  --------------------------------------|----------------|------------|------')
    profiles.forEach(p => {
      console.log(`  ${p.id} | ${(p.name || 'Unknown').padEnd(14)} | ${(p.role || 'user').padEnd(10)} | ${p.xp}`)
    })
    console.log('\nUsage: node scripts/set-admin.js <profile-id>')
    process.exit(0)
  }

  // Promote user
  console.log(`🔧  Promoting user ${targetUserId} to super_admin...`)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('id', targetUserId)

  if (updateError) {
    console.error('❌  Failed to update role:', updateError.message)
    process.exit(1)
  }

  console.log('✅  Successfully promoted to super_admin!')
  console.log('    You can now access http://localhost:3000/admin\n')
}

main()
