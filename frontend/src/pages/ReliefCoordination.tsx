import { useState } from 'react'
import { motion } from '@/utils/motion'
import {
  Package, Truck, Users, Heart, Utensils, Droplets, Zap,
  MapPin, CheckCircle, AlertTriangle, BarChart3, RefreshCw,
  ArrowRight, Shield, Plus,
} from 'lucide-react'
import { MOCK_INVENTORY, MOCK_RESCUE_TEAMS } from '../utils/mockData'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const categoryIcons: Record<string, any> = {
  Food: Utensils, Water: Droplets, Medical: Heart, Shelter: Package,
  Rescue: Shield, Power: Zap,
}

const teamStatusColor: Record<string, string> = {
  DEPLOYED: 'status-critical',
  STANDBY: 'status-info',
  RETURNING: 'status-warning',
  UNAVAILABLE: 'bg-slate-700 text-slate-400 border-slate-600',
}

export default function ReliefCoordination() {
  const { t } = useThemeLanguage()
  const [activeCategory, setActiveCategory] = useState('All')

  const { data: reliefData } = useQuery({
    queryKey: ['relief'],
    queryFn: apiService.getReliefInventory,
  })

  const liveInventory = reliefData?.inventory || MOCK_INVENTORY
  const liveTeams = reliefData?.rescue_teams || MOCK_RESCUE_TEAMS

  const categories = ['All', ...Array.from(new Set(liveInventory.map((i: any) => i.category)))]
  const filtered = activeCategory === 'All' ? liveInventory : liveInventory.filter((i: any) => i.category === activeCategory)

  const inventoryChartData = liveInventory.map((item: any) => ({
    name: item.item.split(' ').slice(0, 2).join(' '),
    available: item.available,
    required: item.required,
  }))

  const totalTeams = liveTeams.length
  const deployedTeams = liveTeams.filter((t: any) => t.status === 'DEPLOYED').length

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Relief Coordination</h1>
          <p className="text-sm text-slate-400 mt-0.5">Inventory · Rescue teams · Resource allocation · AI optimization</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors">
          <Plus className="w-4 h-4" /> Request Supplies
        </button>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Rescue Teams', value: `${deployedTeams}/${totalTeams}`, sub: 'deployed', icon: Shield, color: 'cyan' },
          { label: 'Food Packets', value: '48K', sub: 'of 85K required', icon: Utensils, color: 'amber' },
          { label: 'Water Bottles', value: '125K', sub: 'of 200K required', icon: Droplets, color: 'blue' },
          { label: 'Medical Kits', value: '2,400', sub: 'of 3,500 required', icon: Heart, color: 'red' },
        ].map(({ label, value, sub, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`glass-card p-5 border ${color === 'cyan' ? 'border-cyan-500/30' : color === 'amber' ? 'border-amber-500/30' : color === 'blue' ? 'border-blue-500/30' : 'border-red-500/30'}`}>
            <Icon className={`w-5 h-5 mb-2 ${color === 'cyan' ? 'text-cyan-400' : color === 'amber' ? 'text-amber-400' : color === 'blue' ? 'text-blue-400' : 'text-red-400'}`} />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="xl:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Relief Inventory</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${activeCategory === c ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 bg-slate-800 hover:text-white'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {['Item', 'Category', 'Available', 'Required', 'Coverage', 'Location'].map(h => (
                    <th key={h} className="text-left text-slate-400 pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item, i) => {
                  const pct = Math.round((item.available / item.required) * 100)
                  const Icon = categoryIcons[item.category] || Package
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="text-white font-medium leading-tight">{item.item}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-md">{item.category}</span>
                      </td>
                      <td className="py-3 pr-4 text-white font-semibold">{item.available.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-slate-400">{item.required.toLocaleString()} {item.unit}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span className={`text-xs font-medium ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-400 text-xs leading-tight max-w-[140px]">{item.location}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Rescue Teams */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Rescue Teams</h3>
            <span className="ml-auto text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">{deployedTeams} Active</span>
          </div>
          <div className="space-y-3 flex-1">
            {MOCK_RESCUE_TEAMS.map((team, i) => (
              <motion.div key={team.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-white leading-tight">{team.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md flex-shrink-0 ml-2 ${teamStatusColor[team.status]}`}>{team.status}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{team.district}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{team.members}</span>
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{team.vehicles} vehicles</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {team.specialization.slice(0, 2).map(s => (
                    <span key={s} className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Inventory Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Available vs Required — Inventory Overview</h3>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={inventoryChartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} formatter={(v: number) => v.toLocaleString()} />
            <Bar dataKey="available" name="Available" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="required" name="Required" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-500" /><span className="text-xs text-slate-400">Available</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-600" /><span className="text-xs text-slate-400">Required</span></div>
        </div>
      </motion.div>
    </div>
  )
}
