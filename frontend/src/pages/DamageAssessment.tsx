import { useState } from 'react'
import { motion } from '@/utils/motion'
import {
  Building2, AlertTriangle, TrendingDown, Users, Heart,
  FileText, Camera, Upload, CheckCircle, BrainCircuit,
  Layers, DollarSign, Home, Tractor,
} from 'lucide-react'
import { MOCK_DAMAGE } from '../utils/mockData'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const aiAssessment = {
  summary: 'Satellite and drone imagery analysis by IBM Granite Vision model identifies severe structural damage across Jamnagar and Devbhumi Dwarka coastal zones. Approximately 2,690 houses destroyed, 8,790 damaged. Critical infrastructure including 3 roads, 2 bridges, and coastal embankments compromised. Total preliminary loss estimate: ₹1,720 crore.',
  confidence: 81,
  imagesAnalyzed: 847,
  damagedStructures: 11480,
  model: 'IBM Granite Vision + YOLOv8 + SAR analysis',
}

const damageCategories = [
  { category: 'Residential', destroyed: 2690, damaged: 8790 },
  { category: 'Agricultural', destroyed: 0, damaged: 25800 },
  { category: 'Infrastructure', destroyed: 8, damaged: 34 },
  { category: 'Commercial', destroyed: 210, damaged: 890 },
  { category: 'Government', destroyed: 12, damaged: 45 },
]

const classificationResults = [
  { label: 'Completely Destroyed', count: 2690, color: '#ef4444', pct: 23 },
  { label: 'Severely Damaged', count: 4200, color: '#f97316', pct: 37 },
  { label: 'Moderately Damaged', count: 3100, color: '#f59e0b', pct: 27 },
  { label: 'Minor Damage', count: 1490, color: '#84cc16', pct: 13 },
]

export default function DamageAssessment() {
  const { t } = useThemeLanguage()

  const { data: damageData } = useQuery({
    queryKey: ['damage'],
    queryFn: apiService.getDamageAssessment,
  })

  const liveReports = damageData?.damage_reports || MOCK_DAMAGE
  const [activeDistrict, setActiveDistrict] = useState(liveReports[0] || MOCK_DAMAGE[0])

  const totals = liveReports.reduce((acc: any, r: any) => ({
    houses: acc.houses + (r.housesDestroyed || 0),
    damaged: acc.damaged + (r.housesDamaged || 0),
    lives: acc.lives + (r.livesLost || 0),
    injured: acc.injured + (r.injured || 0),
    loss: acc.loss + (r.totalEstimatedLoss || 0),
  }), { houses: 0, damaged: 0, lives: 0, injured: 0, loss: 0 })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Damage Assessment</h1>
          <p className="text-sm text-slate-400 mt-0.5">IBM Granite Vision · Satellite/Drone analysis · AI loss estimation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/30 transition-colors">
          <Upload className="w-4 h-4" /> Upload Imagery
        </button>
      </motion.div>

      {/* AI Assessment Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 border border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-white">AI Damage Assessment Report</p>
              <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">{aiAssessment.confidence}% confidence</span>
              <span className="text-xs text-slate-400">{aiAssessment.model}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{aiAssessment.summary}</p>
            <div className="flex gap-6 mt-3">
              {[
                { label: 'Images Analyzed', val: aiAssessment.imagesAnalyzed },
                { label: 'Damaged Structures', val: aiAssessment.damagedStructures.toLocaleString() },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-lg font-bold text-white">{val}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Houses Destroyed', value: totals.houses.toLocaleString(), icon: Home, color: 'text-red-400', border: 'border-red-500/30' },
          { label: 'Houses Damaged', value: totals.damaged.toLocaleString(), icon: Building2, color: 'text-amber-400', border: 'border-amber-500/30' },
          { label: 'Lives Lost', value: totals.lives, icon: Users, color: 'text-red-400', border: 'border-red-500/30' },
          { label: 'Injured', value: totals.injured, icon: Heart, color: 'text-orange-400', border: 'border-orange-500/30' },
          { label: 'Total Loss (₹Cr)', value: totals.loss.toLocaleString(), icon: DollarSign, color: 'text-purple-400', border: 'border-purple-500/30' },
        ].map(({ label, value, icon: Icon, color, border }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`glass-card p-4 border ${border}`}>
            <Icon className={`w-4 h-4 mb-2 ${color}`} />
            <p className="text-xs text-slate-400 leading-tight">{label}</p>
            <p className="text-xl font-bold text-white mt-1">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise damage */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">District-wise Damage Reports</h3>
          <div className="space-y-3">
            {MOCK_DAMAGE.map((report, i) => (
              <motion.button key={report.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
                onClick={() => setActiveDistrict(report)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${activeDistrict.id === report.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-800/40 border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{report.district}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md ${report.status === 'PRELIMINARY' ? 'status-warning' : report.status === 'UPDATED' ? 'status-info' : 'status-safe'}`}>{report.status}</span>
                    <span className="text-xs text-slate-400">by {report.verifiedBy.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div><p className="text-red-400 font-bold">{report.housesDestroyed.toLocaleString()}</p><p className="text-slate-500">Destroyed</p></div>
                  <div><p className="text-amber-400 font-bold">{report.housesDamaged.toLocaleString()}</p><p className="text-slate-500">Damaged</p></div>
                  <div><p className="text-red-400 font-bold">{report.livesLost}</p><p className="text-slate-500">Lives Lost</p></div>
                  <div><p className="text-purple-400 font-bold">₹{report.totalEstimatedLoss}Cr</p><p className="text-slate-500">Est. Loss</p></div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* AI Classification Results */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">AI Structure Classification</h3>
          <p className="text-xs text-slate-400 mb-4">IBM Granite Vision · {aiAssessment.imagesAnalyzed} images processed</p>
          <div className="space-y-4 mb-6">
            {classificationResults.map(({ label, count, color, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-semibold text-white">{count.toLocaleString()} <span className="text-slate-500">({pct}%)</span></span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full" style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">Damage by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={damageCategories} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Bar dataKey="destroyed" name="Destroyed" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="damaged" name="Damaged" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Selected District */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Detailed Report — {activeDistrict.district}</h3>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-md ${activeDistrict.status === 'PRELIMINARY' ? 'status-warning' : 'status-safe'}`}>{activeDistrict.status}</span>
          <button className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-xl text-xs text-slate-300 hover:bg-slate-600 transition-colors">
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Houses Destroyed', value: activeDistrict.housesDestroyed.toLocaleString(), sub: 'units', color: 'text-red-400' },
            { label: 'Houses Damaged', value: activeDistrict.housesDamaged.toLocaleString(), sub: 'units', color: 'text-amber-400' },
            { label: 'Livestock Loss', value: activeDistrict.livestockLoss.toLocaleString(), sub: 'animals', color: 'text-orange-400' },
            { label: 'Crop Area Affected', value: `${activeDistrict.cropAreaAffected.toLocaleString()} ha`, sub: 'hectares', color: 'text-yellow-400' },
            { label: 'Lives Lost', value: activeDistrict.livesLost, sub: 'persons', color: 'text-red-400' },
            { label: 'Injured', value: activeDistrict.injured, sub: 'persons', color: 'text-orange-400' },
            { label: 'Infrastructure Damage', value: `₹${activeDistrict.infrastructureDamage} Cr`, sub: 'crore INR', color: 'text-purple-400' },
            { label: 'Total Estimated Loss', value: `₹${activeDistrict.totalEstimatedLoss} Cr`, sub: 'crore INR', color: 'text-purple-400' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="p-3 bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">Verified by: {activeDistrict.verifiedBy} · Report date: {new Date(activeDistrict.reportDate).toLocaleDateString('en-IN')}</p>
      </motion.div>
    </div>
  )
}
