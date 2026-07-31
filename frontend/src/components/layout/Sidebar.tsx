import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Satellite, Fish, Brain, Route, Package,
  Building2, BarChart3, Bot, FileText, Settings, AlertTriangle,
  ChevronLeft, Shield, Waves, CheckCircle,
} from 'lucide-react'
import { useThemeLanguage } from '../../context/ThemeLanguageContext'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../../services/api'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/cyclone-tracker', icon: Satellite, key: 'cycloneTracker' },
  { to: '/fishermen', icon: Fish, key: 'fishermenAlerts' },
  { to: '/ai-prediction', icon: Brain, key: 'aiPrediction' },
  { to: '/evacuation', icon: Route, key: 'evacuationPlanner' },
  { to: '/relief', icon: Package, key: 'reliefCoordination' },
  { to: '/damage', icon: Building2, key: 'damageAssessment' },
  { to: '/analytics', icon: BarChart3, key: 'analytics' },
  { to: '/agents', icon: Bot, key: 'agentConsole' },
  { to: '/reports', icon: FileText, key: 'reports' },
  { to: '/settings', icon: Settings, key: 'settings' },
]

interface SidebarProps {
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { t } = useThemeLanguage()

  const { data: cycloneData } = useQuery({
    queryKey: ['cyclones'],
    queryFn: apiService.getCyclones,
  })

  const hasStorm = cycloneData?.count && cycloneData.count > 0
  const activeStorm = hasStorm ? cycloneData.cyclones[0] : null

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 bg-cyan-400/20 rounded-xl blur-sm" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">CycloneShield</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">AI ACTIVE</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Real Live Monitoring Status Banner */}
      <div className={`mx-3 mt-3 px-3 py-2 rounded-xl border ${hasStorm ? 'bg-red-50 border-red-200 dark:bg-red-500/20 dark:border-red-500/30' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'}`}>
        <div className="flex items-center gap-2">
          {hasStorm ? (
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}
          <div>
            <p className={`text-xs font-semibold ${hasStorm ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {hasStorm ? 'CYCLONE ALERT' : 'COASTAL STATUS'}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
              {hasStorm ? `${activeStorm.name} Cat.${activeStorm.category}` : 'Normal Sea Conditions'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'sidebar-item-active' : 'sidebar-item'
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{t(key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-900 dark:text-white">Admin Officer</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gujarat SDMA</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>IBM Watson Connected</span>
        </div>
      </div>
    </div>
  )
}
