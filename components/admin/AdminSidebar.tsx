'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Users, ShieldAlert, Database, BarChart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'System Dashboard', href: '/admin', icon: Activity },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Challenges', href: '/admin/challenges', icon: ShieldAlert, disabled: true },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart, disabled: true },
  { name: 'Audit Logs', href: '/admin/audit', icon: Database, disabled: true },
  { name: 'Settings', href: '/admin/settings', icon: Settings, disabled: true },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl p-4 flex flex-col hidden md:flex">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bebas tracking-wider text-verve-red">Admin Portal</h2>
        <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Super User</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return item.disabled ? (
            <div key={item.name} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/30 cursor-not-allowed">
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-verve-red/10 text-verve-red border border-verve-red/20" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <div className="flex items-center space-x-2 text-red-500 mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">Restricted Area</span>
        </div>
        <p className="text-xs text-white/50">Actions taken here directly affect production database.</p>
      </div>
    </div>
  )
}
