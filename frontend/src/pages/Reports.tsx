import { motion } from '@/utils/motion'
import { FileText, Download, Eye, Clock, CheckCircle, AlertTriangle, BrainCircuit, Printer } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const defaultReports = [
  { id: 'R001', title: 'Cyclone Biparjoy-II — Situation Report #3', type: 'Cyclone Report', status: 'Published', author: 'IBM Granite AI + Admin', date: new Date().toISOString(), size: '2.4 MB', pages: 18, color: 'red' },
  { id: 'R002', title: 'Damage Assessment Preliminary — Jamnagar', type: 'Damage Report', status: 'Draft', author: 'Damage Assessment Agent', date: new Date(Date.now() - 3600000).toISOString(), size: '1.8 MB', pages: 12, color: 'amber' },
  { id: 'R003', title: 'Evacuation Status Report — 5 Districts', type: 'Evacuation Report', status: 'Published', author: 'Evacuation Agent + District Collector', date: new Date(Date.now() - 7200000).toISOString(), size: '3.1 MB', pages: 24, color: 'cyan' },
  { id: 'R004', title: 'Relief Inventory & Deployment Summary', type: 'Inventory Report', status: 'Published', author: 'Relief Agent + SDMA', date: new Date(Date.now() - 14400000).toISOString(), size: '1.2 MB', pages: 9, color: 'emerald' },
  { id: 'R005', title: 'Fishermen Fleet Safety Report', type: 'Safety Report', status: 'Published', author: 'Fishermen Safety Agent', date: new Date(Date.now() - 21600000).toISOString(), size: '0.9 MB', pages: 7, color: 'blue' },
  { id: 'R006', title: 'AI Prediction Accuracy Assessment', type: 'AI Summary', status: 'Generated', author: 'IBM Granite 34B', date: new Date(Date.now() - 28800000).toISOString(), size: '0.7 MB', pages: 5, color: 'purple' },
]

const colorMap: Record<string, string> = {
  red: 'border-red-500/30 text-red-400 bg-red-500/10',
  amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  purple: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
}

const statusConfig = {
  Published: { icon: CheckCircle, className: 'status-safe' },
  Draft: { icon: AlertTriangle, className: 'status-warning' },
  Generated: { icon: BrainCircuit, className: 'status-info' },
}

export default function Reports() {
  const { t } = useThemeLanguage()
  const { data: apiReportsData } = useQuery({
    queryKey: ['reports'],
    queryFn: apiService.getReports,
  })

  const reportsList = apiReportsData?.reports || defaultReports

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('reports')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">AI-generated reports · PDF export · Audit trail</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 rounded-xl text-sm font-semibold hover:bg-cyan-100 transition-colors">
          <BrainCircuit className="w-4 h-4" /> Generate AI Report
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: reportsList.length, icon: FileText, color: 'text-cyan-600 dark:text-cyan-400' },
          { label: 'Published', value: '4', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'AI Generated', value: '5', icon: BrainCircuit, color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Pending Review', value: '1', icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card p-4 flex items-center gap-3">
            <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
            <div><p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p><p className="text-xs text-slate-600 dark:text-slate-400">{label}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((report: any, i: number) => {
          const sConf = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.Published
          const StatusIcon = sConf.icon
          const colors = colorMap[report.color] || colorMap.cyan
          return (
            <motion.div key={report.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`glass-card p-5 border ${colors.split(' ')[0]} hover:border-opacity-50 transition-all group`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${colors}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-400">{report.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${sConf.className}`}>
                      <StatusIcon className="w-3 h-3" /> {report.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">{report.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5"><BrainCircuit className="w-3 h-3 text-cyan-500" /> {report.author}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(report.date).toLocaleDateString()}</span>
                    <span>{report.pages} pages · {report.size}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
