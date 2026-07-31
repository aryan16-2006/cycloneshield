import { useState } from 'react'
import { motion } from '@/utils/motion'
import {
  Route, MapPin, Clock, Users, AlertTriangle, ChevronRight,
  Navigation, Shield, CheckCircle, Activity, Truck, Building,
} from 'lucide-react'
import { MOCK_EVACUATION_ROUTES, GUJARAT_DISTRICTS, MOCK_SHELTERS } from '../utils/mockData'
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const createShelterIcon = (status: string) => L.divIcon({
  html: `<div style="width:12px;height:12px;background:${status === 'FULL' ? '#ef4444' : status === 'PARTIAL' ? '#f59e0b' : '#10b981'};border-radius:3px;border:2px solid white"></div>`,
  className: '', iconAnchor: [6, 6],
})

const evacuationSteps = [
  { step: 1, title: 'Zone Identification', desc: 'AI identifies high-risk coastal zones within 5km', status: 'done', icon: MapPin },
  { step: 2, title: 'Route Calculation', desc: 'Dijkstra + AI optimizes safest evacuation path', status: 'done', icon: Route },
  { step: 3, title: 'Shelter Allocation', desc: 'ML model allocates nearest available shelters', status: 'done', icon: Building },
  { step: 4, title: 'Transport Dispatch', desc: 'Vehicles assigned from SDMA fleet management', status: 'active', icon: Truck },
  { step: 5, title: 'People Movement', desc: 'Real-time tracking of evacuee progress', status: 'pending', icon: Users },
  { step: 6, title: 'Shelter Confirmation', desc: 'Automated shelter check-in and resource tracking', status: 'pending', icon: CheckCircle },
]

export default function EvacuationPlanner() {
  const { t } = useThemeLanguage()

  const { data: routesData } = useQuery({
    queryKey: ['evacuationRoutes'],
    queryFn: apiService.getEvacuationRoutes,
  })

  const { data: sheltersData } = useQuery({
    queryKey: ['shelters'],
    queryFn: apiService.getShelters,
  })

  const liveRoutes = routesData?.routes || MOCK_EVACUATION_ROUTES
  const liveShelters = sheltersData?.shelters || MOCK_SHELTERS

  const [selectedRoute, setSelectedRoute] = useState(liveRoutes[0] || MOCK_EVACUATION_ROUTES[0])
  const [selectedDistrict, setSelectedDistrict] = useState(GUJARAT_DISTRICTS[1])

  const totalEvacuated = GUJARAT_DISTRICTS.reduce((s, d) => s + d.evacuated, 0)
  const totalTarget = GUJARAT_DISTRICTS.reduce((s, d) => s + Math.floor(d.population * 0.12), 0)
  const progress = Math.round((totalEvacuated / totalTarget) * 100)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evacuation Planner</h1>
          <p className="text-sm text-slate-400 mt-0.5">AI-optimized routes · Real-time shelter allocation · IBM Granite Agent</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">{totalEvacuated.toLocaleString()} Evacuated</span>
        </div>
      </motion.div>

      {/* Progress overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Overall Evacuation Progress</h3>
            <p className="text-xs text-slate-400">Target: {totalTarget.toLocaleString()} · Completed: {totalEvacuated.toLocaleString()}</p>
          </div>
          <span className="text-2xl font-bold text-white">{progress}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {GUJARAT_DISTRICTS.slice(0, 5).map(d => {
            const target = Math.floor(d.population * 0.12)
            const pct = Math.min(100, Math.round((d.evacuated / target) * 100))
            return (
              <button key={d.id} onClick={() => setSelectedDistrict(d)}
                className={`p-3 rounded-xl border transition-all text-left ${selectedDistrict.id === d.id ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-slate-800/50 border-white/10 hover:border-white/20'}`}>
                <p className="text-xs font-medium text-white truncate">{d.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 bg-slate-700 rounded-full">
                    <div className="h-full rounded-full bg-cyan-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-cyan-400">{pct}%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{d.evacuated.toLocaleString()}</p>
              </button>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map with routes */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="xl:col-span-2 glass-card overflow-hidden" style={{ height: 480 }}>
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Evacuation Routes · Shelter Locations</h3>
            </div>
            <div className="flex gap-2">
              {MOCK_EVACUATION_ROUTES.map(r => (
                <button key={r.id} onClick={() => setSelectedRoute(r)}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${selectedRoute.id === r.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 bg-slate-800'}`}>
                  {r.id}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 436 }}>
            <MapContainer center={[22.2, 70.0]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {MOCK_EVACUATION_ROUTES.map(route => (
                <Polyline
                  key={route.id}
                  positions={route.waypoints.map(w => [w.lat, w.lng])}
                  color={route.id === selectedRoute.id ? '#06b6d4' : '#475569'}
                  weight={route.id === selectedRoute.id ? 4 : 2}
                  dashArray={route.roadCondition === 'BLOCKED' ? '8 4' : undefined}
                />
              ))}
              {MOCK_SHELTERS.map(shelter => (
                <Marker key={shelter.id} position={[shelter.position.lat, shelter.position.lng]} icon={createShelterIcon(shelter.status)}>
                  <Popup>
                    <div className="bg-slate-900 text-white p-2 rounded-lg min-w-40">
                      <p className="font-bold">{shelter.name}</p>
                      <p className="text-xs text-slate-300">{shelter.occupied}/{shelter.capacity} occupied</p>
                      <p className={`text-xs font-medium ${shelter.status === 'FULL' ? 'text-red-400' : shelter.status === 'PARTIAL' ? 'text-amber-400' : 'text-emerald-400'}`}>{shelter.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {GUJARAT_DISTRICTS.slice(0, 5).map(d => (
                <CircleMarker key={d.id} center={[d.coordinates.lat, d.coordinates.lng]} radius={8}
                  color={d.riskLevel === 'CRITICAL' ? '#ef4444' : d.riskLevel === 'HIGH' ? '#f59e0b' : '#06b6d4'}
                  fillOpacity={0.3}>
                  <Popup>
                    <div className="bg-slate-900 text-white p-2 rounded-lg">
                      <p className="font-bold">{d.name}</p>
                      <p className="text-xs text-slate-300">Evacuated: {d.evacuated.toLocaleString()}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Selected Route Info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Route {selectedRoute.id}</h3>
              {selectedRoute.isRecommended && (
                <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">✓ Recommended</span>
              )}
            </div>
            <div className="space-y-3">
              {[
                { label: 'From', value: selectedRoute.from, icon: <MapPin className="w-3.5 h-3.5" /> },
                { label: 'To (Shelter)', value: selectedRoute.to, icon: <Building className="w-3.5 h-3.5" /> },
                { label: 'Distance', value: `${selectedRoute.distance} km`, icon: <Route className="w-3.5 h-3.5" /> },
                { label: 'Est. Time', value: `${selectedRoute.estimatedTime} min`, icon: <Clock className="w-3.5 h-3.5" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <div className="text-cyan-400">{icon}</div>
                  <span className="text-xs text-slate-400 flex-1">{label}</span>
                  <span className="text-xs font-medium text-white">{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 py-2 border-b border-white/5">
                <div className="text-cyan-400"><AlertTriangle className="w-3.5 h-3.5" /></div>
                <span className="text-xs text-slate-400 flex-1">Road Condition</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${selectedRoute.roadCondition === 'CLEAR' ? 'status-safe' : selectedRoute.roadCondition === 'PARTIAL' ? 'status-warning' : 'status-critical'}`}>
                  {selectedRoute.roadCondition}
                </span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="text-cyan-400"><Users className="w-3.5 h-3.5" /></div>
                <span className="text-xs text-slate-400 flex-1">Traffic</span>
                <span className={`text-xs font-medium ${selectedRoute.trafficLevel === 'LOW' ? 'text-emerald-400' : selectedRoute.trafficLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'}`}>
                  {selectedRoute.trafficLevel}
                </span>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" /> Dispatch Vehicles
            </button>
          </motion.div>

          {/* Shelter availability */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Nearest Shelters</h3>
            <div className="space-y-3">
              {MOCK_SHELTERS.slice(0, 4).map(shelter => {
                const pct = Math.round((shelter.occupied / shelter.capacity) * 100)
                return (
                  <div key={shelter.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white truncate max-w-[160px]">{shelter.name}</p>
                      <span className={`text-xs ${shelter.status === 'FULL' ? 'text-red-400' : shelter.status === 'PARTIAL' ? 'text-amber-400' : 'text-emerald-400'}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981' }} />
                    </div>
                    <p className="text-xs text-slate-500">{shelter.occupied.toLocaleString()} / {shelter.capacity.toLocaleString()}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Evacuation Workflow */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">AI Evacuation Agent Workflow</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {evacuationSteps.map(({ step, title, desc, status, icon: Icon }) => (
            <div key={step} className={`relative p-4 rounded-xl border text-center ${status === 'done' ? 'bg-emerald-500/10 border-emerald-500/30' : status === 'active' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-800/30 border-white/10'}`}>
              <div className={`w-9 h-9 rounded-xl mx-auto mb-3 flex items-center justify-center ${status === 'done' ? 'bg-emerald-500/20' : status === 'active' ? 'bg-cyan-500/20' : 'bg-slate-700'}`}>
                {status === 'done' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Icon className={`w-5 h-5 ${status === 'active' ? 'text-cyan-400' : 'text-slate-400'}`} />}
              </div>
              <p className={`text-xs font-semibold mb-1 ${status === 'done' ? 'text-emerald-400' : status === 'active' ? 'text-cyan-400' : 'text-slate-400'}`}>{title}</p>
              <p className="text-xs text-slate-500 leading-tight">{desc}</p>
              {status === 'active' && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
