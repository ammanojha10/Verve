'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Save, ShieldAlert, Award, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Run {
  id: string
  strava_activity_id: number
  distance_km: number
  duration_seconds: number
  pace_per_km: number
  elevation_m: number
  start_time: string
  xp_earned: number
}

interface UserDetails {
  id: string
  name: string
  strava_id: number
  xp: number
  tier: string
  role: string
  is_hidden: boolean
  created_at: string
}

export default function AdminUserDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [id, setId] = useState<string | null>(null)
  const [user, setUser] = useState<UserDetails | null>(null)
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form State
  const [xpDelta, setXpDelta] = useState<string>('')
  const [xpReason, setXpReason] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [isHidden, setIsHidden] = useState<boolean>(false)

  useEffect(() => {
    if (!params || !params.id) return
    if (typeof params.id === 'string') {
      setId(params.id)
    } else if (Array.isArray(params.id)) {
      setId(params.id[0])
    }
  }, [params])

  useEffect(() => {
    if (!id) return
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setUser(data.user)
        setRuns(data.runs || [])
        setRole(data.user.role || 'user')
        setIsHidden(data.user.is_hidden || false)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: any = { role, is_hidden: isHidden }
      
      const delta = parseInt(xpDelta)
      if (!isNaN(delta) && delta !== 0) {
        if (!xpReason) {
          alert('Please provide a reason for the XP change.')
          setSaving(false)
          return
        }
        payload.xp_delta = delta
        payload.xp_reason = xpReason
      }

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update user')
      }
      
      // Refresh data
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-white">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-white/70 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <p>User not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-white max-w-5xl">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-white/70 hover:text-white -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bebas tracking-wider">{user.name}</h1>
            <p className="text-white/50 mt-1 font-mono text-sm">ID: {user.id}</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-verve-red hover:bg-red-600 text-white min-w-[120px]"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* XP & Role Controls */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 text-verve-red">
              <Award className="w-5 h-5" />
              <h2 className="font-bebas text-xl tracking-wider">XP & Tier</h2>
            </div>
            
            <div className="mb-6">
              <div className="text-3xl font-light">{user.xp.toLocaleString()} <span className="text-sm text-white/50 uppercase tracking-widest">{user.tier}</span></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Adjust XP (+ or -)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500 or -200" 
                  value={xpDelta}
                  onChange={(e) => setXpDelta(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-verve-red/50"
                />
              </div>
              {xpDelta && xpDelta !== '0' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Reason (Required for Audit)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Won community challenge" 
                    value={xpReason}
                    onChange={(e) => setXpReason(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-verve-red/50"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="font-bebas text-xl tracking-wider">Access & Roles</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">System Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-verve-red/50"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={isHidden}
                      onChange={(e) => setIsHidden(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-yellow-500/20 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white/50 rounded-full peer-checked:translate-x-5 peer-checked:bg-yellow-500 transition-transform"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">Hide from Leaderboards</div>
                    <p className="text-xs text-white/40 mt-1">
                      Prevents this user from appearing on public leaderboards or challenges. Use for suspected cheating.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Runs Verification */}
        <div className="md:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                <h2 className="font-bebas text-xl tracking-wider">Activity Verification</h2>
              </div>
              <span className="text-xs text-white/50 uppercase tracking-widest">Last 20 Runs</span>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/60 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Strava ID</th>
                    <th className="px-6 py-3 font-medium text-right">Distance</th>
                    <th className="px-6 py-3 font-medium text-right">Pace</th>
                    <th className="px-6 py-3 font-medium text-right">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {runs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                        No activity found.
                      </td>
                    </tr>
                  ) : (
                    runs.map((run) => {
                      const paceMins = Math.floor(run.pace_per_km)
                      const paceSecs = Math.round((run.pace_per_km % 1) * 60).toString().padStart(2, '0')
                      
                      // Highlight suspiciously fast paces
                      const isSuspicious = run.pace_per_km < 3.0 // Sub 3 min/km is world class / suspicious for casual runners

                      return (
                        <tr key={run.id} className="hover:bg-white/[0.02]">
                          <td className="px-6 py-3 text-white/70">
                            {new Date(run.start_time).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            <a 
                              href={`https://www.strava.com/activities/${run.strava_activity_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline font-mono text-xs"
                            >
                              {run.strava_activity_id}
                            </a>
                          </td>
                          <td className="px-6 py-3 text-right font-medium">
                            {run.distance_km.toFixed(2)} km
                          </td>
                          <td className={`px-6 py-3 text-right font-medium ${isSuspicious ? 'text-red-400' : 'text-white/70'}`}>
                            {paceMins}:{paceSecs}/km
                          </td>
                          <td className="px-6 py-3 text-right text-verve-red font-bold">
                            +{run.xp_earned}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
