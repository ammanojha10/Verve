'use client'

import { useState, useEffect } from 'react'
import { Server, Database, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs')
      const data = await res.json()
      if (data.logs) setLogs(data.logs)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAction = async (endpoint: string, dryRun: boolean) => {
    const isDestructive = !dryRun
    if (isDestructive && !window.confirm(`Are you sure? This is a destructive action on the production DB.`)) {
      return
    }

    setLoading(true)
    setStatus('Processing...')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun })
      })
      const data = await res.json()
      setStatus(JSON.stringify(data, null, 2))
      fetchLogs()
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bebas tracking-wider text-white mb-2">System Dashboard</h1>
        <p className="text-white/60">Monitor system health, manage data integrity, and review audit logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Deduplication Card */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-yellow-500" />
              Deduplication Tool
            </h3>
          </div>
          <p className="text-sm text-white/50 mb-6">Scan and safely remove duplicate Strava runs while correcting user XP.</p>
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction('/api/admin/deduplicate', true)}
              disabled={loading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-md transition-colors"
            >
              Dry Run
            </button>
            <button 
              onClick={() => handleAction('/api/admin/deduplicate', false)}
              disabled={loading}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 text-sm py-2 rounded-md transition-colors"
            >
              Execute
            </button>
          </div>
        </div>

        {/* Leaderboard Repair Card */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-verve-red to-red-900 opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-verve-red" />
              Leaderboard Repair
            </h3>
          </div>
          <p className="text-sm text-white/50 mb-6">Recalculate all user XP from verified runs to fix sync desyncs.</p>
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction('/api/admin/repair-leaderboard', true)}
              disabled={loading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-md transition-colors"
            >
              Dry Run
            </button>
            <button 
              onClick={() => handleAction('/api/admin/repair-leaderboard', false)}
              disabled={loading}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 text-sm py-2 rounded-md transition-colors"
            >
              Execute
            </button>
          </div>
        </div>

        {/* Global Resync Card */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              Global Resync
            </h3>
          </div>
          <p className="text-sm text-white/50 mb-6">Trigger a background job to sync missing runs for all athletes.</p>
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction('/api/admin/global-resync', true)}
              disabled={loading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-md transition-colors"
            >
              Dry Run
            </button>
            <button 
              onClick={() => handleAction('/api/admin/global-resync', false)}
              disabled={loading}
              className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-sm py-2 rounded-md transition-colors"
            >
              Execute
            </button>
          </div>
        </div>

      </div>

      {status && (
        <div className="bg-black/60 border border-white/20 p-4 rounded-lg">
          <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Action Result</h4>
          <pre className="text-xs text-green-400 overflow-x-auto">{status}</pre>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          Recent Audit Logs
        </h3>
        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-white/50">No audit logs found.</div>
          ) : (
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">{log.admin_name || 'Unknown'}</td>
                    <td className="px-6 py-4 font-mono text-xs">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                        log.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
