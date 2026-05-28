'use client'

import { useState, useEffect } from 'react'
import { Database, Loader2, Search } from 'lucide-react'

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/audit-logs')
      const data = await res.json()
      if (data.logs) setLogs(data.logs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => 
    (log.admin_name && log.admin_name.toLowerCase().includes(search.toLowerCase())) ||
    (log.action && log.action.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bebas tracking-wider">Audit Logs</h1>
          <p className="text-white/50 text-sm mt-1">Review system actions and administrative changes.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text"
            placeholder="Search logs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border border-white/10 text-white w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verve-red/50"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-white/50">No logs match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Target</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">{log.admin_name || 'Unknown'}</td>
                    <td className="px-6 py-4 font-mono text-xs">{log.action}</td>
                    <td className="px-6 py-4 text-white/50">{log.target_type} {log.target_id ? `(${log.target_id.split('-')[0]})` : ''}</td>
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
          </div>
        )}
      </div>
    </div>
  )
}
