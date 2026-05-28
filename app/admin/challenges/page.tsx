'use client'

import { useState, useEffect } from 'react'
import { Plus, ShieldAlert, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Challenge {
  id: string
  title: string
  type: string
  target_value: number
  unit: string
  start_date: string
  end_date: string
  created_at: string
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [type, setType] = useState('personal')
  const [targetValue, setTargetValue] = useState('')
  const [unit, setUnit] = useState('km')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchChallenges = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/challenges')
      const data = await res.json()
      if (data.challenges) setChallenges(data.challenges)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          target_value: Number(targetValue),
          unit,
          start_date: startDate,
          end_date: endDate
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create')
      }
      setIsCreating(false)
      // Reset form
      setTitle('')
      setTargetValue('')
      setStartDate('')
      setEndDate('')
      fetchChallenges()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bebas tracking-wider">Challenges</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage community running challenges.</p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className="bg-verve-red hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> 
          {isCreating ? 'Cancel' : 'New Challenge'}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="text-lg font-bebas tracking-wider mb-4 text-verve-red flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Create New Challenge
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/50">Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-verve-red" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/50">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-verve-red">
                <option value="personal">Personal Goal</option>
                <option value="team">Team Goal</option>
                <option value="duel">Duel</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/50">Target Value</label>
              <input required type="number" step="0.1" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-verve-red" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/50">Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-verve-red">
                <option value="km">Kilometers (km)</option>
                <option value="m">Meters (elevation)</option>
                <option value="runs">Number of Runs</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/50">Start Date</label>
              <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-verve-red" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/50">End Date</label>
              <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-verve-red" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting} className="bg-white/10 hover:bg-white/20 text-white min-w-[120px]">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Create Challenge'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="p-12 text-center text-white/50">No challenges created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Target</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {challenges.map((challenge) => {
                  const now = new Date()
                  const start = new Date(challenge.start_date)
                  const end = new Date(challenge.end_date)
                  const isActive = now >= start && now <= end
                  const isUpcoming = now < start
                  
                  return (
                    <tr key={challenge.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{challenge.title}</td>
                      <td className="px-6 py-4 uppercase text-xs">{challenge.type}</td>
                      <td className="px-6 py-4">{challenge.target_value} {challenge.unit}</td>
                      <td className="px-6 py-4 text-xs">
                        {start.toLocaleDateString()} - {end.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          isActive ? 'bg-green-500/20 text-green-500' :
                          isUpcoming ? 'bg-blue-500/20 text-blue-400' :
                          'bg-white/10 text-white/40'
                        }`}>
                          {isActive ? 'ACTIVE' : isUpcoming ? 'UPCOMING' : 'ENDED'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
