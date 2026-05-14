'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { LeaderboardTable } from './LeaderboardTable'

export function LiveLeaderboard({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' },
        payload => {
          setData(prev => {
            const index = prev.findIndex(r => r.id === payload.new.id)
            if (index === -1) return prev
            const newData = [...prev]
            newData[index] = { ...newData[index], ...payload.new }
            return newData.sort((a, b) => b.xp - a.xp)
          })
        })
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <LeaderboardTable data={data} />
}
