import { useState } from 'react'
import { motion } from '@/utils/motion'
import {
  BrainCircuit, Waves, TrendingUp, Target, Clock, RefreshCw,
  CheckCircle, Activity, ChevronRight, Zap, Database,
  BarChart3, AlertTriangle, Info,
} from 'lucide-react'
import { MOCK_CYCLONE, GUJARAT_DISTRICTS, DISTRICT_RISK_SCORES } from '../utils/mockData'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from 'recharts'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const mlModels = [
  { name: 'Random Forest (Track)', accuracy: 89.4, status: 'Active', color: 'cyan' },
  { name: 'XGBoost (Intensity)', accuracy: 91.2, status: 'Active', color: 'emerald' },
  { name: 'LSTM (Trajectory)', accuracy: 87.6, status: 'Active', color: 'purple' },
  { name: 'CNN (Damage)', accuracy: 83.1, status: 'Standby', color: 'amber' },
  { name: 'Gradient Boost (Flood)', accuracy: 85.9, status: 'Active', color: 'blue' },
]

const intensityForecast = [
  { time: 'T+0h', wind: 185, category: 4 },
  { time: 'T+6h', wind: 193, category: 4 },
  { time: 'T+12h', wind: 195, category: 4 },
  { time: 'T+18h', wind: 190, category: 4 },
  { time: 'T+24h', wind: 178, category: 3 },
  { time: 'T+30h', wind: 158, category: 3 },
  { time: 'T+36h', wind: 140, category: 3 },
  { time: 'T+48h', wind: 105, category: 2 },
]

export default function AIPrediction() {
  const { t } = useThemeLanguage()
  const [activeModel, setActiveModel] = useState('cyclone')
  const [running, setRunning] = useState(false)

  const { data: predictionData, refetch } = useQuery({
    queryKey: ['prediction'],
    queryFn: () => apiService.predictCyclone('CYC-2024-001', true),
  })

  const livePred = predictionData?.prediction

  const runPrediction = async () => {
    setRunning(true)
    await refetch()
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Prediction Engine</h1>
          <p className="text-sm text-slate-400 mt-0.5">IBM Granite LLM · LangGraph Agents · XGBoost · LSTM Models</p>
        </div>
        <button
          onClick={runPrediction}
          className={`flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors ${running ? 'animate-pulse' : ''}`}
        >
          <BrainCircuit className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running Prediction…' : 'Run AI Prediction'}
        </button>
      </motion.div>

      {/* IBM Granite Badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-950/60 to-purple-950/40 border border-blue-500/20 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">IBM Granite AI Platform</p>
          <p className="text-xs text-slate-400">Granite 34B Instruct · watsonx.ai · LangGraph · RAG Pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'Models Active', val: '5' },
            { label: 'Predictions Today', val: '1,247' },
            { label: 'Avg Confidence', val: '88.4%' },
          ].map(({ label, val }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-white">{val}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Output Panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white light:text-slate-900">AI Cyclone Forecast Summary</h3>
            <p className="text-xs text-slate-400">{livePred?.model || 'IBM Granite 8B + LSTM Ensemble'}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-medium text-cyan-400">{livePred?.confidence || 87}% confidence</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 light:bg-slate-100 rounded-xl border border-white/10 light:border-slate-200 mb-5">
          <p className="text-sm text-slate-200 light:text-slate-800 leading-relaxed font-medium">
            {livePred?.ai_summary || 'Cyclone Biparjoy-II is predicted to intensify to Category 4 (185 km/h) and make landfall near Jamnagar-Devbhumi Dwarka border within 36±4 hours.'}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-white light:text-slate-900 mb-3 flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" />Reasoning Steps</p>
          <div className="space-y-2">
            {(livePred?.reasoning_steps || [
              'Analyzed 72-hour NWP model outputs (GFS, ECMWF, IMD-GFS)',
              'Applied LSTM trajectory model on historical cyclone tracks (1990–2024)',
              'XGBoost intensity prediction: Cat 4 likely at landfall',
              'Random Forest flood risk: HIGH for Jamnagar, Dwarka, Kutch',
              'IBM Granite LLM summarization and natural language generation',
            ]).map((step: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-start gap-3 p-3 bg-slate-800/30 light:bg-slate-100 rounded-xl border border-white/5 light:border-slate-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-cyan-400">{i + 1}</span>
                </div>
                <p className="text-xs text-slate-300 light:text-slate-700 font-medium">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intensity Forecast */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Intensity Forecast</h3>
          <p className="text-xs text-slate-400 mb-4">LSTM model · 48hr prediction window</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={intensityForecast}>
              <defs>
                <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="wind" stroke="#06b6d4" strokeWidth={2} fill="url(#intGrad)" name="Wind (km/h)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* District Risk Scores */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">District Risk Scores</h3>
          <p className="text-xs text-slate-400 mb-4">XGBoost ensemble · Multi-factor analysis</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DISTRICT_RISK_SCORES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={60} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Risk Score (%)">
                {DISTRICT_RISK_SCORES.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ML Models Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">ML Model Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {['Model', 'Accuracy', 'Status', 'Training Data', 'Last Run', 'Action'].map(h => (
                  <th key={h} className="text-left text-slate-400 pb-3 pr-6 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mlModels.map((model, i) => (
                <motion.tr key={model.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
                  className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-6 font-medium text-white">{model.name}</td>
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full w-16">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${model.accuracy}%` }} />
                      </div>
                      <span className="text-emerald-400 font-medium">{model.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6">
                    <span className={`px-2 py-0.5 rounded-md ${model.status === 'Active' ? 'status-safe' : 'status-warning'}`}>{model.status}</span>
                  </td>
                  <td className="py-3 pr-6 text-slate-400">Gujarat historical + IMD datasets</td>
                  <td className="py-3 pr-6 text-slate-400">5 min ago</td>
                  <td className="py-3">
                    <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                      Run <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
