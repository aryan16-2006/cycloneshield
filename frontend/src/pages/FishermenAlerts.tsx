import { useState } from 'react'
import { motion, AnimatePresence } from '@/utils/motion'
import {
  Fish, AlertTriangle, MapPin, Phone, Users, Anchor,
  Clock, Navigation, Shield, Send, X, AlertCircle, CheckCircle,
  Radio, Waves,
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
  const [alertSent, setAlertSent] = useState<string[]>([])

  const { data: fishermenData } = useQuery({
    queryKey: ['fishermen'],
    queryFn: apiService.getFishermen,
  })

  const liveFishermen = fishermenData?.fishermen || MOCK_FISHERMEN

  const filtered = filterStatus === 'ALL' ? liveFishermen : liveFishermen.filter((f: any) => f.status === filterStatus)
  const selected = liveFishermen.find((f: any) => f.id === selectedBoat || f.boatId === selectedBoat)

  const sendAlert = (id: string) => {
    setAlertSent(prev => [...prev, id])
    setTimeout(() => setAlertSent(prev => prev.filter(x => x !== id)), 3000)
  }

  const stats = {
    emergency: liveFishermen.filter((f: any) => f.status === 'EMERGENCY').length,
    missing: liveFishermen.filter((f: any) => f.status === 'MISSING').length,
    atSea: liveFishermen.filter((f: any) => f.status === 'AT_SEA').length,
    returning: liveFishermen.filter((f: any) => f.status === 'RETURNING').length,
    safe: liveFishermen.filter((f: any) => f.status === 'IN_HARBOR').length,
    totalCrew: liveFishermen.reduce((sum: number, f: any) => sum + (f.crewCount || 4), 0),
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fishermen Alerts</h1>
          <p className="text-sm text-slate-400 mt-0.5">Real-time boat tracking · AI risk scoring · Emergency comms</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors">
          <Radio className="w-4 h-4 animate-pulse" />
          Broadcast Alert to All
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Emergency', val: stats.emergency, color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
          { label: 'Missing', val: stats.missing, color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
          { label: 'At Sea', val: stats.atSea, color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
          { label: 'Returning', val: stats.returning, color: 'text-cyan-400', bg: 'bg-cyan-500/20 border-cyan-500/30' },
          { label: 'Safe', val: stats.safe, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
          { label: 'Total Crew', val: stats.totalCrew, color: 'text-slate-300', bg: 'bg-slate-800 border-white/10' },
        ].map(({ label, val, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-xl p-3 border ${bg} text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Boat List */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="xl:col-span-2 glass-card flex flex-col" style={{ maxHeight: 600 }}>
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">Fishing Fleet Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'AT_SEA', 'RETURNING', 'EMERGENCY', 'MISSING', 'IN_HARBOR'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${filterStatus === s ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white bg-slate-800'}`}>
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filtered.map((fish, i) => {
              const cfg = statusConfig[fish.status]
              const StatusIcon = cfg.icon
              return (
                <motion.div
                  key={fish.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedBoat(fish.id === selectedBoat ? null : fish.id)}
                  className={`px-5 py-3.5 cursor-pointer transition-colors ${selectedBoat === fish.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{fish.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{fish.boatId} · {fish.district}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Users className="w-3 h-3" />{fish.crewCount} crew</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{fish.distanceToHarbor}km</span>
                        <span className={`text-xs font-medium ${fish.riskScore > 80 ? 'text-red-400' : fish.riskScore > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>Risk: {fish.riskScore}%</span>
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
          {/* Map */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden" style={{ height: 340 }}>
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Fleet Positions</h3>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live GPS</span>
            </div>
            <div style={{ height: 290 }}>
              <MapContainer center={[21.5, 69.5]} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {MOCK_FISHERMEN.map(fish => (
                  <Marker key={fish.id} position={[fish.position.lat, fish.position.lng]} icon={createBoatIcon(fish.status)}>
                    <Popup>
                      <div className="bg-slate-900 text-white p-2 rounded-lg min-w-36">
                        <p className="font-bold text-sm">{fish.name}</p>
                        <p className="text-xs text-slate-300">{fish.boatId}</p>
                        <p className={`text-xs font-medium mt-1 ${statusConfig[fish.status].color}`}>{fish.status}</p>
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
            {selected ? (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${statusConfig[selected.status].bg} border ${statusConfig[selected.status].border} flex items-center justify-center`}>
                      <Fish className={`w-5 h-5 ${statusConfig[selected.status].color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{selected.name}</h3>
                      <p className="text-xs text-slate-400">{selected.boatId} · {selected.district}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBoat(null)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Crew', value: selected.crewCount, icon: <Users className="w-3.5 h-3.5" /> },
                    { label: 'Distance', value: `${selected.distanceToHarbor}km`, icon: <MapPin className="w-3.5 h-3.5" /> },
                    { label: 'ETA', value: selected.estimatedReturn, icon: <Clock className="w-3.5 h-3.5" /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <div className="flex justify-center text-cyan-400 mb-1">{icon}</div>
                      <p className="text-sm font-bold text-white">{value}</p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Nearest Harbor', value: selected.nearestHarbor },
                    { label: 'Last Ping', value: selected.lastPing },
                    { label: 'Risk Score', value: `${selected.riskScore}% — ${selected.riskScore > 80 ? '🔴 CRITICAL' : selected.riskScore > 60 ? '🟡 HIGH' : '🟢 LOW'}` },
                    { label: 'Phone', value: selected.phone },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => sendAlert(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors"
                  >
                    {alertSent.includes(selected.id) ? <><CheckCircle className="w-4 h-4" />Alert Sent!</> : <><Send className="w-4 h-4" />Send SOS Alert</>}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors">
                    <Navigation className="w-4 h-4" />
                    Route to Harbor
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
                <Fish className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Select a boat to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
