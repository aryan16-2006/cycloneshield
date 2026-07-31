import { useState } from 'react'
import { motion, AnimatePresence } from '@/utils/motion'
import { Menu, Search, Bell, AlertTriangle, User, Zap, ChevronDown, X, Sun, Moon, Globe, CheckCircle } from 'lucide-react'
import { useThemeLanguage } from '../../context/ThemeLanguageContext'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../../services/api'

interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: alertsData } = useQuery({
    queryKey: ['alerts'],
    queryFn: apiService.getAlerts,
  })

  const { data: cycloneData } = useQuery({
    queryKey: ['cyclones'],
    queryFn: apiService.getCyclones,
  })

  const liveAlerts = alertsData?.alerts || []
  const hasStorm = cycloneData?.count && cycloneData.count > 0
  const criticalAlerts = liveAlerts.filter((a: any) => a.level === 'CRITICAL')

  return (
    <header className="h-14 flex items-center justify-between px-3 sm:px-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 z-30 transition-colors duration-300">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Toggle Navigation Menu"
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Desktop */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-48 lg:w-72 pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          <kbd className="absolute right-2 text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-700/50 px-1.5 py-0.5 rounded hidden lg:inline">⌘K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-[11px] sm:text-xs font-medium text-slate-900 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">EN</option>
            <option value="hi" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">HI</option>
            <option value="gu" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">GU</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />}
        </button>

        {/* Real Dynamic Status Badge */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${hasStorm ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400'}`}>
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${hasStorm ? 'bg-red-500 animate-ping' : 'bg-emerald-500 dark:bg-emerald-400'}`} />
          </div>
          <span className="text-xs font-bold truncate max-w-[130px]">
            {hasStorm ? t('emergencyStatus') : 'LIVE MONITORING'}
          </span>
          {hasStorm ? <Zap className="w-3.5 h-3.5 flex-shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
            className="relative p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {criticalAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-slate-900" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-w-[90vw]"
              >
                <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-400 px-2 py-0.5 rounded-full">{criticalAlerts.length} Critical</span>
                    <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {liveAlerts.slice(0, 5).map((alert: any) => (
                    <div key={alert.id} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg mt-0.5 ${alert.level === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400'}`}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{alert.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{alert.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{alert.district} • {alert.source}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
            className="flex items-center gap-1.5 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 hidden md:block">Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  )
}
