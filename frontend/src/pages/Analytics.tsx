import { motion } from '@/utils/motion'
import { BarChart3, TrendingUp, Droplets, Users, Building, Clock } from 'lucide-react'
import {
  CYCLONE_FREQUENCY_DATA, WIND_SPEED_TREND, RAINFALL_DATA,
  EVACUATION_PROGRESS, SHELTER_OCCUPANCY, DISTRICT_RISK_SCORES,
  RESPONSE_TIME_DATA,
} from '../utils/mockData'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const COLORS = ['#ef4444', '#f59e0b', '#10b981']

export default function Analytics() {
  const { t } = useThemeLanguage()

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: apiService.getAnalytics,
  })
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Historical data · Trends · AI insights · Export</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-white/10 text-slate-300 rounded-xl text-sm hover:bg-slate-600 transition-colors">
          <BarChart3 className="w-4 h-4" /> Export Report
        </button>
      </motion.div>

      {/* KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Cyclones/Year', value: '2.4', trend: '+8%', color: 'text-red-400' },
          { label: 'Peak Wind (2024)', value: '185 km/h', trend: '+12%', color: 'text-amber-400' },
          { label: 'Total Evacuated', value: '2,22,700', trend: '+34%', color: 'text-cyan-400' },
          { label: 'Avg Response Time', value: '14.8 min', trend: '-6%', color: 'text-emerald-400' },
        ].map(({ label, value, trend, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass-card p-5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className={`text-xs mt-1 ${trend.startsWith('+') ? (color === 'text-emerald-400' ? 'text-emerald-400' : 'text-red-400') : 'text-emerald-400'}`}>{trend} vs last year</p>
          </motion.div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cyclone Frequency */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Cyclone Frequency (2018–2024)</h3>
              <p className="text-xs text-slate-400">Gujarat coast historical data</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CYCLONE_FREQUENCY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Bar dataKey="cyclones" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Cyclones" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Wind Speed Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Wind Speed Trend</h3>
              <p className="text-xs text-slate-400">Cyclone Biparjoy-II · 24-hour window</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WIND_SPEED_TREND}>
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="speed" stroke="#ef4444" strokeWidth={2} fill="url(#a1)" name="Wind (km/h)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rainfall by district */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Expected Rainfall by District (mm)</h3>
              <p className="text-xs text-slate-400">48-hour forecast · IMD + AI prediction</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RAINFALL_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={70} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Bar dataKey="rainfall" name="Rainfall (mm)" radius={[0, 4, 4, 0]}>
                {RAINFALL_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.rainfall > 350 ? '#ef4444' : entry.rainfall > 250 ? '#f59e0b' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Shelter Occupancy Pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Shelter Status</h3>
              <p className="text-xs text-slate-400">456 total active shelters</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SHELTER_OCCUPANCY} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                {SHELTER_OCCUPANCY.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SHELTER_OCCUPANCY.map(({ name, value, fill }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: fill }} /><span className="text-slate-300">{name}</span></div>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evacuation Progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Evacuation Progress by District</h3>
              <p className="text-xs text-slate-400">Target vs Actual evacuees</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={EVACUATION_PROGRESS} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} formatter={(v: number) => v.toLocaleString()} />
              <Bar dataKey="target" name="Target" fill="#475569" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Response Time */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-purple-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Team Response Time (minutes)</h3>
              <p className="text-xs text-slate-400">From alert to deployment</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RESPONSE_TIME_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="team" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Bar dataKey="time" name="Minutes" fill="#a855f7" radius={[4, 4, 0, 0]}>
                {RESPONSE_TIME_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.time <= 12 ? '#10b981' : entry.time <= 18 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
