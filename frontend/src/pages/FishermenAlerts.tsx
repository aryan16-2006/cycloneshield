import { useState } from 'react'
import { motion, AnimatePresence } from '@/utils/motion'
import {
  Fish, AlertTriangle, MapPin, Users, Anchor,
  Navigation, Waves, AlertCircle,
} from 'lucide-react'
import { MOCK_FISHERMEN } from '../utils/mockData'
import type { BoatStatus } from '../types'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const statusConfig: Record<BoatStatus, { label: string; color: string; bg: string; border: string; icon: any }> = {
  AT_SEA: { label: 'At Sea', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: Waves },
  RETURNING: { label: 'Returning', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', icon: Navigation },
  IN_HARBOR: { label: 'In Harbor', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: Anchor },
  MISSING: { label: 'MISSING', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', icon: AlertTriangle },
  EMERGENCY: { label: 'EMERGENCY', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: AlertCircle },
}

const createBoatIcon = (status: BoatStatus) => {
  const colors: Record<BoatStatus, string> = {
    AT_SEA: '#3b82f6', RETURNING: '#06b6d4', IN_HARBOR: '#10b981', MISSING: '#f59e0b', EMERGENCY: '#ef4444',
  }
  const c = colors[status] || '#3b82f6'
  return L.divIcon({
    html: `<div style="position:relative"><div style="width:12px;height:12px;background:${c};border-radius:50%;border:2px solid white;box-shadow:0 0 8px ${c}">${status === 'EMERGENCY' ? '<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid '+ c +';animation:ping 1s infinite"></div>' : ''}</div></div>`,
    className: '', iconAnchor: [6, 6],
  })
}

export default function FishermenAlerts() {
  const { t } = useThemeLanguage()
  const [selectedBoat, setSelectedBoat] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<BoatStatus | 'ALL'>('ALL')

  const { data: fishermenApiData } = useQuery({
    queryKey: ['fishermen'],
    queryFn: apiService.getFishermen,
  })

  const fleet = fishermenApiData?.boats || MOCK_FISHERMEN

  const filtered = fleet.filter((f: any) =>
    filterStatus === 'ALL' ? true : f.status === filterStatus
  )

  const selected = fleet.find((f: any) => f.id === selectedBoat)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('fishermenAlerts')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Real-time GPS Tracking · Automated SMS Safety Alerts · Rescue Coordination</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Fleet List */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-2 glass-card flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Fish className="w-4 h-4 text-cyan-500" /> Monitored Vessels ({filtered.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'AT_SEA', 'EMERGENCY', 'MISSING', 'RETURNING', 'IN_HARBOR'] as const).map(s => (
                <button
                  key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${filterStatus === s ? 'bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'}`}>
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((fish: any, i: number) => {
              const cfg = statusConfig[fish.status as BoatStatus] || statusConfig.AT_SEA
              const StatusIcon = cfg.icon
              return (
                <motion.div
                  key={fish.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedBoat(fish.id === selectedBoat ? null : fish.id)}
                  className={`px-5 py-3.5 cursor-pointer transition-colors ${selectedBoat === fish.id ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{fish.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{fish.boatId} · {fish.district}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Users className="w-3 h-3" />{fish.crewCount} crew</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{fish.distanceToHarbor}km</span>
                        <span className={`text-xs font-semibold ${fish.riskScore > 80 ? 'text-red-600 dark:text-red-400' : fish.riskScore > 60 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>Risk: {fish.riskScore}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Map + Detail */}
        <div className="xl:col-span-3 space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden" style={{ height: 340 }}>
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Fleet GPS Positions</h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live GPS</span>
            </div>
            <div style={{ height: 290 }}>
              <MapContainer center={[21.5, 69.5]} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {fleet.map((fish: any) => (
                  <Marker key={fish.id} position={[fish.position.lat, fish.position.lng]} icon={createBoatIcon(fish.status)}>
                    <Popup>
                      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded-lg min-w-36">
                        <p className="font-bold text-sm">{fish.name}</p>
                        <p className="text-xs text-slate-500">{fish.boatId}</p>
                        <p className={`text-xs font-semibold mt-1 ${(statusConfig[fish.status as BoatStatus] || statusConfig.AT_SEA).color}`}>{fish.status}</p>
                        <p className="text-xs text-slate-400">Risk: {fish.riskScore}%</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </motion.div>

          {/* Selected Boat Detail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${(statusConfig[selected.status as BoatStatus] || statusConfig.AT_SEA).bg} border ${(statusConfig[selected.status as BoatStatus] || statusConfig.AT_SEA).border} flex items-center justify-center`}>
                      <Fish className={`w-5 h-5 ${(statusConfig[selected.status as BoatStatus] || statusConfig.AT_SEA).color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selected.boatId} · {selected.district}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
