const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function checkUser() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const userId = 'f5aa963c-aef8-4b7e-a19c-95d081f53158'
  const stravaId = 171598076

  console.log(`Checking Profile for ID: ${userId}...`)
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error finding profile by ID:', error.message)
  } else {
    console.log('Profile found by ID:', profile)
  }

  console.log(`Checking Profile for Strava ID: ${stravaId}...`)
  const { data: profileByStrava, error: error2 } = await supabase
    .from('profiles')
    .select('*')
    .eq('strava_id', stravaId)
    .single()

  if (error2) {
    console.error('Error finding profile by Strava ID:', error2.message)
  } else {
    console.log('Profile found by Strava ID:', profileByStrava)
  }
}

checkUser()
