import { useState } from 'react'
import { motion } from '@/utils/motion'
import {
  Package, Truck, CheckCircle,
  Clock, Pill, Utensils, Droplets, Tent, ShieldAlert,
} from 'lucide-react'
import { MOCK_INVENTORY } from '../utils/mockData'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const categoryIcons: Record<string, any> = {
  Food: Utensils,
  Water: Droplets,
  Medical: Pill,
  Shelter: Tent,
  Equipment: ShieldAlert,
}

export default function ReliefCoordination() {
  const { t } = useThemeLanguage()
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const { data: apiReliefData } = useQuery({
    queryKey: ['relief'],
    queryFn: apiService.getReliefInventory,
  })

  const inventory: any[] = apiReliefData?.inventory || MOCK_INVENTORY
  const categories: string[] = ['ALL', ...Array.from(new Set(inventory.map((i: any) => String(i.category))))]

  const filtered = inventory.filter((item: any) =>
    activeCategory === 'ALL' ? true : item.category === activeCategory
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('reliefCoordination')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Disaster relief inventory · Resource deployment tracking · Logistics dispatch</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Inventory Items', value: inventory.length.toString(), icon: Package, color: 'text-cyan-600 dark:text-cyan-400' },
          { label: 'Sufficient Stock', value: '4 items', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Dispatches En Route', value: '3 active', icon: Truck, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Critical Shortfall', value: '1 item', icon: Clock, color: 'text-red-600 dark:text-red-400' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card p-5">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="xl:col-span-2 glass-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Relief Inventory</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c: string) => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${activeCategory === c ? 'bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  {['Item', 'Category', 'Available', 'Required', 'Coverage', 'Location'].map(h => (
                    <th key={h} className="text-left text-slate-600 dark:text-slate-400 pb-3 pr-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((item: any, i: number) => {
                  const pct = Math.round((item.available / item.required) * 100)
                  const Icon = categoryIcons[item.category] || Package
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                        {item.item}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{item.category}</td>
                      <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">{item.available.toLocaleString()} {item.unit}</td>
                      <td className="py-3 pr-4 text-slate-500">{item.required.toLocaleString()} {item.unit}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-cyan-500' : 'bg-red-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className={`font-semibold ${pct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 70 ? 'text-cyan-600 dark:text-cyan-400' : 'text-red-600 dark:text-red-400'}`}>{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{item.location}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
