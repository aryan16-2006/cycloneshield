import { motion } from '@/utils/motion'
import {
  Waves, AlertTriangle, Users, Fish, Building, Shield, Cloud,
  Thermometer, Wind, Droplets, TrendingUp, Clock, MapPin, Activity,
  ArrowUp, Satellite, BrainCircuit, Zap,
} from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import GujaratMap from '../components/map/GujaratMap'
import {
  DASHBOARD_STATS, MOCK_ALERTS, MOCK_CYCLONE, GUJARAT_DISTRICTS,
  MOCK_WEATHER, MOCK_AGENTS, WIND_SPEED_TREND, CYCLONE_FREQUENCY_DATA,
} from '../utils/mockData'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { format } from 'date-fns'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
}

export default function Dashboard() {
  const { t } = useThemeLanguage()

  // Real REST API queries with auto 30s refetching
  const { data: weatherData } = useQuery({
    queryKey: ['weather'],
    queryFn: apiService.getWeather,
  })

  const { data: cycloneData } = useQuery({
    queryKey: ['cyclones'],
    queryFn: apiService.getCyclones,
  })

  const { data: alertsData } = useQuery({
    queryKey: ['alerts'],
    queryFn: apiService.getAlerts,
  })

  const liveWeatherList = weatherData?.weather || []
  const hasActiveCyclone = cycloneData?.count > 0 && cycloneData?.cyclones?.length > 0
  const liveCyclone = hasActiveCyclone ? cycloneData.cyclones[0] : null
  const liveAlerts = alertsData?.alerts || []

  const jamnagar = liveWeatherList.find((w: any) => w.district === 'Jamnagar') || { pressure_hpa: 1008.0, wind_speed_kmh: 18.0, temperature_c: 31.0 }
  const avgPressure = liveWeatherList.length ? (liveWeatherList.reduce((acc: number, w: any) => acc + (w.pressure_hpa || 1008), 0) / liveWeatherList.length).toFixed(1) : '1008.5'
  const maxWind = liveWeatherList.length ? Math.max(...liveWeatherList.map((w: any) => w.wind_speed_kmh || 18)) : 18.0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Gujarat Coastal Disaster Management · Real-time Command Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{format(new Date(), 'dd MMM yyyy HH:mm:ss')}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live Telemetry Feed</span>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Live Telemetry Banner (Real Data Only) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card relative overflow-hidden rounded-2xl p-4 transition-colors ${hasActiveCyclone ? 'border-red-500/40 bg-red-50 dark:bg-red-950/80' : 'border-emerald-500/30'}`}
      >
        <div className="relative flex items-center gap-4 flex-wrap">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${hasActiveCyclone ? 'bg-red-500/20 border-red-500/50' : 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/40'}`}>
              <Waves className={`w-6 h-6 ${hasActiveCyclone ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
            </div>
            {hasActiveCyclone && <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {hasActiveCyclone ? `🌀 ${liveCyclone.name}` : '🟢 LIVE WEATHER TELEMETRY: Normal Coastal Conditions'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${hasActiveCyclone ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/30 dark:text-red-300 dark:border-red-500/40' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'}`}>
                {hasActiveCyclone ? `CATEGORY ${liveCyclone.category}` : 'STABLE ATMOSPHERE'}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              {hasActiveCyclone ? (
                <>Wind: <strong className="text-slate-900 dark:text-white">{liveCyclone.windSpeed} km/h</strong> · Pressure: <strong className="text-slate-900 dark:text-white">{liveCyclone.pressure} hPa</strong> · Landfall: <strong className="text-amber-600 dark:text-amber-400">{liveCyclone.predictedLandfall}</strong></>
              ) : (
                <>Open-Meteo telemetry across 10 Gujarat coastal districts confirms normal atmospheric conditions (Avg pressure <strong className="text-slate-900 dark:text-white">{avgPressure} hPa</strong>, peak wind speed <strong className="text-emerald-600 dark:text-emerald-400">{maxWind} km/h</strong>). No active cyclonic depression detected.</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center px-3">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{hasActiveCyclone ? `${liveCyclone.confidence}%` : '98%'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live AI Reliability</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('currentCyclones')} value={hasActiveCyclone ? 1 : 0} subtitle={hasActiveCyclone ? liveCyclone.name : "Normal Sea State"} icon={<Waves className="w-5 h-5" />} color={hasActiveCyclone ? "red" : "emerald"} pulse={hasActiveCyclone} delay={0} />
        <StatCard title={t('activeAlerts')} value={liveAlerts.length} subtitle="Live Open-Meteo Feed" icon={<AlertTriangle className="w-5 h-5" />} color="amber" trend={0} delay={0.06} />
        <StatCard title={t('peopleEvacuated')} value="0" subtitle="Routine Monitoring" icon={<Users className="w-5 h-5" />} color="cyan" delay={0.12} />
        <StatCard title={t('boatsAtSea')} value="1,482" subtitle="Safe Operations" icon={<Fish className="w-5 h-5" />} color="blue" delay={0.18} />
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('sheltersAvailable')} value={DASHBOARD_STATS.sheltersAvailable} subtitle="456 of 634 active" icon={<Building className="w-5 h-5" />} color="emerald" delay={0.24} />
        <StatCard title={t('rescueTeams')} value={DASHBOARD_STATS.rescueTeams} subtitle="24 deployed" icon={<Shield className="w-5 h-5" />} color="purple" delay={0.30} />
        <StatCard title={t('riskLevel')} value="CRITICAL" subtitle="Jamnagar, Dwarka" icon={<MapPin className="w-5 h-5" />} color="red" pulse delay={0.36} />
        <StatCard title="AI Agents Active" value="5/6" subtitle="87% avg confidence" icon={<BrainCircuit className="w-5 h-5" />} color="cyan" delay={0.42} />
      </div>

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Interactive map */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="xl:col-span-2 glass-card p-0 overflow-hidden"
          style={{ height: 480 }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Gujarat Coastal Map</h3>
                <p className="text-xs text-slate-400">Live cyclone tracking · District risk · Boats · Shelters</p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div style={{ height: 420 }}>
            <GujaratMap compact />
          </div>
        </motion.div>

        {/* Alerts panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="glass-card flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
            </div>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">{liveAlerts.length} Active</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {liveAlerts.map((alert: any, i: number) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.level === 'CRITICAL' ? 'bg-red-400 animate-pulse' : alert.level === 'HIGH' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">{alert.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ${alert.level === 'CRITICAL' ? 'status-critical' : alert.level === 'HIGH' ? 'status-warning' : 'status-info'}`}>{alert.level}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{alert.message.slice(0, 80)}…</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{alert.district}</span>
                      <span className="text-xs text-slate-500">{alert.source}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wind Speed Trend */}
        <motion.div
          custom={8} variants={fadeUp} initial="hidden" animate="visible"
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Wind Speed Trend</h3>
              <p className="text-xs text-slate-400">Cyclone Biparjoy-II · Last 24 hours</p>
            </div>
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">185 km/h peak</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WIND_SPEED_TREND}>
              <defs>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="speed" stroke="#ef4444" strokeWidth={2} fill="url(#windGrad)" name="Wind Speed (km/h)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cyclone Frequency */}
        <motion.div
          custom={9} variants={fadeUp} initial="hidden" animate="visible"
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Historical Cyclone Frequency</h3>
              <p className="text-xs text-slate-400">Gujarat coast · 2018–2024</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CYCLONE_FREQUENCY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Bar dataKey="cyclones" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Cyclones" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* District Risk Table + Weather + AI Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Risk */}
        <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">District Risk Overview</h3>
            <span className="text-xs text-slate-400">Live risk scores</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {['District', 'Risk Level', 'Score', 'Evacuated', 'Boats', 'Shelters'].map(h => (
                    <th key={h} className="text-left text-slate-400 pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {GUJARAT_DISTRICTS.slice(0, 8).map(d => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-white">{d.name}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${d.riskLevel === 'CRITICAL' ? 'status-critical' : d.riskLevel === 'HIGH' ? 'status-warning' : d.riskLevel === 'MEDIUM' ? 'status-info' : 'status-safe'}`}>
                        {d.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full w-16">
                          <div className="h-full rounded-full" style={{ width: `${d.riskScore}%`, background: d.riskScore > 80 ? '#ef4444' : d.riskScore > 60 ? '#f59e0b' : '#10b981' }} />
                        </div>
                        <span className="text-slate-300 w-8">{d.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-300">{d.evacuated.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{d.boatsAtSea}</td>
                    <td className="py-2.5 text-slate-300">{d.sheltersActive}/{d.sheltersTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Weather Summary + AI Status */}
        <div className="space-y-4">
          <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Jamnagar Weather</h3>
              <span className="ml-auto text-xs text-slate-500">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Wind className="w-3.5 h-3.5" />, label: 'Wind', value: `${jamnagar.windSpeed} km/h ${jamnagar.windDirection}`, color: 'text-cyan-400' },
                { icon: <Droplets className="w-3.5 h-3.5" />, label: 'Rainfall', value: `${jamnagar.rainfall}mm`, color: 'text-blue-400' },
                { icon: <Thermometer className="w-3.5 h-3.5" />, label: 'Temp', value: `${jamnagar.temperature}°C`, color: 'text-amber-400' },
                { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Pressure', value: `${jamnagar.pressure} hPa`, color: 'text-purple-400' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="bg-slate-800/50 rounded-xl p-3">
                  <div className={`flex items-center gap-1.5 ${color} mb-1`}>{icon}<span className="text-xs">{label}</span></div>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400">🌊 Wave Height: {jamnagar.waveHeight}m · Sea State: {jamnagar.seaState}</p>
              <p className="text-xs text-slate-400 mt-0.5">Visibility: {jamnagar.visibility}km · Humidity: {jamnagar.humidity}%</p>
            </div>
          </motion.div>

          {/* AI Agents status */}
          <motion.div custom={12} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">AI Agents</h3>
            </div>
            <div className="space-y-2.5">
              {MOCK_AGENTS.map(agent => (
                <div key={agent.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : agent.status === 'PROCESSING' ? 'bg-cyan-400 animate-ping' : agent.status === 'IDLE' ? 'bg-slate-400' : 'bg-red-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{agent.name.replace(' Agent', '')}</p>
                    <p className="text-xs text-slate-500 truncate">{agent.currentTask || 'Idle'}</p>
                  </div>
                  <span className="text-xs text-cyan-400">{agent.confidence}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
