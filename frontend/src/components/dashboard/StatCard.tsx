import { motion } from '@/utils/motion'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: number
  color?: 'cyan' | 'red' | 'amber' | 'emerald' | 'purple' | 'blue'
  pulse?: boolean
  delay?: number
}

const iconBgMap = {
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-500/20 dark:border-cyan-500/30 dark:text-cyan-400',
  red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400',
  amber: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400',
  purple: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-400',
  blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400',
}

export default function StatCard({ title, value, subtitle, icon, trend, color = 'cyan', pulse = false, delay = 0 }: StatCardProps) {
  const iconStyle = iconBgMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card relative overflow-hidden p-5 cursor-pointer"
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-widest mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}% from last hour</span>
            </div>
          )}
        </div>
        <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center border ${iconStyle}`}>
          {pulse && (
            <div className="absolute inset-0 rounded-xl border border-current animate-ping opacity-30" />
          )}
          <div>{icon}</div>
        </div>
      </div>
    </motion.div>
  )
}
