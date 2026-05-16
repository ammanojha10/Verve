'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Search, Loader2 } from 'lucide-react'

interface User {
  id: string
  name: string
  strava_id: number
  xp: number
  tier: string
  role: string
  is_hidden: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchUsers = async (searchQuery = '', pageNum = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?q=${searchQuery}&page=${pageNum}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
      setTotalUsers(data.total || 0)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1)
      fetchUsers(search, 1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchUsers(search, newPage)
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bebas tracking-wider">User Directory</h1>
          <p className="text-white/50 text-sm mt-1">Manage athletes, adjust XP, and moderate accounts. ({totalUsers} total)</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text"
            placeholder="Search by name or Strava ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border border-white/10 text-white w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verve-red/50"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Athlete</th>
                <th className="px-6 py-4 font-medium">Strava ID</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">XP / Tier</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-white/40 font-mono mt-1">{user.id.split('-')[0]}...</div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{user.strava_id || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                        user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400' :
                        user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                        user.role === 'moderator' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{user.xp.toLocaleString()}</div>
                      <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{user.tier}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_hidden ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          Hidden
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10" asChild>
                        <Link href={`/admin/users/${user.id}`}>Manage</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            <span className="text-sm text-white/50">Page {page} of {totalPages}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
